/*
  # Create quiz results table

  1. New Tables
    - `quiz_results`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `quiz_content` (text, not null)
      - `score` (integer, not null)
      - `total_questions` (integer, not null)
      - `difficulty` (text, check constraint for easy/medium/hard)
      - `credits_used` (integer, not null)
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `quiz_results` table
    - Add policy for users to read and insert their own quiz results
*/

CREATE TABLE IF NOT EXISTS quiz_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_content text NOT NULL,
  score integer NOT NULL,
  total_questions integer NOT NULL,
  difficulty text NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  credits_used integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own quiz results"
  ON quiz_results
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quiz results"
  ON quiz_results
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);