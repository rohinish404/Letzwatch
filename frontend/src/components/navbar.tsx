"use client"

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Link, useNavigate } from 'react-router-dom'
import { Toggle } from "@/components/ui/toggle"
import { useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/hooks/useAuth'
import { useSearch } from '@/hooks/useSearch'
import { debounce } from 'lodash'


export const Navbar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [isAdult, setIsAdult] = useState(false)
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  
  const { isLoggedIn, handleLogout } = useAuth()
  const { handleSearch: executeSearch, isPending } = useSearch()

  const handleToggleAdult = (checked: boolean) => {
    setIsAdult(checked)
    queryClient.invalidateQueries({queryKey: ['movies', 'search']})
  }

  const debouncedSearch = debounce(async (query: string) => {
    if (query.length >= 2) {
      await executeSearch({ query, includeAdult: isAdult })
      navigate('/search')
    }
  }, 300)

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    debouncedSearch(searchQuery)
  }

  const handleAuthAction = () => {
    if (isLoggedIn) {
      handleLogout()
      navigate('/')
    } else {
      navigate('/login')
    }
  }

  return (
    <nav className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold">LetzWatch</Link>
          </div>
          
          <div className="flex-1 flex justify-center px-2 lg:ml-6 lg:justify-end">
            <Toggle 
              pressed={isAdult}
              className="mr-4" 
              onPressedChange={handleToggleAdult}
              aria-label="Toggle adult content"
            >
              Adult
            </Toggle>
            
            <div className="max-w-lg w-full lg:max-w-xs">
              <form onSubmit={handleSearchSubmit} className="relative">
                <Input
                  type="search"
                  placeholder="Search movies..."
                  className="block w-full pr-10 pl-3 py-2 border border-transparent rounded-md leading-5 bg-gray-700 text-gray-300 placeholder-gray-400 focus:outline-none focus:bg-white focus:text-gray-900 sm:text-sm transition duration-150 ease-in-out"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  disabled={isPending}
                  aria-label="Search movies"
                />
                <button
                  type="submit"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  disabled={isPending}
                >
                  <svg
                    className={`h-5 w-5 ${isPending ? 'animate-spin text-blue-400' : 'text-gray-400'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </form>
            </div>
          </div>

          <button
            onClick={handleAuthAction}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            {isLoggedIn ? 'Logout' : 'Login / Signup'}
          </button>
        </div>
      </div>
    </nav>
  )
}