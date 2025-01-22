import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setSearchResponse } from '@/store/search/searchSlice'
import { MovieSearchResponse } from '@/types'

const BACKEND_API_URL = import.meta.env.VITE_BACKEND_API_URL

interface SearchParams {
  query: string
  includeAdult: boolean
}

export const useSearch = () => {
  const dispatch = useDispatch()
  const queryClient = useQueryClient()

  const { mutate: handleSearch, isPending } = useMutation({
    mutationFn: async ({ query, includeAdult }: SearchParams) => {
      const response = await axios.get<MovieSearchResponse>(`${BACKEND_API_URL}/movies/search`, {
        params: {
          query,
          include_adult: includeAdult,
        },
      })
      return response.data
    },
    onSuccess: (data) => {
      dispatch(setSearchResponse(data))
      queryClient.setQueryData(['movies', 'search'], data)
    },
    onError: (error) => {
      console.error('Search failed:', error)
    },
  })

  return {
    handleSearch,
    isPending,
  }
}