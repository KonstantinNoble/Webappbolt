/*
  # Create user_consents table for DSGVO compliance

  1. New Tables
    - `user_consents`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `consent_type` (text, type of consent)
      - `status` (text, granted/revoked)
      - `timestamp` (timestamptz, when consent was given/revoked)
      - `consent_method` (text, how consent was obtained)
      - `consent_text` (text, exact consent text shown to user)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `user_consents` table
    - Add policies for users to manage their own consent records

  3. Indexes
    - Index on user_id and consent_type for fast lookups
    - Index on timestamp for chronological queries
*/

CREATE TABLE IF NOT EXISTS public.user_consents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  consent_type text NOT NULL,
  status text NOT NULL CHECK (status IN ('granted', 'revoked')),
  timestamp timestamptz NOT NULL DEFAULT now(),
  consent_method text NOT NULL,
  consent_text text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.user_consents ENABLE ROW LEVEL SECURITY;

-- Create policies for user consent management
CREATE POLICY "Users can read their own consents"
  ON public.user_consents
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own consents"
  ON public.user_consents
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own consents"
  ON public.user_consents
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_consents_user_id_type 
  ON public.user_consents(user_id, consent_type);

CREATE INDEX IF NOT EXISTS idx_user_consents_timestamp 
  ON public.user_consents(timestamp DESC);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_user_consents_updated_at ON public.user_consents;
CREATE TRIGGER update_user_consents_updated_at
  BEFORE UPDATE ON public.user_consents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();