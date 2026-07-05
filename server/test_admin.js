const fetch = require('node-fetch');

async function testAdmin() {
    console.log("1. Creating Manual Booking...");
    const createRes = await fetch('http://localhost:3001/api/admin/bookings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            roomId: 'ruma-homestay',
            checkIn: '2026-08-01',
            checkOut: '2026-08-03',
            guestName: 'Admin Test',
            guestEmail: 'busycutiekitty@gmail.com',
            guestPhone: '0123456789'
        })
    });
    
    if (!createRes.ok) {
        console.error("Create failed:", await createRes.text());
        return;
    }
    const createData = await createRes.json();
    console.log("Created successfully!", createData.booking.id);
    const bookingId = createData.booking.id;
    
    // Wait for 3 seconds to let Google Calendar API catch up if needed
    await new Promise(r => setTimeout(r, 3000));
    
    console.log("\n2. Modifying Booking Dates...");
    const modifyRes = await fetch('http://localhost:3001/api/admin/bookings/modify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            bookingId: bookingId,
            checkIn: '2026-08-04',
            checkOut: '2026-08-06'
        })
    });
    
    if (!modifyRes.ok) {
        console.error("Modify failed:", await modifyRes.text());
        return;
    }
    console.log("Modified successfully!");
    
    await new Promise(r => setTimeout(r, 3000));
    
    console.log("\n3. Cancelling Booking...");
    const cancelRes = await fetch('http://localhost:3001/api/bookings/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId: bookingId })
    });
    
    if (!cancelRes.ok) {
        console.error("Cancel failed:", await cancelRes.text());
        return;
    }
    console.log("Cancelled successfully!");
}

testAdmin();
