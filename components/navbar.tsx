"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { Heart, LogIn, LogOut, Moon, ShoppingBag, Sun } from "lucide-react"

import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { cn } from "@/lib/utils"
import { logout, toggleTheme } from "@/features/uiSlice"

function Navbar() {
  const dispatch = useAppDispatch()
  const favorites = useAppSelector((s) => s.favorites.items)
  const theme = useAppSelector((s) => s.ui.theme)
  const isAuthenticated = useAppSelector((s) => s.ui.isAuthenticated)
  const user = useAppSelector((s) => s.ui.user)

  const toggle = () => dispatch(toggleTheme())
  const handleLogout = () => dispatch(logout())
  return (
    <nav className="sticky top-0 z-30 border-b border-border/70 bg-white/90 backdrop-blur dark:bg-slate-900/90 dark:border-white/10">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-8">
        <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <ShoppingBag className="h-5 w-5" />
          </div>
          <span>Modern Market</span>
        </Link>

        <div className="flex items-center gap-2 text-sm font-medium">
          <NavLink href="/" label="Home" />
          <NavLink
            href="/favorites"
            label="Favorites"
            icon={<Heart className="h-4 w-4" />}
            badge={favorites.length}
          />
          <button
            onClick={toggle}
            className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-foreground transition hover:bg-secondary"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            <span className="hidden sm:inline">{theme === "dark" ? "Light" : "Dark"} mode</span>
          </button>
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-foreground transition hover:bg-secondary"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">{user?.name || "User"}</span>
            </button>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-foreground transition hover:bg-secondary"
            >
              <LogIn className="h-4 w-4" />
              <span className="hidden sm:inline">Login</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}

function NavLink({
  href,
  label,
  icon,
  badge,
}: {
  href: string
  label: string
  icon?: ReactNode
  badge?: number
}) {
  return (
    <Link
      href={href}
      className="relative inline-flex items-center gap-1 rounded-full px-3 py-2 text-foreground transition hover:bg-secondary"
    >
      {icon}
      <span>{label}</span>
      {badge ? (
        <span
          className={cn(
            "ml-1 rounded-full bg-primary px-2 py-[2px] text-[10px] font-semibold text-primary-foreground",
            badge > 9 && "px-2.5"
          )}
        >
          {badge > 99 ? "99+" : badge}
        </span>
      ) : null}
    </Link>
  )
}

export default Navbar
