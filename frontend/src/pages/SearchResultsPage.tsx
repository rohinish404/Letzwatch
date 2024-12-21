import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

const SearchPage: React.FC = () => {
  const searchResponse = useSelector((state: RootState) => state.search);
  console.log(searchResponse);

  return (
    <div>
      <h1>Search Results</h1>
      <ul>
      </ul>
    </div>
  );
};

export default SearchPage;