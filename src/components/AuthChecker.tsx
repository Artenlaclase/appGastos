// src/lib/AuthContext.tsx
"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode
} from "react"
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User,
  AuthError
} from "firebase/auth"
import { auth } from "./firebase"

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  loading: boolean
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const authOperation = async (
    operation: () => Promise<void>,
    errorHandler: (error: AuthError) => string
  ) => {
    setLoading(true)
    setError(null)
    try {
      await operation()
    } catch (error) {
      const authError = error as AuthError
      const errorMessage = errorHandler(authError)
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    return authOperation(
      () => signInWithEmailAndPassword(auth, email, password),
      (authError) => {
        switch (authError.code) {
          case "auth/invalid-email": return "Email inválido"
          case "auth/user-disabled": return "Usuario deshabilitado"
          case "auth/user-not-found": return "Usuario no encontrado"
          case "auth/wrong-password": return "Contraseña incorrecta"
          default: return "Error al iniciar sesión"
        }
      }
    )
  }

  const register = async (email: string, password: string) => {
    return authOperation(
      () => createUserWithEmailAndPassword(auth, email, password),
      (authError) => {
        switch (authError.code) {
          case "auth/email-already-in-use": return "Email ya registrado"
          case "auth/invalid-email": return "Email inválido"
          case "auth/weak-password": return "Contraseña débil (mínimo 6 caracteres)"
          default: return "Error al registrar"
        }
      }
    )
  }

  const logout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
      throw new Error("Error al cerrar sesión")
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider")
  }
  return context
}