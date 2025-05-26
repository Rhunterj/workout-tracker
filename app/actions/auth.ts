"use server";

import { signIn, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export async function signInAction() {
  await signIn("google");

  // Wait for session to be established
  const session = await auth();
  if (!session) {
    // If no session after sign in, something went wrong
    throw new Error("Failed to establish session");
  }

  redirect("/dashboard");
}

export async function signOutAction() {
  await signOut();
}

