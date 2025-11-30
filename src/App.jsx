import { useState } from 'react';
import MovieCard from './components/MovieCard';
import MovieDetailsModal from './components/MovieDetailsModal'; 
import './App.css';

const API_KEY = import.meta.env.VITE_OMDB_API_KEY;
const API_BASE_URL = `https://www.omdbapi.com/?apikey=${API_KEY}`;

const fetchMovieDetails = async (imdbID) => {
    try {
        const response = await fetch(`${API_BASE_URL}&i=${imdbID}&plot=full`);
        if (!response.ok) throw new Error(`Detail fetch failed for ID: ${imdbID}`);
        
        const data = await response.json();
        return data;
    } catch (e) {
        console.error(`Error fetching details for ${imdbID}:`, e);
        return { Response: 'False', imdbID, Error: 'Details could not be loaded.' };
    }
};

function App() {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); 
  const [searchYear, setSearchYear] = useState('');
  const [searchType, setSearchType] = useState('');
  const [searchLanguage, setSearchLanguage] = useState(''); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [hasSearched, setHasSearched] = useState(false); 
  
  const [selectedMovie, setSelectedMovie] = useState(null); 
  
  const handleCardClick = (movie) => {
    setSelectedMovie(movie);
  };

  const handleModalClose = () => {
    setSelectedMovie(null);
  };

  const searchMovies = async (title, year, type, language) => {
    if (!title.trim()) {
        setError("Please enter a search term.");
        setMovies([]);
        return;
    }

    setLoading(true);
    setError(null);
    setMovies([]);
    setHasSearched(false); 

    try {
      if (!API_KEY || API_KEY === 'REPLACE_ME') {
          throw new Error("API Key not configured. Please set it in Vercel Environment Variables.");
      }

      let searchUrl = `${API_BASE_URL}&s=${title}`;
      if (year) searchUrl += `&y=${year}`;
      if (type) searchUrl += `&type=${type}`;

      const searchResponse = await fetch(searchUrl);
      
      if (!searchResponse.ok) throw new Error(`Network error! Status: ${searchResponse.status}`);

      const searchData = await searchResponse.json();

      if (searchData.Response === 'True' && searchData.Search) {
        
        const uniqueMovieIds = new Set(searchData.Search.map(item => item.imdbID));
        const uniqueMovies = Array.from(uniqueMovieIds).map(id => searchData.Search.find(item => item.imdbID === id));

        const detailedMoviePromises = uniqueMovies.map(movie => 
            fetchMovieDetails(movie.imdbID)
        );
        
        let detailedMovies = await Promise.all(detailedMoviePromises);
        
        detailedMovies = detailedMovies.filter(movie => movie.Response === 'True');
        
        if (language) {
             const lowerCaseLanguage = language.toLowerCase().trim();
             
             detailedMovies = detailedMovies.filter(movie => {
                 if (!movie.Language || movie.Language === 'N/A') return false;
                 
                 return movie.Language.split(',').some(lang => 
                     lang.trim().toLowerCase() === lowerCaseLanguage
                 );
             });
        }
        
        setMovies(detailedMovies); 
      } else {
        setError(searchData.Error || `Could not find any movies matching "${title}".`);
      }
    } catch (e) {
      console.error("Fetching error:", e);
      setError(e.message || 'An unexpected error occurred during search.');
    } finally {
      setLoading(false);
      setHasSearched(true); 
    }
  };
  
  const handleSearchClick = () => {
    searchMovies(searchTerm, searchYear, searchType, searchLanguage); 
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchClick();
    }
  };

  return (
    <div className="app">
      <h1 className="website-title">CinePaw</h1>
      
      <div className="search-controls">
        <div className="search-main">
          <input
            placeholder="Search for movies by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <button onClick={handleSearchClick} disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        <div className="search-filters">
          <input
            type="number"
            placeholder="Year"
            value={searchYear}
            onChange={(e) => setSearchYear(e.target.value)}
            className="filter-input"
          />
          <input
            type="text"
            placeholder="Language"
            value={searchLanguage}
            onChange={(e) => setSearchLanguage(e.target.value)}
            className="filter-input"
          />
          <select 
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="filter-select"
          >
            <option value="">Type: All</option>
            <option value="movie">Movie</option>
            <option value="series">Series</option>
            <option value="episode">Episode</option>
          </select>
        </div>
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
      
      {!loading && !error && movies.length === 0 && hasSearched && (
        <div className="status-message error-message">
          <h4>❌ Movie not found!</h4>
        </div>
      )}

      {!loading && !error && movies.length === 0 && !hasSearched && (
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