export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      problems: {
        Row: {
          id: string
          title: string
          description: string
          difficulty: 'easy' | 'medium' | 'hard'
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          difficulty: 'easy' | 'medium' | 'hard'
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          difficulty?: 'easy' | 'medium' | 'hard'
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      test_cases: {
        Row: {
          id: string
          problem_id: string
          input: string
          expected_output: string
          is_hidden: boolean
          created_at: string
        }
        Insert: {
          id?: string
          problem_id: string
          input: string
          expected_output: string
          is_hidden?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          problem_id?: string
          input?: string
          expected_output?: string
          is_hidden?: boolean
          created_at?: string
        }
      }
      submissions: {
        Row: {
          id: string
          user_id: string
          problem_id: string
          code: string
          language: string
          status: 'saved' | 'accepted' | 'wrong_answer'
          score: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          problem_id: string
          code: string
          language: string
          status: 'saved' | 'accepted' | 'wrong_answer'
          score?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          problem_id?: string
          code?: string
          language?: string
          status?: 'saved' | 'accepted' | 'wrong_answer'
          score?: number | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 