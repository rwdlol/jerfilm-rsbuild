import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Bookmark, 
  BookmarkCheck, 
  Star, 
  Clock, 
  Youtube, 
  ChevronRight, 
  Sparkles, 
} from 'lucide-react';
import { MovieDetails, Cast, Video, MediaItem, ActiveRoute } from '../types';
import { 
  getMovieDetails, 
  getCredits, 
  getVideos, 
  getRecommendations, 
  getImageUrl 
} from '../services/tmdb';
import { MediaSlider } from '../components/MediaSlider';
import { VideoModal } from '../components/VideoModal';
import { AdultBlockedNotice } from '../components/AdultBlockedNotice';
import { SEO } from '../components/SEO';
import { tToSorani } from '../utils/translate';

interface MovieDetailViewProps {
  movieId: number;
  onRouteChange: (route: ActiveRoute) => void;
  isInWatchlist: (id: number, type: 'movie' | 'tv') => boolean;
  onToggleWatchlist: (e: React.MouseEvent, media: MediaItem, type: 'movie' | 'tv') => void;
}

export const MovieDetailView: React.FC<MovieDetailViewProps> = ({
  movieId,
  onRouteChange,
  isInWatchlist,
  onToggleWatchlist,
}) => {
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [cast, setCast] = useState<Cast[]>([]);
  const [trailer, setTrailer] = useState<Video | null>(null);
  const [recommendations, setRecommendations] = useState<MediaItem[]>([]);
  const [showTrailerModal, setShowTrailerModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchAll() {
      try {
        setLoading(true);
        const movieData = await getMovieDetails(movieId);
        if (isMounted) setMovie(movieData);

        try {
          const [creditsData, videosData, recsData] = await Promise.all([
            getCredits('movie', movieId).catch(() => ({ cast: [], crew: [] })),
            getVideos('movie', movieId).catch(() => ({ results: [] })),
            getRecommendations('movie', movieId).catch(() => ({ results: [] })),
          ]);

          if (isMounted) {
            setCast((creditsData.cast || []).slice(0, 15));
            const officialTrailer = (videosData.results || []).find(
              (v) => v.type === 'Trailer' && v.site === 'YouTube'
            ) || (videosData.results || [])[0];
            setTrailer(officialTrailer || null);
            setRecommendations(recsData.results || []);
          }
        } catch (e) {
          console.warn('Sub-details error:', e);
        }
      } catch (err) {
        console.error('Failed to load movie details:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchAll();
    return () => {
      isMounted = false;
    };
  }, [movieId]);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-semibold text-zinc-400">تکایە چاوەڕێ بکە... گواستنەوەی زانیارییەکانی فیلمەکە</span>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen pt-24 text-center px-4">
        <h2 className="text-xl font-bold text-white">فیلمەکە نەدۆزرایەوە</h2>
        <button
          onClick={() => onRouteChange({ mode: 'home' })}
          className="mt-4 px-4 py-2 bg-amber-400 text-zinc-950 text-xs font-bold rounded-xl"
        >
          گەڕانەوە بۆ سەرەتا
        </button>
      </div>
    );
  }

  if (movie.adult) {
    return <AdultBlockedNotice onRouteChange={onRouteChange} />;
  }

  const inWatchlist = isInWatchlist(movie.id, 'movie');
  const backdropUrl = getImageUrl(movie.backdrop_path || movie.poster_path, 'original');
  const posterUrl = getImageUrl(movie.poster_path, 'w500');
  const releaseYear = (movie.release_date || '').substring(0, 4);

  const runtimeHours = movie.runtime ? Math.floor(movie.runtime / 60) : 0;
  const runtimeMins = movie.runtime ? movie.runtime % 60 : 0;

  return (
    <div className="pb-24">
      <SEO
        title={`فیلمی ${movie.title} (${releaseYear}) - ژێرنووسی کوردی`}
        description={movie.overview ? tToSorani(movie.overview) : `سەیرکردنی فیلمی ${movie.title} بە ژێرنووسی کوردی و کوالێتی بەرز.`}
        image={backdropUrl || posterUrl}
        type="video.movie"
        keywords={[movie.title, `فیلمی ${movie.title}`, "ژێرنووسی کوردی", "فیلمی ئاکشن", "Jerfilm", "سەیرکردنی فیلم"]}
        schemaData={{
          "@context": "https://schema.org",
          "@type": "Movie",
          "name": movie.title,
          "alternateName": movie.original_title,
          "description": movie.overview ? tToSorani(movie.overview) : `فیلمی ${movie.title} بە ژێرنووسی کوردی`,
          "image": posterUrl,
          "datePublished": movie.release_date,
          "aggregateRating": movie.vote_average ? {
            "@type": "AggregateRating",
            "ratingValue": movie.vote_average,
            "bestRating": "10",
            "ratingCount": movie.vote_count || 100
          } : undefined
        }}
      />
      {/* Back Button & Top Bar */}
      <div className="fixed top-16 right-4 z-30">
        <button
          onClick={() => window.history.length > 1 ? window.history.back() : onRouteChange({ mode: 'movies' })}
          className="p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/10 shadow-lg transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Hero Backdrop Header */}
      <div className="relative w-full h-[55vh] min-h-[380px] bg-zinc-950">
        <img
          src={backdropUrl}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-l from-zinc-950 via-zinc-950/50 to-transparent" />
      </div>

      {/* Main Details Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
          {/* Poster Image */}
          <div className="w-40 sm:w-52 md:w-64 flex-shrink-0 rounded-2xl overflow-hidden border-2 border-zinc-800 shadow-2xl bg-zinc-900 mx-auto md:mx-0">
            <img src={posterUrl} alt={movie.title} className="w-full h-auto object-cover" />
          </div>

          {/* Details Content */}
          <div className="flex-1 space-y-4 text-center md:text-right">
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap mb-2">
                <span className="bg-amber-400 text-zinc-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md">
                  فیلم
                </span>
                <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-md border border-white/10 text-xs font-bold text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</span>
                </div>
                {releaseYear && (
                  <span className="text-xs text-zinc-300 font-medium bg-zinc-900/80 px-2.5 py-0.5 rounded-md border border-zinc-800">
                    {releaseYear}
                  </span>
                )}
                {movie.runtime ? (
                  <span className="text-xs text-zinc-300 font-medium bg-zinc-900/80 px-2.5 py-0.5 rounded-md border border-zinc-800 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-400" />
                    {runtimeHours}کا {runtimeMins}خ
                  </span>
                ) : null}
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-white font-display tracking-tight">
                {movie.title}
              </h1>

              {movie.tagline && (
                <p className="text-xs sm:text-sm text-amber-400/90 font-medium italic mt-1">
                  "{movie.tagline}"
                </p>
              )}
            </div>

            {/* Genres list */}
            {movie.genres && movie.genres.length > 0 && (
              <div className="flex items-center justify-center md:justify-start gap-1.5 flex-wrap">
                {movie.genres.map((g) => (
                  <span
                    key={g.id}
                    className="text-[11px] font-semibold bg-zinc-900 text-zinc-300 border border-zinc-800 px-2.5 py-1 rounded-lg"
                  >
                    {tToSorani(g.name)}
                  </span>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-center md:justify-start gap-3 pt-2 flex-wrap">
              <button
                onClick={() => onRouteChange({ mode: 'watch-movie', id: movie.id })}
                className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-lg shadow-amber-400/20 flex items-center gap-2 group transform active:scale-95"
              >
                <Play className="w-4 h-4 fill-zinc-950 group-hover:scale-110 transition-transform" />
                <span>سەیرکردنی فیلمەکە ئێستا</span>
              </button>

              <button
                onClick={(e) => onToggleWatchlist(e, movie, 'movie')}
                className={`px-4 py-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                  inWatchlist
                    ? 'bg-amber-400/20 border-amber-400/60 text-amber-400'
                    : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-white'
                }`}
              >
                {inWatchlist ? <BookmarkCheck className="w-4 h-4 text-amber-400" /> : <Bookmark className="w-4 h-4" />}
                <span>{inWatchlist ? 'لە لیستی سەیرکردندایە' : 'زیادکردن بۆ لیستی سەیرکردن'}</span>
              </button>

              {trailer && (
                <button
                  onClick={() => setShowTrailerModal(true)}
                  className="px-4 py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 text-xs sm:text-sm font-semibold rounded-xl transition-all flex items-center gap-2"
                >
                  <Youtube className="w-4 h-4 text-red-500" />
                  <span>تڕایلەر</span>
                </button>
              )}
            </div>

            {/* Overview */}
            <div className="pt-2 text-right bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">
                کورتە
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal">
                {movie.overview || 'هیچ کورتەیەک بۆ ئەم فیلمە بەردەست نییە.'}
              </p>
            </div>
          </div>
        </div>

        {/* Cast & Crew Carousel */}
        {cast.length > 0 && (
          <section className="my-10">
            <h2 className="text-base sm:text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-red-500" />
              <span>ئەکتەرە سەرەکییەکان</span>
            </h2>

            <div className="flex gap-3 overflow-x-auto scrollbar-none pb-2 snap-x">
              {cast.map((actor) => (
                <div
                  key={actor.id}
                  className="flex-none w-28 sm:w-32 bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 p-2 text-center snap-start"
                >
                  <img
                    src={getImageUrl(actor.profile_path, 'w200')}
                    alt={actor.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl mx-auto mb-2 bg-zinc-950"
                  />
                  <p className="text-xs font-bold text-white line-clamp-1">{actor.name}</p>
                  <p className="text-[10px] text-zinc-400 line-clamp-1 mt-0.5">{actor.character}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <MediaSlider
            title="فیلمە پێشنیازکراوەکان"
            subtitle="فیلمی تر کە ڕەنگە حەزت لێی بێت"
            items={recommendations}
            mediaTypeOverride="movie"
            onRouteChange={onRouteChange}
            isInWatchlist={isInWatchlist}
            onToggleWatchlist={onToggleWatchlist}
          />
        )}
      </div>

      {/* Trailer Modal */}
      {showTrailerModal && trailer && (
        <VideoModal
          video={trailer}
          title={movie.title}
          onClose={() => setShowTrailerModal(false)}
        />
      )}
    </div>
  );
};

