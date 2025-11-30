import { notFound } from "next/navigation"

import ProductDetailShell from "@/components/product-detail-shell"
import type { Product } from "@/types"

async function getProduct(id: string): Promise<Product> {
  const res = await fetch(`https://dummyjson.com/products/${id}`, {
    next: { revalidate: 0 },
  })

  if (res.status === 404) {
    notFound()
  }

  if (!res.ok) {
    throw new Error("Failed to fetch product")
  }

  return res.json()
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-50">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10 sm:px-8">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Product detail</p>
          <h1 className="text-3xl font-semibold">{product.title}</h1>
        </div>
        <ProductDetailShell product={product} />
      </div>
    </div>
  )
}
