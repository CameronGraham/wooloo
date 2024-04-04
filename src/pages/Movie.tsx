import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Select } from 'components/Select';
import { useOmdbApi, MovieSearchType } from 'hooks/useOmdbApi';

const WATCHED_TIMER = 1000 * 60 * 10; // 10 minutes

export const Movie = () => {
  const { movieId } = useParams();
  const { omdbRes, getById, getByIdAndSeason, episodes } = useOmdbApi(); // Assuming the episodes data is available

  const [searchParams, setSearchParams] = useSearchParams();
  // eslint-disable-next-line
  const [watchedStatusState, setWatchedStatusState] = useState<{ [key: string]: string }>({});
  const [selectedProvider, setSelectedProvider] = useState<string>('vidsrc.to');

  const movie = omdbRes?.[0];

  const providers: Record<string, string | { url: string; format?: string }> = {
    'vidsrc.to': {url: 'https://vidsrc.to/embed', format: '{type}/{video_id}/{s}/{e}'},
    'vidsrc.me': {url: 'https://vidsrc.me/embed', format: '{type}/{video_id}/{s}/{e}'},
    'superembed.stream': { url: 'https://multiembed.mov', format: '?video_id={video_id}&s={s}&e={e}' },
    // Add other providers here
  };
// eslint-disable-next-line
  const handleChangeProvider = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProvider(e.target.value);
  };
// eslint-disable-next-line
  const setWatchedStatus = (status: string) => {
    const season = searchParams.get('s') ?? 1;
    const episode = searchParams.get('e') ?? 1;

    if (movieId && movie?.Type === 'series') {
      const watchedState = localStorage.getItem(movieId);
      const watched = watchedState ? JSON.parse(watchedState) : {};

      const seasonInfo = watched[season] ?? {};
      seasonInfo[episode] = !(seasonInfo[episode] ?? false); // Invert the watched status

      watched[season] = seasonInfo;

      localStorage.setItem(movieId, JSON.stringify(watched));

      // Update the watched status for the current episode
      setWatchedStatusState((prevStatus) => {
        const updatedStatus = { ...prevStatus };
        updatedStatus[episode] = seasonInfo[episode] ? 'Watched' : 'Not Watched';
        return updatedStatus;
      });
    }
  };

  useEffect(() => {
    if (movieId) {
      getById(movieId);
    }
  }, [movieId]);

  useEffect(() => {
    let watchedTimeout: string | number | NodeJS.Timeout | undefined;

    if (movieId && searchParams.get('s')) {
      getByIdAndSeason(movieId, searchParams.get('s') ?? '1');
    }

    if (searchParams.get('s') && searchParams.get('e')) {
      const currentStatus = renderWatchedStatus(); // Get the current watched status
      watchedTimeout = setTimeout(() => {
        setWatchedStatus(currentStatus); // Pass the current status to setWatchedStatus
      }, WATCHED_TIMER);
    }

    return () => clearTimeout(watchedTimeout);
  }, [searchParams]);

  useEffect(() => {
    if (movie?.Type === 'series') {
      searchParams.set('s', '1');
      searchParams.set('e', '1');
      setSearchParams(searchParams);
    }
  }, [omdbRes]);

  const handleSeriesInfo = (key: string) => (e: React.ChangeEvent<HTMLSelectElement>) => {
    searchParams.set(key, e.target.value);
    setSearchParams(searchParams);
  };

  const renderPlayer = (movie: MovieSearchType) => {
    let vidUrl = '';

    const provider = providers[selectedProvider];
    

    if (movie.Type === 'series') {
      const season = searchParams.get('s');
      const episode = searchParams.get('e');
      const type = 'tv';
      if (!season || !episode) {
        return null;
      }

      if (typeof provider === 'string') {
        vidUrl = `${provider}/${type}/${movie.imdbID}/${season}/${episode}`;
      } else {
        vidUrl = `${provider.url}/${provider.format ?? ''}`;
        vidUrl = vidUrl.replace('{video_id}', movie.imdbID)
                       .replace('{s}', season)
                       .replace('{e}', episode)
                       .replace('{type}', type);
      }
    } else if (movie.Type === 'movie') {
      const type = 'movie';
      if (typeof provider === 'string') {
        vidUrl = `${provider}/${movie.imdbID}`;
      } else {
        vidUrl = `${provider.url}/${provider.format ?? ''}`;
        vidUrl = vidUrl.replace('{video_id}', movie.imdbID)
                      .replace('{s}', '')
                      .replace('{e}', '')
                      .replace('{type}', type);
      }
     
    }

    return (
      <div className='relative mt-4 h-0 overflow-hidden' style={{ paddingBottom: '56.25%' }}>
        <iframe
          sandbox = "allow-forms allow-pointer-lock allow-same-origin allow-scripts allow-top-navigation"
          width='853'
          height='480'
          src={vidUrl}
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
          allowFullScreen
          title='Embedded Video' className='absolute left-0 h-full w-full'
          />
        </div>
      );
    };
  
    const renderWatchedStatus = () => {
      const watchedState = localStorage.getItem(movieId ?? '');
      const watched = watchedState ? JSON.parse(watchedState) : {};
  
      if (!watched) {
        return 'Not Watched';
      }
  
      const season = searchParams.get('s') ?? 1;
      const episode = searchParams.get('e') ?? 1;
  
      const isWatched = watched[season]?.[episode];
  
      return isWatched ? 'Watched' : 'Not Watched';
    };
  
    const isEpisodeWatched = (episodeNumber: number): boolean => {
      const watchedState = localStorage.getItem(movieId ?? '');
      const watched = watchedState ? JSON.parse(watchedState) : {};
  
      if (!watched) {
        return false;
      }
  
      const season = searchParams.get('s') ?? 1;
      const episode = episodeNumber.toString();
  
      return watched[season]?.[episode];
    };
  
    if (!movie) {
      return null;
    }
  
    return (
      <div>
        <h3 className='mb-8 text-3xl flex'>
          {movie.Title} <span className='text-base uppercase text-slate-400 ml-2'>({movie.Type})</span>
        </h3>
        {movie.Type === 'series' && (
          <div>
            <div className='flex items-center flex-wrap'>
              <div className='flex items-center mx-2 py-2'>
                <div className='mr-2'>Season: </div>
                <Select
                  value={searchParams.get('s') || '1'}
                  options={Array.from({ length: parseInt(movie?.totalSeasons ?? '1') }, (_, i) => ({
                    value: `${i + 1}`,
                  }))}
                  onChange={handleSeriesInfo('s')}
                />
              </div>
              <div className='flex items-center mx-2 py-2'>
                <div className='mr-2'>Episode: </div>
                <Select
                  value={searchParams.get('e') || '1'}
                  options={(episodes || []).map((episode, index) => ({
                    value: `${index + 1}`,
                    label: `${index + 1} - ${episode.Title} (${isEpisodeWatched(index + 1) ? '✔️' : '❌'})`,
                  }))}
                  onChange={handleSeriesInfo('e')}
                />
              </div>
              <div>
                <button
                  className='bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300 pointer'
                  onClick={() => setWatchedStatus(renderWatchedStatus())}
                >
                  {renderWatchedStatus()}
                </button>
              </div>


              <div className='flex items-center ml-auto py-2'>
                <div className='mr-2'>Provider: </div>
                <Select
                  value={selectedProvider}
                  options={[
                    { value: 'vidsrc.to', label: 'vidsrc.to' }, 
                    { value: 'vidsrc.me', label: 'vidsrc.me' },
                    { value: 'superembed.stream', label: 'multiembed.mov' },
                    // Other provider options
                  ]}
                  onChange={(e) => setSelectedProvider(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {movie.Type === 'movie' && (
          <div>
            <div className='flex items-center flex-wrap'>
              <div className='flex items-center ml-auto py-2'>
                <div className='mr-2'>Provider: </div>
                <Select
                  value={selectedProvider}
                  options={[
                    { value: 'vidsrc.to', label: 'vidsrc.to' }, 
                    { value: 'vidsrc.me', label: 'vidsrc.me' },
                    { value: 'superembed.stream', label: 'multiembed.mov' },
                    // Other provider options
                  ]}
                  onChange={(e) => setSelectedProvider(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}
  
        {movie && renderPlayer(movie)}
      </div>
    );
  };
  
  export default Movie;
  
