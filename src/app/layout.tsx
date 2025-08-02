// src/app/layout.tsx
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "../lib/AuthContext"
import { Toaster } from "../components/ui/toaster" // Asegúrate que este es el componente correcto
import { ThemeProvider } from "../components/theme-provider"

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    default: "Gastos App",
    template: "%s | Gastos App",
  },
  description: "Aplicación para gestionar tus ingresos y gastos personales",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f9fafb" },
    { media: "(prefers-color-scheme: dark)", color: "#111827" },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html 
      lang="es" 
      suppressHydrationWarning
      className={`${inter.variable}`}
    >
      <body className="min-h-screen bg-gray-50 dark:bg-gray-900 antialiased">
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster /> {/* Componente sin props - la configuración va dentro del componente */}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}