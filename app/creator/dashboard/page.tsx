import { CreatorNavbar } from "@/components/creator-navbar"
import { TestCreatorDashboard } from "@/components/test-creator-dashboard"

export default function CreatorDashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <CreatorNavbar />
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-8">Test Creator Dashboard</h1>
        <TestCreatorDashboard />
      </main>
    </div>
  )
}

