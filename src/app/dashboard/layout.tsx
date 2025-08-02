// src/app/dashboard/layout.tsx
import { ReactNode } from "react"
import Navigation from "@/components/Navigation"
import Header from "@/components/Header"
import { redirect } from "next/navigation"
import { verifySession } from "@/lib/auth"

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await verifySession()
  
  if (!session) {
    redirect('/login')
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      <div className="flex-1 flex flex-col ml-64">
        <Header />
        <main className="flex-1 p-6 mt-16">
          {children}
        </main>
      </div>
    </div>
  )
}