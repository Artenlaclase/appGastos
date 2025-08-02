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
    // Redirige al dashboard si el usuario está autenticado y la verificación ha terminado
    // Usa replace para evitar que el usuario navegue de vuelta con el botón "atrás"
    if (!loading && user) {
      router.replace('/dashboard')
    }
  }, [user, loading, router])

  // Muestra spinner durante la carga inicial O si hay un usuario (evita flash del formulario)
  if (loading || user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader2 className="animate-spin h-12 w-12 text-blue-600 dark:text-blue-400" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <LoginForm />
    </div>
  )
}