import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { useTMDB, type TVDetail } from '../utils/tmdb';
import AdultContent from '../components/AdultContent';
import { tToSorani, tToSoraniList } from '../utils/tToSorani';
import NotFound from '../components/NotFound';
import MediaPlayer from '../components/MediaPlayer';

interface Episode {
  id: number;
  name: string;
  overview: string;
  episode_number: number;
  season_number: number;
  still_path: string | null;
  air_date?: string;
  vote_average?: number;
}

interface TVSeasonDetail {
  _id: string;
  air_date: string;
  episodes: Episode[];
  name: string;
  overview: string;
  id: number;
  poster_path: string | null;
  season_number: number;
}

export default function TVDetail() {
  const { tvId } = useParams<{ tvId: string }>();
  const [data, loading, error] = useTMDB<TVDetail>(`/tv/${tvId}`);

  const [selectedSeason, setSelectedSeason] = useState<number | null>(null);
  const [selectedEpisode, setSelectedEpisode] = useState<number | null>(null);
  const [prevTvId, setPrevTvId] = useState<string | undefined>(tvId);

  // Reset selection state if the user navigates to a different TV show
  if (tvId !== prevTvId) {
    setPrevTvId(tvId);
    setSelectedSeason(null);
    setSelectedEpisode(null);
  }

  // Derive the active season and episode from the current selection or the fallback data
  const currentSeason =
    selectedSeason !== null
      ? selectedSeason
      : data?.seasons && data.seasons.length > 0
        ? data.seasons[0].season_number
        : null;

  const currentEpisode =
    selectedEpisode !== null
      ? selectedEpisode
      : currentSeason !== null
        ? 1
        : null;

  // Fetch episodes for the derived active season
  const [seasonDetails, seasonLoading, seasonError] = useTMDB<TVSeasonDetail>(
    tvId && currentSeason !== null
      ? `/tv/${tvId}/season/${currentSeason}`
      : null,
  );

  // Helper to change season and reset active episode to 1
  const handleSeasonChange = (seasonNumber: number) => {
    setSelectedSeason(seasonNumber);
    setSelectedEpisode(1);
  };

  if (loading)
    return <div className="text-zinc-400 p-4">بارکردنی زنجیرە...</div>;

  if (
    error &&
    error.message === 'The resource you requested could not be found.'
  ) {
    return <NotFound />;
  }
  if (error)
    return (
      <div className="text-red-500 p-4">هەڵەیەک ڕوویدا: {error.message}</div>
    );

  if (data?.adult) return <AdultContent />;

  return (
    <div className="flex flex-col w-full gap-6 pb-6">
      {/* 1. Backdrop Path & Top Header section */}
      {data?.backdrop_path && (
        <div className="relative w-full h-48 md:h-80 rounded-2xl overflow-hidden border border-zinc-800">
          <img
            src={`https://image.tmdb.org/t/p/original${data.backdrop_path}`}
            alt={data?.name}
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
        </div>
      )}

      {/* 2. Main Details Section */}
      <section className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 w-full rounded-2xl -mt-16 md:-mt-32">
        <img
          src={`https://image.tmdb.org/t/p/w500${data?.poster_path}`}
          alt={data?.name}
          className="w-full max-w-52 h-auto object-center object-cover rounded-2xl border border-zinc-800 shadow-xl"
        />
        <div className="w-full h-full flex flex-col gap-3 items-center md:items-start text-center md:text-start mt-16 md:mt-32">
          <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start">
            <h1 className="text-3xl font-bold text-white">{data?.name}</h1>
            {data?.status && (
              <span className="bg-zinc-800 text-sm text-zinc-300 px-2.5 py-1 rounded-full border border-zinc-700">
                {tToSorani(data.status)}
              </span>
            )}
          </div>

          {data?.original_name && data.original_name !== data.name && (
            <p className="italic text-lg text-zinc-400">
              {data?.original_name}
            </p>
          )}

          <p className="text-gray-300 max-w-3xl leading-relaxed text-base">
            {data?.overview}
          </p>

          <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-400 justify-center md:justify-start">
            {data?.first_air_date ? (
              <span>یەکەم پەخش: {data.first_air_date}</span>
            ) : null}
            {data?.vote_average ? (
              <>
                <span className="text-zinc-700">|</span>
                <span className="inline-flex items-center gap-1">
                  نمرە: 10/{data.vote_average.toFixed(1)}{' '}
                  {data?.vote_count &&
                    `(${data?.vote_count.toLocaleString('ku-IQ')} دەنگ)`}
                </span>
              </>
            ) : null}
          </div>

          {data?.genres && data.genres.length > 0 ? (
            <div className="flex flex-wrap gap-2 justify-center md:justify-start mt-1">
              {data.genres.map((g) => (
                <span
                  key={g.id}
                  className="bg-zinc-900 border border-zinc-800 text-zinc-300 px-3 py-1 rounded-lg"
                >
                  {tToSorani(g.name)}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      {/* 3. Detailed Metadata Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-zinc-900/30 backdrop-blur-sm border border-zinc-800/80 p-4 rounded-2xl flex flex-col gap-2">
          <h3 className="text-white border-b border-zinc-800/60 pb-2 mb-1">
            زمانەکان
          </h3>
          <p className="text-zinc-400 text-sm">
            <span className="text-zinc-500">زمانی سەرەکی:</span>{' '}
            {data?.original_language
              ? tToSorani(data.original_language)
              : 'نادیار'}
          </p>
          {data?.languages && data.languages.length > 0 && (
            <p className="text-zinc-400 text-sm">
              <span className="text-zinc-500">زمانە بەردەستەکان:</span>{' '}
              {tToSoraniList(data.languages)?.join('، ')}
            </p>
          )}
          {data?.spoken_languages?.english_name && (
            <p className="text-zinc-400 text-sm">
              <span className="text-zinc-500">زمانی قسەکردن:</span>{' '}
              {data.spoken_languages.english_name}
            </p>
          )}
        </div>

        <div className="bg-zinc-900/30 backdrop-blur-sm border border-zinc-800/80 p-4 rounded-2xl flex flex-col gap-2">
          <h3 className="text-white border-b border-zinc-800/60 pb-2 mb-1">
            بەرهەمهێنان و وڵات
          </h3>
          {data?.origin_country && data.origin_country.length > 0 && (
            <p className="text-zinc-400 text-sm">
              <span className="text-zinc-500">وڵاتی بنەڕەتی:</span>{' '}
              {tToSoraniList(data.origin_country)?.join('، ')}
            </p>
          )}
          {data?.production_countries &&
            data.production_countries.length > 0 && (
              <p className="text-zinc-400 text-sm">
                <span className="text-zinc-500">وڵاتانی بەرهەمهێنەر:</span>{' '}
                {data.production_countries
                  .map((c) => tToSorani(c.name))
                  .join('، ')}
              </p>
            )}
          <p className="text-zinc-400 text-sm">
            <span className="text-zinc-500">تەمەنی گونجاو:</span>{' '}
            {data?.adult ? 'سەروو ١٨ ساڵ (+18)' : 'گشتی'}
          </p>
        </div>
      </section>

      {/* 4. Media Player Section */}
      {data?.id && currentSeason !== null && currentEpisode !== null && (
        <section className="flex flex-col" id="player">
          <div className="flex flex-col gap-2 bg-zinc-950 border border-zinc-900 p-4 rounded-3xl shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-gold animate-pulse" />
                سەیرکردنی: سیزۆنی {currentSeason} - ئەڵقەی {currentEpisode}
              </h2>
            </div>
            <MediaPlayer
              type="tv"
              id={data.id}
              s={currentSeason}
              e={currentEpisode}
            />
          </div>
        </section>
      )}

      {/* 5. Seasons & Episodes Section */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col">
          <div className="flex items-center justify-between gap-2 border-b border-zinc-800/60 pb-3 mb-4">
            <h2 className="text-xl font-bold text-white">سیزۆنەکان</h2>
            <p className="text-zinc-400 text-sm">
              {data?.number_of_seasons} سیزۆن، {data?.number_of_episodes} ئەڵقە
            </p>
          </div>

          {/* List the seasons */}
          <div className="flex flex-row flex-nowrap items-center overflow-y-hidden overflow-x-auto gap-3 py-2">
            {data?.seasons?.map((season) => (
              <button
                key={season.id}
                onClick={() => handleSeasonChange(season.season_number)}
                className={`flex flex-col items-start text-start shrink-0 border p-4 rounded-2xl transition-all duration-200 cursor-pointer min-w-44 h-full ${
                  currentSeason === season.season_number
                    ? 'bg-zinc-800 border-zinc-600 text-white shadow-lg scale-98'
                    : 'bg-zinc-900/40 border-zinc-800/80 text-zinc-400 hover:text-white hover:border-zinc-700/60'
                }`}
              >
                <h3 className="font-bold text-sm">
                  سیزۆن {season.season_number}
                </h3>
                <div className="text-sm flex flex-col items-start text-start gap-0.5 mt-1.5 text-zinc-500">
                  <span>{season.episode_count} ئەڵقە</span>
                  {season.air_date ? (
                    <span>پەخش: {new Date(season.air_date).getFullYear()}</span>
                  ) : (
                    <span>پەخش: نادیار</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 6. Clean & Smooth Episode List Section */}
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-bold text-white mb-1">ئەڵقەکان</h3>

          {seasonLoading && (
            <div className="text-zinc-400 text-sm">بارکردنی ئەڵقەکان...</div>
          )}

          {seasonError && (
            <div className="text-red-500 text-sm">
              کێشەیەک لە هێنانی ئەڵقەکاندا دروست بوو: {seasonError.message}
            </div>
          )}

          {!seasonLoading && !seasonError && seasonDetails?.episodes && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {seasonDetails.episodes.map((episode) => {
                const isEpisodeActive =
                  currentEpisode === episode.episode_number;
                return (
                  <div
                    key={episode.id}
                    onClick={() => setSelectedEpisode(episode.episode_number)}
                    className={`group flex flex-col md:flex-row gap-5 p-3.5 rounded-2xl border transition-all duration-300 cursor-pointer ${
                      isEpisodeActive
                        ? 'bg-gold/15 border-gold/80 shadow-md shadow-gold/5'
                        : 'bg-zinc-900/20 hover:bg-zinc-900/40 border-zinc-800 hover:border-zinc-700/60'
                    }`}
                  >
                    {/* Episode Still Image Container */}
                    <div className="relative aspect-video w-full md:w-56 shrink-0 overflow-hidden rounded-xl border border-zinc-800/85 bg-zinc-950">
                      {episode.still_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w300${episode.still_path}`}
                          alt={episode.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-600 bg-zinc-900/50">
                          وێنە بەردەست نییە
                        </div>
                      )}

                      {/* Live playing badge on the active thumbnail */}
                      {isEpisodeActive && (
                        <div className="absolute z-10 inset-0 bg-black/60 flex items-center justify-center backdrop-blur-xs">
                          <Link
                            to={`/tv/${data?.id}#player`}
                            className="bg-gold text-black font-bold px-3 py-1 rounded-full flex items-center gap-1.5 animate-pulse"
                          >
                            لە لایڤدایە
                          </Link>
                        </div>
                      )}

                      {/* Dark subtle overlay inside the image container */}
                      <div className="absolute z-0 inset-0 bg-linear-to-t from-zinc-950/20 to-transparent" />
                    </div>

                    {/* Episode Info Container */}
                    <div className="flex flex-col flex-1 justify-center py-1">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-sm font-bold px-2 py-0.5 rounded-md uppercase border ${
                              isEpisodeActive
                                ? 'text-gold bg-gold/10 border-gold/30'
                                : 'text-zinc-400 bg-zinc-800/50 border-zinc-700/50'
                            }`}
                          >
                            ئەڵقەی {episode.episode_number}
                          </span>
                          <h4
                            className={`font-bold transition-colors duration-300 leading-tight ${
                              isEpisodeActive
                                ? 'text-gold'
                                : 'text-white group-hover:text-gold'
                            }`}
                          >
                            {episode.name}
                          </h4>
                        </div>

                        <div className="flex items-center text-sm gap-2 text-zinc-500">
                          {episode.air_date && (
                            <span>
                              {new Date(episode.air_date).getFullYear()}
                            </span>
                          )}
                          {episode.vote_average && episode.vote_average > 0 ? (
                            <>
                              <span className="text-zinc-800">•</span>
                              <span className="flex items-center gap-0.5 text-gold/90">
                                ★ {episode.vote_average.toFixed(1)}
                              </span>
                            </>
                          ) : null}
                        </div>
                      </div>

                      {episode.overview ? (
                        <p className="text-zinc-400 text-sm leading-relaxed line-clamp-2 md:line-clamp-3">
                          {episode.overview}
                        </p>
                      ) : (
                        <p className="text-zinc-600 italic">
                          کورتە باس بەردەست نییە بۆ ئەم ئەڵقەیە.
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
