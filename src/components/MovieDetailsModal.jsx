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
            <p className="modal-meta">
              {movie.Rated && movie.Rated !== 'N/A' && (
                  <span className="modal-rating-badge">{movie.Rated}</span>
              )}
              <span className="modal-type">{movie.Type}</span> | 
              <span className="modal-year"> ({movie.Year})</span>
            </p>
            <p className="modal-plot-full">{movie.Plot || 'No plot description available.'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailsModal;