import { CreatorNavbar } from "@/components/creator-navbar"
import { TestForm } from "@/components/test-form"

export default function NewTestPage() {
  return (
    <div className="min-h-screen bg-background">
      <CreatorNavbar />
      <main className="container py-6 space-y-6">
        <h1 className="text-3xl font-bold">Create New Test</h1>
        <TestForm />
      </main>
    </div>
  )
} 