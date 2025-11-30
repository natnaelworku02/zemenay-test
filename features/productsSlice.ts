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
}

export const fetchProducts = createAsyncThunk(
  'products/fetch',
  async ({ limit = 10, skip = 0 }: { limit?: number; skip?: number }) => {
    const res = await axios.get(`/products?limit=${limit}&skip=${skip}`)
    return res.data
  }
)

const initialState: ProductsState = {
  items: [],
  loading: false,
  error: undefined,
  total: 0,
  skip: 0,
  limit: 10,
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
      // append new results (supports pagination/scroll)
      if (Array.isArray(action.payload.products)) {
        s.items = s.items.concat(action.payload.products)
      }
      s.total = action.payload.total
      s.skip = action.payload.skip
      s.limit = action.payload.limit
    })
    builder.addCase(fetchProducts.rejected, (s, action) => {
      s.loading = false
      s.error = action.error?.message
    })
  },
})

export const { addProduct, updateProduct, removeProduct } = productsSlice.actions
export default productsSlice.reducer
