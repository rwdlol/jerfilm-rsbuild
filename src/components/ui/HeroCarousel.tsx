import React, { useState, useEffect, useRef } from 'react';
import type { Movie } from '../../utils/tmdb';
import { Link } from 'react-router';

interface HeroCarouselProps {
  slides: Movie[];
  autoPlayInterval?: number;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({
  slides,
  autoPlayInterval = 6000,
}) => {
  const [activeIdx, setActiveIdx] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const isMouseDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollLeft, clientWidth } = containerRef.current;
    const index = Math.round(Math.abs(scrollLeft) / clientWidth);

    if (index !== activeIdx && index >= 0 && index < slides.length) {
      setActiveIdx(index);
    }
  };

  const scrollToSlide = (index: number) => {
    if (!containerRef.current) return;
    const slideElement = containerRef.current.children[index] as HTMLElement;
    if (slideElement) {
      containerRef.current.scrollTo({
        left: slideElement.offsetLeft,
        behavior: 'smooth',
      });
    }
  };

  // Autoplay functionality
  useEffect(() => {
    if (slides.length <= 1) return;

    autoPlayTimerRef.current = setInterval(() => {
      const nextIdx = (activeIdx + 1) % slides.length;
      scrollToSlide(nextIdx);
    }, autoPlayInterval);

    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [activeIdx, slides.length, autoPlayInterval]);

  // DOM Mouse Dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    isMouseDownRef.current = true;
    startXRef.current = e.pageX - containerRef.current.offsetLeft;
    scrollLeftRef.current = containerRef.current.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDownRef.current || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.5; // Drag sensitivity
    containerRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    isMouseDownRef.current = false;
  };

  return (
    <div className="relative w-full aspect-video md:aspect-10/4 border border-zinc-900 overflow-hidden select-none rounded-3xl bg-zinc-950">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        className="flex w-full h-full overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar cursor-grab active:cursor-grabbing"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {slides.map((slide) => {
          let imageUrl: string;
          if (slide.backdrop_path) {
            imageUrl =
              'https://image.tmdb.org/t/p/original' + slide.backdrop_path;
          } else {
            if (slide.poster_path) {
              if (slide.poster_path.startsWith('/static/')) {
                imageUrl = slide.poster_path;
              } else {
                imageUrl =
                  'https://image.tmdb.org/t/p/original' + slide.poster_path;
              }
            } else {
              imageUrl =
                'https://placehold.co/780x439/000000/FFFFFF/png?text=No+Image';
            }
          }

          return (
            <div
              key={slide.id}
              className="w-full min-w-full h-full snap-start shrink-0 relative overflow-hidden"
              dir="rtl"
            >
              {/* Slide image backdrop */}
              <img
                src={imageUrl}
                alt={slide.title}
                title={slide.title}
                loading="lazy"
                draggable={false}
                className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-50 md:opacity-75"
              />

              {/* Seamless rich overlays (Vertical and Horizontal RTL Gradients) */}
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-zinc-950/40 to-zinc-950/95" />
              <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-transparent to-transparent opacity-90" />

              {/* Text content details */}
              <div className="relative z-10 max-w-7xl mx-auto h-full px-6 md:px-12 flex items-center">
                <div className="max-w-xl flex flex-col gap-4 w-fit">
                  <h1 className="text-2xl md:text-4xl lg:text-5xl text-white leading-tight drop-shadow-md">
                    {slide.title}
                  </h1>

                  {slide.overview && (
                    <p className="text-sm md:text-sm lg:text-base text-zinc-300 line-clamp-2 md:line-clamp-3 leading-relaxed">
                      {slide.overview}
                    </p>
                  )}

                  {slide.cta_text && slide.cta_link && (
                    <Link
                      to={slide.cta_link}
                      className={`rounded-2xl w-fit font-bold py-2.5 px-6 text-sm transition-all duration-300 shadow-md hover:scale-[1.02] active:scale-95 ${
                        slide.cta_type === 'gold'
                          ? 'text-zinc-950 bg-gold hover:bg-gold/80 shadow-gold/10'
                          : 'bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur-md'
                      }`}
                    >
                      {slide.cta_text}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modern Pill Slide Indicators placed in standard left corner */}
      <div className="absolute bottom-6 left-6 md:left-12 flex gap-2 z-20 pointer-events-auto">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => scrollToSlide(idx)}
            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
              idx === activeIdx
                ? 'w-6 bg-gold'
                : 'w-2 bg-zinc-100/30 hover:bg-zinc-100/60'
            }`}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
