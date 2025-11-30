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
        <span className="movie-type">{movie.Type}</span>
        {movie.Rated && movie.Rated !== 'N/A' && (
             <span className="movie-rating">{movie.Rated}</span>
        )}
        <h3 className="movie-title">{movie.Title}</h3>
        <p className="movie-year">({movie.Year})</p>
        <p className="movie-plot">{movie.Plot || 'No plot description available.'}</p>
      </div>
    </div>
  );
};

export default MovieCard;