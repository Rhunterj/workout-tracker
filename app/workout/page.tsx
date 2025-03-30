import { redirect } from "next/navigation"

// This is a catch-all page to redirect any /workout requests to the home page
export default function WorkoutPage() {
  redirect("/")
  return null
}

