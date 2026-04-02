"use client"

import { useState, useEffect } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Navbar } from "@/components/navbar"
import { LoadingSpinner } from "@/components/loading-spinner"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  CalendarCheck,
  TrendingUp,
  Clock,
  Award,
  ArrowRight,
  Users,
  Wallet,
  ShieldCheck,
  BarChart3,
  Hash,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

// Dashboard statistics interface
interface DashboardStats {
  totalAttendance: number
  performanceScore: number
  hoursLogged: number
  streak: number
  // Admin/Teacher specific
  totalStudents?: number
  todayAttendance?: number
  verifiedRecords?: number
  pendingVerifications?: number
}

// Dashboard page - main overview after login
export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { user, walletAddress } = useAuth()

  // Role-based stats
  const isTeacherOrAdmin = user?.role === "teacher" || user?.role === "admin"

  // Simulate fetching dashboard data
  useEffect(() => {
    const fetchStats = async () => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1200))
      
      // Mock data based on role
      if (isTeacherOrAdmin) {
        setStats({
          totalAttendance: 128,
          performanceScore: 84,
          hoursLogged: 1840,
          streak: 12,
          totalStudents: 156,
          todayAttendance: 142,
          verifiedRecords: 248,
          pendingVerifications: 5,
        })
      } else {
        setStats({
          totalAttendance: 23,
          performanceScore: 87,
          hoursLogged: 184,
          streak: 5,
        })
      }
      setIsLoading(false)
    }

    fetchStats()
  }, [isTeacherOrAdmin])

  // Get role badge
  const getRoleBadge = () => {
    switch (user?.role) {
      case "admin":
        return <Badge className="bg-primary/15 text-primary">Admin</Badge>
      case "teacher":
        return <Badge className="bg-emerald-500/15 text-emerald-600">Teacher</Badge>
      default:
        return <Badge variant="secondary">Student</Badge>
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold">
                  Welcome back, {user?.name}!
                </h1>
                {getRoleBadge()}
              </div>
              <p className="mt-2 text-muted-foreground">
                {isTeacherOrAdmin 
                  ? "Manage attendance records and view analytics"
                  : "Track your attendance and performance metrics"
                }
              </p>
            </div>
            
            {/* Wallet Status */}
            {walletAddress ? (
              <div className="flex items-center gap-2 rounded-lg border bg-muted/50 px-4 py-2">
                <Wallet className="h-4 w-4 text-emerald-500" />
                <span className="text-sm font-mono">
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 rounded-lg border border-amber-500/50 bg-amber-500/10 px-4 py-2">
                <Wallet className="h-4 w-4 text-amber-500" />
                <span className="text-sm text-amber-600">Wallet not connected</span>
              </div>
            )}
          </div>

          {/* Loading State */}
          {isLoading ? (
            <LoadingSpinner text="Loading dashboard data..." />
          ) : (
            <>
              {/* Stats Grid */}
              <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* Teacher/Admin specific stats */}
                {isTeacherOrAdmin && (
                  <>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Total Students
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{stats?.totalStudents}</div>
                        <p className="text-xs text-muted-foreground">
                          Registered in system
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Today&apos;s Attendance
                        </CardTitle>
                        <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{stats?.todayAttendance}</div>
                        <p className="text-xs text-muted-foreground">
                          Students checked in
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Verified Records
                        </CardTitle>
                        <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{stats?.verifiedRecords}</div>
                        <p className="text-xs text-muted-foreground">
                          On blockchain
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Pending Verify
                        </CardTitle>
                        <Hash className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{stats?.pendingVerifications}</div>
                        <p className="text-xs text-muted-foreground">
                          Awaiting verification
                        </p>
                      </CardContent>
                    </Card>
                  </>
                )}

                {/* Student specific stats */}
                {!isTeacherOrAdmin && (
                  <>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Total Attendance
                        </CardTitle>
                        <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{stats?.totalAttendance}</div>
                        <p className="text-xs text-muted-foreground">
                          Days this month
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Performance Score
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{stats?.performanceScore}%</div>
                        <p className="text-xs text-muted-foreground">
                          +5% from last month
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Hours Logged
                        </CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{stats?.hoursLogged}</div>
                        <p className="text-xs text-muted-foreground">
                          Total hours this month
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Current Streak
                        </CardTitle>
                        <Award className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{stats?.streak} days</div>
                        <p className="text-xs text-muted-foreground">
                          Keep it up!
                        </p>
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>

              {/* Quick Actions */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CalendarCheck className="h-5 w-5" />
                      {isTeacherOrAdmin ? "Mark Student Attendance" : "Mark Attendance"}
                    </CardTitle>
                    <CardDescription>
                      {isTeacherOrAdmin 
                        ? "Record student attendance on the blockchain"
                        : "Record your attendance on the blockchain"
                      }
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href="/attendance">
                      <Button className="w-full">
                        Go to Attendance
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      View Performance
                    </CardTitle>
                    <CardDescription>
                      Check detailed performance metrics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href="/performance">
                      <Button variant="outline" className="w-full">
                        View Performance
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                {isTeacherOrAdmin && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Reports & Analytics
                      </CardTitle>
                      <CardDescription>
                        View detailed reports and charts
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Link href="/reports">
                        <Button variant="outline" className="w-full">
                          View Reports
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                )}

                {user?.role === "admin" && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Admin Panel
                      </CardTitle>
                      <CardDescription>
                        Manage users and system settings
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Link href="/admin">
                        <Button variant="outline" className="w-full">
                          Open Admin Panel
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Recent Verified Records (for students) */}
              {!isTeacherOrAdmin && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5" />
                      Recent Verified Records
                    </CardTitle>
                    <CardDescription>
                      Your records secured with blockchain hash verification
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { date: "Today", status: "Verified", hash: "0x8f3a...9f0a", type: "Attendance" },
                        { date: "Yesterday", status: "Verified", hash: "0x7e2f...3456", type: "Attendance" },
                        { date: "Last Week", status: "Verified", hash: "0x3a8b...2c1d", type: "Math Score" },
                      ].map((tx, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between rounded-lg border p-3"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10">
                              <ShieldCheck className="h-4 w-4 text-emerald-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">{tx.type}</p>
                              <p className="text-xs text-muted-foreground">{tx.date}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className="bg-emerald-500/15 text-emerald-600">
                              {tx.status}
                            </Badge>
                            <p className="mt-1 font-mono text-xs text-muted-foreground">
                              Hash: {tx.hash}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </main>
      </div>
    </ProtectedRoute>
  )
}
