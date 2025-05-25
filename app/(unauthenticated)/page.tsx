import { Button } from "@/components/ui/button";
import { LogIn, UserPlus } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="container max-w-md mx-auto p-4 min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-bold mb-4">Workout Tracker</h1>
        <p className="text-muted-foreground mb-8">
          Track your fitness progress and achieve your goals
        </p>

        <div className="space-y-4 w-full max-w-sm">
          <form action="/api/auth/signin/google" method="POST">
            <Button type="submit" size="lg" className="w-full gap-2">
              <LogIn className="h-5 w-5" />
              Sign In with Google
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or
              </span>
            </div>
          </div>

          <Link href="/signup" className="block">
            <Button variant="outline" size="lg" className="w-full gap-2">
              <UserPlus className="h-5 w-5" />
              Create Account
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
