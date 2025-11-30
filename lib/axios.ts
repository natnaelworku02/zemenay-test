import axios from 'axios'
import type { AxiosRequestHeaders } from 'axios'

const instance = axios.create({
  baseURL: 'https://dummyjson.com',
  timeout: 10000,
})

instance.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth:accessToken')
    if (token) {
      const existingHeaders = config.headers as AxiosRequestHeaders | undefined
      config.headers = {
        ...(existingHeaders || {}),
        Authorization: `Bearer ${token}`,
      } as AxiosRequestHeaders
    }
  }
  return config
})

export default instance
