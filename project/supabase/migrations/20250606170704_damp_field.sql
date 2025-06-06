/*
  # Add phone field to admins_auth table

  1. Changes
    - Add phone column to admins_auth table
    - Update trigger function to handle phone from user metadata
    
  2. Security
    - Maintain existing RLS policies
    - Phone field is optional (nullable)
*/

-- Add phone column to admins_auth table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'admins_auth' AND column_name = 'phone'
  ) THEN
    ALTER TABLE admins_auth ADD COLUMN phone text;
  END IF;
END $$;

-- Update the trigger function to handle phone from user metadata
CREATE OR REPLACE FUNCTION public.handle_new_admin()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.admins_auth (user_id, name, email, phone)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'name',
    NEW.email,
    NEW.raw_user_meta_data->>'phone'
  );
  RETURN NEW;
END;
$$;