import React from 'react';

const MovieDetailsModal = ({ movie, onClose }) => {
  if (!movie) return null;

  const hasPoster = movie.Poster && 
                    movie.Poster !== 'N/A' && 
                    movie.Poster.startsWith('http');

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        <button className="modal-close-btn" onClick={onClose}>
          &times;
        </button>

        <div className="modal-details">
          <div className="modal-poster-container">
            {hasPoster ? (
              <img src={movie.Poster} alt={movie.Title} className="modal-poster" />
            ) : (
              <div className="no-image-placeholder modal-placeholder">NO IMAGE</div>
            )}
          </div>

          <div className="modal-info">
            <h2 className="modal-title">{movie.Title}</h2>
            
            {movie.Released && movie.Released !== 'N/A' && (
                <p className="modal-release-date">
                    Released: {movie.Released}
                </p>
            )}

            <p className="modal-sub-meta">
                {movie.Genre && movie.Genre !== 'N/A' && (
                    <span className="detail-genre">{movie.Genre}</span>
                )}
                {movie.Runtime && movie.Runtime !== 'N/A' && (
                    <span className="detail-runtime"> | {movie.Runtime}</span>
                )}
                {movie.Language && movie.Language !== 'N/A' && (
                    <span className="detail-language"> | {movie.Language}</span>
                )}
            </p>

            <div className="modal-ratings-box">
                {movie.Rated && movie.Rated !== 'N/A' && (
                    <span className="detail-rating-text">Rating: {movie.Rated}  |</span>
                )}
                {movie.imdbRating && movie.imdbRating !== 'N/A' && (
                    <span className="detail-imdb">IMDb: {movie.imdbRating} / 10</span>
                )}
            </div>

            <h3 className="section-title">Plot</h3>
            <p className="modal-plot-full">{movie.Plot || 'No plot description available.'}</p>
            
            <h3 className="section-title">Key Personnel</h3>
            {(movie.Director !== 'N/A' || movie.Writer !== 'N/A' || movie.Producer !== 'N/A') ? (
                <ul className="personnel-list">
                    {movie.Director && movie.Director !== 'N/A' && (
                        <li><strong>Director:</strong> {movie.Director}</li>
                    )}
                    {movie.Writer && movie.Writer !== 'N/A' && (
                        <li><strong>Writer:</strong> {movie.Writer}</li>
                    )}
                    {movie.Producer && movie.Producer !== 'N/A' && (
                        <li><strong>Producer:</strong> {movie.Producer}</li>
                    )}
                </ul>
            ) : (
                <p className="detail-cast">Personnel information not available.</p>
            )}
            
            <h3 className="section-title">Cast</h3>
            <p className="detail-cast">{movie.Actors || 'Cast information not available.'}</p>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailsModal;