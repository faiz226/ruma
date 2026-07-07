-- 1. Create admin_users table
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable Row Level Security
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Allow users to query only their own email (so the frontend can check if they are an admin, but not list all admins)
CREATE POLICY "Allow authenticated users to read their own admin status" 
ON public.admin_users 
FOR SELECT 
TO authenticated 
USING (email = auth.jwt()->>'email');

-- Note: The backend uses the service_role key, which bypasses RLS automatically, 
-- allowing it to freely query the table to verify incoming requests.

-- 4. Seed the initial admins
INSERT INTO public.admin_users (email) VALUES 
('busycutiekitty@gmail.com'),
('puteriaura04@gmail.com')
ON CONFLICT (email) DO NOTHING;
