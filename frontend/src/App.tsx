import { Navbar } from '@/components/navbar';
import { MovieCard } from './components/MovieCard';
import { trendingMovies, watchlistMovies } from '@/data/mockdata';
function App() {

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <section>
          <h2 className="text-2xl font-bold mb-4">Trending Now</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {trendingMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Your Watchlist</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {watchlistMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
