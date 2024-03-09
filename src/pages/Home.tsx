import React, { useState, useEffect } from 'react';
import { CgSearch } from 'react-icons/cg';
import { Input } from 'components/Input';
import { MovieResult, MovieResultType } from 'components/MovieResult';
import { useOmdbApi } from 'hooks/useOmdbApi';

export const HomePage = () => {
  const [searchVal, setSearchVal] = useState<string>('');
  const { omdbRes, searchOmdb } = useOmdbApi();
  const [watchedShows, setWatchedShows] = useState<MovieResultType[]>([]);

  useEffect(() => {
    const storedWatchedShows = localStorage.getItem('watchedShows');
    if (storedWatchedShows) {
      setWatchedShows(JSON.parse(storedWatchedShows));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchVal(e.target.value);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchOmdb(searchVal);
  };

  const handleAddToWatchedShows = (show: MovieResultType) => {
    // Check if the show is already in watchedShows
    if (!watchedShows.some((s) => s.imdbID === show.imdbID)) {
      const updatedWatchedShows = [show, ...watchedShows.slice(0, 2)];
      setWatchedShows(updatedWatchedShows);

      localStorage.setItem('watchedShows', JSON.stringify(updatedWatchedShows));
    }
  };

  return (
    <section className='p-4'>
      <h3 className='mt-32 mb-12 text-center text-2xl font-semibold'>Search for a movie or show</h3>
      <div className='relative mb-10 text-black'>
        <form onSubmit={handleSearch}>
          <Input value={searchVal} onChange={handleChange} placeholder='The Last Of Us...' big />
          <button type='submit'>
            <CgSearch size='30' className={`${searchVal ? 'text-slate-800' : 'text-slate-400'} absolute right-5 top-3.5`} />
          </button>
        </form>
      </div>

      {/* Last 3 watched shows */}
      {watchedShows.length > 0 && (
        <>
          <h3 className='text-2xl font-semibold mb-4'>Last Watched</h3>
          <div className="grid grid-cols-3 gap-4 mb-8">
            {watchedShows.map((show) => (
              <MovieResult key={show.imdbID} {...show} />
            ))}
          </div>
        </>
      )}

      {/* Conditional rendering of Search Results title */}
      {omdbRes && omdbRes.length > 0 && (
        <h3 className='text-2xl font-semibold mb-4'>Search Results</h3>
      )}

      {/* Search results */}
      <div>
        {omdbRes && (
          <div>
            {omdbRes
              .filter((item): item is MovieResultType => item.Type === 'movie' || item.Type === 'series')
              .map((movie) => (
                <MovieResult
                  key={movie.imdbID}
                  {...movie}
                  onClick={() => handleAddToWatchedShows(movie)} // Pass the show to the click handler
                />
              ))}
          </div>
        )}
      </div>
    </section>
  );
};
