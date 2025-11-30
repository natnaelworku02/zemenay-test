"use client"

import type { ReactNode } from "react"

import SearchBar from "@/components/search-bar"

type ProductFiltersProps = {
  search: string
  onSearch: (value: string) => void
  categories: string[]
  activeCategory: string
  onCategoryChange: (category: string) => void
  actions?: ReactNode
}

function ProductFilters({
  search,
  onSearch,
  categories,
  activeCategory,
  onCategoryChange,
  actions,
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

      <SearchBar
        value={search}
        onChange={onSearch}
        placeholder="Search by name, brand, or category"
        className="w-full"
      />

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
