import { CodeEditor } from "@/components/code-editor"
import { CoderNavbar } from "@/components/coder-navbar"
import { ProblemDescription } from "@/components/problem-description"

export default function ProblemPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex min-h-screen flex-col">
      <CoderNavbar />
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-8">Problem #{params.id}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ProblemDescription id={params.id} />
          <CodeEditor problemId={params.id} />
        </div>
      </main>
    </div>
  )
}

