"use client"

import ProductDetail from "@/components/product-detail"
import { toggleFavorite } from "@/features/favoritesSlice"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import type { Product } from "@/types"

function ProductDetailShell({ product }: { product: Product }) {
  const dispatch = useAppDispatch()
  const favorites = useAppSelector((s) => s.favorites.items)
  const isFavorite = favorites.some((f) => f.id === product.id)

  return (
    <ProductDetail
      product={product}
      isFavorite={isFavorite}
      onFavorite={(p) => dispatch(toggleFavorite(p))}
    />
  )
}

export default ProductDetailShell
