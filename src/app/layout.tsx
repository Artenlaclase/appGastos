// src/app/layout.tsx
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "../lib/AuthContext"
import { Toaster } from "../components/ui/toaster"
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
  // themeColor movido a viewport.ts según las mejores prácticas de Next.js
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
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}