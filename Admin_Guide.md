# RUMA Homestay - Admin Booking Guide 🏠
*Panduan Pengurusan Tempahan RUMA Homestay*

Welcome to your RUMA Admin Dashboard! This guide will show you how to manage your bookings manually after confirming them with your guests via WhatsApp or phone.

Selamat datang ke Admin Dashboard RUMA! Panduan ini akan menunjukkan cara menguruskan tempahan secara manual selepas anda mengesahkannya dengan tetamu melalui WhatsApp atau telefon.

---

## 1. How to Log In (Cara Log Masuk)

> ⚠️ **Access is restricted.** Only pre-approved admin emails can enter the dashboard. If you need access, contact the developer to add your email to the admin allowlist.
>
> *(Akses adalah terhad. Hanya emel admin yang telah diluluskan boleh masuk ke dashboard. Jika anda perlukan akses, hubungi pembangun untuk menambah emel anda ke dalam senarai yang dibenarkan.)*

1. Go to your website and navigate to `/admin` — e.g. `https://homestay-faizzzz.vercel.app/admin`
   *(Pergi ke laman web anda dan navigasi ke `/admin`.)*
2. You will be redirected to the Login page. Enter your approved Admin Email and Password.
   *(Anda akan diarahkan ke halaman Log Masuk. Masukkan Emel dan Kata Laluan Admin yang telah diluluskan.)*
3. Click **Sign In**.
   *(Klik **Sign In**.)*
4. If you see **"Unauthorized Access"**, your email has not been added to the allowlist yet. Contact the developer.
   *(Jika anda melihat **"Unauthorized Access"**, emel anda belum ditambah ke dalam senarai. Hubungi pembangun.)*

---

## 2. Understanding the Dashboard (Memahami Dashboard)

Once logged in, you will see:

- **4 stat cards at the top** — Total Bookings, Upcoming, Pending, and Estimated Revenue.
- **A bookings table** showing all bookings. Click any column header (**Guest**, **Dates**, **Status**, **Contact**) to **sort the table** by that column. Click again to reverse the order.
  *(Klik mana-mana tajuk lajur untuk **susun semula** senarai. Klik sekali lagi untuk songsangkan susunan.)*
- **Expandable rows** — If a booking has a Note/Remark, you will see a **▶ chevron icon** on the left. Click it to expand and read the note.
  *(Jika tempahan mempunyai Nota/Catatan, ikon ▶ akan muncul di sebelah kiri. Klik untuk lihat nota.)*

---

## 3. How to Create a Booking (Cara Memasukkan Tempahan Baru)

When a guest confirms their dates and pays you via WhatsApp/Bank Transfer:
*(Apabila tetamu mengesahkan tarikh dan membayar melalui WhatsApp/Bank Transfer:)*

1. Click the **+ Create Booking** button at the top right of your dashboard.
   *(Klik butang **+ Create Booking** di bahagian atas kanan dashboard.)*
2. A pop-up form will appear. Fill in the guest's details:
   *(Satu borang akan muncul. Isikan maklumat tetamu:)*
   - **Guest Name** — Full name of the guest *(Nama penuh tetamu)*
   - **Email** — Required so the guest receives their confirmation email *(Diperlukan untuk resit emel)*
   - **Phone** — Guest's WhatsApp/phone number *(No. telefon tetamu)*
   - **Check-in & Check-out Dates** — Select the stay dates *(Tarikh masuk dan keluar)*
   - **Payment Status** — Choose one:
     - **"Paid Already"** → Guest has already paid in full via bank transfer or cash
     - **"Pending (Pay on Arrival)"** → Guest will pay upon check-in
   - **Notes** *(Optional)* — Any internal remarks, e.g. "Late check-in at 10pm", "Requested extra towels". These are admin-only and are **not** sent to the guest.
     *(Catatan dalaman, contoh: "Check-in lewat pukul 10 malam". Ini tidak dihantar kepada tetamu.)*
3. Click **Confirm & Send Automations**.
   *(Klik **Confirm & Send Automations**.)*

**✨ What happens automatically (Apa yang berlaku secara automatik):**
- The dates are immediately blocked on your website calendar *(Tarikh ditutup di laman web)*
- A professional confirmation email is sent to the guest *(Emel pengesahan dihantar kepada tetamu)*
- The booking is added to your Google Calendar *(Tempahan ditambah ke Google Calendar)*
- The booking is logged in your Google Sheets for accounting *(Rekod disimpan dalam Google Sheets)*

---

## 4. How to Modify a Booking (Cara Menukar Tarikh Tempahan)

If a guest wants to change their check-in/check-out dates, payment status, or you want to update the notes:
*(Jika tetamu ingin menukar tarikh, status pembayaran, atau anda ingin kemaskini nota:)*

1. Find their booking in the table.
   *(Cari tempahan mereka dalam senarai.)*
2. Click the blue **Modify** button on the right side of their row.
   *(Klik butang biru **Modify** di sebelah kanan baris mereka.)*
3. A pop-up will appear. Update any of the following:
   - New Check-in and Check-out dates *(Tarikh masuk dan keluar baru)*
   - Payment Status *(Status pembayaran)*
   - Notes *(Nota)*
4. Click **Save Changes**.
   *(Klik **Save Changes**.)*

*Note: The system will automatically recalculate the price, update your Google Calendar, and email the guest their updated booking details.*
*(Nota: Sistem akan mengira semula harga baru, kemaskini Google Calendar, dan menghantar emel kepada tetamu secara automatik.)*

---

## 5. How to Cancel a Booking (Cara Membatalkan Tempahan)

If a guest cancels or you need to free up the dates:
*(Jika tetamu batal atau anda perlu membuka semula tarikh tersebut:)*

1. Find their booking in the table.
   *(Cari tempahan mereka dalam senarai.)*
2. Click the red **Cancel** button on the right side of their row.
   *(Klik butang merah **Cancel** di sebelah kanan baris mereka.)*
3. A confirmation dialog will appear — click **OK** to confirm the cancellation.
   *(Satu dialog pengesahan akan muncul — klik **OK** untuk mengesahkan pembatalan.)*

*Note: The system will automatically open the dates back up on your website, delete the event from Google Calendar, and send a cancellation email to the guest.*
*(Nota: Sistem akan membuka semula tarikh di laman web, memadam acara di Google Calendar, dan menghantar emel pembatalan kepada tetamu secara automatik.)*

---

## 6. Contact & Support (Hubungi & Sokongan)

For any technical issues with the dashboard, contact:

- **Email:** atirahauni.work@gmail.com
- **WhatsApp:** +60 11-1298 3754
