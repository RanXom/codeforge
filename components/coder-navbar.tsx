"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { usePathname } from "next/navigation"
import { Code, LogOut, User } from "lucide-react"

import { signOut } from "@/lib/auth"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"

export function CoderNavbar() {
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()

  const handleLogout = async () => {
    try {
      await signOut()
      router.push("/")
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/coder/home" className="flex items-center gap-2">
            <Code className="h-6 w-6" />
            <span className="text-xl font-bold">CodeForge</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/coder/home"
            className={`text-sm font-medium ${pathname === "/coder/home" ? "text-primary" : "text-muted-foreground"} transition-colors hover:text-primary`}
          >
            Home
          </Link>
          <Link
            href="/coder/problems"
            className={`text-sm font-medium ${pathname === "/coder/problems" ? "text-primary" : "text-muted-foreground"} transition-colors hover:text-primary`}
          >
            Problems
          </Link>
          <Link
            href="/coder/tests"
            className={`text-sm font-medium ${pathname === "/coder/tests" ? "text-primary" : "text-muted-foreground"} transition-colors hover:text-primary`}
          >
            Tests
          </Link>
          <Link
            href="/coder/dashboard"
            className={`text-sm font-medium ${pathname === "/coder/dashboard" ? "text-primary" : "text-muted-foreground"} transition-colors hover:text-primary`}
          >
            Dashboard
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/coder/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/coder/dashboard">Dashboard</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/coder/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={handleLogout}>
                <div className="flex items-center gap-2">
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

