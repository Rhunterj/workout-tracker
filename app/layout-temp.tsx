import { auth } from "@/auth";
import { MainNav } from "@/components/main-nav";
import { redirect } from "next/navigation";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  return (
    <>
      {children}
      <MainNav />
    </>
  );
}

