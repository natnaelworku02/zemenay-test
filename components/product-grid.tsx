"use client"

import type { Product } from "@/types"
import ProductCard from "@/components/product-card"
import Skeleton from "@/components/skeleton"

type ProductGridProps = {
  products: Product[]
  favorites: Product[]
  onFavorite: (product: Product) => void
  onEdit?: (product: Product) => void
  onDelete?: (product: Product) => void
  emptyText?: string
  loading?: boolean
}

function ProductGrid({
  products,
  favorites,
  onFavorite,
  onEdit,
  onDelete,
  emptyText,
  loading,
}: ProductGridProps) {
  if (loading && products.length === 0) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, idx) => (
          <Skeleton key={idx} className="h-64 rounded-2xl border border-border/60 dark:border-white/10" />
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border/80 bg-white p-10 text-center text-muted-foreground dark:bg-slate-900">
        {emptyText || "No products to show right now."}
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          isFavorite={favorites.some((f) => f.id === product.id)}
          onFavorite={onFavorite}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}

export default ProductGrid
