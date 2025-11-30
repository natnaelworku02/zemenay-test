"use client"

import type { ReactNode } from "react"
import { useMemo, useState } from "react"
import {
  Flame,
  Heart,
  Plus,
  ShoppingBag,
  Sparkles,
  Tag,
  Trash2,
} from "lucide-react"
import toast from "react-hot-toast"

import ProductCard from "@/components/product-card"
import ProductForm from "@/components/product-form"
import SearchBar from "@/components/search-bar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toggleFavorite } from "@/features/favoritesSlice"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import type { Product } from "@/types"

const DUMMY_PRODUCTS: Product[] = [
  {
    id: 1,
    title: "Minimalist Leather Backpack",
    description:
      "Premium full-grain leather with padded laptop sleeve and quick access pockets.",
    price: 189,
    rating: 4.8,
    stock: 34,
    brand: "Northwind",
    category: "Accessories",
    discountPercentage: 12,
    thumbnail:
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    title: "Everyday Linen Shirt",
    description:
      "Breathable linen blend with relaxed fit and hidden button-down collar.",
    price: 74,
    rating: 4.4,
    stock: 58,
    brand: "Studio W",
    category: "Apparel",
    thumbnail:
      "https://images.unsplash.com/photo-1496747611180-206a5c8c8c67?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    title: "Smart Ceramic Mug",
    description:
      "Self-heating ceramic mug keeps drinks at the perfect temperature for hours.",
    price: 129,
    rating: 4.7,
    stock: 12,
    brand: "Monocle Labs",
    category: "Home",
    thumbnail:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    title: "Wireless Noise-Canceling Headphones",
    description:
      "Adaptive noise cancellation with 30-hour battery life and studio-grade drivers.",
    price: 279,
    rating: 4.9,
    stock: 18,
    brand: "Aural",
    category: "Electronics",
    discountPercentage: 5,
    thumbnail:
      "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 5,
    title: "Sculpted Table Lamp",
    description:
      "Soft diffused light with dimmable touch controls and matte ceramic base.",
    price: 96,
    rating: 4.5,
    stock: 42,
    brand: "Atelier",
    category: "Home",
    thumbnail:
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 6,
    title: "Performance Running Sneakers",
    description:
      "Responsive foam midsole with breathable knit upper for long-distance comfort.",
    price: 148,
    rating: 4.6,
    stock: 27,
    brand: "Stride",
    category: "Footwear",
    thumbnail:
      "https://images.unsplash.com/photo-1514986888952-8cd320577b68?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 7,
    title: "Compact Mirrorless Camera",
    description:
      "Lightweight body with 4K video, dual stabilization, and Wi-Fi transfer.",
    price: 1049,
    rating: 4.8,
    stock: 9,
    brand: "Lumina",
    category: "Electronics",
    thumbnail:
      "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 8,
    title: "Signature Fragrance Set",
    description:
      "Layered scent trio with citrus top notes and warm amber finish.",
    price: 89,
    rating: 4.3,
    stock: 63,
    brand: "Maison Lune",
    category: "Beauty",
    thumbnail:
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 9,
    title: "Carbon Fiber Travel Luggage",
    description:
      "Featherweight carry-on with 360° wheels, TSA locks, and modular dividers.",
    price: 329,
    rating: 4.7,
    stock: 21,
    brand: "AeroCase",
    category: "Travel",
    discountPercentage: 10,
    thumbnail:
      "https://images.unsplash.com/photo-1522199710521-72d69614c702?auto=format&fit=crop&w=800&q=80",
  },
]

export default function Home() {
  const dispatch = useAppDispatch()
  const favorites = useAppSelector((s) => s.favorites.items)

  const [products, setProducts] = useState<Product[]>(DUMMY_PRODUCTS)
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState<string>("all")
  const [createOpen, setCreateOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [deleting, setDeleting] = useState<Product | null>(null)

  const categories = useMemo(() => {
    const unique = Array.from(new Set(products.map((p) => p.category || "Other")))
    return ["all", ...unique]
  }, [products])

  const filteredProducts = useMemo(() => {
    const term = search.toLowerCase()
    return products.filter((p) => {
      const matchesQuery =
        p.title.toLowerCase().includes(term) ||
        (p.description || "").toLowerCase().includes(term) ||
        (p.category || "").toLowerCase().includes(term)
      const matchesCategory = category === "all" || (p.category || "") === category
      return matchesQuery && matchesCategory
    })
  }, [category, products, search])

  const handleFavorite = (product: Product) => {
    dispatch(toggleFavorite(product))
    const isFav = favorites.some((f) => f.id === product.id)
    toast.success(isFav ? "Removed from favorites" : "Added to favorites")
  }

  const handleCreate = (values: Omit<Product, "id">) => {
    const newProduct: Product = {
      ...values,
      id: Date.now(),
      rating: values.rating ?? 4.5,
      stock: values.stock ?? 0,
    }
    setProducts((prev) => [newProduct, ...prev])
    toast.success("Product created (dummy)")
    setCreateOpen(false)
  }

  const handleUpdate = (values: Omit<Product, "id"> & { id?: number }) => {
    if (!editing) return
    const updated = { ...editing, ...values, id: editing.id }
    setProducts((prev) => prev.map((p) => (p.id === editing.id ? updated : p)))
    toast.success("Product updated (dummy)")
    setEditing(null)
  }

  const handleDelete = () => {
    if (!deleting) return
    setProducts((prev) => prev.filter((p) => p.id !== deleting.id))
    toast.success("Product deleted (dummy)")
    setDeleting(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white text-slate-950">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-10 sm:px-8">
        <header className="rounded-3xl border border-border/70 bg-white/90 p-8 shadow-sm backdrop-blur">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Curated marketplace
              </p>
              <h1 className="text-3xl font-semibold sm:text-4xl">
                Discover, manage, and curate products
              </h1>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground">
              <Sparkles className="h-4 w-4" />
              Live preview (dummy data)
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <StatCard
              icon={<Flame className="h-4 w-4" />}
              label="Hot picks"
              value="New arrivals"
            />
            <StatCard
              icon={<Heart className="h-4 w-4" />}
              label="Favorites"
              value={`${favorites.length} saved`}
            />
            <StatCard
              icon={<Tag className="h-4 w-4" />}
              label="Categories"
              value={`${categories.length - 1}+ curated`}
            />
          </div>
        </header>

        <section className="flex flex-col gap-4 rounded-3xl border border-border/70 bg-white/90 p-6 shadow-sm backdrop-blur">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Catalog
              </p>
              <h2 className="text-2xl font-semibold">Product list & CRUD playground</h2>
            </div>
            <Button onClick={() => setCreateOpen(true)} className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Add product
            </Button>
          </div>

          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search by name, brand, or category"
            className="w-full"
          />

          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                  category === cat
                    ? "border-transparent bg-primary text-primary-foreground shadow-sm"
                    : "border-border bg-secondary text-secondary-foreground hover:border-ring/50"
                }`}
              >
                {cat === "all" ? "All" : cat}
              </button>
            ))}
          </div>
        </section>

        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isFavorite={favorites.some((f) => f.id === product.id)}
              onFavorite={handleFavorite}
              onEdit={setEditing}
              onDelete={setDeleting}
            />
          ))}
          {filteredProducts.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-dashed border-border/80 bg-white p-10 text-center text-muted-foreground">
              No products match this search. Try a different keyword or reset filters.
            </div>
          ) : null}
        </section>
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create product (dummy)</DialogTitle>
            <DialogDescription>
              This form only updates the local list for now. We will wire it to DummyJSON next.
            </DialogDescription>
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
            <DialogTitle>Edit product (dummy)</DialogTitle>
            <DialogDescription>
              Adjust values to see optimistic UI updates.
            </DialogDescription>
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
              <p>
                This removes the item from the local preview list. We will wire it to the API next.
              </p>
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-end gap-2">
            <Button variant="ghost" onClick={() => setDeleting(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

type StatCardProps = {
  icon: ReactNode
  label: string
  value: string
}

function StatCard({ icon, label, value }: StatCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-secondary/60 px-4 py-3 text-sm shadow-inner">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-foreground shadow-sm">
        {icon}
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
        <p className="text-base font-semibold">{value}</p>
      </div>
    </div>
  )
}
