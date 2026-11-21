import MovieCard from './MovieCard';

const MovieGrid = ({ movies, onMovieClick }) => {
  return (
    <div className="container">
      {movies.map((movie) => (
        <MovieCard
          key={movie.imdbID}
          movie={movie}
          onMovieClick={onMovieClick}
        />
      ))}
    </div>
  );
};

export default MovieGrid;
