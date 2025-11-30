"use client"

import type { FormEvent } from "react"
import { useState } from "react"

import type { Product } from "@/types"
import { Button } from "@/components/ui/button"
import { isURL } from "@/lib/validation"

type ProductFormValues = Omit<Product, "id"> & { id?: number }

type ProductFormProps = {
  initialData?: ProductFormValues
  mode?: "create" | "edit"
  onSubmit: (values: ProductFormValues) => void
  onCancel?: () => void
}

const emptyState: ProductFormValues = {
  title: "",
  description: "",
  price: 0,
  stock: 0,
  brand: "",
  category: "",
  rating: 4.5,
  thumbnail: "",
}

function ProductForm({
  initialData = emptyState,
  mode = "create",
  onSubmit,
  onCancel,
}: ProductFormProps) {
  const [values, setValues] = useState<ProductFormValues>({
    ...emptyState,
    ...initialData,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (
    field: keyof ProductFormValues,
    value: string | number
  ) => {
    setValues((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const nextErrors: Record<string, string> = {}
    if (!values.title.trim()) nextErrors.title = "Title is required"
    if (!values.description?.trim()) nextErrors.description = "Description is required"
    if (!values.category?.trim()) nextErrors.category = "Category is required"
    if (Number.isNaN(values.price) || values.price === null || values.price === undefined) {
      nextErrors.price = "Price is required"
    } else if (values.price < 0) nextErrors.price = "Price must be at least 0"
    if (Number.isNaN(values.stock) || values.stock === null || values.stock === undefined) {
      nextErrors.stock = "Stock is required"
    } else if (values.stock < 0) nextErrors.stock = "Stock must be at least 0"
    if (values.rating !== undefined && values.rating !== null) {
      if (Number.isNaN(values.rating)) nextErrors.rating = "Rating must be a number"
      else if (values.rating < 0 || values.rating > 5) nextErrors.rating = "Rating must be 0-5"
    }
    if (values.thumbnail && !isURL(values.thumbnail)) nextErrors.thumbnail = "Thumbnail must be a valid URL"

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    onSubmit(values)
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm font-medium">
          Title
          <input
            required
            value={values.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/50 dark:bg-slate-900"
          />
          {errors.title ? <span className="text-xs text-destructive">{errors.title}</span> : null}
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium">
          Brand
          <input
            value={values.brand}
            onChange={(e) => handleChange("brand", e.target.value)}
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/50 dark:bg-slate-900"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium">
          Category
          <input
            value={values.category}
            onChange={(e) => handleChange("category", e.target.value)}
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/50 dark:bg-slate-900"
          />
          {errors.category ? <span className="text-xs text-destructive">{errors.category}</span> : null}
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium">
          Thumbnail URL
          <input
            value={values.thumbnail || ""}
            onChange={(e) => handleChange("thumbnail", e.target.value)}
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/50 dark:bg-slate-900"
            placeholder="https://images..."
          />
          {errors.thumbnail ? <span className="text-xs text-destructive">{errors.thumbnail}</span> : null}
        </label>
      </div>

      <label className="flex flex-col gap-2 text-sm font-medium">
        Description
        <textarea
          rows={3}
          value={values.description}
          onChange={(e) => handleChange("description", e.target.value)}
          className="rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/50 dark:bg-slate-900"
        />
        {errors.description ? <span className="text-xs text-destructive">{errors.description}</span> : null}
      </label>
      {errors.description ? <span className="text-xs text-destructive">{errors.description}</span> : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <label className="flex flex-col gap-2 text-sm font-medium">
          Price ($)
          <input
            required
            type="number"
            step="0.01"
            value={values.price}
            onChange={(e) => handleChange("price", Number(e.target.value))}
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/50 dark:bg-slate-900"
            min={0}
          />
          {errors.price ? <span className="text-xs text-destructive">{errors.price}</span> : null}
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium">
          Stock
          <input
            required
            type="number"
            value={values.stock}
            onChange={(e) => handleChange("stock", Number(e.target.value))}
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/50 dark:bg-slate-900"
            min={0}
          />
          {errors.stock ? <span className="text-xs text-destructive">{errors.stock}</span> : null}
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium">
          Rating
          <input
            type="number"
            step="0.1"
            value={values.rating ?? 0}
            onChange={(e) => handleChange("rating", Number(e.target.value))}
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/50 dark:bg-slate-900"
            min={0}
            max={5}
          />
          {errors.rating ? <span className="text-xs text-destructive">{errors.rating}</span> : null}
        </label>
      </div>

      <div className="flex items-center justify-end gap-2">
        {onCancel ? (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
        <Button type="submit">{mode === "edit" ? "Save changes" : "Create product"}</Button>
      </div>
    </form>
  )
}

export default ProductForm
