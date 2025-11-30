"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Plus } from "lucide-react"
import toast from "react-hot-toast"

import ProductFilters from "@/components/product-filters"
import ProductForm from "@/components/product-form"
import ProductGrid from "@/components/product-grid"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { addProductLocal, createProduct, fetchProducts } from "@/features/productsSlice"
import { toggleFavorite } from "@/features/favoritesSlice"
import axios from "@/lib/axios"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import type { RootState } from "@/store/store"
import type { Product } from "@/types"

export default function Home() {
  const dispatch = useAppDispatch()
  const { items, loading, error, total, skip, limit } = useAppSelector((s) => s.products)
  const favorites = useAppSelector((s: RootState) => s.favorites.items)
  const user = useAppSelector((s) => s.auth.user)

  const [search, setSearch] = useState("")
  const [category, setCategory] = useState<string>("all")
  const [categories, setCategories] = useState<string[]>(["all"])
  const [minPrice, setMinPrice] = useState<number | undefined>()
  const [maxPrice, setMaxPrice] = useState<number | undefined>()
  const [createOpen, setCreateOpen] = useState(false)
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const id = setTimeout(() => {
      dispatch(
        fetchProducts({
          limit,
          skip: 0,
          q: search || undefined,
          category: category !== "all" ? category : undefined,
        })
      )
    }, 350)
    return () => clearTimeout(id)
  }, [dispatch, limit, search, category])

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await axios.get("/products/categories")
        const raw = Array.isArray(res.data) ? res.data : []
        const parsed = Array.from(
          new Set(
            raw
              .map((c: unknown) => {
                if (typeof c === "string") return c
                if (c && typeof c === "object") {
                  const maybe = c as { slug?: string; name?: string }
                  return maybe.slug || maybe.name || ""
                }
                return ""
              })
              .filter(Boolean)
          )
        )
        setCategories(["all", ...parsed])
      } catch {
        setCategories(["all"])
      }
    }
    loadCategories()
  }, [])

  const hasMore = (skip + limit) < (total || 0)

  const handleFavorite = (product: Product) => {
    if (!user) {
      window.location.href = "/login"
      return
    }
    dispatch(toggleFavorite(product))
    const isFav = favorites.some((f: Product) => f.id === product.id)
    toast.success(isFav ? "Removed from favorites" : "Added to favorites")
  }

  const handleCreate = async (values: Omit<Product, "id">) => {
    if (!user) {
      window.location.href = "/login"
      return
    }
    try {
      await dispatch(createProduct(values)).unwrap()
      toast.success("Product created")
      setCreateOpen(false)
    } catch (err) {
      const message = getErrorMessage(err)
      toast.error(`Create failed: ${message}`)
      // Fallback to local add so the flow still works if the API rejects
      const newLocal: Product = {
        id: Date.now(),
        ...values,
      }
      dispatch(addProductLocal(newLocal))
      toast.success("Created locally (API unavailable)")
      setCreateOpen(false)
    }
  }

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return
    dispatch(
      fetchProducts({
        limit,
        skip: items.length,
        q: search || undefined,
        category: category !== "all" ? category : undefined,
      })
    )
  }, [category, dispatch, hasMore, items.length, limit, loading, search])

  const loadMoreObserver = useCallback(() => {
    loadMore()
  }, [loadMore])

  const filteredProducts = (category === "all"
    ? items
    : items.filter((p) => (p.category || "").toLowerCase() === category.toLowerCase())
  ).filter((p) => {
    const withinMin = typeof minPrice === "number" ? p.price >= minPrice : true
    const withinMax = typeof maxPrice === "number" ? p.price <= maxPrice : true
    return withinMin && withinMax
  })

  useEffect(() => {
    const node = sentinelRef.current
    if (!node) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreObserver()
        }
      },
      { threshold: 1 }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [loadMoreObserver])

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 via-white to-white text-slate-950 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 dark:text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-10 sm:px-8">
        <ProductFilters
          search={search}
          onSearch={setSearch}
          onSearchSubmit={() => {
            dispatch(
              fetchProducts({
                limit,
                skip: 0,
                q: search || undefined,
                category: category !== "all" ? category : undefined,
              })
            )
          }}
          categories={categories}
          activeCategory={category}
          onCategoryChange={setCategory}
          minPrice={minPrice}
          maxPrice={maxPrice}
          onMinPriceChange={setMinPrice}
          onMaxPriceChange={setMaxPrice}
          onReset={() => {
            setSearch("")
            setCategory("all")
            setMinPrice(undefined)
            setMaxPrice(undefined)
            dispatch(fetchProducts({ limit, skip: 0 }))
          }}
          actions={
            <Button
              onClick={() => {
                if (!user) {
                  window.location.href = "/login"
                  return
                }
                setCreateOpen(true)
              }}
              className="w-full sm:w-auto"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add product
            </Button>
          }
        />

        {error ? (
          <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-4 text-destructive">
            {error}
          </div>
        ) : null}

        <ProductGrid
          products={filteredProducts}
          favorites={favorites}
          onFavorite={handleFavorite}
          loading={loading}
          emptyText="No products match this search. Try a different keyword or reset filters."
        />

        <div ref={sentinelRef} className="flex items-center justify-center py-4 text-sm text-muted-foreground">
          {loading ? "Loading..." : hasMore ? "Scroll to load more" : "You’re all caught up."}
        </div>
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create product</DialogTitle>
            <DialogDescription>Posts to DummyJSON and adds the new item to the list.</DialogDescription>
          </DialogHeader>
          <ProductForm
            mode="create"
            onSubmit={handleCreate}
            onCancel={() => setCreateOpen(false)}
          />
        </DialogContent>
      </Dialog>

    </div>
  )
}

function getErrorMessage(err: unknown) {
  if (axios.isAxiosError(err)) {
    return err.response?.data?.message || err.message || "Network error"
  }
  if (err instanceof Error) return err.message
  return "Unknown error"
}
