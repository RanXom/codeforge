import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

import { ToastContextProvider } from "@/components/ui/use-toast"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CodeForge - Competitive Coding Platform",
  description: "A secure environment for fair coding competitions and powerful tools for test management",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastContextProvider>{children}</ToastContextProvider>
      </body>
    </html>
  )
}