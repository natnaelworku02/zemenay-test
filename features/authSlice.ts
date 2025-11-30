import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from '@/lib/axios'

export interface AuthUser {
  id: number
  username: string
  email: string
  firstName?: string
  lastName?: string
}

type LoginResponse = AuthUser & {
  accessToken: string
  refreshToken: string
}

type RefreshResponse = {
  accessToken: string
  refreshToken: string
}

interface AuthState {
  user?: AuthUser
  accessToken?: string
  refreshToken?: string
  loading: boolean
  error?: string
}

const initialState: AuthState = {
  loading: false,
}

export const login = createAsyncThunk(
  'auth/login',
  async ({ username, password }: { username: string; password: string }) => {
    const res = await axios.post('/auth/login', {
      username,
      password,
      expiresInMins: 30,
    })
    return res.data as LoginResponse
  }
)

export const refreshSession = createAsyncThunk('auth/refresh', async () => {
  const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('auth:refreshToken') : undefined
  const res = await axios.post('/auth/refresh', {
    refreshToken: refreshToken || undefined,
    expiresInMins: 30,
  })
  return res.data as RefreshResponse
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    hydrateAuth(state, action: PayloadAction<{ accessToken?: string; refreshToken?: string; user?: AuthUser }>) {
      if (action.payload.accessToken) state.accessToken = action.payload.accessToken
      if (action.payload.refreshToken) state.refreshToken = action.payload.refreshToken
      if (action.payload.user) state.user = action.payload.user
    },
    logout(state) {
      state.user = undefined
      state.accessToken = undefined
      state.refreshToken = undefined
      state.loading = false
      state.error = undefined
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth:accessToken')
        localStorage.removeItem('auth:refreshToken')
        localStorage.removeItem('auth:user')
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => {
      state.loading = true
      state.error = undefined
    })
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false
      state.user = action.payload
      state.accessToken = action.payload.accessToken
      state.refreshToken = action.payload.refreshToken
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth:accessToken', state.accessToken || '')
        localStorage.setItem('auth:refreshToken', state.refreshToken || '')
        localStorage.setItem('auth:user', JSON.stringify(state.user))
      }
    })
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message
    })
    builder.addCase(refreshSession.fulfilled, (state, action) => {
      state.accessToken = action.payload.accessToken
      state.refreshToken = action.payload.refreshToken
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth:accessToken', state.accessToken || '')
        localStorage.setItem('auth:refreshToken', state.refreshToken || '')
      }
    })
  },
})

export const { hydrateAuth, logout } = authSlice.actions
export default authSlice.reducer
