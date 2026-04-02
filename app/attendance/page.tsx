"use client"

import { useState, useEffect, useCallback } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Navbar } from "@/components/navbar"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"
import { BlockchainVerification, VerificationBadge } from "@/components/blockchain-verification"
import {
  Loader2,
  CheckCircle2,
  Clock,
  CalendarDays,
  AlertCircle,
  XCircle,
  Users,
  ShieldCheck,
  Hash,
  Blocks,
} from "lucide-react"
import { 
  mockStudents, 
  mockAttendanceHistory, 
  type AttendanceRecord 
} from "@/lib/mock-data"
import {
  storeHashOnBlockchain,
  verifyHashOnBlockchain,
  generateDataHash,
  type VerificationResult,
} from "@/lib/blockchain-service"

// Transaction status type
type TxStatus = "idle" | "pending" | "success" | "failed"

// Attendance page - mark and view attendance with blockchain verification
export default function AttendancePage() {
  const { user, walletAddress } = useAuth()
  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [txStatus, setTxStatus] = useState<TxStatus>("idle")
  const [currentTxHash, setCurrentTxHash] = useState<string | null>(null)
  const [currentDataHash, setCurrentDataHash] = useState<string | null>(null)
  const [todayMarked, setTodayMarked] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<string>("")

  // Check if user is teacher or admin (can mark attendance for students)
  const canMarkForStudents = user?.role === "teacher" || user?.role === "admin"

  // Simulate fetching attendance records
  useEffect(() => {
    const fetchRecords = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setRecords(mockAttendanceHistory)
      setIsLoading(false)
    }

    fetchRecords()
  }, [])

  // Handle marking attendance - stores hash on blockchain
  const handleMarkAttendance = async () => {
    if (!walletAddress) {
      toast.error("Wallet not connected", {
        description: "Please connect your wallet to mark attendance.",
      })
      return
    }

    setTxStatus("pending")

    toast.loading("Recording attendance...", {
      id: "tx-toast",
      description: "Generating hash and storing on blockchain",
    })

    // Create attendance data
    const studentId = canMarkForStudents && selectedStudent ? selectedStudent : user?.id || "SELF"
    const studentData = mockStudents.find(s => s.studentId === studentId)
    const recordId = `ATT-${Date.now()}`
    const attendanceData = {
      recordId,
      studentId,
      studentName: studentData?.name || user?.name,
      date: new Date().toISOString().split("T")[0],
      checkIn: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: "present",
    }

    // Generate hash and store on blockchain
    const dataHash = generateDataHash(attendanceData)
    setCurrentDataHash(dataHash)

    try {
      const result = await storeHashOnBlockchain(recordId, attendanceData)
      
      setCurrentTxHash(result.txHash)
      
      // Create new attendance record
      const newRecord: AttendanceRecord = {
        id: recordId,
        studentId,
        studentName: studentData?.name || user?.name,
        date: attendanceData.date,
        checkIn: attendanceData.checkIn,
        checkOut: null,
        status: "present",
        txHash: result.txHash,
        txStatus: "success",
        dataHash: result.dataHash,
        blockNumber: result.blockNumber,
        verificationStatus: "verified",
      }

      setRecords([newRecord, ...records])
      setTxStatus("success")
      setTodayMarked(true)

      toast.success("Attendance recorded on blockchain!", {
        id: "tx-toast",
        description: `Block #${result.blockNumber} | Hash: ${result.dataHash.slice(0, 10)}...`,
      })
    } catch {
      setTxStatus("failed")
      
      toast.error("Transaction failed", {
        id: "tx-toast",
        description: "Please try again. Network congestion detected.",
      })
    }

    // Reset status after 5 seconds
    setTimeout(() => {
      setTxStatus("idle")
      setCurrentTxHash(null)
      setCurrentDataHash(null)
    }, 5000)
  }

  // Handle verification of a record
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
      date: record.date,
      checkIn: record.checkIn,
      status: record.status,
    }

    const result = await verifyHashOnBlockchain(recordId, recordData)
    
    // Update the record's verification status
    setRecords(prev => prev.map(r => 
      r.id === recordId 
        ? { ...r, verificationStatus: result.status as AttendanceRecord["verificationStatus"] }
        : r
    ))

    return result
  }, [records])

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "present":
        return <Badge className="bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/15">Present</Badge>
      case "late":
        return <Badge className="bg-amber-500/15 text-amber-600 hover:bg-amber-500/15">Late</Badge>
      case "absent":
        return <Badge className="bg-destructive/15 text-destructive hover:bg-destructive/15">Absent</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  // Get transaction status badge
  const getTxStatusBadge = (status: AttendanceRecord["txStatus"]) => {
    switch (status) {
      case "success":
        return (
          <Badge className="gap-1 bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/15">
            <CheckCircle2 className="h-3 w-3" />
            Confirmed
          </Badge>
        )
      case "pending":
        return (
          <Badge className="gap-1 bg-amber-500/15 text-amber-600 hover:bg-amber-500/15">
            <Loader2 className="h-3 w-3 animate-spin" />
            Pending
          </Badge>
        )
      case "failed":
        return (
          <Badge className="gap-1 bg-destructive/15 text-destructive hover:bg-destructive/15">
            <XCircle className="h-3 w-3" />
            Failed
          </Badge>
        )
      default:
        return null
    }
  }

  // Render transaction status indicator
  const renderTxStatus = () => {
    if (txStatus === "idle") return null

    return (
      <div className={`space-y-2 rounded-lg p-4 ${
        txStatus === "pending" 
          ? "bg-amber-500/15 text-amber-600" 
          : txStatus === "success" 
            ? "bg-emerald-500/15 text-emerald-600"
            : "bg-destructive/15 text-destructive"
      }`}>
        <div className="flex items-center gap-2">
          {txStatus === "pending" && <Loader2 className="h-5 w-5 animate-spin" />}
          {txStatus === "success" && <CheckCircle2 className="h-5 w-5" />}
          {txStatus === "failed" && <XCircle className="h-5 w-5" />}
          <p className="font-medium">
            {txStatus === "pending" && "Storing Hash on Blockchain..."}
            {txStatus === "success" && "Hash Stored Successfully!"}
            {txStatus === "failed" && "Transaction Failed"}
          </p>
        </div>
        {currentDataHash && (
          <div className="flex items-center gap-2 text-xs">
            <Hash className="h-3 w-3" />
            <span>Data Hash: {currentDataHash.slice(0, 20)}...</span>
          </div>
        )}
        {currentTxHash && (
          <div className="flex items-center gap-2 text-xs">
            <Blocks className="h-3 w-3" />
            <span>TX: {currentTxHash.slice(0, 20)}...</span>
          </div>
        )}
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Attendance</h1>
            <p className="mt-2 text-muted-foreground">
              {canMarkForStudents 
                ? "Mark attendance for students - hash stored on blockchain for verification"
                : "Mark your attendance - secured with blockchain verification"
              }
            </p>
          </div>

          {isLoading ? (
            <LoadingSpinner text="Loading attendance records..." />
          ) : (
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Mark Attendance Card */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5" />
                      Mark Attendance
                    </CardTitle>
                    <CardDescription>
                      Data is hashed and stored on blockchain for integrity
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Current Time */}
                    <div className="rounded-lg bg-muted p-4 text-center">
                      <p className="text-sm text-muted-foreground">Current Time</p>
                      <p className="mt-1 text-2xl font-bold">
                        {new Date().toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date().toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>

                    {/* Wallet Status */}
                    {!walletAddress && (
                      <div className="flex items-center gap-2 rounded-lg bg-amber-500/15 p-3 text-amber-600">
                        <AlertCircle className="h-5 w-5 shrink-0" />
                        <p className="text-sm">
                          Connect your wallet to mark attendance
                        </p>
                      </div>
                    )}

                    {/* Student Selection (for teachers/admins) */}
                    {canMarkForStudents && (
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium">
                          <Users className="h-4 w-4" />
                          Select Student
                        </label>
                        <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a student" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockStudents.map((student) => (
                              <SelectItem key={student.studentId} value={student.studentId}>
                                {student.name} ({student.studentId})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {/* Transaction Status */}
                    {renderTxStatus()}

                    {/* Mark Button */}
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={handleMarkAttendance}
                      disabled={
                        txStatus === "pending" || 
                        todayMarked || 
                        !walletAddress ||
                        (canMarkForStudents && !selectedStudent)
                      }
                    >
                      {txStatus === "pending" ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Storing on Blockchain...
                        </>
                      ) : todayMarked ? (
                        <>
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Already Marked Today
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="mr-2 h-4 w-4" />
                          Mark Attendance
                        </>
                      )}
                    </Button>

                    {/* Security Info */}
                    <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                      <p className="text-xs text-muted-foreground">
                        <strong className="text-foreground">Security:</strong> Your attendance data is 
                        stored in the database. A SHA-256 hash of the data is recorded on the 
                        blockchain for tamper-proof verification.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Attendance Records */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CalendarDays className="h-5 w-5" />
                      Attendance History
                    </CardTitle>
                    <CardDescription>
                      Records with blockchain-verified data integrity
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
                                <CalendarDays className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium">
                                  {new Date(record.date).toLocaleDateString("en-US", {
                                    weekday: "short",
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </p>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Clock className="h-3 w-3" />
                                  {record.checkIn}
                                  {record.checkOut && ` - ${record.checkOut}`}
                                </div>
                                {record.studentName && (
                                  <p className="text-xs text-muted-foreground">
                                    {record.studentName}
                                  </p>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-2">
                              {getStatusBadge(record.status)}
                              {getTxStatusBadge(record.txStatus)}
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
                              recordType="attendance"
                              dataHash={record.dataHash}
                              txHash={record.txHash}
                              currentStatus={record.verificationStatus}
                              onVerify={handleVerifyRecord}
                            />
                          </div>
                        </div>
                      ))}

                      {records.length === 0 && (
                        <div className="py-8 text-center text-muted-foreground">
                          No attendance records found.
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  )
}
