"use client"

import type { Product } from "@/types"
import ProductCard from "@/components/product-card"

type ProductGridProps = {
  products: Product[]
  favorites: Product[]
  onFavorite: (product: Product) => void
  onEdit?: (product: Product) => void
  onDelete?: (product: Product) => void
  emptyText?: string
}

function ProductGrid({
  products,
  favorites,
  onFavorite,
  onEdit,
  onDelete,
  emptyText,
}: ProductGridProps) {
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
