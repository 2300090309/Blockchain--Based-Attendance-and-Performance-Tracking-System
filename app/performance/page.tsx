"use client"

import { useState, useEffect, useCallback } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Navbar } from "@/components/navbar"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BlockchainVerification, VerificationBadge } from "@/components/blockchain-verification"
import { useAuth } from "@/contexts/auth-context"
import {
  TrendingUp,
  Target,
  Award,
  Clock,
  CheckCircle2,
  XCircle,
  BarChart3,
  BookOpen,
  Hash,
  Blocks,
  ShieldCheck,
} from "lucide-react"
import { mockPerformanceRecords, type PerformanceRecord } from "@/lib/mock-data"
import { verifyHashOnBlockchain, type VerificationResult } from "@/lib/blockchain-service"

// Performance metrics interface
interface PerformanceData {
  overallScore: number
  punctuality: number
  consistency: number
  productivity: number
  monthlyGoal: number
  monthlyProgress: number
  achievements: string[]
  recentActivities: {
    date: string
    action: string
    points: number
  }[]
}

// Performance page - view detailed performance metrics with blockchain verification
export default function PerformancePage() {
  const { user } = useAuth()
  const [data, setData] = useState<PerformanceData | null>(null)
  const [records, setRecords] = useState<PerformanceRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Simulate fetching performance data
  useEffect(() => {
    const fetchData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      
      // Mock performance data
      setData({
        overallScore: 87,
        punctuality: 92,
        consistency: 85,
        productivity: 84,
        monthlyGoal: 25,
        monthlyProgress: 23,
        achievements: [
          "Perfect Attendance Week",
          "Early Bird (5 days)",
          "Consistency Champion",
          "100 Hours Milestone",
        ],
        recentActivities: [
          { date: "2026-04-01", action: "On-time check-in", points: 10 },
          { date: "2026-03-31", action: "Late check-in (-5 mins)", points: -2 },
          { date: "2026-03-28", action: "Early check-in", points: 15 },
          { date: "2026-03-27", action: "Completed weekly goal", points: 25 },
          { date: "2026-03-26", action: "On-time check-in", points: 10 },
        ],
      })
      
      // Load performance records
      setRecords(mockPerformanceRecords)
      setIsLoading(false)
    }

    fetchData()
  }, [])

  // Handle verification of a performance record
  const handleVerifyRecord = useCallback(async (recordId: string): Promise<VerificationResult> => {
    const record = records.find(r => r.id === recordId)
    if (!record) {
      return {
        isValid: false,
        status: "not_found",
        blockchainHash: null,
        calculatedHash: "",
        timestamp: null,
        txHash: null,
      }
    }

    // Reconstruct the data for hash comparison
    const recordData = {
      recordId: record.id,
      studentId: record.studentId,
      studentName: record.studentName,
      subject: record.subject,
      marks: record.marks,
      maxMarks: record.maxMarks,
      grade: record.grade,
      semester: record.semester,
    }

    const result = await verifyHashOnBlockchain(recordId, recordData)
    
    // Update the record's verification status
    setRecords(prev => prev.map(r => 
      r.id === recordId 
        ? { ...r, verificationStatus: result.status as PerformanceRecord["verificationStatus"] }
        : r
    ))

    return result
  }, [records])

  // Get score color based on value
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-600"
    if (score >= 70) return "text-amber-600"
    return "text-destructive"
  }

  // Get grade badge
  const getGradeBadge = (grade: string) => {
    const colors: Record<string, string> = {
      "A+": "bg-emerald-500/15 text-emerald-600",
      "A": "bg-emerald-500/15 text-emerald-600",
      "B+": "bg-primary/15 text-primary",
      "B": "bg-primary/15 text-primary",
      "C+": "bg-amber-500/15 text-amber-600",
      "C": "bg-amber-500/15 text-amber-600",
    }
    return (
      <Badge className={`${colors[grade] || "bg-muted"} hover:${colors[grade] || "bg-muted"}`}>
        {grade}
      </Badge>
    )
  }

  // Check if user can view all records (teacher/admin)
  const canViewAllRecords = user?.role === "teacher" || user?.role === "admin"

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Performance</h1>
            <p className="mt-2 text-muted-foreground">
              Track performance metrics with blockchain-verified records
            </p>
          </div>

          {isLoading ? (
            <LoadingSpinner text="Loading performance data..." />
          ) : (
            <div className="space-y-6">
              {/* Overall Score */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Overall Performance Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-6">
                    <div className={`text-6xl font-bold ${getScoreColor(data?.overallScore || 0)}`}>
                      {data?.overallScore}%
                    </div>
                    <p className="mt-2 text-muted-foreground">
                      Great job! You&apos;re performing above average.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Metrics Grid */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* Punctuality */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm font-medium">
                      <Clock className="h-4 w-4" />
                      Punctuality
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{data?.punctuality}%</div>
                    <Progress value={data?.punctuality} className="mt-2" />
                  </CardContent>
                </Card>

                {/* Consistency */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm font-medium">
                      <Target className="h-4 w-4" />
                      Consistency
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{data?.consistency}%</div>
                    <Progress value={data?.consistency} className="mt-2" />
                  </CardContent>
                </Card>

                {/* Productivity */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm font-medium">
                      <TrendingUp className="h-4 w-4" />
                      Productivity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{data?.productivity}%</div>
                    <Progress value={data?.productivity} className="mt-2" />
                  </CardContent>
                </Card>

                {/* Monthly Goal */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm font-medium">
                      <Award className="h-4 w-4" />
                      Monthly Goal
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {data?.monthlyProgress}/{data?.monthlyGoal} days
                    </div>
                    <Progress 
                      value={((data?.monthlyProgress || 0) / (data?.monthlyGoal || 1)) * 100} 
                      className="mt-2" 
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Academic Records with Verification */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Academic Records
                  </CardTitle>
                  <CardDescription>
                    {canViewAllRecords 
                      ? "All student records with blockchain verification"
                      : "Your academic records secured on blockchain"
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {records.map((record) => (
                      <div
                        key={record.id}
                        className="rounded-lg border p-4"
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                              <BookOpen className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{record.subject}</p>
                              <p className="text-sm text-muted-foreground">
                                {record.semester}
                                {record.studentName && ` • ${record.studentName}`}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-bold">
                              {record.marks}/{record.maxMarks}
                            </span>
                            {getGradeBadge(record.grade)}
                            <VerificationBadge status={record.verificationStatus} />
                          </div>
                        </div>

                        {/* Hash and Verification Info */}
                        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t pt-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Hash className="h-3 w-3" />
                              <span>Hash: {record.dataHash.slice(0, 16)}...</span>
                            </div>
                            {record.blockNumber && (
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Blocks className="h-3 w-3" />
                                <span>Block #{record.blockNumber}</span>
                              </div>
                            )}
                          </div>
                          <BlockchainVerification
                            recordId={record.id}
                            recordType="performance"
                            dataHash={record.dataHash}
                            txHash={record.txHash}
                            currentStatus={record.verificationStatus}
                            onVerify={handleVerifyRecord}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Achievements and Activity */}
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Achievements */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      Achievements
                    </CardTitle>
                    <CardDescription>
                      Badges earned based on your performance
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {data?.achievements.map((achievement, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 rounded-lg border bg-muted/50 p-3"
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <Award className="h-5 w-5 text-primary" />
                          </div>
                          <span className="text-sm font-medium">{achievement}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Recent Activity
                    </CardTitle>
                    <CardDescription>
                      Your recent performance activities
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {data?.recentActivities.map((activity, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between rounded-lg border p-3"
                        >
                          <div className="flex items-center gap-3">
                            {activity.points > 0 ? (
                              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                            ) : (
                              <XCircle className="h-5 w-5 text-destructive" />
                            )}
                            <div>
                              <p className="text-sm font-medium">{activity.action}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(activity.date).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                })}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`text-sm font-medium ${
                              activity.points > 0 ? "text-emerald-600" : "text-destructive"
                            }`}
                          >
                            {activity.points > 0 ? "+" : ""}
                            {activity.points} pts
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Security Info Card */}
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <ShieldCheck className="h-5 w-5" />
                    Blockchain Security
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    All academic records are secured using blockchain technology. Each record&apos;s 
                    hash is stored on the blockchain, ensuring data integrity and tamper-proof 
                    verification. Click the &quot;Verify&quot; button on any record to confirm its 
                    authenticity against the blockchain.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  )
}
