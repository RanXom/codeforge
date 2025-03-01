import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/lib/database.types"

export type Problem = {
  id: string
  title: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  created_by: string
  created_at: string
  updated_at: string
}

export type TestCase = {
  id: string
  problem_id: string
  input: string
  expected_output: string
  is_hidden: boolean
  created_at: string
}

export async function getProblem(id: string) {
  const supabase = createClientComponentClient<Database>()
  
  const { data: problem, error: problemError } = await supabase
    .from('problems')
    .select('*')
    .eq('id', id)
    .single()

  if (problemError) throw problemError

  const { data: testCases, error: testCasesError } = await supabase
    .from('test_cases')
    .select('*')
    .eq('problem_id', id)
    .eq('is_hidden', false)

  if (testCasesError) throw testCasesError

  return {
    problem,
    testCases
  }
}

export async function getAllProblems() {
  const supabase = createClientComponentClient<Database>()
  
  const { data, error } = await supabase
    .from('problems')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getSubmissions(userId: string, problemId?: string) {
  const supabase = createClientComponentClient<Database>()
  
  let query = supabase
    .from('submissions')
    .select('*')
    .eq('user_id', userId)
    
  if (problemId) {
    query = query.eq('problem_id', problemId)
  }

  const { data, error } = await query.order('created_at', { ascending: false })

  if (error) throw error
  return data
} 