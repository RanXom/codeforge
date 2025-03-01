"use client"

import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock problem data
const mockProblemData = {
  "1": {
    id: "1",
    title: "Two Sum",
    difficulty: "Easy",
    tags: ["Arrays", "Hash Table"],
    description: `
      <p>Given an array of integers <code>nums</code> and an integer <code>target</code>, return indices of the two numbers such that they add up to <code>target</code>.</p>
      <p>You may assume that each input would have exactly one solution, and you may not use the same element twice.</p>
      <p>You can return the answer in any order.</p>
    `,
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
        explanation: "Because nums[1] + nums[2] == 6, we return [1, 2].",
      },
    ],
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists.",
    ],
    hints: [
      "Try using a hash map to store the values you've seen so far.",
      "For each element, check if target - current element exists in the hash map.",
    ],
  },
  "2": {
    id: "2",
    title: "Reverse Linked List",
    difficulty: "Medium",
    tags: ["Linked List", "Recursion"],
    description: `
      <p>Given the <code>head</code> of a singly linked list, reverse the list, and return the reversed list.</p>
    `,
    examples: [
      {
        input: "head = [1,2,3,4,5]",
        output: "[5,4,3,2,1]",
      },
      {
        input: "head = [1,2]",
        output: "[2,1]",
      },
    ],
    constraints: ["The number of nodes in the list is the range [0, 5000].", "-5000 <= Node.val <= 5000"],
    hints: [
      "A linked list can be reversed either iteratively or recursively.",
      "Try to visualize the reversal process by drawing it out.",
    ],
  },
}

export function ProblemDescription({ id }: { id: string }) {
  const [loading, setLoading] = useState(true)
  const [problem, setProblem] = useState<any>(null)

  useEffect(() => {
    // Simulate API call to fetch problem data
    const fetchProblem = async () => {
      setLoading(true)
      // In a real app, you would fetch from an API
      await new Promise((resolve) => setTimeout(resolve, 800))
      setProblem(mockProblemData[id] || mockProblemData["1"])
      setLoading(false)
    }

    fetchProblem()
  }, [id])

  if (loading) {
    return (
      <Card className="min-h-[500px] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
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
              problem.difficulty === "Easy" ? "success" : problem.difficulty === "Medium" ? "warning" : "destructive"
            }
          >
            {problem.difficulty}
          </Badge>
        </CardTitle>
        <CardDescription>
          <div className="flex flex-wrap gap-2 mt-2">
            {problem.tags.map((tag: string) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="description">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="examples">Examples</TabsTrigger>
            <TabsTrigger value="constraints">Constraints</TabsTrigger>
            <TabsTrigger value="hints">Hints</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-4">
            <div dangerouslySetInnerHTML={{ __html: problem.description }} />
          </TabsContent>

          <TabsContent value="examples" className="mt-4 space-y-4">
            {problem.examples.map((example: any, index: number) => (
              <div key={index} className="space-y-2 border rounded-md p-4">
                <div>
                  <strong>Input:</strong> {example.input}
                </div>
                <div>
                  <strong>Output:</strong> {example.output}
                </div>
                {example.explanation && (
                  <div>
                    <strong>Explanation:</strong> {example.explanation}
                  </div>
                )}
              </div>
            ))}
          </TabsContent>

          <TabsContent value="constraints" className="mt-4">
            <ul className="list-disc pl-5 space-y-1">
              {problem.constraints.map((constraint: string, index: number) => (
                <li key={index}>{constraint}</li>
              ))}
            </ul>
          </TabsContent>

          <TabsContent value="hints" className="mt-4">
            <ul className="list-disc pl-5 space-y-1">
              {problem.hints.map((hint: string, index: number) => (
                <li key={index}>{hint}</li>
              ))}
            </ul>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

