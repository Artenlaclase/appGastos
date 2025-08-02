// src/app/dashboard/layout.tsx
import { ReactNode } from "react"
import Navigation from "@/components/Navigation"
import Header from "@/components/Header"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Navigation />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 ml-0 md:ml-64 mt-16">
          {children}
        </main>
      </div>
    </div>
  )
}