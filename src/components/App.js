import { useState } from "react";
import { useMovies } from "../hooks/useMovies";
import Loader from "./Loader";
import ErrorMessage from "./ErrorMessage";
import NavBar from "./NavBar";
import Search from "./Search";
import NumResults from "./NumResults";
import Main from "./Main";
import Box from "./Box";
import MovieList from "./MovieList";
import WatchedMovieList from "./WatchedMovieList";
import MovieDetails from "./MovieDetails";
import WatchedSummary from "./WatchedSummary";
import { useLocalStorageState } from "../hooks/useLocalStorageState";

export const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export const KEY = "57f91a9b";

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const { movies, isLoading, error } = useMovies(query);

  const [watched, setWatched] = useLocalStorageState([], "watched");

  function handleSelectMovie(id) {
    setSelectedId((selectedId) => (selectedId === id ? null : id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);

    // localStorage.setItem("watched", JSON.stringify([...watched, movie]));
  }

  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        {movies.length >= 1 && <NumResults movies={movies}></NumResults>}
      </NavBar>

      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>

        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched}></WatchedSummary>
              <WatchedMovieList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              ></WatchedMovieList>
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
