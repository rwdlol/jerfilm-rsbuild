import { Link } from 'react-router';
import { SEO } from '../components/SEO';
import { useTMDB, type Movie, type TMDBResponseList } from '../utils/tmdb';

export default function Home() {
  const [data, loading, error] = useTMDB<TMDBResponseList<Movie>>(
    '/trending/movie/day',
  );

  if (loading) return <div>Loading trending movies...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="content">
      <SEO title="Home | JerFilm.VIP" description="Welcome to JerFilm.VIP" />

      <section>
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {data?.results.map((movie: Movie) => (
            <Link
              to={`/movie/${movie.id}`}
              key={movie.id}
              className="relative flex flex-col w-full h-full rounded-2xl border border-zinc-800"
            >
              <img
                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                className="w-full h-full object-cover rounded-2xl"
                alt={movie.title}
              />
              <div className="absolute inset-0 flex items-end justify-center text-center rounded-2xl p-2 pb-4 bg-linear-to-b from-black/0 via-black/40 to-black text-white">
                {movie.title}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
