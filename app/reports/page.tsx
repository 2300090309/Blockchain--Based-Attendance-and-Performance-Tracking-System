"use client"

import { useState, useEffect } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Navbar } from "@/components/navbar"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import {
  BarChart3,
  Download,
  Filter,
  Calendar,
  Search,
} from "lucide-react"
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import {
  monthlyAttendanceData,
  performanceData,
  classAttendanceData,
  mockStudents,
} from "@/lib/mock-data"

// Reports page - Analytics and data visualization
export default function ReportsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [selectedClass, setSelectedClass] = useState("all")
  const [selectedDate, setSelectedDate] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  // Simulate data loading
  useEffect(() => {
    const loadData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1200))
      setIsLoading(false)
    }
    loadData()
  }, [])

  // Filter students based on search and class
  const filteredStudents = mockStudents.filter((student) => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesClass = selectedClass === "all" || student.class === selectedClass
    return matchesSearch && matchesClass
  })

  // Calculate statistics
  const avgAttendance = Math.round(
    filteredStudents.reduce((sum, s) => sum + s.attendancePercentage, 0) / 
    filteredStudents.length
  )
  const avgMarks = Math.round(
    filteredStudents.reduce((sum, s) => sum + s.marks, 0) / 
    filteredStudents.length
  )

  // Pie chart colors
  const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))"]

  // Export report handler
  const handleExportCSV = () => {
    const headers = ["Student ID", "Name", "Class", "Attendance %", "Marks"]
    const rows = filteredStudents.map((s) => [
      s.studentId,
      s.name,
      s.class,
      s.attendancePercentage,
      s.marks,
    ])
    
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `attendance-report-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
    
    toast.success("Report exported", {
      description: "CSV file downloaded successfully.",
    })
  }

  const handleExportPDF = () => {
    toast.info("PDF Export", {
      description: "PDF export feature coming soon!",
    })
  }

  // Prepare pie chart data for attendance distribution
  const attendanceDistribution = [
    { name: "Present", value: monthlyAttendanceData.reduce((sum, m) => sum + m.present, 0) },
    { name: "Late", value: monthlyAttendanceData.reduce((sum, m) => sum + m.late, 0) },
    { name: "Absent", value: monthlyAttendanceData.reduce((sum, m) => sum + m.absent, 0) },
  ]

  return (
    <ProtectedRoute allowedRoles={["teacher", "admin"]}>
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="flex items-center gap-2 text-3xl font-bold">
                <BarChart3 className="h-8 w-8" />
                Reports & Analytics
              </h1>
              <p className="mt-2 text-muted-foreground">
                View attendance statistics and performance reports
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleExportCSV}>
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
              <Button variant="outline" onClick={handleExportPDF}>
                <Download className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
            </div>
          </div>

          {isLoading ? (
            <LoadingSpinner text="Loading reports..." />
          ) : (
            <div className="space-y-6">
              {/* Filters */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Filter className="h-5 w-5" />
                    Filters
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search by name or ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                    <Select value={selectedClass} onValueChange={setSelectedClass}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Class" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Classes</SelectItem>
                        <SelectItem value="Class 10-A">Class 10-A</SelectItem>
                        <SelectItem value="Class 10-B">Class 10-B</SelectItem>
                        <SelectItem value="Class 11-A">Class 11-A</SelectItem>
                        <SelectItem value="Class 11-B">Class 11-B</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Statistics Summary */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Total Students</p>
                      <p className="text-3xl font-bold">{filteredStudents.length}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Avg Attendance</p>
                      <p className="text-3xl font-bold">{avgAttendance}%</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Avg Marks</p>
                      <p className="text-3xl font-bold">{avgMarks}%</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Classes</p>
                      <p className="text-3xl font-bold">{classAttendanceData.length}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts Row 1 */}
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Monthly Attendance Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Attendance Overview</CardTitle>
                    <CardDescription>
                      Attendance trends over the past 6 months
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={monthlyAttendanceData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="month" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: "hsl(var(--popover))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                        />
                        <Legend />
                        <Bar dataKey="present" name="Present" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="late" name="Late" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="absent" name="Absent" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Attendance Distribution Pie Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Attendance Distribution</CardTitle>
                    <CardDescription>
                      Overall attendance breakdown
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={attendanceDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {attendanceDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: "hsl(var(--popover))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Charts Row 2 */}
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Performance Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Subject-wise Performance</CardTitle>
                    <CardDescription>
                      Average marks across different subjects
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={performanceData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis type="number" domain={[0, 100]} className="text-xs" />
                        <YAxis dataKey="subject" type="category" width={80} className="text-xs" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: "hsl(var(--popover))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                        />
                        <Bar dataKey="score" name="Score" fill="hsl(var(--chart-1))" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Class-wise Attendance */}
                <Card>
                  <CardHeader>
                    <CardTitle>Class-wise Attendance Rate</CardTitle>
                    <CardDescription>
                      Attendance percentage by class
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={classAttendanceData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="class" className="text-xs" />
                        <YAxis domain={[80, 100]} className="text-xs" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: "hsl(var(--popover))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="attendance" 
                          name="Attendance %"
                          stroke="hsl(var(--chart-1))" 
                          strokeWidth={2}
                          dot={{ fill: "hsl(var(--chart-1))", strokeWidth: 2 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Student Data Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Student Records</CardTitle>
                  <CardDescription>
                    Detailed student attendance and performance data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b text-left text-sm text-muted-foreground">
                          <th className="pb-3 font-medium">Student ID</th>
                          <th className="pb-3 font-medium">Name</th>
                          <th className="pb-3 font-medium">Class</th>
                          <th className="pb-3 font-medium">Attendance</th>
                          <th className="pb-3 font-medium">Marks</th>
                          <th className="hidden pb-3 font-medium md:table-cell">Blockchain TX</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {filteredStudents.map((student) => (
                          <tr key={student.studentId}>
                            <td className="py-3 font-mono text-sm">{student.studentId}</td>
                            <td className="py-3">{student.name}</td>
                            <td className="py-3 text-muted-foreground">{student.class}</td>
                            <td className="py-3">
                              <span className={
                                student.attendancePercentage >= 90 
                                  ? "text-emerald-600" 
                                  : student.attendancePercentage >= 75 
                                    ? "text-amber-600" 
                                    : "text-destructive"
                              }>
                                {student.attendancePercentage}%
                              </span>
                            </td>
                            <td className="py-3">{student.marks}%</td>
                            <td className="hidden py-3 md:table-cell">
                              <code className="rounded bg-muted px-2 py-1 text-xs">
                                {student.blockchainTxHash.slice(0, 10)}...
                              </code>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {filteredStudents.length === 0 && (
                    <div className="py-8 text-center text-muted-foreground">
                      No students found matching your filters.
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
