require('dotenv').config();
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const cron = require('node-cron');
const { createClient } = require('@supabase/supabase-js');
const { google } = require('googleapis');
const { Resend } = require('resend');
const fs = require('fs');
const path = require('path');
const rateLimit = require('express-rate-limit');

const app = express();
app.use(cors());

const resend = new Resend(process.env.RESEND_API_KEY);

// Dynamic public holidays cache
let cachedHolidays = [];
const supplementaryHolidays = [
  // Add Pahang-specific holidays here (e.g. Sultan of Pahang's Birthday)
  // Format: 'YYYY-MM-DD'
];
// Need raw body for HMAC verification
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: true }));

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const apiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // Higher limit for admin
  message: { error: 'Too many requests from this IP.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware for Admin Auth
const authenticateAdmin = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Unauthorized: Missing token' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized: Missing token' });

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }

  if (!user.email) {
    return res.status(403).json({ error: 'Forbidden: No email found' });
  }

  // Check against the admin_users table using the service_role key
  const { data: adminUser, error: adminError } = await supabase
    .from('admin_users')
    .select('email')
    .eq('email', user.email)
    .single();

  if (adminError || !adminUser) {
    return res.status(403).json({ error: 'Forbidden: You are not authorized to access this API' });
  }

  req.user = user;
  next();
};

const getGoogleAuth = () => {
  const credsStr = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!credsStr) return null;
  try {
    const credentials = JSON.parse(credsStr);
    console.log("Successfully parsed GOOGLE_SERVICE_ACCOUNT_JSON");
    return new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/calendar.events', 'https://www.googleapis.com/auth/spreadsheets'],
    });
  } catch (e) {
    console.error("Invalid GOOGLE_SERVICE_ACCOUNT_JSON");
    return null;
  }
};

const fetchMalaysianHolidays = async () => {
  const auth = getGoogleAuth();
  if (!auth) return;
  const calendar = google.calendar({ version: 'v3', auth });
  try {
    const res = await calendar.events.list({
      calendarId: 'en.malaysia#holiday@group.v.calendar.google.com',
      timeMin: (new Date(new Date().getFullYear(), 0, 1)).toISOString(),
      timeMax: (new Date(new Date().getFullYear() + 2, 11, 31)).toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });
    
    const events = res.data.items || [];
    let fetchedHolidays = events
      .filter(e => {
         const summary = e.summary || '';
         // Exclude non-holidays and regional holidays (which apply to other states).
         // Pahang-specific holidays should be added to supplementaryHolidays manually.
         if (summary.includes('Valentine') || summary.includes('Eve') || summary.includes('Easter')) return false;
         if (summary.includes('(regional holiday)')) return false;
         return true;
      })
      .map(e => {
         const d = e.start.date || e.start.dateTime;
         return d.split('T')[0];
      });
      
    // Combine and deduplicate
    cachedHolidays = [...new Set([...fetchedHolidays, ...supplementaryHolidays])];
    console.log(`Fetched ${cachedHolidays.length} holidays from Google Calendar.`);
  } catch (err) {
    console.error("Error fetching holidays:", err.message);
  }
};

// Fetch on startup and schedule daily fetch at 2 AM
fetchMalaysianHolidays();
cron.schedule('0 2 * * *', fetchMalaysianHolidays);

app.get('/api/holidays', apiLimiter, (req, res) => {
  res.json({ holidays: cachedHolidays });
});

const addEventToGoogleCalendar = async (booking) => {
  const auth = getGoogleAuth();
  if (!auth) return;
  const calendar = google.calendar({ version: 'v3', auth });
  try {
    const response = await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      requestBody: {
        summary: `RUMA Rivervale: ${booking.guest_name} (${booking.booking_ref})`,
        description: `Phone: ${booking.guest_phone}\nEmail: ${booking.guest_email}`,
        start: { date: booking.check_in.split('T')[0] },
        end: { date: booking.check_out.split('T')[0] },
      }
    });
    console.log(`Calendar event created for ${booking.booking_ref}`);

    // Save the event ID in supabase for future cancellations
    if (response.data.id) {
      await supabase.from('bookings').update({ google_calendar_event_id: response.data.id }).eq('id', booking.id);
    }
  } catch (err) {
    console.error("Google Calendar Error:");
    console.error("- Message:", err.message);
    if (err.response && err.response.data) {
      console.error("- Response Data:", err.response.data);
    } else {
      console.error("- Full Error:", err);
    }
  }
};

const cancelEventInGoogleCalendar = async (eventId) => {
  const auth = getGoogleAuth();
  if (!auth || !eventId) return;
  const calendar = google.calendar({ version: 'v3', auth });
  try {
    await calendar.events.delete({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      eventId: eventId,
    });
    console.log(`Calendar event ${eventId} cancelled`);
  } catch (err) {
    console.error("Google Calendar Cancel Error:", err.message);
  }
};

const updateEventInGoogleCalendar = async (booking) => {
  if (!booking.google_calendar_event_id) return await addEventToGoogleCalendar(booking);

  const auth = getGoogleAuth();
  if (!auth) return;
  const calendar = google.calendar({ version: 'v3', auth });
  try {
    await calendar.events.patch({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      eventId: booking.google_calendar_event_id,
      requestBody: {
        start: { date: booking.check_in.split('T')[0] },
        end: { date: booking.check_out.split('T')[0] },
      }
    });
    console.log(`Calendar event ${booking.google_calendar_event_id} updated`);
  } catch (err) {
    console.error("Google Calendar Update Error:", err.message);
  }
};

const logToGoogleSheet = async (booking) => {
  const auth = getGoogleAuth();
  if (!auth) return;
  const sheets = google.sheets({ version: 'v4', auth });
  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: `${process.env.SHEET_ENV === 'live' ? 'RUMA Rivervale Live' : 'RUMA Rivervale Test'}!A:N`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[
          booking.booking_ref,
          booking.guest_name,
          booking.guest_email,
          booking.guest_phone,
          booking.check_in.split('T')[0],
          booking.check_out.split('T')[0],
          (booking.total_price_cents / 100).toFixed(2),
          booking.status,
          new Date().toISOString(),
          booking.notes || '',
          booking.adjustment_cents ? (booking.adjustment_cents / 100).toFixed(2) : '0.00',
          booking.adjustment_reason || '',
          booking.discount_code_id ? (booking.discount_code || 'Applied') : '',
          booking.discount_cents ? (booking.discount_cents / 100).toFixed(2) : '0.00'
        ]]
      }
    });
    console.log(`Logged ${booking.booking_ref} to Google Sheets`);
  } catch (err) {
    console.error("Google Sheets Error:");
    console.error("- Message:", err.message);
    if (err.response && err.response.data) {
      console.error("- Response Data:", err.response.data);
    } else {
      console.error("- Full Error:", err);
    }
  }
};

const sendConfirmationEmail = async (booking) => {
  try {
    const templatePath = path.join(__dirname, 'emailTemplate.html');
    let html = fs.readFileSync(templatePath, 'utf8');
    
    let paymentStatusText = booking.status === 'PENDING_PAYMENT' 
      ? 'Booking Received – Payment Due on Arrival' 
      : 'We have successfully received your payment and your booking is confirmed.';
      
    let amountLabel = booking.status === 'PENDING_PAYMENT'
      ? 'Amount Due at Check-in:'
      : 'Amount Paid:';

    html = html.replace(/{{guestName}}/g, booking.guest_name)
      .replace(/{{bookingRef}}/g, booking.booking_ref)
      .replace(/{{checkInDate}}/g, booking.check_in.split('T')[0])
      .replace(/{{checkOutDate}}/g, booking.check_out.split('T')[0])
      .replace(/{{amountPaid}}/g, (booking.total_price_cents / 100).toFixed(2))
      .replace(/{{paymentStatusText}}/g, paymentStatusText)
      .replace(/{{amountLabel}}/g, amountLabel);

    // TODO: Update 'from' email once custom domain is verified on Resend.
    // Requires adding DNS TXT/MX records in your domain registrar (e.g. GoDaddy/Namecheap).
    await resend.emails.send({
      from: 'RUMA Rivervale <onboarding@resend.dev>',
      to: booking.guest_email,
      subject: `Booking Confirmed - ${booking.booking_ref}`,
      html: html
    });
    console.log(`Confirmation email sent for ${booking.booking_ref}`);
  } catch (err) {
    console.error("Resend Error:");
    console.error("- Message:", err.message);
    if (err.response && err.response.data) {
      console.error("- Response Data:", err.response.data);
    } else {
      console.error("- Full Error:", err);
    }
  }
};

const sendCancellationEmail = async (booking) => {
  try {
    await resend.emails.send({
      from: 'RUMA Rivervale <onboarding@resend.dev>',
      to: booking.guest_email,
      subject: `Booking Cancelled - ${booking.booking_ref}`,
      html: `<h3>Hi ${booking.guest_name},</h3><p>Your booking ${booking.booking_ref} has been cancelled.</p><p>If you requested a refund, it will be processed shortly.</p>`
    });
    console.log(`Cancellation email sent for ${booking.booking_ref}`);
  } catch (err) {
    console.error("Resend Cancellation Error:", err.message);
  }
};

// ---------------------------------------------------------
// 1. ADMIN - CANCEL BOOKING
// ---------------------------------------------------------
app.post('/api/bookings/cancel', apiLimiter, authenticateAdmin, async (req, res) => {
  try {
    const { bookingId } = req.body;


    const { data: booking, error: fetchError } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single();

    if (fetchError || !booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Update status in DB
    const { error: updateError } = await supabase
      .from('bookings')
      .update({ status: 'CANCELLED' })
      .eq('id', bookingId);

    if (updateError) {
      return res.status(500).json({ error: 'Failed to cancel in database' });
    }

    // Remove from Google Calendar
    if (booking.google_calendar_event_id) {
      await cancelEventInGoogleCalendar(booking.google_calendar_event_id);
    }

    // Send cancellation email
    await sendCancellationEmail(booking);

    res.json({ success: true });
  } catch (err) {
    console.error("Cancel Error:", err);
  }
});


// ---------------------------------------------------------
// Discount Codes APIs
// ---------------------------------------------------------
app.get('/api/admin/discount-codes', apiLimiter, authenticateAdmin, async (req, res) => {
  const { data, error } = await supabase.from('discount_codes').select('*').order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post('/api/admin/discount-codes', apiLimiter, authenticateAdmin, async (req, res) => {
  const { code, type, value, expiry_date, usage_limit } = req.body;
  if (!code || !type || !value) return res.status(400).json({ error: 'Missing required fields' });
  const { data, error } = await supabase.from('discount_codes').insert([{ code: code.toUpperCase(), type, value, expiry_date: expiry_date || null, usage_limit: usage_limit || null }]).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.put('/api/admin/discount-codes/:id', apiLimiter, authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  const { active } = req.body;
  const { data, error } = await supabase.from('discount_codes').update({ active }).eq('id', id).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.delete('/api/admin/discount-codes/:id', apiLimiter, authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('discount_codes').delete().eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

app.post('/api/admin/discount-codes/validate', apiLimiter, authenticateAdmin, async (req, res) => {
  const { code } = req.body;
  const { data, error } = await supabase.from('discount_codes').select('*').eq('code', code.toUpperCase()).eq('active', true).single();
  if (error || !data) return res.status(404).json({ error: 'Invalid or inactive discount code' });
  if (data.expiry_date && new Date(data.expiry_date) < new Date()) return res.status(400).json({ error: 'Discount code has expired' });
  if (data.usage_limit && data.times_used >= data.usage_limit) return res.status(400).json({ error: 'Discount code usage limit reached' });
  res.json(data);
});

// ---------------------------------------------------------
// Bookings APIs
// ---------------------------------------------------------
app.post('/api/admin/bookings/create', apiLimiter, authenticateAdmin, async (req, res) => {
  try {
    const { roomId, checkIn, checkOut, guestName, guestEmail, guestPhone, guestPostcode, status, notes, adjustmentAmount, adjustmentReason, discountCode, isTest } = req.body;
    // Basic validation
    if (!checkIn || !checkOut || !guestName || !guestEmail) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Resolve room slug to UUID (defaulting to the slug if not provided)
    const roomSlug = roomId || 'ruma-homestay';
    const { data: room, error: roomErr } = await supabase
      .from('rooms')
      .select('id')
      .eq('slug', roomSlug)
      .single();

    if (roomErr || !room) {
      return res.status(400).json({ error: 'Invalid room specified.' });
    }
    const actualRoomId = room.id;

    // Recalculate price
    let amount = 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    let currentDate = new Date(start);

    while (currentDate < end) {
      const day = currentDate.getDay();
      const yyyy = currentDate.getFullYear();
      const mm = String(currentDate.getMonth() + 1).padStart(2, '0');
      const dd = String(currentDate.getDate()).padStart(2, '0');
      const dateString = `${yyyy}-${mm}-${dd}`;
      
      const isPublicHoliday = cachedHolidays.includes(dateString);

      // Friday (5), Saturday (6), Sunday (0) or Public Holiday are RM270, else RM250
      if (day === 5 || day === 6 || day === 0 || isPublicHoliday) {
        amount += 270;
      } else {
        amount += 250;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    let discountCodeId = null;
    let discountCents = 0;
    let actualDiscountCodeText = '';
    
    if (discountCode) {
      const { data: dc } = await supabase.from('discount_codes').select('*').eq('code', discountCode.toUpperCase()).eq('active', true).single();
      if (dc && (!dc.expiry_date || new Date(dc.expiry_date) > new Date()) && (!dc.usage_limit || dc.times_used < dc.usage_limit)) {
        discountCodeId = dc.id;
        actualDiscountCodeText = dc.code;
        const baseAmountCents = Math.round(amount * 100);
        if (dc.type === 'flat') {
          discountCents = Math.round(dc.value * 100);
        } else if (dc.type === 'percentage') {
          discountCents = Math.round(baseAmountCents * (dc.value / 100));
        }
      }
    }
    
    const adjCents = adjustmentAmount ? Math.round(Number(adjustmentAmount) * 100) : 0;
    const total_price_cents = Math.max(0, Math.round(amount * 100) - discountCents + adjCents);

    // Check availability
    const { data: conflicting } = await supabase
      .from('bookings')
      .select('id')
      .eq('room_id', actualRoomId)
      .lt('check_in', checkOut)
      .gt('check_out', checkIn)
      .in('status', ['PAID', 'confirmed', 'PENDING_PAYMENT']);

    if (conflicting && conflicting.length > 0) {
      return res.status(400).json({ error: 'Dates are already booked.' });
    }

    // Insert directly as PAID
    const { data: insertedBooking, error: insertError } = await supabase
      .from('bookings')
      .insert({
        room_id: actualRoomId,
        check_in: checkIn,
        check_out: checkOut,
        guest_name: guestName,
        guest_email: guestEmail,
        guest_phone: guestPhone || null,
        guest_postcode: guestPostcode || null,
        total_price_cents: total_price_cents,
        adjustment_cents: adjCents,
        adjustment_reason: adjustmentReason || null,
        discount_code_id: discountCodeId,
        discount_cents: discountCents,
        is_test: isTest === true,
        status: status || 'PAID',
        notes: notes || null,
        locked_until: new Date().toISOString()
      })
      .select()
      .single();

    if (insertError) {
      console.error("Booking insert error:", insertError);
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (discountCodeId) {
      const { error: rpcError } = await supabase.rpc('increment_discount_usage', { code_id: discountCodeId });
      if (rpcError) {
        // Fallback if RPC doesn't exist
        const { data } = await supabase.from('discount_codes').select('times_used').eq('id', discountCodeId).single();
        if (data) {
          await supabase.from('discount_codes').update({ times_used: data.times_used + 1 }).eq('id', discountCodeId);
        }
      }
    }

    const bookingWithCode = { ...insertedBooking, discount_code: actualDiscountCodeText };
    // Trigger Integrations
    await addEventToGoogleCalendar(bookingWithCode);
    await sendConfirmationEmail(bookingWithCode);
    await logToGoogleSheet(bookingWithCode);

    res.json({ success: true, booking: bookingWithCode });
  } catch (err) {
    console.error("Create Admin Booking Error:", err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ---------------------------------------------------------
// 3. ADMIN - MODIFY BOOKING
// ---------------------------------------------------------
app.post('/api/admin/bookings/modify', apiLimiter, authenticateAdmin, async (req, res) => {
  try {
    const { bookingId, checkIn, checkOut, status, notes, adjustmentAmount, adjustmentReason } = req.body;
    if (!bookingId || !checkIn || !checkOut) return res.status(400).json({ error: 'Missing required fields' });

    const { data: booking, error: fetchErr } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single();

    if (fetchErr || !booking) return res.status(404).json({ error: 'Booking not found' });

    // Check availability (exclude self)
    const { data: conflicting } = await supabase
      .from('bookings')
      .select('id')
      .eq('room_id', booking.room_id)
      .neq('id', bookingId)
      .lt('check_in', checkOut)
      .gt('check_out', checkIn)
      .in('status', ['PAID', 'confirmed', 'PENDING_PAYMENT']);

    if (conflicting && conflicting.length > 0) {
      return res.status(400).json({ error: 'Dates are already booked by another guest.' });
    }

    // Recalculate price
    let amount = 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    let currentDate = new Date(start);

    while (currentDate < end) {
      const day = currentDate.getDay();
      const yyyy = currentDate.getFullYear();
      const mm = String(currentDate.getMonth() + 1).padStart(2, '0');
      const dd = String(currentDate.getDate()).padStart(2, '0');
      const dateString = `${yyyy}-${mm}-${dd}`;
      
      const isPublicHoliday = cachedHolidays.includes(dateString);

      if (day === 5 || day === 6 || day === 0 || isPublicHoliday) amount += 270;
      else amount += 250;
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // If adjustmentAmount is passed from frontend, use it. Otherwise retain existing adjustment.
    const adjCents = adjustmentAmount !== undefined ? Math.round(Number(adjustmentAmount) * 100) : (booking.adjustment_cents || 0);
    const adjReason = adjustmentReason !== undefined ? adjustmentReason : booking.adjustment_reason;
    
    const total_price_cents = Math.round(amount * 100) + adjCents;

    // Update DB
    const { data: updatedBooking, error: updateError } = await supabase
      .from('bookings')
      .update({
        check_in: checkIn,
        check_out: checkOut,
        total_price_cents: total_price_cents,
        adjustment_cents: adjCents,
        adjustment_reason: adjReason,
        status: status || booking.status,
        notes: notes !== undefined ? notes : booking.notes,
        updated_at: new Date().toISOString()
      })
      .eq('id', bookingId)
      .select()
      .single();

    if (updateError || !updatedBooking) return res.status(500).json({ error: 'Failed to update booking.' });

    // Update Google Calendar
    await updateEventInGoogleCalendar(updatedBooking);

    // Send update email via Resend
    try {
      await resend.emails.send({
        from: 'RUMA Rivervale <onboarding@resend.dev>',
        to: updatedBooking.guest_email,
        subject: `Booking Updated - ${updatedBooking.booking_ref}`,
        html: `<h3>Hi ${updatedBooking.guest_name},</h3><p>Your booking ${updatedBooking.booking_ref} has been updated.</p><p>New Check-in: ${updatedBooking.check_in.split('T')[0]}</p><p>New Check-out: ${updatedBooking.check_out.split('T')[0]}</p><p>New Total Price: RM ${(updatedBooking.total_price_cents / 100).toFixed(2)}</p>`
      });
      console.log(`Update email sent for ${updatedBooking.booking_ref}`);
    } catch (emailErr) {
      console.error("Update Email Error:", emailErr.message);
    }

    res.json({ success: true, booking: updatedBooking });
  } catch (err) {
    console.error("Modify Admin Booking Error:", err);
    res.status(500).json({ error: 'Server error' });
  }
});


app.post('/api/contact', apiLimiter, async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const resendClient = new Resend(process.env.RESEND_API_KEY);
    // Replace with your verified email in Resend
    const targetEmail = 'atirahauni.work@gmail.com';

    await resendClient.emails.send({
      from: 'RUMA Contact Form <onboarding@resend.dev>',
      to: targetEmail,
      subject: `New Message: ${subject}`,
      html: `
                <h3>New Message from RUMA Rivervale Website</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <br />
                <p><strong>Message:</strong></p>
                <p>${message.replace(/\n/g, '<br>')}</p>
            `
    });

    res.json({ success: true });
  } catch (err) {
    console.error("Contact Form Error:", err);
    res.status(500).json({ error: 'Failed to send message.' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
