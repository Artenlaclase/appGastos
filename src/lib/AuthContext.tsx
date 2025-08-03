// src/lib/AuthContext.tsx
"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User as FirebaseUser,
  AuthError
} from 'firebase/auth'
import { auth } from './firebase'

interface AuthContextType {
  user: FirebaseUser | null
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("AuthContext | onAuthStateChanged fired | user:", user);
      setUser(user)
      setLoading(false)
      // Persistencia opcional para datos específicos
      if (user) {
        localStorage.setItem('user', JSON.stringify({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName
        }))
      } else {
        localStorage.removeItem('user')
      }
    })

    return () => unsubscribe()
  }, [])

  const handleAuthError = (error: AuthError): string => {
    switch (error.code) {
      case 'auth/invalid-email': return 'Email inválido'
      case 'auth/user-disabled': return 'Usuario deshabilitado'
      case 'auth/user-not-found': return 'Usuario no encontrado'
      case 'auth/wrong-password': return 'Contraseña incorrecta'
      case 'auth/email-already-in-use': return 'Email ya registrado'
      case 'auth/weak-password': return 'Contraseña débil (mínimo 6 caracteres)'
      default: return 'Error de autenticación'
    }
  }

  const login = async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      toast.success('Sesión iniciada correctamente')
      router.push('/dashboard') // <-- AHORA REDIRIGE AL DASHBOARD!
    } catch (error) {
      const errorMessage = handleAuthError(error as AuthError)
      setError(errorMessage)
      toast.error(errorMessage)
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
      toast.success('Cuenta creada correctamente')
      router.push('/dashboard')
    } catch (error) {
      const errorMessage = handleAuthError(error as AuthError)
      setError(errorMessage)
      toast.error(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      toast.success('Sesión cerrada correctamente')
      router.push('/')
    } catch (error) {
      toast.error('Error al cerrar sesión')
      throw error
    }
  }

  const clearError = () => setError(null)

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}