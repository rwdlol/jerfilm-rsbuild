import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { MediaItem, ActiveRoute } from '../types';
import { searchMulti } from '../services/tmdb';
import { MediaCard } from '../components/MediaCard';
import { SEO } from '../components/SEO';

interface SearchViewProps {
  initialQuery?: string;
  onRouteChange: (route: ActiveRoute) => void;
  isInWatchlist: (id: number, type: 'movie' | 'tv') => boolean;
  onToggleWatchlist: (e: React.MouseEvent, media: MediaItem, type: 'movie' | 'tv') => void;
}

export const SearchView: React.FC<SearchViewProps> = ({
  initialQuery = '',
  onRouteChange,
  isInWatchlist,
  onToggleWatchlist,
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [filter, setFilter] = useState<'all' | 'movie' | 'tv'>('all');
  const [results, setResults] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const data = await searchMulti(query.trim());
        const filtered = (data.results || []).filter(
          (item) => item.media_type === 'movie' || item.media_type === 'tv'
        );
        setResults(filtered);
      } catch (err) {
        console.error('Search failed:', err);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  const displayResults = results.filter((item) => {
    if (filter === 'movie') return item.media_type === 'movie' || item.title;
    if (filter === 'tv') return item.media_type === 'tv' || item.name;
    return true;
  });

  return (
    <div className="pt-20 pb-24 max-w-7xl mx-auto px-4 sm:px-6">
      <SEO
        title={query ? `ئەنجامەکانی گەڕان بۆ "${query}"` : "گەڕان لە فیلم و زنجیرەکان"}
        description={`گەڕان لە هەزاران فیلم، زنجیرە و ئەکتەر لە مالپەڕی Jerfilm.VIP بە ژێرنووسی کوردی.`}
      />
      {/* Search Input Hero Header */}
      <div className="max-w-3xl mx-auto my-6 text-center">
        <h1 className="text-2xl sm:text-3xl font-black text-white font-display mb-2 flex items-center justify-center gap-2">
          <Search className="w-7 h-7 text-amber-400" />
          <span>گەڕان</span>
        </h1>
        <p className="text-xs text-zinc-400 mb-6">
          لە هەزاران فیلم، زنجیرە و ئەکتەر بگەڕێ
        </p>

        {/* Input Field - RTL aware */}
        <div className="relative">
          <Search className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ناوی فیلم، زنجیرە یان ئەکتەر بنووسە..."
            className="w-full bg-zinc-900 border-2 border-zinc-800 focus:border-amber-400 rounded-2xl pr-12 pl-10 py-3.5 text-sm sm:text-base text-white placeholder-zinc-500 focus:outline-none transition-all shadow-xl"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        {results.length > 0 && (
          <div className="flex items-center justify-center gap-2 mt-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filter === 'all'
                  ? 'bg-amber-400 text-zinc-950 shadow'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white'
              }`}
            >
              هەموو ئەنجامەکان ({results.length})
            </button>
            <button
              onClick={() => setFilter('movie')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filter === 'movie'
                  ? 'bg-amber-400 text-zinc-950 shadow'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white'
              }`}
            >
              فیلمەکان
            </button>
            <button
              onClick={() => setFilter('tv')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filter === 'tv'
                  ? 'bg-amber-400 text-zinc-950 shadow'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white'
              }`}
            >
              زنجیرەکان
            </button>
          </div>
        )}
      </div>

      {/* Results Container */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-zinc-400">تکایە چاوەڕێ بکە... گەڕان</span>
        </div>
      ) : !query.trim() ? (
        <div className="py-16 text-center text-zinc-500 text-xs">
          وشەیەکی گەڕان لە سەرەوە بنووسە بۆ دۆزینەوەی فیلم و زنجیرەکان.
        </div>
      ) : displayResults.length === 0 ? (
        <div className="py-16 text-center text-zinc-400 text-xs bg-zinc-900/40 rounded-2xl border border-zinc-800 p-8 max-w-md mx-auto">
          هیچ ئەنجامێک بۆ "{query}" نەدۆزرایەوە. تکایە لە دروستی وشەکان دڵنیا ببەرەوە.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 mt-6">
          {displayResults.map((item) => {
            const type: 'movie' | 'tv' =
              item.media_type === 'tv' || item.first_air_date ? 'tv' : 'movie';
            return (
              <MediaCard
                key={`${type}-${item.id}`}
                media={item}
                mediaTypeOverride={type}
                onRouteChange={onRouteChange}
                isInWatchlist={isInWatchlist(item.id, type)}
                onToggleWatchlist={onToggleWatchlist}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

