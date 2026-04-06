import axios from 'axios';
import type { TMDBResponse } from '../types/movie'; 

const API_TOKEN = import.meta.env.VITE_TMDB_TOKEN;
axios.defaults.baseURL = 'https://api.themoviedb.org/3';

export const fetchMovies = async (query: string, page: number): Promise<TMDBResponse> => {
  const response = await axios.get<TMDBResponse>('/search/movie', {
    params: {
      query,
      page,
      include_adult: false,
      language: 'en-US',
    },
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      accept: 'application/json',
    },
  });
  
  return response.data;
};