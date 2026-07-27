import React, { useState, useEffect, useRef } from 'react';
import type { Movie } from '../../utils/tmdb';

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

  // Autoplay
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
    <div
      dir="ltr"
      className="relative w-full h-auto aspect-12/6 border border-zinc-800 overflow-hidden select-none"
    >
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
        {slides.map((slide) => (
          <div
            key={slide.id}
            className="w-full min-w-full h-full snap-start shrink-0 relative overflow-hidden"
          >
            <img
              src={`https://image.tmdb.org/t/p/w780${slide.backdrop_path || slide.poster_path}`}
              alt={slide.title}
              title={slide.title}
              loading="lazy"
              fetchPriority="auto"
              draggable={false}
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />

            <div className="absolute inset-0 bg-linear-to-r from-zinc-950/90 via-zinc-950/50 to-transparent" />
            <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-transparent to-transparent opacity-90" />

            <div className="relative z-10 max-w-7xl mx-auto h-full px-6 md:px-12 flex items-center">
              <div className="max-w-xl">
                <span className="inline-block px-3 py-1 mb-3 text-sm bg-zinc-100/10 border border-zinc-100/20 rounded-full text-zinc-100 backdrop-blur-md">
                  testing
                </span>
                <h1 className="text-2xl md:text-4xl mb-3 text-zinc-100 leading-tight drop-shadow">
                  {slide.title}
                </h1>
                <p className="hidden md:block text-base text-gray-300 mb-6 line-clamp-3 leading-relaxed">
                  {slide.overview}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-4 inset-x-0 flex justify-end px-4 gap-2 z-20 pointer-events-auto">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => scrollToSlide(idx)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              idx === activeIdx
                ? 'w-8 bg-zinc-100'
                : 'w-2.5 bg-zinc-100/40 hover:bg-zinc-100/70'
            }`}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
