import React, { useState, useEffect } from 'react';
import { Users, Search, Star, Film, Sparkles, ChevronRight, ChevronLeft } from 'lucide-react';
import { ActiveRoute, Person } from '../types';
import { getPopularPersons, getImageUrl } from '../services/tmdb';
import { SEO } from '../components/SEO';

interface ActorsViewProps {
  onRouteChange: (route: ActiveRoute) => void;
}

export const ActorsView: React.FC<ActorsViewProps> = ({ onRouteChange }) => {
  const [actors, setActors] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterQuery, setFilterQuery] = useState('');

  useEffect(() => {
    fetchActors(page);
  }, [page]);

  const fetchActors = async (p: number) => {
    setLoading(true);
    try {
      const res = await getPopularPersons(p);
      if (res && res.results) {
        setActors(res.results);
        setTotalPages(Math.min(res.total_pages || 1, 50));
      }
    } catch (err) {
      console.error("Error fetching popular actors:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredActors = filterQuery.trim()
    ? actors.filter((a) =>
        a.name.toLowerCase().includes(filterQuery.toLowerCase())
      )
    : actors;

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-in fade-in duration-300">
      <SEO
        title="ئەکتەران - کۆکراوەی ئەکتەرە ناودارەکانی جیهان"
        description="دۆزینەوەی هەموو فیلم و زنجیرەکانی ئەکتەرە بەناوبانگەکانی جیهان لە Jerfilm.VIP."
        type="profile"
        keywords={["ئەکتەران", "هونەرمەندان", "ئەکتەرە بەناوبانگەکان", "Jerfilm"]}
      />
      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-bold mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>ئەکتەرە ناودارەکانی جیهان</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white font-display">
            کۆکراوەی ئەکتەران و هونەرمەندان
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            دۆزینەوەی فیلم و زنجیرەکانی ئەکتەرە خۆشەویستەکانت
          </p>
        </div>

        {/* Filter Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="فلتەرکردنی ناو..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pr-10 pl-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* Actors Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
          {[...Array(18)].map((_, i) => (
            <div key={i} className="aspect-[3/4] bg-zinc-900 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filteredActors.length === 0 ? (
        <div className="text-center py-20 bg-zinc-900/50 rounded-3xl border border-zinc-800">
          <Users className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
          <p className="text-sm font-bold text-zinc-300">هیچ ئەکتەرێک نەدۆزرایەوە</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
          {filteredActors.map((actor) => {
            const profileUrl = getImageUrl(actor.profile_path, 'w500');
            const knownForTitles = actor.known_for
              ? actor.known_for.map((k) => k.title || k.name).filter(Boolean).slice(0, 2).join('، ')
              : '';

            return (
              <div
                key={actor.id}
                onClick={() => onRouteChange({ mode: 'actor-detail', id: actor.id })}
                className="group cursor-pointer bg-zinc-900 border border-zinc-800/90 rounded-2xl overflow-hidden hover:border-amber-400/80 transition-all duration-300 hover:shadow-xl hover:shadow-amber-400/10 flex flex-col justify-between"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-zinc-950">
                  <img
                    src={profileUrl}
                    alt={actor.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80" />
                  <div className="absolute top-2 right-2 bg-amber-400/90 text-zinc-950 text-[10px] font-black px-2 py-0.5 rounded-md shadow-md">
                    {actor.known_for_department || 'ئەکتەر'}
                  </div>
                </div>

                <div className="p-3 text-right">
                  <h3 className="text-xs sm:text-sm font-bold text-white line-clamp-1 group-hover:text-amber-400 transition-colors">
                    {actor.name}
                  </h3>
                  {knownForTitles && (
                    <p className="text-[10px] text-zinc-400 mt-1 line-clamp-1 font-medium">
                      ناودار بە: {knownForTitles}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {!loading && totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-3">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <span className="text-xs font-bold text-zinc-400 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800">
            لاپەڕە {page} لە {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};
