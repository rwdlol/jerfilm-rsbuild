import { Link } from 'react-router';
import { useTMDB, type Serie, type TMDBResponseList } from '../../utils/tmdb';
import { ChevronLeft, Play, Star } from 'lucide-react';

export default function TrendingSeries() {
  const [data, loading, error] =
    useTMDB<TMDBResponseList<Serie>>('/trending/tv/week');

  if (loading)
    return (
      <div className="text-zinc-500 text-sm p-6">بارکردنی زنجیرەی ترێند...</div>
    );
  if (error)
    return (
      <div className="text-red-500 text-sm p-6">
        هەڵەیەک ڕوویدا: {error.message}
      </div>
    );

  return (
    <section className="flex flex-col w-full h-fit py-6" dir="rtl">
      <div className="flex flex-col gap-4">
        {/* Header section with hover slide effect */}
        <div className="flex flex-row justify-between gap-2 items-center px-1">
          <h2 className="text-xl font-bold text-white tracking-tight">
            زنجیرەی ترێند لەم هەفتەیەدا
          </h2>
          <Link
            to="/tv"
            className="flex items-center gap-1 transition-all duration-300 hover:gap-2 text-sm text-zinc-400 hover:text-gold"
          >
            <span>بینینی زیاتر</span>
            <ChevronLeft size={16} />
          </Link>
        </div>

        {/* Clean, smooth horizontal slider */}
        <div className="w-full h-fit flex flex-row gap-4 overflow-x-auto pb-4 pt-1 scrollbar-none snap-x snap-mandatory">
          {data?.results.map((serie: Serie) => {
            if (serie.adult) return null;
            return (
              <Link
                to={`/tv/${serie.id}`}
                key={serie.id}
                title={serie.name}
                className="group relative flex flex-col w-36 sm:w-44 shrink-0 snap-start transition-all duration-300"
              >
                {/* Poster image & hover action effects */}
                <div className="relative w-full aspect-2/3 rounded-2xl overflow-hidden border border-zinc-900 bg-zinc-950 shadow-md group-hover:border-zinc-700/50 group-hover:shadow-lg group-hover:shadow-gold/10 transition-all duration-350">
                  <img
                    src={`https://image.tmdb.org/t/p/w300${serie.poster_path}`}
                    alt={serie.name}
                    title={serie.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Subtle dark gradient overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />

                  {/* Play Button hover pop-up effect */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
                    <div className="w-12 h-12 rounded-full bg-gold text-zinc-950 flex items-center justify-center font-bold shadow-xl shadow-gold/20 scale-90 group-hover:scale-100 transition-transform duration-300">
                      {/* Play Icon adjusted slightly for alignment */}
                      <Play
                        size={20}
                        fill="currentColor"
                        stroke="currentColor"
                        className="translate-x-[1.5px]"
                      />
                    </div>
                  </div>

                  {/* Transparent Star Rating Badge */}
                  {serie.vote_average && (
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1 text-xs bg-zinc-950/75 backdrop-blur-md border border-zinc-800/80 text-white p-1.5 px-2 rounded-xl font-bold">
                      <Star size={12} fill="gold" stroke="gold" />
                      <span>{serie.vote_average.toFixed(1)}</span>
                    </div>
                  )}
                </div>

                {/* Serie Titles & Metadata */}
                <div className="flex flex-col gap-0.5 mt-2.5 px-1">
                  <h3 className="text-sm font-bold text-zinc-200 group-hover:text-gold transition-colors duration-200 truncate leading-tight">
                    {serie.name}
                  </h3>
                  {serie.first_air_date && (
                    <p className="text-xs text-zinc-500">
                      {new Date(serie.first_air_date).getFullYear()}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
