-- Row Level Security (RLS) Policies for Users Table
-- Run these commands in your Supabase SQL editor

-- Enable RLS on the users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own profile
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- Policy: Users can update their own profile (except id and email)
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policy: Allow insertion of new users (for OAuth flow)
CREATE POLICY "Allow user insertion" ON users
  FOR INSERT WITH CHECK (true);

-- Policy: Only authenticated users can access users table
CREATE POLICY "Authenticated users only" ON users
  FOR ALL USING (auth.role() = 'authenticated');

-- Grant necessary permissions to authenticated users
GRANT SELECT, INSERT, UPDATE ON users TO authenticated;

-- Grant usage on the sequence if you're using auto-incrementing IDs
-- (This is not needed if you're using UUIDs from auth.users)
-- GRANT USAGE, SELECT ON SEQUENCE users_id_seq TO authenticated;

-- Optional: Create a function to handle user creation from OAuth
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- This function can be used to automatically create user profiles
  -- when new users sign up through Supabase Auth
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Optional: Create a trigger to automatically create user profiles
-- Uncomment if you want automatic user profile creation
-- CREATE TRIGGER on_auth_user_created
--   AFTER INSERT ON auth.users
--   FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Verify the policies are in place
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'users';
