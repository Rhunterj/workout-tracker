import { auth, signIn, signOut } from "@/auth";

import { Button } from "@/components/ui/button";
import { LogIn, LogOut } from "lucide-react";
import { useSession } from "next-auth/react";

export default async function AuthButton() {
  const session = await auth();

  if (session) {
    return (
      <Button variant="ghost" size="sm" onClick={() => signOut()}>
        <LogOut className="mr-2 h-4 w-4" /> Sign Out
      </Button>
    );
  }

  return (
    <Button variant="ghost" size="sm" onClick={() => signIn("google")}>
      <LogIn className="mr-2 h-4 w-4" /> Sign In with Google
    </Button>
  );
}

