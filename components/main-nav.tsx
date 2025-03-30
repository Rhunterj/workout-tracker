"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Calendar, Home } from "lucide-react"
import { cn } from "@/lib/utils"

export default function MainNav() {
  const pathname = usePathname()

  const navItems = [
    {
      name: "Home",
      href: "/",
      icon: <Home className="h-5 w-5" />,
      active: pathname === "/",
    },
    {
      name: "Calendar",
      href: "/calendar",
      icon: <Calendar className="h-5 w-5" />,
      active: pathname === "/calendar",
    },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-10 bg-background border-t">
      <div className="container max-w-md mx-auto">
        <div className="flex items-center justify-around">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center py-3 px-6",
                item.active ? "text-primary" : "text-muted-foreground",
              )}
            >
              {item.icon}
              <span className="text-xs mt-1">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}

