"use client"

import Image from "next/image"
import { Heart, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Product } from "@/types"

type ProductDetailProps = {
  product: Product
  isFavorite?: boolean
  onFavorite: (product: Product) => void
  onEdit?: () => void
  onDelete?: () => void
}

function ProductDetail({ product, isFavorite, onFavorite, onEdit, onDelete }: ProductDetailProps) {
  const imageSrc =
    product.thumbnail ||
    product.images?.[0] ||
    "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80"

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-gradient-to-br from-muted to-secondary/60 dark:from-slate-800 dark:to-slate-900 dark:border-white/10">
        <Image
          src={imageSrc}
          alt={product.title}
          width={900}
          height={700}
          className="h-full w-full object-cover"
          priority
        />
        {product.discountPercentage ? (
          <div className="absolute left-4 top-4 rounded-full bg-primary text-primary-foreground px-3 py-1 text-xs font-semibold shadow">
            -{product.discountPercentage}%
          </div>
        ) : null}
      </div>

      <div className="flex flex-col gap-6 rounded-3xl border border-border/70 bg-white/90 p-6 shadow-sm backdrop-blur dark:bg-slate-900 dark:border-white/10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
              {product.brand || "Brand"}
            </p>
            <h1 className="text-3xl font-semibold">{product.title}</h1>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-600">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            {product.rating?.toFixed(1) ?? "4.5"}
          </div>
        </div>

        <p className="text-base text-muted-foreground">{product.description}</p>

        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
            {product.category || "Category"}
          </span>
          <span
            className={cn(
              "rounded-full px-3 py-1 text-xs font-semibold",
              (product.stock ?? 0) > 0
                ? "bg-emerald-50 text-emerald-600"
                : "bg-rose-50 text-rose-600"
            )}
          >
            {product.stock ? `${product.stock} in stock` : "Out of stock"}
          </span>
        </div>

        <div className="flex items-center justify-between rounded-2xl bg-secondary/60 px-4 py-3">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Price</span>
            <span className="text-3xl font-bold">${product.price}</span>
          </div>
          <Button
            size="lg"
            variant={isFavorite ? "secondary" : "default"}
            onClick={() => onFavorite(product)}
          >
            <Heart
              className={cn(
                "mr-2 h-5 w-5",
                isFavorite ? "fill-current text-primary" : "text-current"
              )}
            />
            {isFavorite ? "Favorited" : "Add to Favorites"}
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 justify-between">
          {onEdit ? (
            <Button size="lg" variant="outline" className="flex-1 min-w-[140px]" onClick={onEdit}>
              Edit
            </Button>
          ) : null}
          {onDelete ? (
            <Button size="lg" variant="destructive" className="flex-1 min-w-[140px]" onClick={onDelete}>
              Delete
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
