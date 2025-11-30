import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UIState {
  theme: 'light' | 'dark'
  isAuthenticated: boolean
  user?: { name: string; email: string }
}

const initialState: UIState = {
  theme: 'light',
  isAuthenticated: false,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme(state) {
      state.theme = state.theme === 'light' ? 'dark' : 'light'
    },
    setTheme(state, action: PayloadAction<'light' | 'dark'>) {
      state.theme = action.payload
    },
    login(state, action: PayloadAction<{ name: string; email: string }>) {
      state.isAuthenticated = true
      state.user = action.payload
    },
    register(state, action: PayloadAction<{ name: string; email: string }>) {
      state.isAuthenticated = true
      state.user = action.payload
    },
    logout(state) {
      state.isAuthenticated = false
      state.user = undefined
    },
    hydrateAuth(state, action: PayloadAction<{ user?: { name: string; email: string }; theme?: 'light' | 'dark' }>) {
      if (action.payload.theme) state.theme = action.payload.theme
      if (action.payload.user) {
        state.isAuthenticated = true
        state.user = action.payload.user
      }
    },
  },
})

export const { toggleTheme, setTheme, login, logout, register, hydrateAuth } = uiSlice.actions
export default uiSlice.reducer
