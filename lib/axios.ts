import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://dummyjson.com',
  timeout: 10000,
})

instance.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth:accessToken')
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      }
    }
  }
  return config
})

export default instance
