"use client";

import { Button } from "@/components/ui/button";
import { LogIn, LogOut } from "lucide-react";
import { signInAction, signOutAction } from "@/app/actions/auth";

export function AuthButtons({ session }: { session: any }) {
  if (session) {
    return (
      <form action={signOutAction}>
        <Button variant="ghost" size="sm" type="submit">
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </form>
    );
  }

  return (
    <form action={signInAction}>
      <Button variant="ghost" size="sm" type="submit">
        <LogIn className="mr-2 h-4 w-4" />
        Sign In
      </Button>
    </form>
  );
}

