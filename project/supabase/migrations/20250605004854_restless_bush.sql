/*
  # Fix Admin Trigger Function

  1. Changes
    - Create or replace the trigger function to handle new admin creation
    - Add trigger to auth.users table
    
  2. Security
    - Function executes with security definer to bypass RLS
    - Only creates admin record for new signups
*/

-- First, create the trigger function
CREATE OR REPLACE FUNCTION public.handle_new_admin()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.admins_auth (user_id, name, email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'name',
    NEW.email
  );
  RETURN NEW;
END;
$$;

-- Then, create the trigger if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW
      EXECUTE FUNCTION public.handle_new_admin();
  END IF;
END
$$;