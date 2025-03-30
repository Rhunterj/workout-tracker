import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <main className="container max-w-md mx-auto p-4 flex flex-col items-center justify-center min-h-[70vh]">
      <h1 className="text-3xl font-bold mb-2">404</h1>
      <h2 className="text-xl font-semibold mb-4">Page Not Found</h2>
      <p className="text-muted-foreground text-center mb-6">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link href="/">
        <Button className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>
      </Link>
    </main>
  )
}

