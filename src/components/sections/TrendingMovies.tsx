import { Link } from 'react-router';
import { useTMDB, type Movie, type TMDBResponseList } from '../../utils/tmdb';
import { ChevronLeft, Play, Star } from 'lucide-react';

export default function TrendingMovies() {
  const [data, loading, error] = useTMDB<TMDBResponseList<Movie>>(
    '/trending/movie/week',
  );

  if (loading) return <div>بارکردنی فیلمە ترێند...</div>;
  if (error) return <div>هەڵەیەک ڕوویدا: {error.message}</div>;

  return (
    <section className="flex flex-col w-full h-fit py-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-row justify-between gap-2 items-center">
          <h2 className="text-lg">فیلمە ترێندەکان لەم هەفتەیەدا</h2>
          <Link
            to="/movie"
            className="flex items-center gap-0 transition-all duration-300 hover:gap-1 text-sm hover:text-gold opacity-75 hover:opacity-100"
          >
            بینینی زیاتر <ChevronLeft size={18} />
          </Link>
        </div>
        <div className="w-full h-fit flex flex-row gap-4 overflow-y-hidden overflow-auto">
          {data?.results.map((movie: Movie) => {
            if (movie.adult) return null;
            return (
              <Link
                to={`/movie/${movie.id}`}
                key={movie.id}
                title={movie.title}
                className="group relative flex flex-col w-full min-w-44 h-full"
                dir="ltr"
              >
                <div className="relative w-full h-fit">
                  <img
                    src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                    alt={movie.title}
                    title={movie.title}
                    loading="lazy"
                    fetchPriority="low"
                    className="block w-full h-auto aspect-2/3 rounded-2xl border border-zinc-800 object-cover object-center"
                  />
                  <div className="group-hover:flex absolute inset-0 hidden items-center justify-center bg-linear-to-b from-zinc-950/0 via-zinc-950/40 to-zinc-950/80">
                    <div className="relative w-12 h-12 rounded-full bg-zinc-900/15 backdrop-blur-2xl flex items-center justify-center font-bold text-center">
                      <Play size={24} fill="white" stroke="white" />
                    </div>
                    {movie.vote_average && (
                      <div className="absolute top-2 right-2 flex items-center rounded-full leading-none gap-1 text-sm bg-white/15 backdrop-blur-2xl text-white p-1.5 px-2 font-bold font-rabar21">
                        <Star size={14} fill="gold" stroke="gold" />
                        {movie.vote_average.toFixed(1)}
                      </div>
                    )}
                  </div>
                </div>
                <h3 className="mt-2 mb-1">{movie.title}</h3>
                {movie.release_date && (
                  <p className="text-sm">
                    {new Date(movie.release_date).getFullYear()}
                  </p>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
