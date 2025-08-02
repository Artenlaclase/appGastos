// src/components/AuthChecker.tsx
"use client"

import { useAuth } from "@/lib/AuthContext"
import { redirect } from "next/navigation"
import { useEffect } from "react"

export default function AuthChecker({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && !user) {
      redirect('/login')
    }
  }, [user, loading])

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return <>{children}</>
}