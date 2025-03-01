import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If there's no session and the user is trying to access protected routes
  if (!session && (req.nextUrl.pathname.startsWith("/coder") || req.nextUrl.pathname.startsWith("/creator"))) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // If there's a session, get the user's role
  if (session) {
    const { data: userData } = await supabase.from("users").select("role").eq("id", session.user.id).single()

    // Redirect creator trying to access coder routes
    if (userData?.role === "creator" && req.nextUrl.pathname.startsWith("/coder")) {
      return NextResponse.redirect(new URL("/creator/dashboard", req.url))
    }

    // Redirect coder trying to access creator routes
    if (userData?.role === "coder" && req.nextUrl.pathname.startsWith("/creator")) {
      return NextResponse.redirect(new URL("/coder/home", req.url))
    }
  }

  return res
}

export const config = {
  matcher: ["/coder/:path*", "/creator/:path*"],
}

