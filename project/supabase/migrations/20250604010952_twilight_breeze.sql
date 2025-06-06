/*
  # Admin Registration Trigger

  1. New Trigger
    - Creates a trigger to automatically insert records into admins_auth table
    - Executes after a new user signs up through Supabase Auth
    - Checks if the user doesn't already exist in admins_auth

  2. Security
    - Only inserts if user doesn't already exist (prevents duplicates)
    - Uses the auth.uid() from the newly created user
*/

-- Create function to handle new admin registration
CREATE OR REPLACE FUNCTION handle_new_admin()
RETURNS TRIGGER AS $$
BEGIN
  -- Only proceed if the user doesn't already exist in admins_auth
  IF NOT EXISTS (
    SELECT 1 FROM public.admins_auth WHERE user_id = auth.uid()
  ) THEN
    -- Insert new record into admins_auth
    INSERT INTO public.admins_auth (
      user_id,
      name,
      email
    ) VALUES (
      auth.uid(),
      NEW.raw_user_meta_data->>'name',
      NEW.email
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger that fires after admin signup
CREATE OR REPLACE TRIGGER on_admin_signup
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_admin();