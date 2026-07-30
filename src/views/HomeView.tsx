import React, { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, Flame, Star, Film, Tv } from 'lucide-react';
import { MediaItem, ActiveRoute, Genre } from '../types';
import { SEO } from '../components/SEO';
import { 
  getTrending, 
  getPopularMovies, 
  getPopularTV, 
  getTopRatedMovies, 
  getTopRatedTV, 
  getGenres, 
  discoverMedia 
} from '../services/tmdb';
import { HeroBanner } from '../components/HeroBanner';
import { MediaSlider } from '../components/MediaSlider';
import { Top10Slider } from '../components/Top10Slider';
import { GenrePills } from '../components/GenrePills';
import { MediaCard } from '../components/MediaCard';

interface HomeViewProps {
  onRouteChange: (route: ActiveRoute) => void;
  isInWatchlist: (id: number, type: 'movie' | 'tv') => boolean;
  onToggleWatchlist: (e: React.MouseEvent, media: MediaItem, type: 'movie' | 'tv') => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onRouteChange,
  isInWatchlist,
  onToggleWatchlist,
}) => {
  const [trending, setTrending] = useState<MediaItem[]>([]);
  const [popularMovies, setPopularMovies] = useState<MediaItem[]>([]);
  const [popularTV, setPopularTV] = useState<MediaItem[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<MediaItem[]>([]);
  const [topRatedTV, setTopRatedTV] = useState<MediaItem[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenreId, setSelectedGenreId] = useState<number | undefined>(undefined);
  const [filteredMedia, setFilteredMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [
          trendingRes,
          popMoviesRes,
          popTvRes,
          topMoviesRes,
          topTvRes,
          movieGenresRes,
        ] = await Promise.all([
          getTrending('all', 'day'),
          getPopularMovies(1),
          getPopularTV(1),
          getTopRatedMovies(1),
          getTopRatedTV(1),
          getGenres('movie'),
        ]);

        setTrending(trendingRes.results || []);
        setPopularMovies(popMoviesRes.results || []);
        setPopularTV(popTvRes.results || []);
        setTopRatedMovies(topMoviesRes.results || []);
        setTopRatedTV(topTvRes.results || []);
        setGenres(movieGenresRes.genres || []);
      } catch (err) {
        console.error('Failed to load home data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    async function handleGenreChange() {
      if (selectedGenreId) {
        try {
          const res = await discoverMedia('movie', { genreId: selectedGenreId });
          setFilteredMedia(res.results || []);
        } catch (e) {
          console.error(e);
        }
      } else {
        setFilteredMedia([]);
      }
    }
    handleGenreChange();
  }, [selectedGenreId]);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-semibold text-zinc-400">تکایە چاوەڕێ بکە... ئامادەکردنی لیستەکان</span>
      </div>
    );
  }

  return (
    <div className="pb-20">
      <SEO 
        title="سەرەتا - مالپەڕی فەرمی جێر فیلم | Jerfilm.VIP" 
        description="سەیرکردنی نوێترین فیلم و زنجیرە سەرکەوتووەکانی جیهان بە ژێرنووسی کوردی بە کوالێتی HD و 4K بێبەرامبەر."
        schemaData={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Jerfilm.VIP",
          "alternateName": "جێر فیلم",
          "url": "https://jerfilm.vip"
        }}
      />
      {/* Featured Hero Banner */}
      <HeroBanner
        items={trending}
        onRouteChange={onRouteChange}
        isInWatchlist={isInWatchlist}
        onToggleWatchlist={onToggleWatchlist}
      />

      {/* Genre Filter Pills */}
      <div className="max-w-7xl mx-auto my-4">
        <GenrePills
          genres={genres}
          selectedGenreId={selectedGenreId}
          onSelectGenre={setSelectedGenreId}
        />
      </div>

      {/* Genre Discovery Results */}
      {selectedGenreId && filteredMedia.length > 0 ? (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 my-6">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-red-500" />
            <span>ئەنجامەکانی بەپێی ژانەر</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {filteredMedia.map((media) => (
              <MediaCard
                key={media.id}
                media={media}
                mediaTypeOverride="movie"
                onRouteChange={onRouteChange}
                isInWatchlist={isInWatchlist(media.id, 'movie')}
                onToggleWatchlist={onToggleWatchlist}
              />
            ))}
          </div>
        </section>
      ) : (
        <>
          {/* Shahid Style Top 10 Today Row */}
          <Top10Slider
            items={trending}
            onRouteChange={onRouteChange}
            isInWatchlist={isInWatchlist}
            onToggleWatchlist={onToggleWatchlist}
          />

          {/* Trending Media Slider */}
          <MediaSlider
            title="ترێندینگ"
            subtitle="بەناوبانگترین فیلم و زنجیرەکانی ئەمڕۆ"
            icon={<Flame className="w-5 h-5" />}
            items={trending}
            onRouteChange={onRouteChange}
            isInWatchlist={isInWatchlist}
            onToggleWatchlist={onToggleWatchlist}
          />

          {/* Popular Movies Slider */}
          <MediaSlider
            title="فیلمە باوەکان"
            subtitle="باشترین و پڕبینەرترین فیلمەکان"
            icon={<Film className="w-5 h-5" />}
            items={popularMovies}
            mediaTypeOverride="movie"
            onRouteChange={onRouteChange}
            isInWatchlist={isInWatchlist}
            onToggleWatchlist={onToggleWatchlist}
            onSeeAll={() => onRouteChange({ mode: 'movies' })}
          />

          {/* Popular TV Shows Slider */}
          <MediaSlider
            title="زنجیرە باوەکان"
            subtitle="پڕبینەرترین زنجیرە تەلەڤزیۆنییەکان"
            icon={<Tv className="w-5 h-5" />}
            items={popularTV}
            mediaTypeOverride="tv"
            onRouteChange={onRouteChange}
            isInWatchlist={isInWatchlist}
            onToggleWatchlist={onToggleWatchlist}
            onSeeAll={() => onRouteChange({ mode: 'tv' })}
          />

          {/* Top Rated Movies */}
          <MediaSlider
            title="بەرزترین هەڵسەنگاندن - فیلم"
            subtitle="شاکارە نایابەکانی جیهانی سینەما"
            icon={<Star className="w-5 h-5" />}
            items={topRatedMovies}
            mediaTypeOverride="movie"
            onRouteChange={onRouteChange}
            isInWatchlist={isInWatchlist}
            onToggleWatchlist={onToggleWatchlist}
            onSeeAll={() => onRouteChange({ mode: 'movies' })}
          />

          {/* Top Rated Series */}
          <MediaSlider
            title="بەرزترین هەڵسەنگاندن - زنجیرە"
            subtitle="بەناوبانگترین زنجیرە خاوەن هەڵسەنگاندنە بەرزەکان"
            icon={<TrendingUp className="w-5 h-5" />}
            items={topRatedTV}
            mediaTypeOverride="tv"
            onRouteChange={onRouteChange}
            isInWatchlist={isInWatchlist}
            onToggleWatchlist={onToggleWatchlist}
            onSeeAll={() => onRouteChange({ mode: 'tv' })}
          />
        </>
      )}
    </div>
  );
};

