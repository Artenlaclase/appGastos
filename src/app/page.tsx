// src/app/page.tsx
"use client"

import { useAuth } from "@/lib/AuthContext"
import LoginForm from "@/components/LoginForm"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Redirigir al dashboard si el usuario está autenticado
    if (user && !loading) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader2 className="animate-spin h-12 w-12 text-blue-600 dark:text-blue-400" />
      </div>
    )
  }

  // Mostrar el formulario de login si no hay usuario
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <LoginForm />
    </div>
  )
}