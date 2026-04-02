"use client"

import { Loader2 } from "lucide-react"

interface LoadingSpinnerProps {
  text?: string
  size?: "sm" | "md" | "lg"
}

// Reusable loading spinner component
export function LoadingSpinner({ text = "Loading...", size = "md" }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      <Loader2 className={`animate-spin text-primary ${sizeClasses[size]}`} />
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  )
}
