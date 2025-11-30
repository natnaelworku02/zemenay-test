"use client"

import React, { type ReactNode } from "react"
import { Provider, useDispatch, useSelector } from "react-redux"
import { Toaster } from "react-hot-toast"

import { store } from "@/store/store"
import type { RootState } from "@/store/store"
import { hydrateAuth } from "@/features/uiSlice"
import { hydrate as hydrateMockAuth } from "@/features/authSlice"
import { hydrateFavorites } from "@/features/favoritesSlice"
import { hydrateProducts } from "@/features/productsSlice"

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
  const favorites = useSelector((s: RootState) => s.favorites.items)
  const products = useSelector((s: RootState) => s.products.items)
  const dispatch = useDispatch()

  React.useEffect(() => {
    const savedTheme = (localStorage.getItem("ui:theme") as "light" | "dark" | null) || undefined
    const savedUserRaw = localStorage.getItem("ui:user")
    const savedUser = savedUserRaw ? (JSON.parse(savedUserRaw) as { name: string; email: string }) : undefined
    dispatch(hydrateAuth({ user: savedUser, theme: savedTheme }))

    dispatch(hydrateMockAuth())

    try {
      const favRaw = localStorage.getItem("favorites:items")
      if (favRaw) {
        const favParsed = JSON.parse(favRaw)
        dispatch(hydrateFavorites(Array.isArray(favParsed) ? favParsed : []))
      }
    } catch {
      /* ignore */
    }

    try {
      const prodRaw = localStorage.getItem("products:cache")
      if (prodRaw) {
        const prodParsed = JSON.parse(prodRaw)
        dispatch(hydrateProducts(prodParsed))
      }
    } catch {
      /* ignore */
    }
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

  React.useEffect(() => {
    try {
      localStorage.setItem("favorites:items", JSON.stringify(favorites))
    } catch {
      /* ignore */
    }
  }, [favorites])

  React.useEffect(() => {
    try {
      localStorage.setItem("products:cache", JSON.stringify({ items: products }))
    } catch {
      /* ignore */
    }
  }, [products])

  return null
}

export default Providers
