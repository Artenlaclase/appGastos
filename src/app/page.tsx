"use client"

import { useAuth } from "@/lib/AuthContext"
import LoginForm from "@/components/LoginForm"
import Dashboard from "./dashboard/page"

export default function Home() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return user ? <Dashboard /> : <LoginForm />
}
