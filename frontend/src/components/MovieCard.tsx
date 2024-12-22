import React from 'react';
import { Movie } from '@/store/search/searchSlice';
import { Link } from 'react-router-dom';

interface MovieCardProps {
    movie: Movie;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
    return (
        <Link to={`/movie/${movie.id}`} className="block">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <img src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`} alt={movie.title ? movie.title : 'movie'} className="w-full h-48 object-cover" />
                <div className="p-4">
                    <h3 className="font-semibold text-lg truncate">{movie.title}</h3>
                    <div className="flex items-center mt-1">
                        <svg className="h-4 w-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-sm">{movie.popularity?.toFixed(1)}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};