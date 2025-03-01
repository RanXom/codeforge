"use client"

import { useState, useEffect } from "react"
import { BarChart3, CheckCircle, Clock, Target } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/lib/database.types"

export function CoderDashboard() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    problemsSolved: 0,
    totalProblems: 0,
    testsCompleted: 0,
    averageScore: 0,
    problemStats: {
      easy: { solved: 0, total: 0 },
      medium: { solved: 0, total: 0 },
      hard: { solved: 0, total: 0 },
    },
    recentActivity: [] as any[],
  })
  const { toast } = useToast()
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        const user = await supabase.auth.getUser()
        if (!user.data.user) throw new Error('Not authenticated')

        // Fetch all problems to get total counts
        const { data: problems } = await supabase
          .from('problems')
          .select('*')
        
        // Fetch user's submissions
        const { data: submissions } = await supabase
          .from('submissions')
          .select('*, problems(*)')
          .eq('user_id', user.data.user.id)
          .order('created_at', { ascending: false })

        if (problems) {
          // Calculate problem statistics
          const totalProblems = problems.length
          const problemsByDifficulty = {
            easy: problems.filter(p => p.difficulty === 'easy').length,
            medium: problems.filter(p => p.difficulty === 'medium').length,
            hard: problems.filter(p => p.difficulty === 'hard').length,
          }

          // Calculate solved problems
          const solvedProblemIds = new Set(
            submissions
              ?.filter(s => s.status === 'accepted')
              .map(s => s.problem_id)
          )

          const solvedProblems = problems.filter(p => solvedProblemIds.has(p.id))
          const solvedByDifficulty = {
            easy: solvedProblems.filter(p => p.difficulty === 'easy').length,
            medium: solvedProblems.filter(p => p.difficulty === 'medium').length,
            hard: solvedProblems.filter(p => p.difficulty === 'hard').length,
          }

          // Calculate average score
          const scores = submissions?.map(s => s.score).filter(s => s !== null) as number[]
          const averageScore = scores.length > 0
            ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
            : 0

          // Format recent activity
          const recentActivity = submissions?.slice(0, 5).map(submission => ({
            type: "problem",
            title: submission.problems?.title || 'Unknown Problem',
            result: submission.status === 'accepted' ? 'Solved' : 'Attempted',
            timestamp: submission.created_at,
            score: submission.score || 0,
          })) || []

          setStats({
            problemsSolved: solvedProblemIds.size,
            totalProblems,
            testsCompleted: 0, // TODO: Implement when tests feature is added
            averageScore,
            problemStats: {
              easy: { solved: solvedByDifficulty.easy, total: problemsByDifficulty.easy },
              medium: { solved: solvedByDifficulty.medium, total: problemsByDifficulty.medium },
              hard: { solved: solvedByDifficulty.hard, total: problemsByDifficulty.hard },
            },
            recentActivity,
          })
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [supabase, toast])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Problems Solved</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.problemsSolved} / {stats.totalProblems}
            </div>
            <Progress value={(stats.problemsSolved / stats.totalProblems) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tests Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.testsCompleted}</div>
            <p className="text-xs text-muted-foreground">Average Score: {stats.averageScore}%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Ranking</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Coming Soon</div>
            <p className="text-xs text-muted-foreground">Ranking system in development</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Spent</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Coming Soon</div>
            <p className="text-xs text-muted-foreground">Time tracking in development</p>
          </CardContent>
        </Card>
      </div>

      {/* Problem Solving Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Problem Solving Progress</CardTitle>
          <CardDescription>Your progress across different difficulty levels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Easy</span>
                <span className="text-muted-foreground">
                  {stats.problemStats.easy.solved} / {stats.problemStats.easy.total}
                </span>
              </div>
              <Progress
                value={(stats.problemStats.easy.solved / stats.problemStats.easy.total) * 100}
                className="h-2 bg-muted"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Medium</span>
                <span className="text-muted-foreground">
                  {stats.problemStats.medium.solved} / {stats.problemStats.medium.total}
                </span>
              </div>
              <Progress
                value={(stats.problemStats.medium.solved / stats.problemStats.medium.total) * 100}
                className="h-2 bg-muted"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Hard</span>
                <span className="text-muted-foreground">
                  {stats.problemStats.hard.solved} / {stats.problemStats.hard.total}
                </span>
              </div>
              <Progress
                value={(stats.problemStats.hard.solved / stats.problemStats.hard.total) * 100}
                className="h-2 bg-muted"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest problem solving activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.recentActivity.length > 0 ? (
              stats.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {activity.type === "problem" ? "Problem" : "Test"} • {activity.result}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{activity.score > 0 ? `${activity.score}%` : "—"}</p>
                    <p className="text-sm text-muted-foreground">{formatDate(activity.timestamp)}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No recent activity. Start solving problems to see your progress!
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}