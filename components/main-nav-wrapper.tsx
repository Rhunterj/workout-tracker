"use client";

import { usePathname } from "next/navigation";
import { MainNav } from "./main-nav";

export default function MainNavWrapper() {
  const pathname = usePathname();
  const isAuthPage =
    pathname === "/" || pathname === "/login" || pathname === "/signup";

  if (isAuthPage) return null;
  return <MainNav />;
}

