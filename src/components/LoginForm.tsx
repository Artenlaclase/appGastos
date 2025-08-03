// src/components/LoginForm.tsx
"use client"

import { useState } from "react"
import { useAuth } from "@/lib/AuthContext"
import { Eye, EyeOff, Loader2, LogIn, UserPlus } from "lucide-react"
import Link from "next/link"

export default function LoginForm() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const { login, register, loading } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    try {
      if (isLogin) {
        await login(email, password)
      } else {
        await register(email, password)
      }
    } catch (error: any) {
      setError(error.message || "Ocurrió un error. Por favor intenta nuevamente.")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 flex flex-col gap-6 relative">
        {/* Logo y título */}
        <div className="flex flex-col items-center gap-2">
          <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-3">
            {isLogin ? <LogIn className="h-8 w-8 text-blue-600 dark:text-blue-400" /> : <UserPlus className="h-8 w-8 text-blue-600 dark:text-blue-400" />}
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            {isLogin ? "Bienvenido de nuevo" : "Crea tu cuenta"}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            {isLogin ? "Accede a tu dashboard y gestiona tus finanzas." : "Comienza a controlar tus gastos fácilmente."}
          </p>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 dark:border-red-400 p-3 rounded-lg flex items-center gap-2 animate-shake">
            <svg className="h-5 w-5 text-red-500 dark:text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm text-red-700 dark:text-red-300">{error}</span>
          </div>
        )}

        {/* Formulario */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="relative">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <span className="absolute right-3 top-8 text-blue-500 dark:text-blue-400">
              <svg className="h-5 w-5" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10" /></svg>
            </span>
          </div>

          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete={isLogin ? "current-password" : "new-password"}
              required
              minLength={6}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10 transition"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>

          {isLogin && (
            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-bold shadow-lg transition flex items-center justify-center gap-2 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin h-5 w-5" />
                Procesando...
              </>
            ) : isLogin ? (
              <>
                <LogIn className="h-5 w-5" />
                Iniciar sesión
              </>
            ) : (
              <>
                <UserPlus className="h-5 w-5" />
                Crear cuenta
              </>
            )}
          </button>
        </form>

        {/* Alternar entre login y registro */}
        <div className="text-center mt-2">
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin)
              setError("")
            }}
            className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline transition"
          >
            {isLogin ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión"}
          </button>
        </div>
      </div>
    </div>
  )
}