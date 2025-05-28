"use server";

import { signIn, signOut } from "@/auth";
import { redirect } from "next/navigation";

export async function signInAction() {
  try {
    await signIn("google", {
      redirectTo: "/dashboard",
      redirect: true,
    });
  } catch (error) {
    console.error("Sign in error:", error);
    throw error;
  }
}

export async function signOutAction() {
  try {
    await signOut({ redirectTo: "/" });
  } catch (error) {
    console.error("Sign out error:", error);
    throw error;
  }
}

