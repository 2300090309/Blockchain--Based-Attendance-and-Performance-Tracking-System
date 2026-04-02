import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShieldCheck, Home, ArrowLeft } from "lucide-react"

// 404 Not Found page
export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="text-center">
        {/* Logo */}
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary">
          <ShieldCheck className="h-10 w-10 text-primary-foreground" />
        </div>

        {/* Error Code */}
        <h1 className="mb-2 text-8xl font-bold text-primary">404</h1>
        
        {/* Error Message */}
        <h2 className="mb-4 text-2xl font-semibold">Page Not Found</h2>
        <p className="mb-8 max-w-md text-muted-foreground">
          Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved. 
          Let&apos;s get you back on track.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/dashboard">
            <Button size="lg">
              <Home className="mr-2 h-4 w-4" />
              Go to Dashboard
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" size="lg">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
