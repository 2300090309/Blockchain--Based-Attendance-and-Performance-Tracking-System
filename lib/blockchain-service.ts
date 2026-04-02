// Blockchain Service - Security Layer for Data Verification
// This simulates a lightweight blockchain integration that stores only hashes
// for data integrity verification (not actual data storage)

// Types for blockchain records
export interface BlockchainRecord {
  recordId: string
  dataHash: string
  timestamp: number
  txHash: string
  blockNumber: number
}

export interface VerificationResult {
  isValid: boolean
  status: "verified" | "tampered" | "not_found" | "pending"
  blockchainHash: string | null
  calculatedHash: string
  timestamp: number | null
  txHash: string | null
}

// Simulated blockchain storage (in production, this would be a smart contract)
const blockchainStorage: Map<string, BlockchainRecord> = new Map()

// Generate SHA-256 hash of data (simulated)
export function generateDataHash(data: Record<string, unknown>): string {
  // Create a deterministic string from the data
  const sortedData = JSON.stringify(data, Object.keys(data).sort())
  
  // Simple hash simulation (in production, use actual SHA-256)
  let hash = 0
  for (let i = 0; i < sortedData.length; i++) {
    const char = sortedData.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  
  // Convert to hex string and pad to look like SHA-256
  const baseHash = Math.abs(hash).toString(16).padStart(8, "0")
  return `0x${baseHash}${Array.from({ length: 56 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join("")}`
}

// Generate transaction hash
export function generateTxHash(): string {
  return `0x${Array.from({ length: 64 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join("")}`
}

// Store hash on blockchain (simulated)
export async function storeHashOnBlockchain(
  recordId: string,
  data: Record<string, unknown>
): Promise<{ success: boolean; txHash: string; dataHash: string; blockNumber: number }> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  // 90% success rate simulation
  if (Math.random() < 0.1) {
    throw new Error("Transaction failed: Network congestion")
  }
  
  const dataHash = generateDataHash(data)
  const txHash = generateTxHash()
  const blockNumber = Math.floor(Math.random() * 1000000) + 18000000
  
  // Store on "blockchain"
  const record: BlockchainRecord = {
    recordId,
    dataHash,
    timestamp: Date.now(),
    txHash,
    blockNumber,
  }
  
  blockchainStorage.set(recordId, record)
  
  return { success: true, txHash, dataHash, blockNumber }
}

// Verify hash against blockchain
export async function verifyHashOnBlockchain(
  recordId: string,
  currentData: Record<string, unknown>
): Promise<VerificationResult> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  const storedRecord = blockchainStorage.get(recordId)
  const calculatedHash = generateDataHash(currentData)
  
  if (!storedRecord) {
    return {
      isValid: false,
      status: "not_found",
      blockchainHash: null,
      calculatedHash,
      timestamp: null,
      txHash: null,
    }
  }
  
  // For demo purposes, we'll use a deterministic check
  // In real implementation, we'd compare actual hashes
  const isValid = storedRecord.dataHash.slice(0, 10) === calculatedHash.slice(0, 10)
  
  return {
    isValid,
    status: isValid ? "verified" : "tampered",
    blockchainHash: storedRecord.dataHash,
    calculatedHash,
    timestamp: storedRecord.timestamp,
    txHash: storedRecord.txHash,
  }
}

// Get blockchain record by ID
export function getBlockchainRecord(recordId: string): BlockchainRecord | null {
  return blockchainStorage.get(recordId) || null
}

// Initialize with some mock data for demo
export function initializeMockBlockchainData() {
  const mockRecords: BlockchainRecord[] = [
    {
      recordId: "ATT-001",
      dataHash: "0x8f3a9b2c1d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a",
      timestamp: Date.now() - 86400000,
      txHash: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890",
      blockNumber: 18234567,
    },
    {
      recordId: "ATT-002",
      dataHash: "0x7e2f8a1b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef123456",
      timestamp: Date.now() - 172800000,
      txHash: "0x2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890ab",
      blockNumber: 18234566,
    },
    {
      recordId: "ATT-003",
      dataHash: "0x6d1e7f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e",
      timestamp: Date.now() - 259200000,
      txHash: "0x3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcd",
      blockNumber: 18234565,
    },
    {
      recordId: "PERF-001",
      dataHash: "0x5c0d6e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d",
      timestamp: Date.now() - 345600000,
      txHash: "0x4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
      blockNumber: 18234564,
    },
    {
      recordId: "PERF-002",
      dataHash: "0x4b9c5d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c",
      timestamp: Date.now() - 432000000,
      txHash: "0x5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12",
      blockNumber: 18234563,
    },
  ]
  
  mockRecords.forEach(record => {
    blockchainStorage.set(record.recordId, record)
  })
}

// Initialize mock data on module load
initializeMockBlockchainData()

// Smart Contract Interface (simulated)
export const smartContractABI = {
  name: "SecureTrackVerification",
  version: "1.0.0",
  functions: [
    {
      name: "storeHash",
      inputs: ["string recordId", "bytes32 hash"],
      outputs: ["bool success"],
    },
    {
      name: "verifyHash",
      inputs: ["string recordId", "bytes32 hash"],
      outputs: ["bool isValid"],
    },
    {
      name: "getRecord",
      inputs: ["string recordId"],
      outputs: ["bytes32 hash", "uint256 timestamp"],
    },
  ],
}

// Format hash for display
export function formatHash(hash: string, length: number = 10): string {
  if (hash.length <= length * 2) return hash
  return `${hash.slice(0, length)}...${hash.slice(-length)}`
}

// Format timestamp
export function formatTimestamp(timestamp: number): string {
  return new Date(timestamp).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  })
}
