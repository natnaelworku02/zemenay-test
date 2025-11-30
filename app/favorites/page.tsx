"use client"

import ProductGrid from "@/components/product-grid"
import PageHero from "@/components/page-hero"
import { toggleFavorite } from "@/features/favoritesSlice"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import type { RootState } from "@/store/store"
import type { Product } from "@/types"

export default function FavoritesPage() {
  const dispatch = useAppDispatch()
  const favorites = useAppSelector((s: RootState) => s.favorites.items)
  const user = useAppSelector((s) => s.auth.user)
  const categories = Array.from(new Set(favorites.map((p) => p.category || "Other")))

  const handleFavorite = (product: Product) => {
    if (!user) {
      window.location.href = "/login"
      return
    }
    dispatch(toggleFavorite(product))
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:px-8">
        <PageHero favoritesCount={favorites.length} categoriesCount={categories.length} />
        <div className="rounded-3xl border border-border/70 bg-white/90 p-6 shadow-sm backdrop-blur dark:bg-slate-900 dark:border-white/10">
          <div className="mb-4">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Favorites</p>
            <h2 className="text-2xl font-semibold">Your saved items</h2>
          </div>
          <ProductGrid
            products={favorites}
            favorites={favorites}
            onFavorite={handleFavorite}
            emptyText="You haven't added any favorites yet."
          />
        </div>
      </div>
    </div>
  )
}
