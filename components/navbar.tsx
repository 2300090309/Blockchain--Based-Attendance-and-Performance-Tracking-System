"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  LayoutDashboard,
  ClipboardCheck,
  TrendingUp,
  Shield,
  LogOut,
  Menu,
  X,
  Wallet,
  BarChart3,
  Loader2,
} from "lucide-react"
import { useState } from "react"

// Navigation items configuration
const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["student", "teacher", "admin"] },
  { href: "/attendance", label: "Attendance", icon: ClipboardCheck, roles: ["student", "teacher", "admin"] },
  { href: "/performance", label: "Performance", icon: TrendingUp, roles: ["student", "teacher", "admin"] },
  { href: "/reports", label: "Reports", icon: BarChart3, roles: ["teacher", "admin"] },
]

// Admin-only navigation item
const adminItem = { href: "/admin", label: "Admin Panel", icon: Shield }

export function Navbar() {
  const pathname = usePathname()
  const { user, logout, walletAddress, isWalletConnecting, connectWallet, disconnectWallet } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Don't show navbar on login page
  if (pathname === "/") return null

  const handleLogout = () => {
    logout()
    setIsMobileMenuOpen(false)
  }

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter(
    (item) => user?.role && item.roles.includes(user.role)
  )

  // Format wallet address for display
  const formatWalletAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="hidden font-semibold sm:inline-block">
              SecureTrack
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-1 md:flex">
            {filteredNavItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
            
            {/* Show admin link only for admin users */}
            {user?.role === "admin" && (
              <Link
                href={adminItem.href}
                className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  pathname === adminItem.href
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <Shield className="h-4 w-4" />
                {adminItem.label}
              </Link>
            )}
          </div>

          {/* Right Side Actions (Desktop) */}
          <div className="hidden items-center gap-3 md:flex">
            {/* Wallet Connection */}
            {walletAddress ? (
              <Button
                variant="outline"
                size="sm"
                onClick={disconnectWallet}
                className="gap-2"
              >
                <Wallet className="h-4 w-4 text-emerald-500" />
                {formatWalletAddress(walletAddress)}
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={connectWallet}
                disabled={isWalletConnecting}
                className="gap-2"
              >
                {isWalletConnecting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Wallet className="h-4 w-4" />
                )}
                Connect Wallet
              </Button>
            )}

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Info & Logout */}
            <div className="text-right">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground capitalize">
                {user?.role}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="border-t border-border md:hidden">
          <div className="space-y-1 px-4 py-3">
            {filteredNavItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
            
            {user?.role === "admin" && (
              <Link
                href={adminItem.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  pathname === adminItem.href
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <Shield className="h-4 w-4" />
                {adminItem.label}
              </Link>
            )}

            {/* Mobile Wallet Connection */}
            <div className="my-2 border-t border-border pt-2">
              {walletAddress ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={disconnectWallet}
                  className="w-full gap-2"
                >
                  <Wallet className="h-4 w-4 text-emerald-500" />
                  {formatWalletAddress(walletAddress)}
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={connectWallet}
                  disabled={isWalletConnecting}
                  className="w-full gap-2"
                >
                  {isWalletConnecting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Wallet className="h-4 w-4" />
                  )}
                  Connect Wallet
                </Button>
              )}
            </div>

            <div className="border-t border-border pt-2">
              <div className="mb-2 px-3">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground capitalize">
                  {user?.role}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
