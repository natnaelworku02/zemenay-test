import axios from "@/lib/axios"
import type { Product } from "@/types"

export async function fetchProductsApi({
  limit = 10,
  skip = 0,
  q,
  category,
}: {
  limit?: number
  skip?: number
  q?: string
  category?: string
}) {
  const params = new URLSearchParams()
  params.set("limit", `${limit}`)
  params.set("skip", `${skip}`)
  if (q) params.set("q", q)

  let endpoint = `/products?${params.toString()}`
  if (q) {
    endpoint = `/products/search?${params.toString()}`
  } else if (category && category !== "all") {
    endpoint = `/products/category/${encodeURIComponent(category)}?${params.toString()}`
  }

  const res = await axios.get(endpoint)
  return res.data
}

export async function createProductApi(payload: Omit<Product, "id">) {
  const res = await axios.post<Product>("/products/add", payload)
  return res.data
}

export async function updateProductApi(id: number, payload: Omit<Product, "id">) {
  const res = await axios.put<Product>(`/products/${id}`, payload)
  return res.data
}

export async function deleteProductApi(id: number) {
  await axios.delete(`/products/${id}`)
  return id
}

export async function fetchProductByIdApi(id: number | string) {
  const res = await axios.get<Product>(`/products/${id}`)
  return res.data
}
