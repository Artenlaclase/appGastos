// src/components/Navigation.tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Calendar, History, PlusCircle, DollarSign } from "lucide-react"

export default function Navigation() {
  const pathname = usePathname()

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: Home },
    { name: "Current Month", path: "/dashboard/month", icon: Calendar },
    { name: "History", path: "/dashboard/history", icon: History },
    { name: "Add Data", path: "/dashboard/add", icon: PlusCircle },
  ]

  return (
    <nav className="bg-white shadow-sm border-r border-gray-200 fixed h-full w-64">
      <div className="p-4 flex items-center space-x-2">
        <DollarSign className="h-8 w-8 text-blue-600" />
        <h1 className="text-xl font-bold text-gray-900">Gastos App</h1>
      </div>
      <div className="mt-8 space-y-1 px-2">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.path}
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
              pathname === item.path
                ? "bg-blue-50 text-blue-700"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <item.icon className="h-5 w-5 mr-3" />
            {item.name}
          </Link>
        ))}
      </div>
    </nav>
  )
}