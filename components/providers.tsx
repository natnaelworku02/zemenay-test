"use client"

import React, { type ReactNode } from "react"
import { Provider, useDispatch, useSelector } from "react-redux"
import { Toaster } from "react-hot-toast"

import { store } from "@/store/store"
import type { RootState } from "@/store/store"
import { hydrateAuth } from "@/features/uiSlice"

function Providers({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <StateHydrator />
      {children}
      <Toaster position="top-right" />
    </Provider>
  )
}

function StateHydrator() {
  const theme = useSelector((s: RootState) => s.ui.theme)
  const dispatch = useDispatch()

  React.useEffect(() => {
    const savedTheme = (localStorage.getItem("ui:theme") as "light" | "dark" | null) || undefined
    const savedUserRaw = localStorage.getItem("ui:user")
    const savedUser = savedUserRaw ? (JSON.parse(savedUserRaw) as { name: string; email: string }) : undefined
    dispatch(hydrateAuth({ user: savedUser, theme: savedTheme }))
  }, [dispatch])

  React.useEffect(() => {
    localStorage.setItem("ui:theme", theme)
    if (theme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [theme])

  const user = useSelector((s: RootState) => s.ui.user)
  React.useEffect(() => {
    if (user) {
      localStorage.setItem("ui:user", JSON.stringify(user))
    } else {
      localStorage.removeItem("ui:user")
    }
  }, [user])

  return null
}

export default Providers
