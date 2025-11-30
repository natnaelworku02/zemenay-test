import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { Product } from '../types'

interface FavoritesState {
  items: Product[]
}

const initialState: FavoritesState = { items: [] }

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    hydrateFavorites(state, action: PayloadAction<Product[]>) {
      state.items = action.payload
    },
    toggleFavorite(state, action: PayloadAction<Product>) {
      const exists = state.items.find((p) => p.id === action.payload.id)
      if (exists) {
        state.items = state.items.filter((p) => p.id !== action.payload.id)
      } else {
        state.items.push(action.payload)
      }
    },
    clearFavorites(state) {
      state.items = []
    },
  },
})

export const { hydrateFavorites, toggleFavorite, clearFavorites } = favoritesSlice.actions
export default favoritesSlice.reducer
