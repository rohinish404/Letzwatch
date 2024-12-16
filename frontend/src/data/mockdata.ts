export interface Movie {
    id: number;
    title: string;
    posterUrl: string;
    rating: number;
  }

export const trendingMovies: Movie[] = [
  { id: 1, title: "The Shawshank Redemption", posterUrl: "https://via.placeholder.com/300x400", rating: 9.3 },
  { id: 2, title: "The Godfather", posterUrl: "https://via.placeholder.com/300x400", rating: 9.2 },
  { id: 3, title: "The Dark Knight", posterUrl: "https://via.placeholder.com/300x400", rating: 9.0 },
  { id: 4, title: "12 Angry Men", posterUrl: "https://via.placeholder.com/300x400", rating: 8.9 },
  { id: 5, title: "Schindler's List", posterUrl: "https://via.placeholder.com/300x400", rating: 8.9 },
];

export const watchlistMovies: Movie[] = [
  { id: 6, title: "Pulp Fiction", posterUrl: "https://via.placeholder.com/300x400", rating: 8.9 },
  { id: 7, title: "The Lord of the Rings: The Return of the King", posterUrl: "https://via.placeholder.com/300x400", rating: 8.9 },
  { id: 8, title: "The Good, the Bad and the Ugly", posterUrl: "https://via.placeholder.com/300x400", rating: 8.8 },
];