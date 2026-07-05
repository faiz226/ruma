require('dotenv').config();
const { google } = require('googleapis');
const { Resend } = require('resend');
const fs = require('fs');
const path = require('path');

const resend = new Resend(process.env.RESEND_API_KEY);

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

const addEventToGoogleCalendar = async (booking) => {
    const auth = getGoogleAuth();
    if (!auth) return;
    const calendar = google.calendar({ version: 'v3', auth });
    try {
        const response = await calendar.events.insert({
            calendarId: process.env.GOOGLE_CALENDAR_ID,
            requestBody: {
                summary: `Booked: ${booking.guest_name} (${booking.booking_ref})`,
                description: `Phone: ${booking.guest_phone}\nEmail: ${booking.guest_email}`,
                start: { date: booking.check_in.split('T')[0] },
                end: { date: booking.check_out.split('T')[0] }, 
            }
        });
        console.log(`Calendar event created for ${booking.booking_ref}`);
        console.log(`Event ID: ${response.data.id}`);
        console.log(`Event Link: ${response.data.htmlLink}`);
    } catch(err) {
        console.error("Google Calendar Error:");
        console.error("- Message:", err.message);
        if (err.response && err.response.data) {
            console.error("- Response Data:", err.response.data);
        } else {
            console.error("- Full Error:", err);
        }
    }
};

const logToGoogleSheet = async (booking) => {
    const auth = getGoogleAuth();
    if (!auth) return;
    const sheets = google.sheets({ version: 'v4', auth });
    try {
        await sheets.spreadsheets.values.append({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: 'Sheet1!A:H', 
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
                    new Date().toISOString()
                ]]
            }
        });
        console.log(`Logged ${booking.booking_ref} to Google Sheets`);
    } catch(err) {
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
        html = html.replace(/{{guestName}}/g, booking.guest_name)
                   .replace(/{{bookingRef}}/g, booking.booking_ref)
                   .replace(/{{checkInDate}}/g, booking.check_in.split('T')[0])
                   .replace(/{{checkOutDate}}/g, booking.check_out.split('T')[0])
                   .replace(/{{amountPaid}}/g, (booking.total_price_cents / 100).toFixed(2));

        await resend.emails.send({
            from: 'RUMA Homestay <onboarding@resend.dev>',
            to: booking.guest_email,
            subject: `Booking Confirmed - ${booking.booking_ref}`,
            html: html
        });
        console.log(`Confirmation email sent for ${booking.booking_ref}`);
    } catch(err) {
        console.error("Resend Error:");
        console.error("- Message:", err.message);
        if (err.response && err.response.data) {
            console.error("- Response Data:", err.response.data);
        } else {
            console.error("- Full Error:", err);
        }
    }
};

const booking = {
    booking_ref: 'TEST-001',
    guest_name: 'Test Guest',
    guest_email: 'busycutiekitty@gmail.com',
    guest_phone: '1234567890',
    check_in: '2026-07-10T12:00:00.000Z',
    check_out: '2026-07-11T12:00:00.000Z',
    total_price_cents: 24000
};

async function runTest() {
    console.log("=== Testing Google Calendar ===");
    await addEventToGoogleCalendar(booking);
    console.log("\n=== Testing Google Sheets ===");
    await logToGoogleSheet(booking);
    console.log("\n=== Testing Resend Email ===");
    await sendConfirmationEmail(booking);
}

runTest();
