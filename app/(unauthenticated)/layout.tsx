import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function UnauthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  return <>{children}</>;
}
