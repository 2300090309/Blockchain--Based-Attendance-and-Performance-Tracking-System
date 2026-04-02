"use client"

import { useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useAuth, type UserRole } from "@/contexts/auth-context"
import { LoadingSpinner } from "@/components/loading-spinner"
import { toast } from "sonner"

interface ProtectedRouteProps {
  children: React.ReactNode
  adminOnly?: boolean
  allowedRoles?: UserRole[]
}

// Protected route component - redirects to login if not authenticated
export function ProtectedRoute({ 
  children, 
  adminOnly = false,
  allowedRoles 
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth()
  const router = useRouter()
  
  // Stabilize allowedRoles for dependency array
  const allowedRolesKey = useMemo(
    () => (allowedRoles ? allowedRoles.join(",") : ""),
    [allowedRoles]
  )

  useEffect(() => {
    if (!isLoading) {
      // Redirect to login if not authenticated
      if (!isAuthenticated) {
        toast.error("Access denied", {
          description: "Please log in to access this page.",
        })
        router.push("/")
        return
      }

      // Check for admin-only routes
      if (adminOnly && user?.role !== "admin") {
        toast.error("Access denied", {
          description: "You do not have permission to access this page.",
        })
        router.push("/dashboard")
        return
      }

      // Check for allowed roles using the stabilized key
      if (allowedRolesKey && user?.role) {
        const roles = allowedRolesKey.split(",") as UserRole[]
        if (!roles.includes(user.role)) {
          toast.error("Access denied", {
            description: "You do not have permission to access this page.",
          })
          router.push("/dashboard")
          return
        }
      }
    }
  }, [isAuthenticated, isLoading, router, adminOnly, user, allowedRolesKey])

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner text="Checking authentication..." />
      </div>
    )
  }

  // Don't render children if not authenticated or not authorized
  if (!isAuthenticated) {
    return null
  }

  if (adminOnly && user?.role !== "admin") {
    return null
  }

  if (allowedRoles && user?.role && !allowedRoles.includes(user.role)) {
    return null
  }

  return <>{children}</>
}
