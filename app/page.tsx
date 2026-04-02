"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Loader2, ShieldCheck, Mail, Lock, GraduationCap, BookOpen, Shield } from "lucide-react"

// Login page - entry point of the application
export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const { login, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, isLoading, router])

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    // Validate inputs
    if (!email || !password) {
      setError("Please fill in all fields")
      setIsSubmitting(false)
      return
    }

    // Attempt login
    const success = await login(email, password)
    
    if (success) {
      router.push("/dashboard")
    } else {
      setError("Invalid credentials. Password must be at least 4 characters.")
      setIsSubmitting(false)
    }
  }

  // Show loading while checking auth state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      {/* Theme Toggle in corner */}
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md space-y-6">
        <Card>
          <CardHeader className="space-y-4 text-center">
            {/* Logo */}
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
              <ShieldCheck className="h-8 w-8 text-primary-foreground" />
            </div>
            
            <div>
              <CardTitle className="text-2xl font-bold">SecureTrack</CardTitle>
              <CardDescription className="mt-2">
                Blockchain-Secured Attendance & Performance Verification
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}

              {/* Submit Button */}
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Demo Credentials Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Demo Credentials</CardTitle>
            <CardDescription className="text-xs">
              Use any email with password (min 4 characters). Role is determined by email:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <GraduationCap className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Student</p>
                <p className="text-xs text-muted-foreground">student@school.edu</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <BookOpen className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Teacher</p>
                <p className="text-xs text-muted-foreground">teacher@school.edu</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <Shield className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Admin</p>
                <p className="text-xs text-muted-foreground">admin@school.edu</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
