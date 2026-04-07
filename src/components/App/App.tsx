import { useState, useEffect } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import toast, { Toaster } from 'react-hot-toast';

import Pagination from '../ReactPaginate/Pagination';
import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';

import { fetchMovies } from '../../services/movieService';
import type { TMDBResponse } from '../../services/movieService';
import type { Movie } from '../../types/movie';

import css from './App.module.css';

export default function App() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isLoading, isError, isSuccess } = useQuery<TMDBResponse>({
    queryKey: ['movies', searchTerm, page],
    queryFn: () => fetchMovies(searchTerm, page),
    enabled: searchTerm !== '',
    placeholderData: keepPreviousData,
  });

  const movies: Movie[] = data?.results || [];
  const totalPages: number = data?.total_pages || 0;

  useEffect(() => {
    if (isSuccess && searchTerm !== '' && movies.length === 0) {
      toast.error("No movies found for your request.");
    }
    if (isError) {
      toast.error("An error occurred while fetching movies.");
    }
    if (!isLoading && searchTerm !== '' && movies.length === 0) {
      toast.error("No movies found for your request.");
    }
  }, [isError, isLoading, isSuccess, movies.length, searchTerm]);

  const handleSearch = (query: string) => {
    setSearchTerm(query);
    setPage(1);
  };

  return (
    <div className={css.app}>
      <Toaster position="top-right" />
      <SearchBar onSubmit={handleSearch} />
      
      {isError && <ErrorMessage />}
      
      {isLoading && movies.length === 0 && <Loader />}
      
      {movies.length > 0 && !isError && (
        <>
          {totalPages > 1 && (
            <Pagination 
              pageCount={totalPages > 500 ? 500 : totalPages}
              forcePage={page}
              onPageChange={(nextPage: number) => setPage(nextPage)}
            />
          )}
          <MovieGrid movies={movies} onSelect={setSelectedMovie} />
        </>
      )}

      {selectedMovie && (
        <MovieModal 
          movie={selectedMovie} 
          onClose={() => setSelectedMovie(null)} 
        />
      )}
    </div>
  );
}