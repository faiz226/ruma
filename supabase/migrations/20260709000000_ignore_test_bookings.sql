CREATE OR REPLACE FUNCTION check_room_availability(
    _room_id UUID,
    _check_in DATE,
    _check_out DATE
) RETURNS boolean AS $$
DECLARE
    v_conflicting_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_conflicting_count
    FROM public.bookings
    WHERE room_id = _room_id
      AND check_in < _check_out
      AND check_out > _check_in
      AND (
          status = 'PAID' OR status = 'confirmed' OR
          (status = 'PENDING_PAYMENT' AND locked_until > NOW())
      )
      AND (is_test IS NULL OR is_test = false);

    RETURN v_conflicting_count = 0;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION create_pending_booking(
    p_room_id UUID,
    p_check_in DATE,
    p_check_out DATE,
    p_guest_name TEXT,
    p_guest_email TEXT,
    p_guest_phone TEXT,
    p_total_price_cents INTEGER,
    p_lock_minutes INTEGER DEFAULT 30
) RETURNS json AS $$
DECLARE
    v_conflicting_count INTEGER;
    v_booking_ref TEXT;
    v_booking_id UUID;
    v_locked_until TIMESTAMP WITH TIME ZONE;
BEGIN
    -- Acquire an advisory lock to prevent concurrent inserts from seeing the same dates as available
    PERFORM pg_advisory_xact_lock(hashtext(p_room_id::text || p_check_in::text || p_check_out::text));

    -- Check for conflicting bookings
    -- A booking conflicts if it overlaps with the requested dates AND 
    -- its status is 'PAID' or ('PENDING_PAYMENT' and locked_until > NOW())
    -- AND it is NOT a test booking
    SELECT COUNT(*) INTO v_conflicting_count
    FROM public.bookings
    WHERE room_id = p_room_id
      AND check_in < p_check_out
      AND check_out > p_check_in
      AND (
          status = 'PAID' OR status = 'confirmed' OR
          (status = 'PENDING_PAYMENT' AND locked_until > NOW())
      )
      AND (is_test IS NULL OR is_test = false);

    IF v_conflicting_count > 0 THEN
        RAISE EXCEPTION 'Dates are no longer available.';
    END IF;

    v_locked_until := NOW() + (p_lock_minutes || ' minutes')::INTERVAL;

    -- Insert the pending booking
    INSERT INTO public.bookings (
        room_id, check_in, check_out, guest_name, guest_email, guest_phone,
        status, total_price_cents, locked_until
    ) VALUES (
        p_room_id, p_check_in, p_check_out, p_guest_name, p_guest_email, p_guest_phone,
        'PENDING_PAYMENT', p_total_price_cents, v_locked_until
    ) RETURNING id, booking_ref INTO v_booking_id, v_booking_ref;

    RETURN json_build_object(
        'id', v_booking_id,
        'booking_ref', v_booking_ref,
        'locked_until', v_locked_until
    );
END;
$$ LANGUAGE plpgsql;
