"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Plus, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/lib/database.types"

type TestCase = {
  input: string
  expected_output: string
  is_hidden: boolean
}

export function ProblemForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy")
  const [testCases, setTestCases] = useState<TestCase[]>([
    { input: "", expected_output: "", is_hidden: false }
  ])

  const addTestCase = () => {
    setTestCases([...testCases, { input: "", expected_output: "", is_hidden: false }])
  }

  const removeTestCase = (index: number) => {
    setTestCases(testCases.filter((_, i) => i !== index))
  }

  const updateTestCase = (index: number, field: keyof TestCase, value: string | boolean) => {
    const newTestCases = [...testCases]
    newTestCases[index] = { ...newTestCases[index], [field]: value }
    setTestCases(newTestCases)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (testCases.length === 0) {
      toast({
        title: "Error",
        description: "Add at least one test case",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)
      const supabase = createClientComponentClient<Database>()

      // Get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError

      // Create the problem
      const { data: problem, error: problemError } = await supabase
        .from('problems')
        .insert({
          title,
          description,
          difficulty,
          created_by: user?.id,
        })
        .select()
        .single()

      if (problemError) throw problemError

      // Create test cases
      const { error: testCasesError } = await supabase
        .from('test_cases')
        .insert(
          testCases.map(tc => ({
            problem_id: problem.id,
            input: tc.input,
            expected_output: tc.expected_output,
            is_hidden: tc.is_hidden,
          }))
        )

      if (testCasesError) throw testCasesError

      toast({
        title: "Success",
        description: "Problem created successfully",
      })

      router.push('/creator/problems')
      router.refresh()
    } catch (error) {
      console.error('Error creating problem:', error)
      toast({
        title: "Error",
        description: "Failed to create problem. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Create New Problem</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Problem Details */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Two Sum"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                placeholder="Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target..."
                className="min-h-[200px]"
              />
            </div>

            <div className="space-y-2">
              <Label>Difficulty</Label>
              <Select value={difficulty} onValueChange={(value: "easy" | "medium" | "hard") => setDifficulty(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Test Cases */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Test Cases</Label>
              <Button type="button" variant="outline" size="sm" onClick={addTestCase}>
                <Plus className="h-4 w-4 mr-2" />
                Add Test Case
              </Button>
            </div>

            {testCases.map((testCase, index) => (
              <Card key={index}>
                <CardContent className="pt-6 space-y-4">
                  <div className="space-y-2">
                    <Label>Input</Label>
                    <Input
                      value={testCase.input}
                      onChange={(e) => updateTestCase(index, "input", e.target.value)}
                      required
                      placeholder="[2, 7, 11, 15], 9"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Expected Output</Label>
                    <Input
                      value={testCase.expected_output}
                      onChange={(e) => updateTestCase(index, "expected_output", e.target.value)}
                      required
                      placeholder="[0, 1]"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`hidden-${index}`}
                      checked={testCase.is_hidden}
                      onChange={(e) => updateTestCase(index, "is_hidden", e.target.checked)}
                    />
                    <Label htmlFor={`hidden-${index}`}>Hidden test case</Label>
                  </div>

                  {testCases.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeTestCase(index)}
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={loading} className="ml-auto">
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Create Problem
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
} 