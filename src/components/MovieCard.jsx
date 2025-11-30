import React from 'react';

const MovieCard = ({ movie, onMovieClick }) => {
  const hasPoster = movie.Poster && 
                    movie.Poster !== 'N/A' && 
                    movie.Poster.startsWith('http');

  return (
    <div className="movie-card" onClick={() => onMovieClick(movie)}> 
      <div className="card-image">
        {hasPoster ? (
          <img src={movie.Poster} alt={movie.Title} />
        ) : (
          <div className="no-image-placeholder">
            NO IMAGE
          </div>
        )}
      </div>
      <div className="card-info">
        <div className="card-meta-row">
            <span className="movie-type">{movie.Type}</span>
            {movie.Rated && movie.Rated !== 'N/A' && (
                 <span className="movie-rating-text">Rated: {movie.Rated}</span>
            )}
        </div>
        
        <h3 className="movie-title">{movie.Title}</h3>
        <p className="movie-year">({movie.Year})</p>
        
        <div className="card-metadata-fixed-height">
            {movie.Released && movie.Released !== 'N/A' && (
                <p className="movie-released-date">Released: {movie.Released}</p>
            )}

            <div className="card-genre-runtime">
                {movie.Genre && movie.Genre !== 'N/A' && (
                    <span className="movie-genre">{movie.Genre.split(',')[0]}</span>
                )}
                {movie.Runtime && movie.Runtime !== 'N/A' && (
                    <span className="movie-runtime">{movie.Runtime}</span>
                )}
            </div>

            {movie.imdbRating && movie.imdbRating !== 'N/A' && (
                <p className="movie-imdb-rating">IMDb: {movie.imdbRating} / 10</p>
            )}
            
            {movie.Language && movie.Language !== 'N/A' && (
                <p className="movie-language">Language: {movie.Language.split(',')[0]}</p>
            )}
        </div>
        
      </div>
    </div>
  );
};

export default MovieCard;