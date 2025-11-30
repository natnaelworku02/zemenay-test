import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from '../lib/axios'
import type { Product } from '../types'

interface ProductsState {
  items: Product[]
  loading: boolean
  error?: string
  total?: number
  skip: number
  limit: number
  query?: string
  category?: string
}

export const fetchProducts = createAsyncThunk(
  'products/fetch',
  async ({
    limit = 10,
    skip = 0,
    q,
    category,
  }: { limit?: number; skip?: number; q?: string; category?: string }) => {
    const params = new URLSearchParams()
    params.set('limit', `${limit}`)
    params.set('skip', `${skip}`)
    if (q) params.set('q', q)

    let endpoint = `/products?${params.toString()}`
    if (q) {
      endpoint = `/products/search?${params.toString()}`
    } else if (category && category !== 'all') {
      endpoint = `/products/category/${encodeURIComponent(category)}?${params.toString()}`
    }

    const res = await axios.get(endpoint)
    return { ...res.data, query: q, category }
  }
)

const initialState: ProductsState = {
  items: [],
  loading: false,
  error: undefined,
  total: 0,
  skip: 0,
  limit: 10,
  query: undefined,
  category: 'all',
}

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    addProduct(state, action: PayloadAction<Product>) {
      state.items.unshift(action.payload)
    },
    updateProduct(state, action: PayloadAction<Product>) {
      const idx = state.items.findIndex((p) => p.id === action.payload.id)
      if (idx >= 0) state.items[idx] = action.payload
    },
    removeProduct(state, action: PayloadAction<number>) {
      state.items = state.items.filter((p) => p.id !== action.payload)
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProducts.pending, (s) => {
      s.loading = true
      s.error = undefined
    })
    builder.addCase(fetchProducts.fulfilled, (s, action) => {
      s.loading = false
      const { products, total, skip, limit, query, category } = action.payload
      const isAppend = skip > 0 && s.query === query && s.category === category
      if (Array.isArray(products)) {
        s.items = isAppend ? s.items.concat(products) : products
      }
      s.total = total
      s.skip = skip
      s.limit = limit
      s.query = query
      s.category = category
    })
    builder.addCase(fetchProducts.rejected, (s, action) => {
      s.loading = false
      s.error = action.error?.message
    })
  },
})

export const { addProduct, updateProduct, removeProduct } = productsSlice.actions
export default productsSlice.reducer
