/*
  # Create learning plans table

  1. New Tables
    - `learning_plans`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `title` (text, not null)
      - `content` (text, not null)
      - `tier` (text, check constraint for basic/advanced/premium)
      - `credits_used` (integer, not null)
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `learning_plans` table
    - Add policy for users to read and insert their own learning plans
*/

CREATE TABLE IF NOT EXISTS learning_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  tier text NOT NULL CHECK (tier IN ('basic', 'advanced', 'premium')),
  credits_used integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE learning_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own learning plans"
  ON learning_plans
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own learning plans"
  ON learning_plans
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);