"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Plus, Trash, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/lib/database.types"
import type { Problem } from "@/lib/problems"

type SelectedProblem = Problem & {
  points: number
}

export function TestForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [startTime, setStartTime] = useState("")
  const [duration, setDuration] = useState(60) // Duration in minutes
  const [problems, setProblems] = useState<Problem[]>([])
  const [selectedProblems, setSelectedProblems] = useState<SelectedProblem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const supabase = createClientComponentClient<Database>()

  // Fetch available problems
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const { data, error } = await supabase
          .from('problems')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        setProblems(data || [])
      } catch (error) {
        console.error('Error fetching problems:', error)
        toast({
          title: "Error",
          description: "Failed to load problems. Please try again.",
          variant: "destructive",
        })
      }
    }

    fetchProblems()
  }, [supabase, toast])

  // Filter problems based on search query
  const filteredProblems = problems.filter(problem =>
    problem.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
    !selectedProblems.some(sp => sp.id === problem.id)
  )

  const addProblem = (problem: Problem) => {
    setSelectedProblems([...selectedProblems, { ...problem, points: 10 }])
  }

  const removeProblem = (problemId: string) => {
    setSelectedProblems(selectedProblems.filter(p => p.id !== problemId))
  }

  const updatePoints = (problemId: string, points: number) => {
    setSelectedProblems(selectedProblems.map(p =>
      p.id === problemId ? { ...p, points } : p
    ))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (selectedProblems.length === 0) {
      toast({
        title: "Error",
        description: "Add at least one problem to the test",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)
      const user = await supabase.auth.getUser()
      if (!user.data.user) throw new Error('Not authenticated')

      // Create the test
      const { data: test, error: testError } = await supabase
        .from('tests')
        .insert({
          title,
          description,
          created_by: user.data.user.id,
          start_time: new Date(startTime).toISOString(),
          end_time: new Date(new Date(startTime).getTime() + duration * 60000).toISOString(),
          status: 'upcoming',
        })
        .select()
        .single()

      if (testError) throw testError

      // Add problems to the test
      const { error: problemsError } = await supabase
        .from('test_problems')
        .insert(
          selectedProblems.map(p => ({
            test_id: test.id,
            problem_id: p.id,
            points: p.points,
          }))
        )

      if (problemsError) throw problemsError

      toast({
        title: "Success",
        description: "Test created successfully",
      })

      router.push('/creator/tests')
      router.refresh()
    } catch (error) {
      console.error('Error creating test:', error)
      toast({
        title: "Error",
        description: "Failed to create test. Please try again.",
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
          <CardTitle>Create New Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Test Details */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Weekly Coding Challenge #1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                placeholder="Test instructions and additional information..."
                className="min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value))}
                  required
                />
              </div>
            </div>
          </div>

          {/* Problem Selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Selected Problems</Label>
              <div className="text-sm text-muted-foreground">
                Total Points: {selectedProblems.reduce((sum, p) => sum + p.points, 0)}
              </div>
            </div>

            {selectedProblems.map((problem) => (
              <Card key={problem.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{problem.title}</div>
                      <div className="text-sm text-muted-foreground">Difficulty: {problem.difficulty}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="space-x-2">
                        <Label htmlFor={`points-${problem.id}`}>Points:</Label>
                        <Input
                          id={`points-${problem.id}`}
                          type="number"
                          min="0"
                          value={problem.points}
                          onChange={(e) => updatePoints(problem.id, parseInt(e.target.value))}
                          className="w-20 inline-block"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeProblem(problem.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="space-y-4">
              <Label>Add Problems</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search problems..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>

              <div className="space-y-2">
                {filteredProblems.map((problem) => (
                  <Card key={problem.id} className="cursor-pointer hover:bg-accent" onClick={() => addProblem(problem)}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{problem.title}</div>
                          <div className="text-sm text-muted-foreground">Difficulty: {problem.difficulty}</div>
                        </div>
                        <Button type="button" variant="outline" size="sm">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={loading} className="ml-auto">
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Create Test
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
} 