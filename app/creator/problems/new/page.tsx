import { CreatorNavbar } from "@/components/creator-navbar"
import { ProblemForm } from "@/components/problem-form"

export default function NewProblemPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <CreatorNavbar />
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-8">Create New Problem</h1>
        <ProblemForm />
      </main>
    </div>
  )
} 