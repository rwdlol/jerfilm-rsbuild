import React, { useState, useEffect } from 'react';
import { Play, Plus, Check, Star, Info } from 'lucide-react';
import { MediaItem, ActiveRoute } from '../types';
import { getImageUrl } from '../services/tmdb';
import { tToSorani } from '../utils/translate';

interface HeroBannerProps {
  items: MediaItem[];
  onRouteChange: (route: ActiveRoute) => void;
  isInWatchlist?: (id: number, type: 'movie' | 'tv') => boolean;
  onToggleWatchlist?: (e: React.MouseEvent, media: MediaItem, type: 'movie' | 'tv') => void;
  onPlayTrailer?: (media: MediaItem, type: 'movie' | 'tv') => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  items,
  onRouteChange,
  isInWatchlist,
  onToggleWatchlist,
  onPlayTrailer,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!items || items.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.min(items.length, 5));
    }, 8000);
    return () => clearInterval(interval);
  }, [items]);

  if (!items || items.length === 0) return null;

  const currentMedia = items[currentIndex];
  const type: 'movie' | 'tv' =
    currentMedia.media_type === 'tv' || currentMedia.first_air_date
      ? 'tv'
      : 'movie';

  const title =
    currentMedia.title ||
    currentMedia.name ||
    currentMedia.original_title ||
    currentMedia.original_name ||
    'تایبەتمەند';
  const year = (
    currentMedia.release_date ||
    currentMedia.first_air_date ||
    ''
  ).substring(0, 4);
  const rating = currentMedia.vote_average
    ? currentMedia.vote_average.toFixed(1)
    : 'N/A';
  const backdropUrl = getImageUrl(
    currentMedia.backdrop_path || currentMedia.poster_path,
    'original'
  );

  const inWatchlist = isInWatchlist
    ? isInWatchlist(currentMedia.id, type)
    : false;

  const handleWatchNow = () => {
    if (type === 'movie') {
      onRouteChange({ mode: 'watch-movie', id: currentMedia.id });
    } else {
      onRouteChange({ mode: 'watch-tv', id: currentMedia.id, season: 1, episode: 1 });
    }
  };

  const handleMoreInfo = () => {
    if (type === 'movie') {
      onRouteChange({ mode: 'movie-detail', id: currentMedia.id });
    } else {
      onRouteChange({ mode: 'tv-detail', id: currentMedia.id });
    }
  };

  return (
    <div className="relative w-full h-[65vh] min-h-[420px] max-h-[600px] overflow-hidden bg-zinc-950">
      {/* Background Backdrop Image */}
      <div className="absolute inset-0">
        <img
          src={backdropUrl}
          alt={title}
          className="w-full h-full object-cover object-center transition-all duration-1000 ease-in-out scale-105"
        />
        {/* Multilayered Gradient Masks for Content Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-l from-zinc-950 via-zinc-950/80 to-transparent w-full md:w-3/4" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto h-full px-4 sm:px-6 flex flex-col justify-end pb-10">
        <div className="max-w-2xl space-y-3 text-right">
          {/* Tag Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-amber-400 text-zinc-950 font-black text-[10px] tracking-wider uppercase px-2.5 py-0.5 rounded-md shadow-md">
              تایبەتمەند • {type === 'movie' ? 'فیلم' : 'زنجیرە'}
            </span>
            <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-md border border-white/10 text-xs font-bold text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{rating} TMDB</span>
            </div>
            {year && (
              <span className="text-xs text-zinc-300 font-medium bg-black/40 px-2 py-0.5 rounded-md border border-white/5">
                {year}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white font-display tracking-tight line-clamp-2 drop-shadow-lg">
            {title}
          </h1>

          {/* Overview */}
          <p className="text-xs sm:text-sm text-zinc-300 font-normal line-clamp-2 sm:line-clamp-3 leading-relaxed max-w-xl drop-shadow">
            {currentMedia.overview || 'هیچ کورتەیەک بەردەست نییە بۆ ئەم بەرهەمە.'}
          </p>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 pt-2 flex-wrap">
            <button
              onClick={handleWatchNow}
              className="px-5 py-2.5 sm:px-6 sm:py-3 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-lg shadow-amber-400/20 flex items-center gap-2 group transform active:scale-95"
            >
              <Play className="w-4 h-4 fill-zinc-950 group-hover:scale-110 transition-transform" />
              <span>پەخشکردنی دەستبەجێ</span>
            </button>

            <button
              onClick={handleMoreInfo}
              className="px-4 py-2.5 sm:px-5 sm:py-3 bg-zinc-900/90 hover:bg-zinc-800 text-white font-semibold text-xs sm:text-sm rounded-xl border border-zinc-700/80 transition-all flex items-center gap-2 backdrop-blur-md"
            >
              <Info className="w-4 h-4 text-zinc-300" />
              <span>زانیاری زیاتر</span>
            </button>

            {onToggleWatchlist && (
              <button
                onClick={(e) => onToggleWatchlist(e, currentMedia, type)}
                className={`p-2.5 sm:p-3 rounded-xl border transition-all ${
                  inWatchlist
                    ? 'bg-amber-400/20 border-amber-400/50 text-amber-400'
                    : 'bg-zinc-900/90 border-zinc-700/80 text-zinc-300 hover:text-white hover:bg-zinc-800'
                }`}
                title={inWatchlist ? 'لابردن لە لیست' : 'زیادکردن بۆ لیست'}
              >
                {inWatchlist ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-3 left-4 sm:left-6 flex items-center gap-1.5 z-20">
          {items.slice(0, 5).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all ${
                idx === currentIndex
                  ? 'w-6 bg-red-500 shadow-sm shadow-red-500'
                  : 'w-2 bg-zinc-700 hover:bg-zinc-500'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

