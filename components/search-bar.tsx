"use client"

import React from "react"
import { Search } from "lucide-react"

import { cn } from "@/lib/utils"

type SearchBarProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

function SearchBar({ value, onChange, placeholder, className }: SearchBarProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl border border-border/70 bg-background px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-ring/60 transition-all",
        className
      )}
    >
      <Search className="h-5 w-5 text-muted-foreground" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Search products"}
        className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Clear
        </button>
      )}
    </div>
  )
}

export default SearchBar
