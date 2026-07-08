const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY;
const ADMIN_EMAIL = process.env.TEST_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.TEST_ADMIN_PASSWORD;

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error('ERROR: Set TEST_ADMIN_EMAIL and TEST_ADMIN_PASSWORD in server/.env before running this script.');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testBooking() {
    console.log("Logging into Supabase...");
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD
    });

    if (authError) {
        console.error("Auth error:", authError.message);
        return;
    }
    
    console.log("Login successful! Token:", authData.session.access_token.substring(0, 15) + '...');
    
    console.log("Creating test booking via API...");
    const response = await fetch('http://localhost:3001/api/admin/bookings/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authData.session.access_token}`
        },
        body: JSON.stringify({
            roomId: 'ruma-homestay',
            checkIn: '2027-03-10',
            checkOut: '2027-03-12',
            guestName: 'AI Test User',
            guestEmail: 'busycutiekitty@gmail.com',
            guestPhone: '0123456789',
            status: 'PAID',
            notes: 'This is a live test from the AI agent.',
            discountCode: 'WELCOME10',
            isTest: true
        })
    });
    
    const data = await response.json();
    console.log("Response:", response.status, data);
}

testBooking();
