"use client"

import { useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data for analytics
const mockData = {
  participationData: [
    { name: "Jan", participants: 45 },
    { name: "Feb", participants: 52 },
    { name: "Mar", participants: 49 },
    { name: "Apr", participants: 63 },
    { name: "May", participants: 58 },
    { name: "Jun", participants: 64 },
  ],
  scoreDistribution: [
    { range: "0-20", count: 5 },
    { range: "21-40", count: 12 },
    { range: "41-60", count: 25 },
    { range: "61-80", count: 38 },
    { range: "81-100", count: 20 },
  ],
  cheatingAttempts: [
    { name: "Tab Switch", count: 15 },
    { name: "Fullscreen Exit", count: 8 },
    { name: "Copy-Paste", count: 12 },
    { name: "DevTools", count: 5 },
  ],
}

export function TestAnalytics() {
  const [period, setPeriod] = useState("6m")

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Test Analytics</CardTitle>
            <CardDescription>Overview of test participation and performance</CardDescription>
          </div>
          <Tabs defaultValue="6m" onValueChange={setPeriod}>
            <TabsList>
              <TabsTrigger value="1m">1m</TabsTrigger>
              <TabsTrigger value="3m">3m</TabsTrigger>
              <TabsTrigger value="6m">6m</TabsTrigger>
              <TabsTrigger value="1y">1y</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Participation Trend</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockData.participationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="participants" fill="#3b82f6" name="Participants" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium">Score Distribution</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockData.scoreDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#10b981" name="Participants" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-2 md:col-span-2">
            <h3 className="text-lg font-medium">Cheating Attempts by Type</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockData.cheatingAttempts}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#ef4444" name="Attempts" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

