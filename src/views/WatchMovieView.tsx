import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, 
  Maximize2, 
  RotateCcw, 
  Star, 
  Bookmark, 
  BookmarkCheck, 
  Share2, 
} from 'lucide-react';
import { MovieDetails, StreamServer, MediaItem, ActiveRoute } from '../types';
import { STREAM_SERVERS } from '../services/servers';
import { getMovieDetails, getRecommendations } from '../services/tmdb';
import { ServerSelector } from '../components/ServerSelector';
import { MediaSlider } from '../components/MediaSlider';
import { AdultBlockedNotice } from '../components/AdultBlockedNotice';
import { SEO } from '../components/SEO';
import { tToSorani } from '../utils/translate';

interface WatchMovieViewProps {
  movieId: number;
  onRouteChange: (route: ActiveRoute) => void;
  isInWatchlist: (id: number, type: 'movie' | 'tv') => boolean;
  onToggleWatchlist: (e: React.MouseEvent, media: MediaItem, type: 'movie' | 'tv') => void;
}

export const WatchMovieView: React.FC<WatchMovieViewProps> = ({
  movieId,
  onRouteChange,
  isInWatchlist,
  onToggleWatchlist,
}) => {
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [currentServer, setCurrentServer] = useState<StreamServer>(STREAM_SERVERS[0]);
  const [recommendations, setRecommendations] = useState<MediaItem[]>([]);
  const [isTheater, setIsTheater] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchMovieData() {
      try {
        setLoading(true);
        // Fetch movie details first
        const movieData = await getMovieDetails(movieId);
        if (isMounted) {
          setMovie(movieData);
        }

        // Fetch recommendations safely in background
        try {
          const recsData = await getRecommendations('movie', movieId);
          if (isMounted) {
            setRecommendations(recsData.results || []);
          }
        } catch (e) {
          console.warn('Failed to fetch recommendations:', e);
        }
      } catch (err) {
        console.error('Failed to load watch movie data:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    fetchMovieData();
    return () => {
      isMounted = false;
    };
  }, [movieId]);

  const handleRefreshIframe = () => {
    setIframeKey((prev) => prev + 1);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-semibold text-zinc-400">تکایە چاوەڕێ بکە... ئامادەکردنی پەخشی فیلمەکە</span>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen pt-24 text-center px-4">
        <h2 className="text-xl font-bold text-white">فیلمەکە نەدۆزرایەوە</h2>
        <button
          onClick={() => onRouteChange({ mode: 'movies' })}
          className="mt-4 px-4 py-2 bg-amber-400 text-zinc-950 text-xs font-bold rounded-xl"
        >
          گەڕانەوە بۆ فیلمەکان
        </button>
      </div>
    );
  }

  if (movie.adult) {
    return <AdultBlockedNotice onRouteChange={onRouteChange} />;
  }

  const streamUrl = currentServer.getMovieUrl(movieId);
  const inWatchlist = isInWatchlist(movie.id, 'movie');
  const releaseYear = (movie.release_date || '').substring(0, 4);

  return (
    <div className={`pb-24 transition-colors duration-300 ${isTheater ? 'bg-black' : ''}`}>
      <SEO
        title={`سەیرکردنی فیلمی ${movie.title} (${releaseYear}) - ژێرنووسی کوردی`}
        description={`پەخشکردنی ڕاستەوخۆ و سەیرکردنی فیلمی ${movie.title} بە ژێرنووسی کوردی و کوالێتی بەرز Full HD.`}
        type="video.movie"
      />
      {/* Top Header Bar */}
      <div className="pt-16 pb-3 px-4 sm:px-6 max-w-7xl mx-auto flex items-center justify-between">
        <button
          onClick={() => onRouteChange({ mode: 'movie-detail', id: movieId })}
          className="flex items-center gap-2 text-xs font-bold text-zinc-300 hover:text-white bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-xl transition-all"
        >
          <ChevronRight className="w-4 h-4" />
          <span>زانیارییەکانی فیلمەکە</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsTheater(!isTheater)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isTheater
                ? 'bg-amber-500 text-zinc-950 border-amber-400 font-bold'
                : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:text-white'
            }`}
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>دۆخی سینەما</span>
          </button>

          <button
            onClick={handleRefreshIframe}
            className="p-1.5 bg-zinc-900 text-zinc-300 hover:text-white border border-zinc-800 rounded-xl transition-all"
            title="نوێکردنەوەی پڵەیەر"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Video Player Container - NO SANDBOX ATTRIBUTE */}
      <div className={`max-w-7xl mx-auto px-2 sm:px-6 ${isTheater ? 'max-w-none px-0' : ''}`}>
        <div className="relative aspect-video w-full bg-black rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl">
          <iframe
            key={iframeKey}
            src={streamUrl}
            title={movie.title}
            style={{ width: '100%', height: '100%' }}
            frameBorder="0"
            allow="autoplay *; fullscreen *; picture-in-picture *; encrypted-media *"
            referrerPolicy="no-referrer"
            allowFullScreen
          />
        </div>
      </div>

      {/* Main Content below video */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Server Switcher */}
        <ServerSelector
          currentServerId={currentServer.id}
          onSelectServer={setCurrentServer}
        />

        {/* Movie Overview & Details */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 sm:p-6 my-4 backdrop-blur-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="bg-amber-400 text-zinc-950 text-[10px] font-black px-2 py-0.5 rounded uppercase">
                  فیلم
                </span>
                <div className="flex items-center gap-1 text-xs font-bold text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</span>
                </div>
                {releaseYear && <span className="text-xs text-zinc-400 font-medium">• {releaseYear}</span>}
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-white font-display">
                {movie.title}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={(e) => onToggleWatchlist(e, movie, 'movie')}
                className={`px-3.5 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  inWatchlist
                    ? 'bg-amber-400/20 border-amber-400/60 text-amber-400'
                    : 'bg-zinc-950 text-zinc-300 border-zinc-800 hover:text-white'
                }`}
              >
                {inWatchlist ? <BookmarkCheck className="w-4 h-4 text-amber-400" /> : <Bookmark className="w-4 h-4" />}
                <span>{inWatchlist ? 'خەزنکراوە' : 'لیستی سەیرکردن'}</span>
              </button>

              <button
                onClick={handleShare}
                className="px-3.5 py-2 bg-zinc-950 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <Share2 className="w-4 h-4" />
                <span>{copied ? 'کۆپی کرا!' : 'بەشداریکردن'}</span>
              </button>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-zinc-300 mt-4 leading-relaxed font-normal">
            {movie.overview || 'هیچ کورتەیەک بەردەست نییە.'}
          </p>
        </div>

        {/* More Movies Recommendation */}
        {recommendations.length > 0 && (
          <MediaSlider
            title="فیلمە پێشنیازکراوەکانی تر"
            subtitle="بەپێی ئەو فیلمەی ئێستا سەیری دەکەیت"
            items={recommendations}
            mediaTypeOverride="movie"
            onRouteChange={onRouteChange}
            isInWatchlist={isInWatchlist}
            onToggleWatchlist={onToggleWatchlist}
          />
        )}
      </div>
    </div>
  );
};

