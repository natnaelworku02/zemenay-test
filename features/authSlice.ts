import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type User = {
  name: string
  email: string
  password: string
}

interface AuthState {
  user?: User
  users: User[]
  error?: string
}

const defaultUsers: User[] = [
  { name: 'Demo User', email: 'demo@example.com', password: 'password123' },
]

function loadUsers(): User[] {
  if (typeof window === 'undefined') return defaultUsers
  try {
    const raw = localStorage.getItem('auth:users')
    if (raw) {
      const parsed = JSON.parse(raw) as User[]
      if (parsed.length) return parsed
    }
  } catch {
    /* ignore */
  }
  return defaultUsers
}

function persistUsers(users: User[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem('auth:users', JSON.stringify(users))
}

function persistUser(user?: User) {
  if (typeof window === 'undefined') return
  if (user) {
    localStorage.setItem('auth:user', JSON.stringify(user))
  } else {
    localStorage.removeItem('auth:user')
  }
}

const initialState: AuthState = {
  user: undefined,
  users: loadUsers(),
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    hydrate(state) {
      state.users = loadUsers()
      if (typeof window !== 'undefined') {
        const raw = localStorage.getItem('auth:user')
        if (raw) state.user = JSON.parse(raw) as User
      }
    },
    register(state, action: PayloadAction<{ name: string; email: string; password: string }>) {
      const exists = state.users.some((u) => u.email.toLowerCase() === action.payload.email.toLowerCase())
      if (exists) {
        state.error = 'Email already registered'
        return
      }
      const newUser: User = {
        name: action.payload.name,
        email: action.payload.email,
        password: action.payload.password,
      }
      state.users.push(newUser)
      state.user = newUser
      state.error = undefined
      persistUsers(state.users)
      persistUser(newUser)
    },
    login(state, action: PayloadAction<{ email: string; password: string }>) {
      const found = state.users.find(
        (u) => u.email.toLowerCase() === action.payload.email.toLowerCase() && u.password === action.payload.password
      )
      if (!found) {
        state.error = 'Invalid credentials'
        return
      }
      state.user = found
      state.error = undefined
      persistUser(found)
    },
    logout(state) {
      state.user = undefined
      state.error = undefined
      persistUser(undefined)
    },
  },
})

export const { hydrate, login, register, logout } = authSlice.actions
export type { User }
export default authSlice.reducer
