"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

import ProductDetail from "@/components/product-detail"
import ProductForm from "@/components/product-form"
import { toggleFavorite } from "@/features/favoritesSlice"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import axios from "@/lib/axios"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import type { RootState } from "@/store/store"
import type { Product } from "@/types"

function ProductDetailShell({ product }: { product: Product }) {
  const dispatch = useAppDispatch()
  const favorites = useAppSelector((s: RootState) => s.favorites.items)
  const user = useAppSelector((s) => s.auth.user)
  const isFavorite = favorites.some((f) => f.id === product.id)
  const router = useRouter()

  const [editing, setEditing] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [current, setCurrent] = useState<Product>(product)

  const ensureAuth = () => {
    if (!user) {
      router.push("/login")
      return false
    }
    return true
  }

  return (
    <>
      <ProductDetail
        product={current}
        isFavorite={isFavorite}
        onFavorite={(p) => {
          if (!ensureAuth()) return
          dispatch(toggleFavorite(p))
        }}
        onEdit={() => {
          if (!ensureAuth()) return
          setEditing(true)
        }}
        onDelete={() => {
          if (!ensureAuth()) return
          setDeleting(true)
        }}
      />

      <Dialog open={editing} onOpenChange={setEditing}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit product</DialogTitle>
            <DialogDescription>Updates this product using DummyJSON (mock-friendly).</DialogDescription>
          </DialogHeader>
          <ProductForm
            mode="edit"
            initialData={current}
            onSubmit={async (values) => {
              try {
                const res = await axios.put<Product>(`/products/${current.id}`, values)
                setCurrent(res.data)
                toast.success("Product updated")
                setEditing(false)
              } catch (err) {
                const message = err instanceof Error ? err.message : "Failed to update"
                toast.error(message)
              }
            }}
            onCancel={() => setEditing(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={deleting} onOpenChange={setDeleting}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete product?</DialogTitle>
            <DialogDescription>This will call DummyJSON delete and return you to the home page.</DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-end gap-2">
            <Button variant="ghost" onClick={() => setDeleting(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                try {
                  await axios.delete(`/products/${current.id}`)
                  toast.success("Product deleted")
                  setDeleting(false)
                  router.push("/")
                } catch (err) {
                  const message = err instanceof Error ? err.message : "Failed to delete"
                  toast.error(message)
                }
              }}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ProductDetailShell
