"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LogIn, UserPlus } from "lucide-react"
import toast from "react-hot-toast"

import { Button } from "@/components/ui/button"
import { login, register } from "@/features/authSlice"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { useEffect } from "react"

export default function LoginPage() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const user = useAppSelector((s) => s.auth.user)
  const error = useAppSelector((s) => s.auth.error)

  const [mode, setMode] = useState<"login" | "signup">("login")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      router.push("/")
    }
  }, [router, user])

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) {
      toast.error("Email and password are required")
      return
    }
    if (mode === "signup") {
      if (!name.trim()) {
        toast.error("Name is required")
        return
      }
      if (password !== confirm) {
        toast.error("Passwords do not match")
        return
      }
      if (password.length < 6) {
        toast.error("Password must be at least 6 characters")
        return
      }
    }

    setLoading(true)
    if (mode === "signup") {
      dispatch(register({ name, email, password }))
    } else {
      dispatch(login({ email, password }))
    }
    setLoading(false)
  }

  if (user) {
    router.push("/")
    return null
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-50">
      <div className="mx-auto flex max-w-md flex-col gap-6 px-4 py-14 sm:px-8">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            {mode === "login" ? "Welcome back" : "Join us"}
          </p>
          <h1 className="text-3xl font-semibold">
            {mode === "login" ? "Login to continue" : "Create an account"}
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 rounded-2xl border border-border/70 bg-white/90 p-6 shadow-sm backdrop-blur dark:bg-slate-900 dark:border-white/10"
        >
          {mode === "signup" && (
            <label className="flex flex-col gap-2 text-sm font-medium">
              Name
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                className="rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/50 dark:bg-slate-900"
                required
              />
            </label>
          )}

          <label className="flex flex-col gap-2 text-sm font-medium">
            Email
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/50 dark:bg-slate-900"
              required
              type="email"
            />
          </label>

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

          {mode === "signup" && (
            <label className="flex flex-col gap-2 text-sm font-medium">
              Confirm password
              <input
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
                type="password"
                required
                className="rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/50 dark:bg-slate-900"
              />
            </label>
          )}

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          <Button type="submit" className="w-full" disabled={loading}>
            {mode === "login" ? (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                {loading ? "Signing in..." : "Login"}
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                {loading ? "Creating..." : "Sign up"}
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
