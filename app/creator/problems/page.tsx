import Link from "next/link"
import { Plus } from "lucide-react"
import { CreatorNavbar } from "@/components/creator-navbar"
import { Button } from "@/components/ui/button"
import { ProblemList } from "@/components/problem-list"

export default function ProblemsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <CreatorNavbar />
      <main className="flex-1 container py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Problem Bank</h1>
          <Button asChild>
            <Link href="/creator/problems/new">
              <Plus className="h-4 w-4 mr-2" />
              Create Problem
            </Link>
          </Button>
        </div>
        <ProblemList />
      </main>
    </div>
  )
} 