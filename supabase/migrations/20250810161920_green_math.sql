/*
  # Interactive Goal Graph System

  1. New Tables
    - `goal_nodes`
      - `id` (uuid, primary key)
      - `goal_id` (uuid, foreign key to user_goals)
      - `title` (text)
      - `description` (text, optional)
      - `type` (text: 'start', 'milestone', 'step', 'end')
      - `position_x` (numeric)
      - `position_y` (numeric)
      - `status` (text: 'todo', 'done')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `goal_edges`
      - `id` (uuid, primary key)
      - `goal_id` (uuid, foreign key to user_goals)
      - `source_node_id` (uuid, foreign key to goal_nodes)
      - `target_node_id` (uuid, foreign key to goal_nodes)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data
*/

-- Goal Nodes Table
CREATE TABLE IF NOT EXISTS goal_nodes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id uuid NOT NULL REFERENCES user_goals(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text DEFAULT '',
  type text NOT NULL CHECK (type IN ('start', 'milestone', 'step', 'end')),
  position_x numeric NOT NULL DEFAULT 0,
  position_y numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'done')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Goal Edges Table
CREATE TABLE IF NOT EXISTS goal_edges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id uuid NOT NULL REFERENCES user_goals(id) ON DELETE CASCADE,
  source_node_id uuid NOT NULL REFERENCES goal_nodes(id) ON DELETE CASCADE,
  target_node_id uuid NOT NULL REFERENCES goal_nodes(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE goal_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE goal_edges ENABLE ROW LEVEL SECURITY;

-- RLS Policies for goal_nodes
CREATE POLICY "Users can manage their own goal nodes"
  ON goal_nodes
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_goals 
      WHERE user_goals.id = goal_nodes.goal_id 
      AND user_goals.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_goals 
      WHERE user_goals.id = goal_nodes.goal_id 
      AND user_goals.user_id = auth.uid()
    )
  );

-- RLS Policies for goal_edges
CREATE POLICY "Users can manage their own goal edges"
  ON goal_edges
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_goals 
      WHERE user_goals.id = goal_edges.goal_id 
      AND user_goals.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_goals 
      WHERE user_goals.id = goal_edges.goal_id 
      AND user_goals.user_id = auth.uid()
    )
  );

-- Add updated_at trigger for goal_nodes
CREATE TRIGGER update_goal_nodes_updated_at
  BEFORE UPDATE ON goal_nodes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_goal_nodes_goal_id ON goal_nodes(goal_id);
CREATE INDEX IF NOT EXISTS idx_goal_nodes_type ON goal_nodes(type);
CREATE INDEX IF NOT EXISTS idx_goal_edges_goal_id ON goal_edges(goal_id);
CREATE INDEX IF NOT EXISTS idx_goal_edges_source ON goal_edges(source_node_id);
CREATE INDEX IF NOT EXISTS idx_goal_edges_target ON goal_edges(target_node_id);