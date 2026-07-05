-- Add columns for reminder emails and google calendar cancellation
ALTER TABLE public.bookings
ADD COLUMN reminder_sent BOOLEAN DEFAULT FALSE,
ADD COLUMN google_calendar_event_id TEXT;
