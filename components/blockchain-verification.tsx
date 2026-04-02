"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  ShieldCheck,
  ShieldAlert,
  ShieldQuestion,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  Hash,
  Blocks,
} from "lucide-react"
import { toast } from "sonner"
import { type VerificationResult, formatHash, formatTimestamp } from "@/lib/blockchain-service"

interface BlockchainVerificationProps {
  recordId: string
  recordType: "attendance" | "performance"
  dataHash: string
  txHash: string
  currentStatus?: "verified" | "tampered" | "pending" | "not_verified"
  onVerify: (recordId: string) => Promise<VerificationResult>
}

// Verification status badge component
export function VerificationBadge({ 
  status 
}: { 
  status?: "verified" | "tampered" | "pending" | "not_verified" 
}) {
  switch (status) {
    case "verified":
      return (
        <Badge className="gap-1 bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/15">
          <ShieldCheck className="h-3 w-3" />
          Verified
        </Badge>
      )
    case "tampered":
      return (
        <Badge className="gap-1 bg-destructive/15 text-destructive hover:bg-destructive/15">
          <ShieldAlert className="h-3 w-3" />
          Tampered
        </Badge>
      )
    case "pending":
      return (
        <Badge className="gap-1 bg-amber-500/15 text-amber-600 hover:bg-amber-500/15">
          <Clock className="h-3 w-3" />
          Pending
        </Badge>
      )
    default:
      return (
        <Badge className="gap-1 bg-muted text-muted-foreground hover:bg-muted">
          <ShieldQuestion className="h-3 w-3" />
          Not Verified
        </Badge>
      )
  }
}

// Main verification component with dialog
export function BlockchainVerification({
  recordId,
  recordType,
  dataHash,
  txHash,
  currentStatus,
  onVerify,
}: BlockchainVerificationProps) {
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const handleVerify = async () => {
    setIsVerifying(true)
    
    toast.loading("Verifying on blockchain...", {
      id: "verify-toast",
      description: "Comparing data hash with blockchain record",
    })

    try {
      const result = await onVerify(recordId)
      setVerificationResult(result)

      if (result.isValid) {
        toast.success("Verification successful!", {
          id: "verify-toast",
          description: "Data integrity confirmed on blockchain",
        })
      } else if (result.status === "tampered") {
        toast.error("Verification failed!", {
          id: "verify-toast",
          description: "Data may have been tampered with",
        })
      } else {
        toast.warning("Record not found", {
          id: "verify-toast",
          description: "This record is not yet on the blockchain",
        })
      }
    } catch {
      toast.error("Verification failed", {
        id: "verify-toast",
        description: "Could not connect to blockchain",
      })
    } finally {
      setIsVerifying(false)
    }
  }

  const getStatusIcon = () => {
    if (!verificationResult) return <ShieldQuestion className="h-12 w-12 text-muted-foreground" />
    
    switch (verificationResult.status) {
      case "verified":
        return <ShieldCheck className="h-12 w-12 text-emerald-500" />
      case "tampered":
        return <ShieldAlert className="h-12 w-12 text-destructive" />
      default:
        return <ShieldQuestion className="h-12 w-12 text-amber-500" />
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <ShieldCheck className="h-4 w-4" />
          Verify
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Blocks className="h-5 w-5" />
            Blockchain Verification
          </DialogTitle>
          <DialogDescription>
            Verify {recordType} record integrity against blockchain
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Current Status */}
          <div className="flex items-center justify-center py-4">
            {getStatusIcon()}
          </div>

          {/* Record Info */}
          <div className="space-y-3 rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Record ID</span>
              <code className="rounded bg-muted px-2 py-1 text-xs">{recordId}</code>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Data Hash</span>
              <code className="rounded bg-muted px-2 py-1 text-xs font-mono">
                {formatHash(dataHash, 8)}
              </code>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">TX Hash</span>
              <code className="rounded bg-muted px-2 py-1 text-xs font-mono">
                {formatHash(txHash, 8)}
              </code>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <VerificationBadge status={currentStatus} />
            </div>
          </div>

          {/* Verification Result */}
          {verificationResult && (
            <div className={`space-y-3 rounded-lg p-4 ${
              verificationResult.isValid 
                ? "bg-emerald-500/10 border border-emerald-500/20" 
                : "bg-destructive/10 border border-destructive/20"
            }`}>
              <div className="flex items-center gap-2">
                {verificationResult.isValid ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-destructive" />
                )}
                <span className="font-medium">
                  {verificationResult.isValid ? "Data Integrity Verified" : "Verification Failed"}
                </span>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Hash className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">Blockchain Hash:</span>
                  <code className="font-mono text-xs">
                    {verificationResult.blockchainHash 
                      ? formatHash(verificationResult.blockchainHash, 8) 
                      : "Not found"}
                  </code>
                </div>
                <div className="flex items-center gap-2">
                  <Hash className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">Calculated Hash:</span>
                  <code className="font-mono text-xs">
                    {formatHash(verificationResult.calculatedHash, 8)}
                  </code>
                </div>
                {verificationResult.timestamp && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground">Recorded:</span>
                    <span className="text-xs">
                      {formatTimestamp(verificationResult.timestamp)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Verify Button */}
          <Button 
            onClick={handleVerify} 
            disabled={isVerifying}
            className="w-full"
          >
            {isVerifying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <ShieldCheck className="mr-2 h-4 w-4" />
                Verify with Blockchain
              </>
            )}
          </Button>

          {/* Info Text */}
          <p className="text-center text-xs text-muted-foreground">
            This compares the data hash stored on the blockchain with the 
            calculated hash of the current data to ensure integrity.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Simple inline verification button
export function VerifyButton({
  recordId,
  onVerify,
  size = "sm",
}: {
  recordId: string
  onVerify: (recordId: string) => Promise<VerificationResult>
  size?: "sm" | "default" | "lg"
}) {
  const [isVerifying, setIsVerifying] = useState(false)
  const [status, setStatus] = useState<"idle" | "verified" | "failed">("idle")

  const handleVerify = async () => {
    setIsVerifying(true)
    try {
      const result = await onVerify(recordId)
      setStatus(result.isValid ? "verified" : "failed")
      
      if (result.isValid) {
        toast.success("Verified!", { description: "Data integrity confirmed" })
      } else {
        toast.error("Verification failed", { description: "Data may be tampered" })
      }
    } catch {
      toast.error("Error", { description: "Could not verify" })
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <Button
      variant={status === "verified" ? "default" : status === "failed" ? "destructive" : "outline"}
      size={size}
      onClick={handleVerify}
      disabled={isVerifying}
      className="gap-1"
    >
      {isVerifying ? (
        <Loader2 className="h-3 w-3 animate-spin" />
      ) : status === "verified" ? (
        <CheckCircle2 className="h-3 w-3" />
      ) : status === "failed" ? (
        <XCircle className="h-3 w-3" />
      ) : (
        <ShieldCheck className="h-3 w-3" />
      )}
      {isVerifying ? "Verifying..." : status === "verified" ? "Verified" : status === "failed" ? "Failed" : "Verify"}
    </Button>
  )
}
