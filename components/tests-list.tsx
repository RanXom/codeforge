"use client"

import Link from "next/link"
import { CalendarClock, CheckCircle, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

// Mock data for tests
const mockTests = {
  upcoming: [
    {
      id: 1,
      title: "Weekly Coding Challenge",
      date: "2025-03-05T14:00:00",
      duration: "2 hours",
      problemCount: 5,
    },
    {
      id: 2,
      title: "Algorithm Mastery Test",
      date: "2025-03-10T10:00:00",
      duration: "3 hours",
      problemCount: 8,
    },
  ],
  ongoing: [
    {
      id: 3,
      title: "Data Structures Challenge",
      date: "2025-03-01T09:00:00",
      duration: "4 hours",
      problemCount: 6,
      timeRemaining: "2h 15m",
    },
  ],
  past: [
    {
      id: 4,
      title: "Frontend Coding Test",
      date: "2025-02-20T15:00:00",
      duration: "2 hours",
      problemCount: 4,
      score: "85/100",
      rank: 42,
    },
    {
      id: 5,
      title: "Backend Development Challenge",
      date: "2025-02-15T13:00:00",
      duration: "3 hours",
      problemCount: 5,
      score: "92/100",
      rank: 15,
    },
  ],
}

export function TestsList() {
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

  return (
    <Tabs defaultValue="upcoming" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
        <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
        <TabsTrigger value="past">Past</TabsTrigger>
      </TabsList>

      <TabsContent value="upcoming" className="space-y-4 mt-4">
        {mockTests.upcoming.map((test) => (
          <Card key={test.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{test.title}</CardTitle>
              <CardDescription className="flex items-center gap-1">
                <CalendarClock className="h-3.5 w-3.5" />
                {formatDate(test.date)}
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{test.duration}</span>
                </div>
                <div>
                  <span>{test.problemCount} problems</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild size="sm">
                <Link href={`/coder/test/${test.id}`}>Register</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}

        {mockTests.upcoming.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">No upcoming tests available.</div>
        )}
      </TabsContent>

      <TabsContent value="ongoing" className="space-y-4 mt-4">
        {mockTests.ongoing.map((test) => (
          <Card key={test.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{test.title}</CardTitle>
              <CardDescription className="flex items-center gap-1">
                <CalendarClock className="h-3.5 w-3.5" />
                {formatDate(test.date)}
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{test.duration}</span>
                </div>
                <div>
                  <span>{test.problemCount} problems</span>
                </div>
                <Badge variant="outline" className="bg-primary/10">
                  Time remaining: {test.timeRemaining}
                </Badge>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild size="sm" variant="default">
                <Link href={`/coder/test/${test.id}/active`}>Continue Test</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}

        {mockTests.ongoing.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">No ongoing tests at the moment.</div>
        )}
      </TabsContent>

      <TabsContent value="past" className="space-y-4 mt-4">
        {mockTests.past.map((test) => (
          <Card key={test.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{test.title}</CardTitle>
              <CardDescription className="flex items-center gap-1">
                <CalendarClock className="h-3.5 w-3.5" />
                {formatDate(test.date)}
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{test.duration}</span>
                </div>
                <div>
                  <span>{test.problemCount} problems</span>
                </div>
                <Badge variant="outline" className="bg-primary/10 flex items-center gap-1">
                  <CheckCircle className="h-3.5 w-3.5" />
                  Score: {test.score}
                </Badge>
                <Badge variant="outline">Rank: #{test.rank}</Badge>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild size="sm" variant="outline">
                <Link href={`/coder/test/${test.id}/results`}>View Results</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}

        {mockTests.past.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">No past tests found.</div>
        )}
      </TabsContent>
    </Tabs>
  )
}

