/*
  # Initial Schema for Barbershop Management System

  1. New Tables
    - `admins_auth`: System administrators linked to Supabase Auth
    - `businesses`: Barbershops and salons
    - `clients`: Business clients
    - `professionals`: Business professionals (barbers/hairdressers)
    - `services`: Business services
    - `appointments`: Client appointments

  2. Security
    - Enable RLS on all tables
    - Add policies for data access based on business_id
    - Ensure data isolation between businesses

  3. Relationships
    - Link admins to Supabase Auth
    - Link all business-related data through business_id
    - Set up proper foreign key constraints
*/

-- Create admins_auth table
CREATE TABLE IF NOT EXISTS admins_auth (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE admins_auth ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view their own data"
  ON admins_auth
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create businesses table
CREATE TABLE IF NOT EXISTS businesses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid REFERENCES admins_auth(user_id) ON DELETE RESTRICT,
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  city text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage businesses"
  ON businesses
  FOR ALL
  TO authenticated
  USING (auth.uid() IN (SELECT user_id FROM admins_auth));

-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid REFERENCES businesses(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  total_spent decimal(10,2) DEFAULT 0,
  visits integer DEFAULT 0,
  last_visit timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Businesses can manage their clients"
  ON clients
  FOR ALL
  TO authenticated
  USING (business_id IN (
    SELECT id FROM businesses WHERE admin_id = auth.uid()
  ));

-- Create professionals table
CREATE TABLE IF NOT EXISTS professionals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid REFERENCES businesses(id) ON DELETE CASCADE,
  name text NOT NULL,
  specialty text NOT NULL,
  contact text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE professionals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Businesses can manage their professionals"
  ON professionals
  FOR ALL
  TO authenticated
  USING (business_id IN (
    SELECT id FROM businesses WHERE admin_id = auth.uid()
  ));

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid REFERENCES businesses(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  price decimal(10,2) NOT NULL,
  duration integer NOT NULL, -- in minutes
  created_at timestamptz DEFAULT now()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Businesses can manage their services"
  ON services
  FOR ALL
  TO authenticated
  USING (business_id IN (
    SELECT id FROM businesses WHERE admin_id = auth.uid()
  ));

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid REFERENCES businesses(id) ON DELETE CASCADE,
  client_id uuid REFERENCES clients(id) ON DELETE RESTRICT,
  service_id uuid REFERENCES services(id) ON DELETE RESTRICT,
  professional_id uuid REFERENCES professionals(id) ON DELETE RESTRICT,
  date date NOT NULL,
  time text NOT NULL,
  status text NOT NULL CHECK (status IN ('scheduled', 'completed', 'canceled')),
  value decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Businesses can manage their appointments"
  ON appointments
  FOR ALL
  TO authenticated
  USING (business_id IN (
    SELECT id FROM businesses WHERE admin_id = auth.uid()
  ));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_businesses_admin_id ON businesses(admin_id);
CREATE INDEX IF NOT EXISTS idx_clients_business_id ON clients(business_id);
CREATE INDEX IF NOT EXISTS idx_professionals_business_id ON professionals(business_id);
CREATE INDEX IF NOT EXISTS idx_services_business_id ON services(business_id);
CREATE INDEX IF NOT EXISTS idx_appointments_business_id ON appointments(business_id);
CREATE INDEX IF NOT EXISTS idx_appointments_client_id ON appointments(client_id);
CREATE INDEX IF NOT EXISTS idx_appointments_service_id ON appointments(service_id);
CREATE INDEX IF NOT EXISTS idx_appointments_professional_id ON appointments(professional_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date);