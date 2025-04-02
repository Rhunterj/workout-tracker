import { auth } from "@/auth";
import { MainNav } from "./main-nav";

export default async function MainNavWrapper() {
  const session = await auth();
  return <MainNav session={session} />;
}

