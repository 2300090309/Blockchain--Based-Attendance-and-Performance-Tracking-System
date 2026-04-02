"use client"

import { useState, useEffect } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Navbar } from "@/components/navbar"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Users,
  UserCheck,
  UserX,
  Search,
  Shield,
  Activity,
  Settings,
  Download,
} from "lucide-react"

// User interface for admin panel
interface UserData {
  id: string
  name: string
  email: string
  role: "user" | "admin"
  status: "active" | "inactive"
  attendance: number
  performance: number
  lastActive: string
}

// System stats interface
interface SystemStats {
  totalUsers: number
  activeUsers: number
  totalAttendanceToday: number
  avgPerformance: number
}

// Admin panel page - manage users and view system stats
export default function AdminPage() {
  const [users, setUsers] = useState<UserData[]>([])
  const [stats, setStats] = useState<SystemStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  // Simulate fetching admin data
  useEffect(() => {
    const fetchData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      
      // Mock users data
      const mockUsers: UserData[] = [
        {
          id: "1",
          name: "John Doe",
          email: "john@company.com",
          role: "user",
          status: "active",
          attendance: 95,
          performance: 88,
          lastActive: "2026-04-02",
        },
        {
          id: "2",
          name: "Jane Smith",
          email: "jane@company.com",
          role: "user",
          status: "active",
          attendance: 92,
          performance: 91,
          lastActive: "2026-04-02",
        },
        {
          id: "3",
          name: "Bob Wilson",
          email: "bob@company.com",
          role: "user",
          status: "inactive",
          attendance: 78,
          performance: 72,
          lastActive: "2026-03-28",
        },
        {
          id: "4",
          name: "Alice Brown",
          email: "alice@company.com",
          role: "admin",
          status: "active",
          attendance: 98,
          performance: 95,
          lastActive: "2026-04-02",
        },
        {
          id: "5",
          name: "Charlie Davis",
          email: "charlie@company.com",
          role: "user",
          status: "active",
          attendance: 85,
          performance: 82,
          lastActive: "2026-04-01",
        },
      ]
      
      // Mock system stats
      const mockStats: SystemStats = {
        totalUsers: 156,
        activeUsers: 142,
        totalAttendanceToday: 128,
        avgPerformance: 84,
      }

      setUsers(mockUsers)
      setStats(mockStats)
      setIsLoading(false)
    }

    fetchData()
  }, [])

  // Filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Toggle user status
  const toggleUserStatus = (userId: string) => {
    setUsers(
      users.map((user) =>
        user.id === userId
          ? { ...user, status: user.status === "active" ? "inactive" : "active" }
          : user
      )
    )
  }

  return (
    <ProtectedRoute adminOnly>
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="flex items-center gap-2 text-3xl font-bold">
                <Shield className="h-8 w-8" />
                Admin Panel
              </h1>
              <p className="mt-2 text-muted-foreground">
                Manage users, view system stats, and configure settings
              </p>
            </div>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>

          {isLoading ? (
            <LoadingSpinner text="Loading admin data..." />
          ) : (
            <div className="space-y-6">
              {/* System Stats */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Users
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.totalUsers}</div>
                    <p className="text-xs text-muted-foreground">
                      Registered users
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Active Users
                    </CardTitle>
                    <UserCheck className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.activeUsers}</div>
                    <p className="text-xs text-muted-foreground">
                      Currently active
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Today&apos;s Attendance
                    </CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.totalAttendanceToday}</div>
                    <p className="text-xs text-muted-foreground">
                      Check-ins today
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Avg Performance
                    </CardTitle>
                    <Settings className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.avgPerformance}%</div>
                    <p className="text-xs text-muted-foreground">
                      System average
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* User Management */}
              <Card>
                <CardHeader>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <CardTitle>User Management</CardTitle>
                      <CardDescription>
                        View and manage all registered users
                      </CardDescription>
                    </div>
                    <div className="relative w-full sm:w-64">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b text-left text-sm text-muted-foreground">
                          <th className="pb-3 font-medium">User</th>
                          <th className="pb-3 font-medium">Role</th>
                          <th className="pb-3 font-medium">Status</th>
                          <th className="hidden pb-3 font-medium md:table-cell">Attendance</th>
                          <th className="hidden pb-3 font-medium md:table-cell">Performance</th>
                          <th className="pb-3 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {filteredUsers.map((user) => (
                          <tr key={user.id}>
                            <td className="py-4">
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {user.email}
                                </p>
                              </div>
                            </td>
                            <td className="py-4">
                              <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                                {user.role}
                              </Badge>
                            </td>
                            <td className="py-4">
                              <Badge
                                className={
                                  user.status === "active"
                                    ? "bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/15"
                                    : "bg-destructive/15 text-destructive hover:bg-destructive/15"
                                }
                              >
                                {user.status}
                              </Badge>
                            </td>
                            <td className="hidden py-4 md:table-cell">
                              {user.attendance}%
                            </td>
                            <td className="hidden py-4 md:table-cell">
                              {user.performance}%
                            </td>
                            <td className="py-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleUserStatus(user.id)}
                              >
                                {user.status === "active" ? (
                                  <UserX className="h-4 w-4" />
                                ) : (
                                  <UserCheck className="h-4 w-4" />
                                )}
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {filteredUsers.length === 0 && (
                    <div className="py-8 text-center text-muted-foreground">
                      No users found matching your search.
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  )
}
