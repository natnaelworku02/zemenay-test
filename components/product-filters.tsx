"use client"

import type { ReactNode } from "react"

import SearchBar from "@/components/search-bar"
import { Button } from "@/components/ui/button"

type ProductFiltersProps = {
  search: string
  onSearch: (value: string) => void
  onSearchSubmit?: () => void
  categories: string[]
  activeCategory: string
  onCategoryChange: (category: string) => void
  actions?: ReactNode
  minPrice: number | undefined
  maxPrice: number | undefined
  onMinPriceChange: (v: number | undefined) => void
  onMaxPriceChange: (v: number | undefined) => void
}

function ProductFilters({
  search,
  onSearch,
  onSearchSubmit,
  categories,
  activeCategory,
  onCategoryChange,
  actions,
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
}: ProductFiltersProps) {
  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-border/70 bg-white/90 p-6 shadow-sm backdrop-blur dark:bg-slate-900 dark:border-white/10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Catalog</p>
          <h2 className="text-2xl font-semibold">Product list & CRUD playground</h2>
        </div>
        {actions}
      </div>

      <form
        className="grid gap-3 sm:grid-cols-[2fr_1fr_1fr_auto]"
        onSubmit={(e) => {
          e.preventDefault()
          onSearchSubmit?.()
        }}
      >
        <SearchBar
          value={search}
          onChange={onSearch}
          placeholder="Search by name, brand, or category"
          className="w-full"
        />
        <input
          type="number"
          min={0}
          value={minPrice ?? ""}
          onChange={(e) => onMinPriceChange(e.target.value ? Number(e.target.value) : undefined)}
          className="rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/50 dark:bg-slate-900"
          placeholder="Min price"
        />
        <input
          type="number"
          min={0}
          value={maxPrice ?? ""}
          onChange={(e) => onMaxPriceChange(e.target.value ? Number(e.target.value) : undefined)}
          className="rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/50 dark:bg-slate-900"
          placeholder="Max price"
        />
        <Button type="submit" className="w-full sm:w-auto">
          Search
        </Button>
      </form>

      <div className="flex flex-wrap items-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
              activeCategory === cat
                ? "border-transparent bg-primary text-primary-foreground shadow-sm"
                : "border-border bg-secondary text-secondary-foreground hover:border-ring/50"
            }`}
          >
            {cat === "all" ? "All" : cat}
          </button>
        ))}
      </div>
    </div>
  )
}

export default ProductFilters
