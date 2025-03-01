"use client"

import Link from "next/link"
import { BarChart3, Clock, FileText, Plus, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TestAnalytics } from "@/components/test-analytics"

// Mock data for tests
const mockTests = [
  {
    id: 1,
    title: "Weekly Coding Challenge",
    date: "2025-03-05T14:00:00",
    duration: "2 hours",
    problemCount: 5,
    participantCount: 42,
    status: "upcoming",
  },
  {
    id: 2,
    title: "Algorithm Mastery Test",
    date: "2025-03-10T10:00:00",
    duration: "3 hours",
    problemCount: 8,
    participantCount: 28,
    status: "upcoming",
  },
  {
    id: 3,
    title: "Data Structures Challenge",
    date: "2025-03-01T09:00:00",
    duration: "4 hours",
    problemCount: 6,
    participantCount: 35,
    status: "ongoing",
  },
  {
    id: 4,
    title: "Frontend Coding Test",
    date: "2025-02-20T15:00:00",
    duration: "2 hours",
    problemCount: 4,
    participantCount: 56,
    status: "completed",
    averageScore: 78,
    cheatingAttempts: 3,
  },
  {
    id: 5,
    title: "Backend Development Challenge",
    date: "2025-02-15T13:00:00",
    duration: "3 hours",
    problemCount: 5,
    participantCount: 48,
    status: "completed",
    averageScore: 82,
    cheatingAttempts: 1,
  },
]

export function TestCreatorDashboard() {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const upcomingTests = mockTests.filter((test) => test.status === "upcoming")
  const ongoingTests = mockTests.filter((test) => test.status === "ongoing")
  const completedTests = mockTests.filter((test) => test.status === "completed")

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockTests.length}</div>
            <p className="text-xs text-muted-foreground">
              {upcomingTests.length} upcoming, {ongoingTests.length} ongoing
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockTests.reduce((sum, test) => sum + test.participantCount, 0)}</div>
            <p className="text-xs text-muted-foreground">Across all tests</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {completedTests.length > 0
                ? Math.round(
                    completedTests.reduce((sum, test) => sum + (test.averageScore || 0), 0) / completedTests.length,
                  )
                : 0}
              %
            </div>
            <p className="text-xs text-muted-foreground">Across completed tests</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cheating Attempts</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {completedTests.reduce((sum, test) => sum + (test.cheatingAttempts || 0), 0)}
            </div>
            <p className="text-xs text-muted-foreground">Detected across all tests</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Tests</h2>
        <Button asChild>
          <Link href="/creator/tests/new">
            <Plus className="h-4 w-4 mr-2" />
            Create New Test
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4 mt-4">
          {upcomingTests.map((test) => (
            <Card key={test.id}>
              <CardHeader>
                <CardTitle>{test.title}</CardTitle>
                <CardDescription>Scheduled for {formatDate(test.date)}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm font-medium">Duration</p>
                    <p className="text-sm text-muted-foreground">{test.duration}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Problems</p>
                    <p className="text-sm text-muted-foreground">{test.problemCount}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Participants</p>
                    <p className="text-sm text-muted-foreground">{test.participantCount}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" asChild>
                  <Link href={`/creator/tests/${test.id}/edit`}>Edit</Link>
                </Button>
                <Button asChild>
                  <Link href={`/creator/tests/${test.id}`}>View Details</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}

          {upcomingTests.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No upcoming tests. Create a new test to get started.
            </div>
          )}
        </TabsContent>

        <TabsContent value="ongoing" className="space-y-4 mt-4">
          {ongoingTests.map((test) => (
            <Card key={test.id}>
              <CardHeader>
                <CardTitle>{test.title}</CardTitle>
                <CardDescription>Started at {formatDate(test.date)}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm font-medium">Duration</p>
                    <p className="text-sm text-muted-foreground">{test.duration}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Problems</p>
                    <p className="text-sm text-muted-foreground">{test.problemCount}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Participants</p>
                    <p className="text-sm text-muted-foreground">{test.participantCount}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" asChild>
                  <Link href={`/creator/tests/${test.id}/monitor`}>Monitor</Link>
                </Button>
                <Button asChild>
                  <Link href={`/creator/tests/${test.id}`}>View Details</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}

          {ongoingTests.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">No ongoing tests at the moment.</div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4 mt-4">
          {completedTests.map((test) => (
            <Card key={test.id}>
              <CardHeader>
                <CardTitle>{test.title}</CardTitle>
                <CardDescription>Completed on {formatDate(test.date)}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm font-medium">Duration</p>
                    <p className="text-sm text-muted-foreground">{test.duration}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Problems</p>
                    <p className="text-sm text-muted-foreground">{test.problemCount}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Participants</p>
                    <p className="text-sm text-muted-foreground">{test.participantCount}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Average Score</p>
                    <p className="text-sm text-muted-foreground">{test.averageScore}%</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" asChild>
                  <Link href={`/creator/tests/${test.id}/results`}>Results</Link>
                </Button>
                <Button asChild>
                  <Link href={`/creator/tests/${test.id}`}>View Details</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}

          {completedTests.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">No completed tests yet.</div>
          )}
        </TabsContent>
      </Tabs>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Analytics Overview</h2>
        <TestAnalytics />
      </div>
    </div>
  )
}

