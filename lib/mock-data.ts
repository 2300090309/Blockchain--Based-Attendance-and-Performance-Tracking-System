// Student data structure
export interface Student {
  studentId: string
  name: string
  email: string
  class: string
  attendancePercentage: number
  marks: number
  blockchainTxHash: string
  walletAddress?: string
}

// Attendance record structure with verification
export interface AttendanceRecord {
  id: string
  studentId: string
  studentName?: string
  date: string
  checkIn: string
  checkOut: string | null
  status: "present" | "late" | "absent"
  // Blockchain verification fields
  txHash: string
  txStatus: "pending" | "success" | "failed"
  dataHash: string
  blockNumber?: number
  verificationStatus?: "verified" | "tampered" | "pending" | "not_verified"
}

// Performance record structure with verification
export interface PerformanceRecord {
  id: string
  studentId: string
  studentName?: string
  subject: string
  marks: number
  maxMarks: number
  grade: string
  semester: string
  // Blockchain verification fields
  txHash: string
  dataHash: string
  blockNumber?: number
  verificationStatus?: "verified" | "tampered" | "pending" | "not_verified"
  timestamp: number
}

// Mock students data
export const mockStudents: Student[] = [
  {
    studentId: "STU001",
    name: "John Doe",
    email: "john.doe@school.edu",
    class: "Class 10-A",
    attendancePercentage: 95,
    marks: 88,
    blockchainTxHash: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12",
  },
  {
    studentId: "STU002",
    name: "Jane Smith",
    email: "jane.smith@school.edu",
    class: "Class 10-A",
    attendancePercentage: 92,
    marks: 91,
    blockchainTxHash: "0x2b3c4d5e6f7890abcdef1234567890abcdef1234",
  },
  {
    studentId: "STU003",
    name: "Bob Wilson",
    email: "bob.wilson@school.edu",
    class: "Class 10-B",
    attendancePercentage: 78,
    marks: 72,
    blockchainTxHash: "0x3c4d5e6f7890abcdef1234567890abcdef123456",
  },
  {
    studentId: "STU004",
    name: "Alice Brown",
    email: "alice.brown@school.edu",
    class: "Class 10-A",
    attendancePercentage: 98,
    marks: 95,
    blockchainTxHash: "0x4d5e6f7890abcdef1234567890abcdef12345678",
  },
  {
    studentId: "STU005",
    name: "Charlie Davis",
    email: "charlie.davis@school.edu",
    class: "Class 10-B",
    attendancePercentage: 85,
    marks: 82,
    blockchainTxHash: "0x5e6f7890abcdef1234567890abcdef1234567890",
  },
  {
    studentId: "STU006",
    name: "Emma Thompson",
    email: "emma.t@school.edu",
    class: "Class 10-A",
    attendancePercentage: 89,
    marks: 87,
    blockchainTxHash: "0x6f7890abcdef1234567890abcdef12345678901a",
  },
  {
    studentId: "STU007",
    name: "David Lee",
    email: "david.lee@school.edu",
    class: "Class 10-B",
    attendancePercentage: 94,
    marks: 79,
    blockchainTxHash: "0x7890abcdef1234567890abcdef12345678901a2b",
  },
  {
    studentId: "STU008",
    name: "Sarah Johnson",
    email: "sarah.j@school.edu",
    class: "Class 10-A",
    attendancePercentage: 91,
    marks: 93,
    blockchainTxHash: "0x890abcdef1234567890abcdef12345678901a2b3c",
  },
]

// Mock attendance history with verification data
export const mockAttendanceHistory: AttendanceRecord[] = [
  {
    id: "ATT-001",
    studentId: "STU001",
    studentName: "John Doe",
    date: "2026-04-01",
    checkIn: "09:00 AM",
    checkOut: "05:30 PM",
    status: "present",
    txHash: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890",
    txStatus: "success",
    dataHash: "0x8f3a9b2c1d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a",
    blockNumber: 18234567,
    verificationStatus: "verified",
  },
  {
    id: "ATT-002",
    studentId: "STU001",
    studentName: "John Doe",
    date: "2026-03-31",
    checkIn: "09:15 AM",
    checkOut: "05:00 PM",
    status: "late",
    txHash: "0x2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890ab",
    txStatus: "success",
    dataHash: "0x7e2f8a1b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef123456",
    blockNumber: 18234566,
    verificationStatus: "verified",
  },
  {
    id: "ATT-003",
    studentId: "STU001",
    studentName: "John Doe",
    date: "2026-03-28",
    checkIn: "08:55 AM",
    checkOut: "06:00 PM",
    status: "present",
    txHash: "0x3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcd",
    txStatus: "success",
    dataHash: "0x6d1e7f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e",
    blockNumber: 18234565,
    verificationStatus: "verified",
  },
  {
    id: "ATT-004",
    studentId: "STU002",
    studentName: "Jane Smith",
    date: "2026-04-01",
    checkIn: "08:45 AM",
    checkOut: "05:15 PM",
    status: "present",
    txHash: "0x4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    txStatus: "success",
    dataHash: "0x5c0d6e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d",
    blockNumber: 18234568,
    verificationStatus: "verified",
  },
  {
    id: "ATT-005",
    studentId: "STU003",
    studentName: "Bob Wilson",
    date: "2026-04-01",
    checkIn: "09:30 AM",
    checkOut: "05:00 PM",
    status: "late",
    txHash: "0x5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12",
    txStatus: "success",
    dataHash: "0x4b9c5d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c",
    blockNumber: 18234569,
    verificationStatus: "not_verified",
  },
]

// Mock performance records with verification
export const mockPerformanceRecords: PerformanceRecord[] = [
  {
    id: "PERF-001",
    studentId: "STU001",
    studentName: "John Doe",
    subject: "Mathematics",
    marks: 85,
    maxMarks: 100,
    grade: "A",
    semester: "Spring 2026",
    txHash: "0x6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234",
    dataHash: "0x3a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b",
    blockNumber: 18234570,
    verificationStatus: "verified",
    timestamp: Date.now() - 604800000,
  },
  {
    id: "PERF-002",
    studentId: "STU001",
    studentName: "John Doe",
    subject: "Science",
    marks: 92,
    maxMarks: 100,
    grade: "A+",
    semester: "Spring 2026",
    txHash: "0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456",
    dataHash: "0x2b7a6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b",
    blockNumber: 18234571,
    verificationStatus: "verified",
    timestamp: Date.now() - 518400000,
  },
  {
    id: "PERF-003",
    studentId: "STU001",
    studentName: "John Doe",
    subject: "English",
    marks: 78,
    maxMarks: 100,
    grade: "B+",
    semester: "Spring 2026",
    txHash: "0x890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567",
    dataHash: "0x1c6b5a4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b",
    blockNumber: 18234572,
    verificationStatus: "verified",
    timestamp: Date.now() - 432000000,
  },
  {
    id: "PERF-004",
    studentId: "STU002",
    studentName: "Jane Smith",
    subject: "Mathematics",
    marks: 91,
    maxMarks: 100,
    grade: "A+",
    semester: "Spring 2026",
    txHash: "0x90abcdef1234567890abcdef1234567890abcdef1234567890abcdef12345678",
    dataHash: "0x0d5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a",
    blockNumber: 18234573,
    verificationStatus: "not_verified",
    timestamp: Date.now() - 345600000,
  },
]

// Monthly attendance data for charts
export const monthlyAttendanceData = [
  { month: "Jan", present: 20, late: 2, absent: 1 },
  { month: "Feb", present: 18, late: 3, absent: 2 },
  { month: "Mar", present: 21, late: 1, absent: 0 },
  { month: "Apr", present: 19, late: 2, absent: 1 },
  { month: "May", present: 22, late: 0, absent: 0 },
  { month: "Jun", present: 17, late: 4, absent: 2 },
]

// Performance data for charts
export const performanceData = [
  { subject: "Mathematics", score: 85, maxScore: 100 },
  { subject: "Science", score: 92, maxScore: 100 },
  { subject: "English", score: 78, maxScore: 100 },
  { subject: "History", score: 88, maxScore: 100 },
  { subject: "Computer", score: 95, maxScore: 100 },
]

// Class-wise attendance data
export const classAttendanceData = [
  { class: "Class 10-A", attendance: 92 },
  { class: "Class 10-B", attendance: 87 },
  { class: "Class 11-A", attendance: 94 },
  { class: "Class 11-B", attendance: 89 },
  { class: "Class 12-A", attendance: 91 },
  { class: "Class 12-B", attendance: 85 },
]

// Generate transaction hash (legacy function - use blockchain-service instead)
export function generateTxHash(): string {
  return `0x${Array.from({ length: 64 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join("")}`
}
