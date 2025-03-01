import Link from "next/link"
import { Code } from "lucide-react"

import { SignupForm } from "@/components/signup-form"

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
        <Link href="/" className="mb-8 flex items-center gap-2">
          <Code className="h-6 w-6" />
          <span className="text-xl font-bold">CodeForge</span>
        </Link>
        <div className="w-full max-w-md space-y-8 rounded-lg border bg-card p-6 shadow-sm">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Sign Up</h1>
            <p className="text-muted-foreground">Create an account to get started</p>
          </div>
          <SignupForm />
          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary underline-offset-4 hover:underline">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

