import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { MediaItem, ActiveRoute } from '../types';
import { MediaCard } from './MediaCard';
import { tToSorani } from '../utils/translate';

interface MediaSliderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  items: MediaItem[];
  mediaTypeOverride?: 'movie' | 'tv';
  onRouteChange: (route: ActiveRoute) => void;
  isInWatchlist?: (id: number, type: 'movie' | 'tv') => boolean;
  onToggleWatchlist?: (e: React.MouseEvent, media: MediaItem, type: 'movie' | 'tv') => void;
  onSeeAll?: () => void;
}

export const MediaSlider: React.FC<MediaSliderProps> = ({
  title,
  subtitle,
  icon,
  items,
  mediaTypeOverride,
  onRouteChange,
  isInWatchlist,
  onToggleWatchlist,
  onSeeAll,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.75;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <section className="my-6">
      {/* Slider Header */}
      <div className="flex items-center justify-between mb-3 px-4 sm:px-6">
        <div className="flex items-center gap-2">
          {icon && <div className="text-amber-400">{icon}</div>}
          <div>
            <h2 className="text-sm sm:text-base md:text-lg font-black text-white tracking-tight flex items-center gap-2 font-display">
              {tToSorani(title)}
            </h2>
            {subtitle && (
              <p className="text-[11px] text-zinc-400 font-normal">{tToSorani(subtitle)}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onSeeAll && (
            <button
              onClick={onSeeAll}
              className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors py-1 px-2.5 rounded-lg hover:bg-zinc-900 border border-transparent hover:border-zinc-800"
            >
              <span>بینینی هەمووی</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          )}

          <div className="hidden sm:flex items-center gap-1 ltr" dir="ltr">
            <button
              onClick={() => scroll('left')}
              className="p-1.5 rounded-lg bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800/90 transition-all active:scale-95"
              title="چەپ"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-1.5 rounded-lg bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800/90 transition-all active:scale-95"
              title="ڕاست"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Scroll Area */}
      <div
        ref={scrollRef}
        className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-none px-4 sm:px-6 py-2 snap-x snap-mandatory scroll-smooth"
      >
        {items.map((media) => {
          const type: 'movie' | 'tv' =
            mediaTypeOverride ||
            (media.media_type === 'tv' || media.first_air_date ? 'tv' : 'movie');
          const inWatchlist = isInWatchlist ? isInWatchlist(media.id, type) : false;

          return (
            <div
              key={`${type}-${media.id}`}
              className="flex-none w-[140px] sm:w-[170px] md:w-[190px] snap-start"
            >
              <MediaCard
                media={media}
                mediaTypeOverride={type}
                onRouteChange={onRouteChange}
                isInWatchlist={inWatchlist}
                onToggleWatchlist={onToggleWatchlist}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
};

