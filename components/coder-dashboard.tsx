"use client"

import { BarChart3, CheckCircle, Clock, Target } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

// Mock data for the dashboard
const mockData = {
  stats: {
    problemsSolved: 42,
    totalProblems: 150,
    testsCompleted: 8,
    averageScore: 85,
    ranking: 256,
    totalParticipants: 1500,
  },
  recentActivity: [
    {
      type: "problem",
      title: "Two Sum",
      result: "Solved",
      timestamp: "2024-03-01T10:30:00",
      score: 100,
    },
    {
      type: "test",
      title: "Weekly Coding Challenge",
      result: "Completed",
      timestamp: "2024-02-28T15:45:00",
      score: 85,
    },
    {
      type: "problem",
      title: "Binary Tree Maximum Path Sum",
      result: "Attempted",
      timestamp: "2024-02-27T09:15:00",
      score: 0,
    },
  ],
  problemStats: {
    easy: { solved: 25, total: 50 },
    medium: { solved: 15, total: 75 },
    hard: { solved: 2, total: 25 },
  },
}

export function CoderDashboard() {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
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
              {mockData.stats.problemsSolved} / {mockData.stats.totalProblems}
            </div>
            <Progress value={(mockData.stats.problemsSolved / mockData.stats.totalProblems) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tests Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.stats.testsCompleted}</div>
            <p className="text-xs text-muted-foreground">Average Score: {mockData.stats.averageScore}%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Ranking</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">#{mockData.stats.ranking}</div>
            <p className="text-xs text-muted-foreground">Out of {mockData.stats.totalParticipants} participants</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Spent</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">124h</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
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
                  {mockData.problemStats.easy.solved} / {mockData.problemStats.easy.total}
                </span>
              </div>
              <Progress
                value={(mockData.problemStats.easy.solved / mockData.problemStats.easy.total) * 100}
                className="h-2 bg-muted"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Medium</span>
                <span className="text-muted-foreground">
                  {mockData.problemStats.medium.solved} / {mockData.problemStats.medium.total}
                </span>
              </div>
              <Progress
                value={(mockData.problemStats.medium.solved / mockData.problemStats.medium.total) * 100}
                className="h-2 bg-muted"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Hard</span>
                <span className="text-muted-foreground">
                  {mockData.problemStats.hard.solved} / {mockData.problemStats.hard.total}
                </span>
              </div>
              <Progress
                value={(mockData.problemStats.hard.solved / mockData.problemStats.hard.total) * 100}
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
          <CardDescription>Your latest problem solving and test activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockData.recentActivity.map((activity, index) => (
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
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}