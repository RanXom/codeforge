"use client"

import { useState } from "react"
import Link from "next/link"
import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

// Mock data for problems
const mockProblems = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    tags: ["Arrays", "Hash Table"],
    solvedCount: 1245,
  },
  {
    id: 2,
    title: "Reverse Linked List",
    difficulty: "Medium",
    tags: ["Linked List", "Recursion"],
    solvedCount: 987,
  },
  {
    id: 3,
    title: "Binary Tree Maximum Path Sum",
    difficulty: "Hard",
    tags: ["Binary Tree", "DFS"],
    solvedCount: 456,
  },
]

export function ProblemList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [difficultyFilter, setDifficultyFilter] = useState("all")

  // Filter problems based on search query and difficulty
  const filteredProblems = mockProblems.filter((problem) => {
    const matchesSearch = problem.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDifficulty =
      difficultyFilter === "all" || problem.difficulty.toLowerCase() === difficultyFilter.toLowerCase()
    return matchesSearch && matchesDifficulty
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search problems..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Difficulties</SelectItem>
            <SelectItem value="easy">Easy</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="hard">Hard</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {filteredProblems.length > 0 ? (
          filteredProblems.map((problem) => (
            <Card key={problem.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{problem.title}</CardTitle>
                <CardDescription>Solved by {problem.solvedCount} coders</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant={
                      problem.difficulty === "Easy"
                        ? "success"
                        : problem.difficulty === "Medium"
                          ? "warning"
                          : "destructive"
                    }
                  >
                    {problem.difficulty}
                  </Badge>
                  {problem.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild size="sm">
                  <Link href={`/coder/problem/${problem.id}`}>Solve</Link>
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">No problems found matching your criteria.</div>
        )}
      </div>
    </div>
  )
}

