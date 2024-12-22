import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { MovieCard } from '@/components/MovieCard';
import { Movie } from '@/store/search/searchSlice';

const SearchPage: React.FC = () => {
  const searchResponse = useSelector((state: RootState) => state.search);
  console.log(searchResponse);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <section>
        <h2 className="text-2xl font-bold mb-4">Search Results</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {searchResponse.results?.map((movie: Movie) => (
                <MovieCard key={movie.id} movie={movie} />
            ))}
        </div>
    </section>
    </div>
  );
};

export default SearchPage;