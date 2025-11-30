"use client"

import Image from "next/image"
import Link from "next/link"
import { Heart, Pencil, Star, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Product } from "@/types"

type ProductCardProps = {
  product: Product
  isFavorite?: boolean
  onFavorite: (product: Product) => void
  onEdit?: (product: Product) => void
  onDelete?: (product: Product) => void
}

function ProductCard({
  product,
  isFavorite,
  onFavorite,
  onEdit,
  onDelete,
}: ProductCardProps) {
  const imageSrc =
    product.thumbnail ||
    product.images?.[0] ||
    "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80"

  return (
    <div className="group relative flex h-full flex-col gap-3 overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-slate-900">
      <Link
        href={`/product/${product.id}`}
        className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-muted to-secondary/60 dark:from-slate-800 dark:to-slate-900"
      >
        <Image
          src={imageSrc}
          alt={product.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          priority
        />
        <div className="absolute left-3 top-3 rounded-full bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur dark:bg-slate-900/80">
          {product.category || "Uncategorized"}
        </div>
        {product.discountPercentage ? (
          <div className="absolute right-3 top-3 rounded-full bg-primary text-primary-foreground px-3 py-1 text-xs font-semibold shadow">
            -{product.discountPercentage}%
          </div>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col gap-3 px-4 pb-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">
              {product.brand || "Brand"}
            </p>
            <Link href={`/product/${product.id}`} className="text-lg font-semibold leading-tight hover:underline">
              {product.title}
            </Link>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-600">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            {product.rating?.toFixed(1) ?? "4.5"}
          </div>
        </div>

        <p className="line-clamp-2 text-sm text-muted-foreground">
          {product.description || "Beautifully crafted item for everyday use."}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Price</span>
            <span className="text-xl font-bold">${product.price}</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "rounded-full px-3 py-1 text-xs font-semibold",
                (product.stock ?? 0) > 0
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-rose-50 text-rose-600"
              )}
            >
              {product.stock ? `${product.stock} in stock` : "Out of stock"}
            </div>
          </div>
        </div>

        <div className="mt-auto flex items-center gap-2">
          <Button
            size="sm"
            variant={isFavorite ? "secondary" : "default"}
            className="flex-1"
            onClick={() => onFavorite(product)}
          >
            <Heart
              className={cn(
                "h-4 w-4",
                isFavorite ? "fill-current text-primary" : "text-current"
              )}
            />
            {isFavorite ? "Favorited" : "Add to Favorites"}
          </Button>
          {onEdit ? (
            <Button
              size="icon-sm"
              variant="outline"
              aria-label="Edit product"
              onClick={() => onEdit(product)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          ) : null}
          {onDelete ? (
            <Button
              size="icon-sm"
              variant="outline"
              aria-label="Delete product"
              onClick={() => onDelete(product)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default ProductCard
