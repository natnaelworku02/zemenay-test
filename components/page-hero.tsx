"use client"

import { Heart, ShoppingBag, Sparkles, Tag } from "lucide-react"

import StatCard from "@/components/stat-card"

type PageHeroProps = {
  favoritesCount: number
  categoriesCount: number
}

function PageHero({ favoritesCount, categoriesCount }: PageHeroProps) {
  return (
    <header className="rounded-3xl border border-border/70 bg-white/90 p-8 shadow-sm backdrop-blur">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md">
          <ShoppingBag className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Curated marketplace
          </p>
          <h1 className="text-3xl font-semibold sm:text-4xl">Discover, manage, and curate products</h1>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground">
          <Sparkles className="h-4 w-4" />
          Live data
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatCard icon={<Sparkles className="h-4 w-4" />} label="Hot picks" value="New arrivals" />
        <StatCard icon={<Heart className="h-4 w-4" />} label="Favorites" value={`${favoritesCount} saved`} />
        <StatCard icon={<Tag className="h-4 w-4" />} label="Categories" value={`${categoriesCount}+ curated`} />
      </div>
    </header>
  )
}

export default PageHero
