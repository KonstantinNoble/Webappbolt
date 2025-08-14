import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          email: string;
          credits: number;
          last_credit_reset: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          credits?: number;
          last_credit_reset?: string;
        };
        Update: {
          credits?: number;
          last_credit_reset?: string;
          updated_at?: string;
        };
      };
      learning_plans: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          content: string;
          tier: 'basic' | 'advanced' | 'premium';
          credits_used: number;
          created_at: string;
        };
        Insert: {
          user_id: string;
          title: string;
          content: string;
          tier: 'basic' | 'advanced' | 'premium';
          credits_used: number;
        };
      };
      quiz_results: {
        Row: {
          id: string;
          user_id: string;
          quiz_content: string;
          score: number;
          total_questions: number;
          difficulty: 'easy' | 'medium' | 'hard';
          credits_used: number;
          created_at: string;
        };
        Insert: {
          user_id: string;
          quiz_content: string;
          score: number;
          total_questions: number;
          difficulty: 'easy' | 'medium' | 'hard';
          credits_used: number;
        };
      };
      user_consents: {
        Row: {
          id: string;
          user_id: string;
          consent_type: string;
          status: 'granted' | 'revoked';
          timestamp: string;
          consent_method: string;
          consent_text: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          consent_type: string;
          status: 'granted' | 'revoked';
          timestamp: string;
          consent_method: string;
          consent_text: string;
        };
        Update: {
          status?: 'granted' | 'revoked';
          timestamp?: string;
          updated_at?: string;
        };
      };
      user_notes: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          content: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          title: string;
          content?: string;
        };
        Update: {
          title?: string;
          content?: string;
          updated_at?: string;
        };
      };
      user_goals: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string;
          due_date: string | null;
          status: 'todo' | 'in_progress' | 'done';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          title: string;
          description?: string;
          due_date?: string | null;
          status?: 'todo' | 'in_progress' | 'done';
        };
        Update: {
          title?: string;
          description?: string;
          due_date?: string | null;
          status?: 'todo' | 'in_progress' | 'done';
          updated_at?: string;
        };
      };
      goal_nodes: {
        Row: {
          id: string;
          goal_id: string;
          title: string;
          description: string;
          type: 'start' | 'milestone' | 'step' | 'end';
          position_x: number;
          position_y: number;
          status: 'todo' | 'done';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          goal_id: string;
          title: string;
          description?: string;
          type: 'start' | 'milestone' | 'step' | 'end';
          position_x?: number;
          position_y?: number;
          status?: 'todo' | 'done';
        };
        Update: {
          title?: string;
          description?: string;
          type?: 'start' | 'milestone' | 'step' | 'end';
          position_x?: number;
          position_y?: number;
          status?: 'todo' | 'done';
          updated_at?: string;
        };
      };
      goal_edges: {
        Row: {
          id: string;
          goal_id: string;
          source_node_id: string;
          target_node_id: string;
          created_at: string;
        };
        Insert: {
          goal_id: string;
          source_node_id: string;
          target_node_id: string;
        };
        Update: {
          source_node_id?: string;
          target_node_id?: string;
        };
      };
    };
  };
};