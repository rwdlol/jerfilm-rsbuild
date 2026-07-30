import React from 'react';
import { Star, Play, Bookmark, BookmarkCheck } from 'lucide-react';
import { MediaItem, ActiveRoute } from '../types';
import { getImageUrl } from '../services/tmdb';
import { tToSorani } from '../utils/translate';

interface MediaCardProps {
  media: MediaItem;
  mediaTypeOverride?: 'movie' | 'tv';
  onRouteChange: (route: ActiveRoute) => void;
  isInWatchlist?: boolean;
  onToggleWatchlist?: (e: React.MouseEvent, media: MediaItem, type: 'movie' | 'tv') => void;
  aspectRatio?: 'poster' | 'backdrop';
}

export const MediaCard: React.FC<MediaCardProps> = ({
  media,
  mediaTypeOverride,
  onRouteChange,
  isInWatchlist = false,
  onToggleWatchlist,
  aspectRatio = 'poster',
}) => {
  const type: 'movie' | 'tv' =
    mediaTypeOverride ||
    (media.media_type === 'tv' || media.first_air_date ? 'tv' : 'movie');

  const title = media.title || media.name || media.original_title || media.original_name || 'بێ ناونیشان';
  const year = (media.release_date || media.first_air_date || '').substring(0, 4);
  const rating = media.vote_average ? media.vote_average.toFixed(1) : 'N/A';

  const imagePath = aspectRatio === 'poster' ? media.poster_path : (media.backdrop_path || media.poster_path);
  const imageUrl = getImageUrl(imagePath, aspectRatio === 'poster' ? 'w500' : 'w780');

  const handleClick = () => {
    if (type === 'movie') {
      onRouteChange({ mode: 'movie-detail', id: media.id });
    } else {
      onRouteChange({ mode: 'tv-detail', id: media.id });
    }
  };

  const handleWatchNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (type === 'movie') {
      onRouteChange({ mode: 'watch-movie', id: media.id });
    } else {
      onRouteChange({ mode: 'watch-tv', id: media.id, season: 1, episode: 1 });
    }
  };

  return (
    <div
      onClick={handleClick}
      className="group relative bg-zinc-900/90 rounded-xl overflow-hidden border border-zinc-800/80 hover:border-amber-400/80 transition-all duration-300 hover:shadow-lg hover:shadow-amber-400/10 cursor-pointer flex flex-col h-full"
    >
      {/* Poster / Backdrop Image Container */}
      <div className={`relative w-full overflow-hidden bg-zinc-950 ${aspectRatio === 'poster' ? 'aspect-[2/3]' : 'aspect-[16/9]'}`}>
        <img
          src={imageUrl}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between z-10 pointer-events-none">
          <div className="flex items-center gap-1 bg-black/70 backdrop-blur-md px-1.5 py-0.5 rounded-md border border-white/10 text-[10px] font-bold text-amber-400">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{rating}</span>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-[9px] font-black uppercase tracking-wider bg-amber-400 text-zinc-950 px-1.5 py-0.5 rounded-md border border-amber-300 shadow-sm">
              {type === 'movie' ? 'فیلم' : 'زنجیرە'}
            </span>

            {onToggleWatchlist && (
              <button
                onClick={(e) => onToggleWatchlist(e, media, type)}
                className={`pointer-events-auto p-1 rounded-md backdrop-blur-md transition-all ${
                  isInWatchlist
                    ? 'bg-amber-400 text-zinc-950 shadow-md font-bold'
                    : 'bg-black/70 hover:bg-black/90 text-zinc-300 hover:text-white border border-white/10'
                }`}
                title={isInWatchlist ? 'لابردن لە لیست' : 'زیادکردن بۆ لیست'}
              >
                {isInWatchlist ? (
                  <BookmarkCheck className="w-3.5 h-3.5" />
                ) : (
                  <Bookmark className="w-3.5 h-3.5" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Play Button Hover Effect */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[2px]">
          <button
            onClick={handleWatchNow}
            className="w-10 h-10 rounded-full bg-amber-400 hover:bg-amber-300 text-zinc-950 flex items-center justify-center shadow-lg shadow-amber-400/30 transform group-hover:scale-100 scale-75 transition-all font-bold"
            title="پەخشکردن"
          >
            <Play className="w-4 h-4 fill-zinc-950" />
          </button>
        </div>
      </div>

      {/* Media Details Footer */}
      <div className="p-2.5 flex flex-col justify-between flex-1 bg-zinc-900/90">
        <div>
          <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1">
            {title}
          </h3>
          <div className="flex items-center gap-1.5 mt-0.5 text-[10px] sm:text-[11px] text-zinc-400 font-medium">
            {year && <span>{year}</span>}
            {year && <span>•</span>}
            <span>{type === 'movie' ? 'فیلم' : 'زنجیرە'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

