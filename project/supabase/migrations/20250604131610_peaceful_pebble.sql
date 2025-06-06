/*
  # Add Test Connection Table

  1. New Table
    - `connection_test`: Simple table to test Supabase connection
    - Contains message and timestamp fields
    - Enables RLS with policy for authenticated users

  2. Security
    - Enable RLS
    - Add policy for authenticated users to insert
*/

-- Create test connection table
CREATE TABLE IF NOT EXISTS connection_test (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE connection_test ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users
CREATE POLICY "Allow inserts for authenticated users"
  ON connection_test
  FOR INSERT
  TO authenticated
  WITH CHECK (true);