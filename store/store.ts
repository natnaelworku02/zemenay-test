import { configureStore } from '@reduxjs/toolkit'
import productsReducer from '@/features/productsSlice'
import favoritesReducer from '@/features/favoritesSlice'
import uiReducer from '@/features/uiSlice'

export const store = configureStore({
  reducer: {
    products: productsReducer,
    favorites: favoritesReducer,
    ui: uiReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
