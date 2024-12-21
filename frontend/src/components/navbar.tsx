"use client"

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Link, useNavigate } from 'react-router-dom'
import { Toggle } from "@/components/ui/toggle"
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setSearchResponse } from '@/store/search/searchSlice'


interface NavbarProps {
  isLoggedIn: boolean;
  onLogout: () => void;
}



export const Navbar: React.FC<NavbarProps> = ({ isLoggedIn, onLogout }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdult, setIsAdult] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  

  const handleToggleAdult = (checked: boolean) => {
    setIsAdult(checked);
    console.log('Adult content:', checked);
  }


  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    axios.get('http://localhost:8000/api/v1/movies/search', {
      params: {
        query: searchQuery,
        include_adult: isAdult,
      },
    })
      .then(response => {
        console.log(response.data)
        dispatch(setSearchResponse(response.data));
      })
      .catch(error => {
        console.error(error);
      });
    console.log('Searching for:', searchQuery);
    navigate('/search');
  };

  const handleAuthAction = () => {
    if (isLoggedIn) {
      onLogout();
      navigate('/');
    } else {
      navigate('/login');
    }
  };



  return (
    <nav className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold">MovieStream</Link>
          </div>
          <div className="flex-1 flex justify-center px-2 lg:ml-6 lg:justify-end">
            <Toggle className='mr-4' onPressedChange={handleToggleAdult}>Adult</Toggle>
            <div className="max-w-lg w-full lg:max-w-xs">
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="search"
                  placeholder="Search movies..."
                  className="block w-full pr-10 pl-3 py-2 border border-transparent rounded-md leading-5 bg-gray-700 text-gray-300 placeholder-gray-400 focus:outline-none focus:bg-white focus:text-gray-900 sm:text-sm transition duration-150 ease-in-out"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </button>
              </form>
            </div>
          </div>
          <div>
            <button
              onClick={handleAuthAction}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
            >
              {isLoggedIn ? 'Logout' : 'Login / Signup'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}