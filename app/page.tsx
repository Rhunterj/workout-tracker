import { Button } from "@/components/ui/button";
import { LogIn, UserPlus } from "lucide-react";
import Link from "next/link";
import { signInAction } from "@/app/actions/auth";

export default function Home() {
  return (
    <main className="container flex flex-col max-w-md min-h-screen p-4 mx-auto">
      <div className="flex flex-col items-center justify-center flex-1 text-center">
        <h1 className="mb-4 text-4xl font-bold">Workout Tracker</h1>
        <p className="mb-8 text-muted-foreground">
          Track your fitness progress and achieve your goals
        </p>

        <div className="w-full max-w-sm space-y-4">
          <form action={signInAction}>
            <Button type="submit" size="lg" className="w-full gap-2">
              <LogIn className="w-5 h-5" />
              Sign In with Google
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="px-2 bg-background text-muted-foreground">
                Or
              </span>
            </div>
          </div>

          <Link href="/signup" className="block">
            <Button variant="outline" size="lg" className="w-full gap-2">
              <UserPlus className="w-5 h-5" />
              Create Account
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}

