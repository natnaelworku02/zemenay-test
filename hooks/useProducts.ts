import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchProducts } from '../features/productsSlice'

export function useProducts(limit = 10, skip = 0) {
  const dispatch = useAppDispatch()
  const state = useAppSelector((s) => s.products)

  useEffect(() => {
    // initial fetch; component can call with different limit/skip
    dispatch(fetchProducts({ limit, skip }))
  }, [dispatch, limit, skip])

  return state
}
