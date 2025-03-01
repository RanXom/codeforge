import { CoderNavbar } from "@/components/coder-navbar"
import { CoderDashboard } from "@/components/coder-dashboard"

export default function CoderDashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <CoderNavbar />
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-8">Your Dashboard</h1>
        <CoderDashboard />
      </main>
    </div>
  )
}