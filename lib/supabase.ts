import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type TestCase = {
  id: string
  problem_id: string
  input: string
  expected_output: string
  is_hidden: boolean
  created_at: string
}

export type Problem = {
  id: string
  title: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  created_by: string
  created_at: string
  updated_at: string
}