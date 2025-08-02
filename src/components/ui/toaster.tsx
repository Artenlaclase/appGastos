// src/components/ui/toaster.tsx
"use client"
import { Toaster as SonnerToaster } from "sonner"

export function Toaster() {
  return (
    <SonnerToaster 
      position="top-center"
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast: 'dark:bg-gray-800 dark:text-white',
        },
      }}
    />
  )
}