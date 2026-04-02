"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { toast } from "sonner"

// Define user roles
export type UserRole = "student" | "teacher" | "admin"

// Define the shape of our user object
export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  walletAddress?: string
}

// Define the shape of our auth context
interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
  walletAddress: string | null
  isWalletConnecting: boolean
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
}

// Create the auth context with default values
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Auth provider component that wraps the app
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [isWalletConnecting, setIsWalletConnecting] = useState(false)

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("blockchain-attendance-user")
    const storedWallet = localStorage.getItem("blockchain-attendance-wallet")
    
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    if (storedWallet) {
      setWalletAddress(storedWallet)
    }
    setIsLoading(false)
  }, [])

  // Determine user role based on email
  const determineRole = (email: string): UserRole => {
    if (email.includes("admin")) return "admin"
    if (email.includes("teacher")) return "teacher"
    return "student"
  }

  // Login function - simulates authentication
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500))
    
    // Simple validation (in real app, this would call an API)
    if (email && password.length >= 4) {
      const role = determineRole(email)
      const newUser: User = {
        id: "user-" + Date.now(),
        name: email.split("@")[0],
        email: email,
        role: role,
        walletAddress: walletAddress || undefined,
      }
      setUser(newUser)
      localStorage.setItem("blockchain-attendance-user", JSON.stringify(newUser))
      toast.success("Login successful", {
        description: `Welcome back, ${newUser.name}!`,
      })
      setIsLoading(false)
      return true
    }
    
    toast.error("Login failed", {
      description: "Please check your credentials and try again.",
    })
    setIsLoading(false)
    return false
  }

  // Logout function - clears user session
  const logout = () => {
    setUser(null)
    setWalletAddress(null)
    localStorage.removeItem("blockchain-attendance-user")
    localStorage.removeItem("blockchain-attendance-wallet")
    toast.info("Logged out successfully")
  }

  // Connect MetaMask wallet
  const connectWallet = useCallback(async () => {
    setIsWalletConnecting(true)
    
    try {
      // Check if MetaMask is installed
      if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
        // Request account access
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        })
        
        if (accounts && accounts.length > 0) {
          const address = accounts[0] as string
          setWalletAddress(address)
          localStorage.setItem("blockchain-attendance-wallet", address)
          
          // Update user with wallet address
          if (user) {
            const updatedUser = { ...user, walletAddress: address }
            setUser(updatedUser)
            localStorage.setItem("blockchain-attendance-user", JSON.stringify(updatedUser))
          }
          
          toast.success("Wallet connected", {
            description: `Connected to ${address.slice(0, 6)}...${address.slice(-4)}`,
          })
        }
      } else {
        toast.error("MetaMask not found", {
          description: "Please install MetaMask to connect your wallet.",
        })
      }
    } catch (error) {
      console.error("Wallet connection error:", error)
      toast.error("Connection failed", {
        description: "Failed to connect wallet. Please try again.",
      })
    } finally {
      setIsWalletConnecting(false)
    }
  }, [user])

  // Disconnect wallet
  const disconnectWallet = () => {
    setWalletAddress(null)
    localStorage.removeItem("blockchain-attendance-wallet")
    
    if (user) {
      const updatedUser = { ...user, walletAddress: undefined }
      setUser(updatedUser)
      localStorage.setItem("blockchain-attendance-user", JSON.stringify(updatedUser))
    }
    
    toast.info("Wallet disconnected")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isAuthenticated: !!user,
        walletAddress,
        isWalletConnecting,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Extend Window interface for ethereum
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>
      on: (event: string, callback: (...args: unknown[]) => void) => void
      removeListener: (event: string, callback: (...args: unknown[]) => void) => void
    }
  }
}
