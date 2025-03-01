import Link from "next/link"
import { ArrowRight, Code, Shield, Trophy } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Code className="h-6 w-6" />
            <span className="text-xl font-bold">CodeForge</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  The Ultimate Competitive Coding Platform
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  CodeForge provides a secure environment for fair coding competitions and powerful tools for test
                  management.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/signup">
                  <Button size="lg" className="gap-1.5">
                    Get Started <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Key Features</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Designed for both coders and test creators with powerful features
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6">
                <div className="rounded-full bg-primary/10 p-4">
                  <Code className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Advanced Code Editor</h3>
                <p className="text-center text-muted-foreground">
                  Monaco Editor with autofill suggestions and real-time code execution via Judge0 API
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6">
                <div className="rounded-full bg-primary/10 p-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Anti-Cheating Measures</h3>
                <p className="text-center text-muted-foreground">
                  Strict fullscreen enforcement, tab switching prevention, and DevTools blocking
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6">
                <div className="rounded-full bg-primary/10 p-4">
                  <Trophy className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Comprehensive Analytics</h3>
                <p className="text-center text-muted-foreground">
                  Track performance, problem-solving stats, and test results with detailed metrics
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © {new Date().getFullYear()} CodeForge. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

