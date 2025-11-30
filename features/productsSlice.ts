import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { Product } from '../types'
import {
  createProductApi,
  deleteProductApi,
  fetchProductsApi,
  updateProductApi,
} from '@/lib/api/products'

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
    const res = await fetchProductsApi({ limit, skip, q, category })
    return { ...res, query: q, category }
  }
)

export const createProduct = createAsyncThunk(
  'products/create',
  async (payload: Omit<Product, 'id'>) => {
    const res = await createProductApi(payload)
    return res
  }
)

export const updateProduct = createAsyncThunk(
  'products/update',
  async ({ id, data }: { id: number; data: Omit<Product, 'id'> }) => {
    const res = await updateProductApi(id, data)
    return res
  }
)

export const deleteProduct = createAsyncThunk('products/delete', async (id: number) => {
  await deleteProductApi(id)
  return id
})

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

const PRODUCTS_CACHE_KEY = 'products:cache'

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    hydrateProducts(state, action: PayloadAction<Partial<ProductsState>>) {
      state.items = action.payload.items ?? state.items
      state.total = action.payload.total ?? state.total
      state.skip = action.payload.skip ?? state.skip
      state.limit = action.payload.limit ?? state.limit
      state.query = action.payload.query ?? state.query
      state.category = action.payload.category ?? state.category
    },
    addProductLocal(state, action: PayloadAction<Product>) {
      state.items.unshift(action.payload)
    },
    updateProductLocal(state, action: PayloadAction<Product>) {
      const idx = state.items.findIndex((p) => p.id === action.payload.id)
      if (idx >= 0) state.items[idx] = action.payload
    },
    removeProductLocal(state, action: PayloadAction<number>) {
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
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(
            PRODUCTS_CACHE_KEY,
            JSON.stringify({
              items: s.items,
              total: s.total,
              skip: s.skip,
              limit: s.limit,
              query: s.query,
              category: s.category,
            })
          )
        } catch {
          // ignore cache write errors
        }
      }
    })
    builder.addCase(fetchProducts.rejected, (s, action) => {
      s.loading = false
      s.error = action.error?.message
    })
    builder.addCase(createProduct.fulfilled, (s, action) => {
      s.items.unshift(action.payload)
    })
    builder.addCase(updateProduct.fulfilled, (s, action) => {
      const idx = s.items.findIndex((p) => p.id === action.payload.id)
      if (idx >= 0) s.items[idx] = action.payload
    })
    builder.addCase(deleteProduct.fulfilled, (s, action) => {
      s.items = s.items.filter((p) => p.id !== action.payload)
    })
  },
})

export const { hydrateProducts, addProductLocal, updateProductLocal, removeProductLocal } = productsSlice.actions
export default productsSlice.reducer
