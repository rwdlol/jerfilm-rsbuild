import { Link } from 'react-router';
import { useTMDB, type Serie, type TMDBResponseList } from '../../utils/tmdb';
import { ChevronLeft, Play } from 'lucide-react';

export default function TrendingSeries() {
  const [data, loading, error] =
    useTMDB<TMDBResponseList<Serie>>('/trending/tv/week');

  if (loading) return <div>Loading trending series...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <section className="flex flex-col w-full h-fit py-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-row justify-between gap-2 items-center">
          <h2 className="text-lg">زنجیرەی ترێند لەم هەفتەیەدا</h2>
          <Link
            to="/tv"
            className="flex items-center gap-0 transition-all duration-300 hover:gap-1 text-sm hover:text-gold opacity-75 hover:opacity-100 hover:underline"
          >
            بینینی زیاتر <ChevronLeft size={18} />
          </Link>
        </div>
        <div className="w-full h-fit flex flex-row gap-4 overflow-y-hidden overflow-auto">
          {data?.results.map((serie: Serie) => {
            if (serie.adult) return null;
            return (
              <Link
                to={`/tv/${serie.id}`}
                key={serie.id}
                title={serie.name}
                className="group relative flex flex-col w-full min-w-44 h-full"
                dir="ltr"
              >
                <div className="relative w-full h-fit">
                  <img
                    src={`https://image.tmdb.org/t/p/w200${serie.poster_path}`}
                    alt={serie.name}
                    title={serie.name}

                    className="block w-full h-auto aspect-2/3 rounded-2xl border border-zinc-800 object-cover object-center"
                  />
                  <div className="group-hover:flex absolute inset-0 hidden items-center justify-center bg-linear-to-b from-zinc-950/0 via-zinc-950/40 to-zinc-950/80">
                    <div className="relative w-12 h-12 rounded-full bg-zinc-900/15 backdrop-blur-2xl flex items-center justify-center font-bold text-center">
                      <Play size={24} fill="white" stroke="white" />
                    </div>
                  </div>
                </div>
                <h3 className="mt-2 mb-1">{serie.name}</h3>
                <p className="text-sm">
                  {new Date(serie.first_air_date).getFullYear()}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
