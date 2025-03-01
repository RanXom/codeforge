"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { getAllProblems, type Problem } from "@/lib/problems"

export function ProblemList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [difficultyFilter, setDifficultyFilter] = useState("all")
  const [problems, setProblems] = useState<Problem[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setLoading(true)
        const data = await getAllProblems()
        setProblems(data)
      } catch (error) {
        console.error('Error fetching problems:', error)
        toast({
          title: "Error",
          description: "Failed to load problems. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProblems()
  }, [toast])

  // Filter problems based on search query and difficulty
  const filteredProblems = problems.filter((problem) => {
    const matchesSearch = problem.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDifficulty =
      difficultyFilter === "all" || problem.difficulty.toLowerCase() === difficultyFilter.toLowerCase()
    return matchesSearch && matchesDifficulty
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

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
                <CardDescription>Created {new Date(problem.created_at).toLocaleDateString()}</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex flex-wrap gap-2">
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

