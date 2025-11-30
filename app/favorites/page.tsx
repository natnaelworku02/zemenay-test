"use client"

import ProductGrid from "@/components/product-grid"
import PageHero from "@/components/page-hero"
import { toggleFavorite } from "@/features/favoritesSlice"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import type { Product } from "@/types"

export default function FavoritesPage() {
  const dispatch = useAppDispatch()
  const favorites = useAppSelector((s) => s.favorites.items)
  const categories = Array.from(new Set(favorites.map((p) => p.category || "Other")))

  const handleFavorite = (product: Product) => {
    dispatch(toggleFavorite(product))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white text-slate-950">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:px-8">
        <PageHero favoritesCount={favorites.length} categoriesCount={categories.length} />
        <div className="rounded-3xl border border-border/70 bg-white/90 p-6 shadow-sm backdrop-blur">
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
