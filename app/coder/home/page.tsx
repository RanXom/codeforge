import { CoderNavbar } from "@/components/coder-navbar"
import { ProblemList } from "@/components/problem-list"
import { TestsList } from "@/components/tests-list"

export default function CoderHomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <CoderNavbar />
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-8">Welcome, Coder!</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Problems</h2>
            <ProblemList />
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Tests</h2>
            <TestsList />
          </div>
        </div>
      </main>
    </div>
  )
}

