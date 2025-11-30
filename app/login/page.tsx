"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LogIn, UserPlus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { login, register } from "@/features/uiSlice"
import { useAppDispatch, useAppSelector } from "@/store/hooks"

export default function LoginPage() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const isAuthenticated = useAppSelector((s) => s.ui.isAuthenticated)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [mode, setMode] = useState<"login" | "signup">("login")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) return

    if (mode === "signup") {
      if (!name.trim()) return
      dispatch(register({ name, email }))
      localStorage.setItem(`auth:${email}`, JSON.stringify({ name, email, password }))
    } else {
      const stored = localStorage.getItem(`auth:${email}`)
      if (!stored) return
      const user = JSON.parse(stored) as { name: string; email: string; password: string }
      if (user.password !== password) return
      dispatch(login({ name: user.name, email }))
    }
    router.push("/")
  }

  if (isAuthenticated) {
    router.push("/")
    return null
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-50">
      <div className="mx-auto flex max-w-md flex-col gap-6 px-4 py-14 sm:px-8">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Welcome back</p>
          <h1 className="text-3xl font-semibold">
            {mode === "login" ? "Login to continue" : "Create an account"}
          </h1>
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 rounded-2xl border border-border/70 bg-white/90 p-6 shadow-sm backdrop-blur dark:bg-slate-900 dark:border-white/10"
        >
          <label className="flex flex-col gap-2 text-sm font-medium">
            Email
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              type="email"
              required
              className="rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/50 dark:bg-slate-900"
            />
          </label>
          {mode === "signup" && (
            <label className="flex flex-col gap-2 text-sm font-medium">
              Name
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                required={mode === "signup"}
                className="rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/50 dark:bg-slate-900"
              />
            </label>
          )}
          <label className="flex flex-col gap-2 text-sm font-medium">
            Password
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              type="password"
              required
              className="rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/50 dark:bg-slate-900"
            />
          </label>
          <Button type="submit" className="w-full">
            {mode === "login" ? (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Sign up
              </>
            )}
          </Button>
          <button
            type="button"
            className="text-sm text-primary underline-offset-4 hover:underline"
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
          >
            {mode === "login" ? "No account? Create one" : "Have an account? Login"}
          </button>
        </form>
      </div>
    </div>
  )
}
