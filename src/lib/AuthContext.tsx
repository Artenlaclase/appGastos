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

  const login = async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      const authError = error as AuthError
      let errorMessage = "Error al iniciar sesión"
      switch (authError.code) {
        case "auth/invalid-email":
          errorMessage = "Email inválido"
          break
        case "auth/user-disabled":
          errorMessage = "Usuario deshabilitado"
          break
        case "auth/user-not-found":
          errorMessage = "Usuario no encontrado"
          break
        case "auth/wrong-password":
          errorMessage = "Contraseña incorrecta"
          break
        default:
          errorMessage = "Error al iniciar sesión"
      }
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const register = async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      await createUserWithEmailAndPassword(auth, email, password)
    } catch (error) {
      const authError = error as AuthError
      let errorMessage = "Error al registrar"
      switch (authError.code) {
        case "auth/email-already-in-use":
          errorMessage = "Email ya registrado"
          break
        case "auth/invalid-email":
          errorMessage = "Email inválido"
          break
        case "auth/weak-password":
          errorMessage = "Contraseña débil (mínimo 6 caracteres)"
          break
        default:
          errorMessage = "Error al registrar"
      }
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
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
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
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