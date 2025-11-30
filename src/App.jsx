import { useState } from 'react';
import MovieCard from './components/MovieCard';
import MovieDetailsModal from './components/MovieDetailsModal'; 
import './App.css';

const API_KEY = import.meta.env.VITE_OMDB_API_KEY;
const API_BASE_URL = `http://www.omdbapi.com/?apikey=${API_KEY}`;

const fetchMovieDetails = async (imdbID) => {
    try {
        const response = await fetch(`${API_BASE_URL}&i=${imdbID}&plot=short`);
        if (!response.ok) throw new Error(`Detail fetch failed for ID: ${imdbID}`);
        
        const data = await response.json();
        return data;
    } catch (e) {
        console.error(`Error fetching details for ${imdbID}:`, e);
        return { imdbID, Title: 'Detail Error', Plot: 'Details could not be loaded.' };
    }
};

function App() {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [selectedMovie, setSelectedMovie] = useState(null); 
  
  const handleCardClick = (movie) => {
    setSelectedMovie(movie);
  };

  const handleModalClose = () => {
    setSelectedMovie(null);
  };

  const searchMovies = async (title) => {
    if (!title.trim()) {
        setError("Please enter a search term.");
        setMovies([]);
        return;
    }

    setLoading(true);
    setError(null);
    setMovies([]);

    try {
      if (!API_KEY || API_KEY === '[YOUR_OMDB_API_KEY]') {
          throw new Error("API Key not configured. Please check your .env file.");
      }

      const searchResponse = await fetch(`${API_BASE_URL}&s=${title}`);
      
      if (!searchResponse.ok) throw new Error(`Network error! Status: ${searchResponse.status}`);

      const searchData = await searchResponse.json();

      if (searchData.Response === 'True' && searchData.Search) {
        
        const uniqueMovies = Array.from(new Map(searchData.Search.map(item => [item.imdbID, item])).values());

        const detailedMoviePromises = uniqueMovies.map(movie => 
            fetchMovieDetails(movie.imdbID)
        );
        
        const detailedMovies = await Promise.all(detailedMoviePromises);
        
        setMovies(detailedMovies);
      } else {
        setError(searchData.Error || `Could not find any movies matching "${title}".`);
      }
    } catch (e) {
      console.error("Fetching error:", e);
      setError(e.message || 'An unexpected error occurred during search.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchMovies(searchTerm);
    }
  };

  return (
    <div className="app">
      <h1 className="website-title">CinePaw</h1>
      
      <div className="search">
        <input
          placeholder="Search for movies"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button onClick={() => searchMovies(searchTerm)} disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {loading && <div className="status-message">Loading movies...</div>}
      {error && <div className="status-message error-message">❌ {error}</div>}
      
      {!loading && !error && movies.length > 0 && (
        <div className="container">
          {movies.map((movie) => (
            <MovieCard 
              key={movie.imdbID} 
              movie={movie} 
              onMovieClick={handleCardClick} 
            />
          ))}
        </div>
      )}
      
      {!loading && !error && movies.length === 0 && (
        <div className="status-message">
          <h2>Type a title and click Search to begin your cinematic journey!</h2>
        </div>
      )}

      {selectedMovie && (
        <MovieDetailsModal 
          movie={selectedMovie} 
          onClose={handleModalClose} 
        />
      )}
    </div>
  );
}

export default App;