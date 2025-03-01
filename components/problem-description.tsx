"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"
import { getProblem, type Problem, type TestCase } from "@/lib/problems"
import { useToast } from "@/components/ui/use-toast"

export function ProblemDescription({ id }: { id: string }) {
  const [loading, setLoading] = useState(true)
  const [problem, setProblem] = useState<Problem | null>(null)
  const [testCases, setTestCases] = useState<TestCase[]>([])
  const { toast } = useToast()

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        setLoading(true)
        const data = await getProblem(id)
        setProblem(data.problem)
        setTestCases(data.testCases)
      } catch (error) {
        console.error('Error fetching problem:', error)
        toast({
          title: "Error",
          description: "Failed to load problem details. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProblem()
  }, [id, toast])

  if (loading) {
    return (
      <Card className="min-h-[500px] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </Card>
    )
  }

  if (!problem) {
    return (
      <Card className="min-h-[500px] flex items-center justify-center">
        <div className="text-center text-muted-foreground">Problem not found</div>
      </Card>
    )
  }

  return (
    <Card className="min-h-[500px] overflow-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{problem.title}</span>
          <Badge
            variant={
              problem.difficulty === "easy"
                ? "default"
                : problem.difficulty === "medium"
                  ? "secondary"
                  : "destructive"
            }
          >
            {problem.difficulty}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="description">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="examples">Test Cases</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-4">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: problem.description }} />
            </div>
          </TabsContent>

          <TabsContent value="examples" className="mt-4 space-y-4">
            {testCases.map((testCase) => (
              <div key={testCase.id} className="space-y-2 border rounded-md p-4">
                <div>
                  <strong>Input:</strong> {testCase.input}
                </div>
                <div>
                  <strong>Expected Output:</strong> {testCase.expected_output}
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}


