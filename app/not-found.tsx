import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="container max-w-md mx-auto p-4 flex flex-col items-center justify-center min-h-[70vh]">
      <h1 className="mb-2 text-3xl font-bold">404</h1>
      <h2 className="mb-4 text-xl font-semibold">Page Not Found</h2>
      <p className="mb-6 text-center text-muted-foreground">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link href="/dashboard">
        <Button className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Button>
      </Link>
    </main>
  );
}

