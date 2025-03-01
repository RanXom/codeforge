import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Try to get and refresh the session
  const {
    data: { session },
    error: sessionError
  } = await supabase.auth.getSession()

  // Refresh session if it exists
  if (session) {
    await supabase.auth.refreshSession()
  }

  console.log("Middleware - Current path:", req.nextUrl.pathname)
  console.log("Middleware - Session exists:", !!session)

  // Handle session error
  if (sessionError) {
    console.error("Middleware - Session error:", sessionError)
    return res
  }

  // If there's no session and trying to access protected routes
  if (!session && (req.nextUrl.pathname.startsWith("/coder") || req.nextUrl.pathname.startsWith("/creator"))) {
    console.log("Middleware - No session, redirecting to login")
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // If there's a session, get the user's role for protected routes
  if (session) {
    try {
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("role")
        .eq("id", session.user.id)
        .single()

      if (userError) throw userError
      if (!userData) throw new Error("User data not found")

      console.log("Middleware - User role:", userData.role)

      // If on login page and authenticated, redirect to appropriate dashboard
      if (req.nextUrl.pathname === "/login") {
        return NextResponse.redirect(
          new URL(
            userData.role === "creator" ? "/creator/dashboard" : "/coder/home",
            req.url
          )
        )
      }

      // Handle role-based access
      if (userData.role === "creator" && req.nextUrl.pathname.startsWith("/coder")) {
        return NextResponse.redirect(new URL("/creator/dashboard", req.url))
      }

      if (userData.role === "coder" && req.nextUrl.pathname.startsWith("/creator")) {
        return NextResponse.redirect(new URL("/coder/home", req.url))
      }
    } catch (error) {
      console.error("Middleware - Error fetching user data:", error)
      return res
    }
  }

  return res
}

export const config = {
  matcher: ["/login", "/coder/:path*", "/creator/:path*"],
}

