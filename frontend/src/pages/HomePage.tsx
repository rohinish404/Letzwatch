import { MovieCard } from '@/components/MovieCard';
// import { MovieDetails } from '@/components/MovieDetailsCard';
import { Movie } from '@/types';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { SkeletonCard } from '@/components/SkeletonCard';
import api from '@/api';
interface HomePageProps {
    isLoggedIn: boolean;
}

const HomePage: React.FC<HomePageProps> = ({ isLoggedIn }) => {
    const [trending, setTrending] = useState<Movie[]>([]);
    const [watchlist, setWatchlist] = useState<Movie[]>([]);
    // const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

    // const handleSelectMovie = (movie: Movie) => {
    //     setSelectedMovie(movie);
    // };
    // const handleCloseDetails = () => {
    //     setSelectedMovie(null);
    // };

    useEffect(() => {
        axios.get('http://localhost:8000/api/v1/movies/trending/week')
            .then(response => {
                setTrending(response.data?.results);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    useEffect(() => {
        api.get('movies/watchlist/all')
            .then(async response => {
                const movieIds = response.data.movies;
                const detailsPromises = movieIds.map((movieId: number) =>
                    axios.get(`http://localhost:8000/api/v1/movies/${movieId}`)
                );

                const detailsResponses = await Promise.all(detailsPromises);
                const movies = detailsResponses.map(res => res.data);
                setWatchlist(movies);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    return (
        <div>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <section>
                    <h2 className="text-2xl font-bold mb-4">Trending Now</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {trending.map((movie) => (
                            <MovieCard key={movie.id} movie={movie} />
                        ))}
                    </div>
                </section>

                <section className="mt-12">
                    <h2 className="text-2xl font-bold mb-4">Your Watchlist</h2>
                    {isLoggedIn ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {watchlist.map((movie) => (
                                <MovieCard key={movie.id} movie={movie} />
                            ))}
                        </div>
                    ) : (
                        <div>
                            <p className="text-gray-600 mb-4">Please log in to see your watchlist.</p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {[...Array(5)].map((_, index) => (
                                    <SkeletonCard key={index} />
                                ))}
                            </div>
                        </div>
                    )}
                </section>
                {/* {selectedMovie && (
                    <MovieDetails movie={selectedMovie} />
                )} */}
            </main>
        </div>
    )
}
export default HomePage