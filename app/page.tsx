"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import toast from "react-hot-toast"

import PageHero from "@/components/page-hero"
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
import { addProduct, fetchProducts, removeProduct, updateProduct } from "@/features/productsSlice"
import { toggleFavorite } from "@/features/favoritesSlice"
import axios from "@/lib/axios"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import type { RootState } from "@/store/store"
import type { Product } from "@/types"

export default function Home() {
  const dispatch = useAppDispatch()
  const { items, loading, error, total, skip, limit } = useAppSelector((s) => s.products)
  const favorites = useAppSelector((s: RootState) => s.favorites.items)
  const isAuthenticated = useAppSelector((s) => s.ui.isAuthenticated)

  const [search, setSearch] = useState("")
  const [category, setCategory] = useState<string>("all")
  const [categories, setCategories] = useState<string[]>(["all"])
  const [minPrice, setMinPrice] = useState<number | undefined>()
  const [maxPrice, setMaxPrice] = useState<number | undefined>()
  const [createOpen, setCreateOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [deleting, setDeleting] = useState<Product | null>(null)
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
    if (!isAuthenticated) {
      window.location.href = "/login"
      return
    }
    dispatch(toggleFavorite(product))
    const isFav = favorites.some((f: Product) => f.id === product.id)
    toast.success(isFav ? "Removed from favorites" : "Added to favorites")
  }

  const handleCreate = async (values: Omit<Product, "id">) => {
    if (!isAuthenticated) {
      window.location.href = "/login"
      return
    }
    try {
      const res = await axios.post<Product>("/products/add", values)
      dispatch(addProduct(res.data))
      toast.success("Product created")
      setCreateOpen(false)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create product"
      toast.error(message)
    }
  }

  const handleUpdate = async (values: Omit<Product, "id"> & { id?: number }) => {
    if (!editing?.id) return
    if (!isAuthenticated) {
      window.location.href = "/login"
      return
    }
    try {
      const res = await axios.put<Product>(`/products/${editing.id}`, values)
      dispatch(updateProduct(res.data))
      toast.success("Product updated")
      setEditing(null)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update product"
      toast.error(message)
    }
  }

  const handleDelete = async () => {
    if (!deleting?.id) return
    if (!isAuthenticated) {
      window.location.href = "/login"
      return
    }
    try {
      await axios.delete(`/products/${deleting.id}`)
      dispatch(removeProduct(deleting.id))
      toast.success("Product deleted")
      setDeleting(null)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete product"
      toast.error(message)
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
        <PageHero favoritesCount={favorites.length} categoriesCount={categories.length - 1} />

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
          actions={
            <Button onClick={() => setCreateOpen(true)} className="w-full sm:w-auto">
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
          onEdit={setEditing}
          onDelete={setDeleting}
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

      <Dialog open={Boolean(editing)} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit product</DialogTitle>
            <DialogDescription>Updates the DummyJSON product and refreshes the list item.</DialogDescription>
          </DialogHeader>
          {editing ? (
            <ProductForm
              mode="edit"
              initialData={editing}
              onSubmit={handleUpdate}
              onCancel={() => setEditing(null)}
            />
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(deleting)} onOpenChange={(open) => !open && setDeleting(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete product?</DialogTitle>
            <DialogDescription className="space-y-2">
              <p className="font-medium text-foreground">{deleting?.title}</p>
              <p>This calls DummyJSON delete and removes it from the local list.</p>
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-end gap-2">
            <Button variant="ghost" onClick={() => setDeleting(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={loading}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
