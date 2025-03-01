"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { usePathname } from "next/navigation"
import { Code, LogOut, User } from "lucide-react"

import { signOut } from "@/lib/auth"
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

export function CreatorNavbar() {
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
          <Link href="/creator/dashboard" className="flex items-center gap-2">
            <Code className="h-6 w-6" />
            <span className="text-xl font-bold">CodeForge</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/creator/dashboard"
            className={`text-sm font-medium ${pathname === "/creator/dashboard" ? "text-primary" : "text-muted-foreground"} transition-colors hover:text-primary`}
          >
            Dashboard
          </Link>
          <Link
            href="/creator/tests"
            className={`text-sm font-medium ${pathname === "/creator/tests" ? "text-primary" : "text-muted-foreground"} transition-colors hover:text-primary`}
          >
            My Tests
          </Link>
          <Link
            href="/creator/problems"
            className={`text-sm font-medium ${pathname === "/creator/problems" ? "text-primary" : "text-muted-foreground"} transition-colors hover:text-primary`}
          >
            Problem Bank
          </Link>
          <Link
            href="/creator/analytics"
            className={`text-sm font-medium ${pathname === "/creator/analytics" ? "text-primary" : "text-muted-foreground"} transition-colors hover:text-primary`}
          >
            Analytics
          </Link>
        </nav>

        <div className="flex items-center gap-4">
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
                <Link href="/creator/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/creator/settings">Settings</Link>
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

