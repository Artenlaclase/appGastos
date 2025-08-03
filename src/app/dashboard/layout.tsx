// src/app/dashboard/layout.tsx
"use client"

import { ReactNode, useEffect } from "react"
import { useAuth } from "@/lib/AuthContext"
import { useRouter } from "next/navigation"
import Navigation from "@/components/Navigation"
import Header from "@/components/Header"
import { Loader2 } from "lucide-react"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login")
    }
  }, [user, loading, router])

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader2 className="animate-spin h-12 w-12 text-blue-600 dark:text-blue-400" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      <div className="flex-1 flex flex-col ml-64">
        <Header />
        <main className="flex-1 p-6 mt-16">
          {children}
        </main>
      </div>
    </div>
  )
}