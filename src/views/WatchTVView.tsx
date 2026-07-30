import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  RotateCcw, 
  Star, 
  Bookmark, 
  BookmarkCheck, 
  Layers, 
  Play, 
  List, 
  Share2 
} from 'lucide-react';
import { TVDetails, Season, Episode, StreamServer, MediaItem, ActiveRoute } from '../types';
import { STREAM_SERVERS } from '../services/servers';
import { 
  getTVDetails, 
  getTVSeasonDetails, 
  getRecommendations, 
} from '../services/tmdb';
import { ServerSelector } from '../components/ServerSelector';
import { MediaSlider } from '../components/MediaSlider';
import { AdultBlockedNotice } from '../components/AdultBlockedNotice';
import { SEO } from '../components/SEO';
import { tToSorani } from '../utils/translate';

interface WatchTVViewProps {
  tvId: number;
  seasonNum: number;
  episodeNum: number;
  onRouteChange: (route: ActiveRoute) => void;
  isInWatchlist: (id: number, type: 'movie' | 'tv') => boolean;
  onToggleWatchlist: (e: React.MouseEvent, media: MediaItem, type: 'movie' | 'tv') => void;
  updateTvProgress?: (id: number, season: number, episode: number) => void;
}

export const WatchTVView: React.FC<WatchTVViewProps> = ({
  tvId,
  seasonNum,
  episodeNum,
  onRouteChange,
  isInWatchlist,
  onToggleWatchlist,
  updateTvProgress,
}) => {
  const [show, setShow] = useState<TVDetails | null>(null);
  const [seasonData, setSeasonData] = useState<Season | null>(null);
  const [currentServer, setCurrentServer] = useState<StreamServer>(STREAM_SERVERS[0]);
  const [recommendations, setRecommendations] = useState<MediaItem[]>([]);
  const [isTheater, setIsTheater] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const [showEpisodeDrawer, setShowEpisodeDrawer] = useState(false);
  const [selectedSeasonForDrawer, setSelectedSeasonForDrawer] = useState<number>(seasonNum);
  const [drawerSeasonData, setDrawerSeasonData] = useState<Season | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch TV Show details and current season
  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      try {
        setLoading(true);
        const showRes = await getTVDetails(tvId);
        if (isMounted) {
          setShow(showRes);
        }

        // Recommendations (non-blocking)
        try {
          const recsRes = await getRecommendations('tv', tvId);
          if (isMounted) {
            setRecommendations(recsRes.results || []);
          }
        } catch (e) {
          console.warn('Failed to fetch recommendations:', e);
        }

        // Season details (non-blocking fallback)
        try {
          const sData = await getTVSeasonDetails(tvId, seasonNum);
          if (isMounted) {
            setSeasonData(sData);
          }
        } catch (e) {
          console.warn(`Failed to fetch season ${seasonNum} details:`, e);
        }

        // Update watch progress
        if (updateTvProgress) {
          updateTvProgress(tvId, seasonNum, episodeNum);
        }
      } catch (err) {
        console.error('Failed to load watch TV data:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    fetchData();
    return () => {
      isMounted = false;
    };
  }, [tvId, seasonNum, episodeNum]);

  // Fetch season data when drawer season changes
  useEffect(() => {
    async function fetchDrawerSeason() {
      if (!tvId || !selectedSeasonForDrawer) return;
      try {
        const data = await getTVSeasonDetails(tvId, selectedSeasonForDrawer);
        setDrawerSeasonData(data);
      } catch (e) {
        console.error(e);
      }
    }
    fetchDrawerSeason();
  }, [tvId, selectedSeasonForDrawer]);

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
        <span className="text-xs font-semibold text-zinc-400">تکایە چاوەڕێ بکە... ئامادەکردنی ئەڵقەکە</span>
      </div>
    );
  }

  if (!show) {
    return (
      <div className="min-h-screen pt-24 text-center px-4">
        <h2 className="text-xl font-bold text-white">زنجیرەکە نەدۆزرایەوە</h2>
        <button
          onClick={() => onRouteChange({ mode: 'tv' })}
          className="mt-4 px-4 py-2 bg-amber-400 text-zinc-950 text-xs font-bold rounded-xl"
        >
          گەڕانەوە بۆ زنجیرەکان
        </button>
      </div>
    );
  }

  if (show.adult) {
    return <AdultBlockedNotice onRouteChange={onRouteChange} />;
  }

  const streamUrl = currentServer.getTvUrl(tvId, seasonNum, episodeNum);
  const inWatchlist = isInWatchlist(show.id, 'tv');

  const currentEpisode: Episode | undefined = seasonData?.episodes?.find(
    (e) => e.episode_number === episodeNum
  );

  const totalEpisodesInSeason = seasonData?.episodes?.length || 0;
  const hasPrevEpisode = episodeNum > 1 || seasonNum > 1;
  const hasNextEpisode =
    episodeNum < totalEpisodesInSeason || seasonNum < show.number_of_seasons;

  const handlePrevEpisode = () => {
    if (episodeNum > 1) {
      onRouteChange({ mode: 'watch-tv', id: tvId, season: seasonNum, episode: episodeNum - 1 });
    } else if (seasonNum > 1) {
      onRouteChange({ mode: 'watch-tv', id: tvId, season: seasonNum - 1, episode: 1 });
    }
  };

  const handleNextEpisode = () => {
    if (episodeNum < totalEpisodesInSeason) {
      onRouteChange({ mode: 'watch-tv', id: tvId, season: seasonNum, episode: episodeNum + 1 });
    } else if (seasonNum < show.number_of_seasons) {
      onRouteChange({ mode: 'watch-tv', id: tvId, season: seasonNum + 1, episode: 1 });
    }
  };

  const validSeasons = (show.seasons || []).filter((s) => s.season_number > 0);

  return (
    <div className={`pb-24 transition-colors duration-300 ${isTheater ? 'bg-black' : ''}`}>
      <SEO
        title={`زنجیرەی ${show.name} - وەرزی ${seasonNum} ئەڵقەی ${episodeNum} - ژێرنووسی کوردی`}
        description={`پەخشکردن و سەیرکردنی وەرزی ${seasonNum} ئەڵقەی ${episodeNum} لە زنجیرەی ${show.name} بە ژێرنووسی کوردی.`}
        type="video.tv_show"
      />
      {/* Top Header Bar */}
      <div className="pt-16 pb-3 px-4 sm:px-6 max-w-7xl mx-auto flex items-center justify-between">
        <button
          onClick={() => onRouteChange({ mode: 'tv-detail', id: tvId })}
          className="flex items-center gap-2 text-xs font-bold text-zinc-300 hover:text-white bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-xl transition-all"
        >
          <ChevronRight className="w-4 h-4" />
          <span>زانیارییەکانی زنجیرەکە</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedSeasonForDrawer(seasonNum);
              setShowEpisodeDrawer(true);
            }}
            className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-400/20"
          >
            <List className="w-3.5 h-3.5" />
            <span>هەڵبژاردنی ئەڵقە</span>
          </button>

          <button
            onClick={() => setIsTheater(!isTheater)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isTheater
                ? 'bg-amber-400 text-zinc-950 border-amber-300 font-bold'
                : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:text-white'
            }`}
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">دۆخی سینەما</span>
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
            title={`${show.name} S${seasonNum} E${episodeNum}`}
            style={{ width: '100%', height: '100%' }}
            frameBorder="0"
            allow="autoplay *; fullscreen *; picture-in-picture *; encrypted-media *"
            referrerPolicy="no-referrer"
            allowFullScreen
          />
        </div>

        {/* Quick Prev / Next Controls below player */}
        <div className="flex items-center justify-between gap-2 my-3">
          <button
            disabled={!hasPrevEpisode}
            onClick={handlePrevEpisode}
            className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed border border-zinc-800 text-zinc-200 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all"
          >
            <ChevronRight className="w-4 h-4" />
            <span>ئەڵقەی پێشوو</span>
          </button>

          <div className="text-center">
            <span className="text-xs font-black text-amber-400 bg-amber-400/10 border border-amber-400/40 px-3 py-1 rounded-full tracking-wider">
              وەرز {seasonNum} • ئەڵقەی {episodeNum}
            </span>
          </div>

          <button
            disabled={!hasNextEpisode}
            onClick={handleNextEpisode}
            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 disabled:opacity-40 disabled:cursor-not-allowed text-zinc-950 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-amber-400/20"
          >
            <span>ئەڵقەی داهاتوو</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content below player */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Server Switcher */}
        <ServerSelector
          currentServerId={currentServer.id}
          onSelectServer={setCurrentServer}
        />

        {/* Show & Episode Details */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 sm:p-6 my-4 backdrop-blur-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="bg-red-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded uppercase">
                  و{seasonNum} ئە{episodeNum}
                </span>
                <div className="flex items-center gap-1 text-xs font-bold text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{show.vote_average ? show.vote_average.toFixed(1) : 'N/A'}</span>
                </div>
                <span className="text-xs text-zinc-400 font-medium">• {show.name}</span>
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-white font-display">
                {currentEpisode ? `ئەڵقەی ${episodeNum}: ${currentEpisode.name}` : `ئەڵقەی ${episodeNum}`}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={(e) => onToggleWatchlist(e, show, 'tv')}
                className={`px-3.5 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  inWatchlist
                    ? 'bg-red-950/80 border-red-500/60 text-red-400'
                    : 'bg-zinc-950 text-zinc-300 border-zinc-800 hover:text-white'
                }`}
              >
                {inWatchlist ? <BookmarkCheck className="w-4 h-4 text-red-400" /> : <Bookmark className="w-4 h-4" />}
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
            {currentEpisode?.overview || show.overview || 'هیچ کورتەیەکی ئەڵقە بەردەست نییە.'}
          </p>
        </div>

        {/* Season & Episode Selector List on Page */}
        {seasonData && seasonData.episodes && (
          <section className="my-6 bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center justify-between">
              <span>ئەڵقەکانی وەرزی {seasonNum}</span>
              <span className="text-xs text-zinc-400 font-normal">
                {seasonData.episodes.length} ئەڵقە
              </span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-80 overflow-y-auto pl-1">
              {seasonData.episodes.map((ep) => {
                const isCurrent = ep.episode_number === episodeNum;
                return (
                  <button
                    key={ep.id}
                    onClick={() =>
                      onRouteChange({
                        mode: 'watch-tv',
                        id: tvId,
                        season: seasonNum,
                        episode: ep.episode_number,
                      })
                    }
                    className={`p-2.5 rounded-xl border text-right flex items-center gap-3 transition-all ${
                      isCurrent
                        ? 'bg-red-600 text-white border-red-500 font-bold shadow'
                        : 'bg-zinc-950/80 hover:bg-zinc-800 text-zinc-300 border-zinc-800'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-black/40 flex items-center justify-center font-bold text-xs flex-shrink-0">
                      ئەڵقەی {ep.episode_number}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs truncate font-semibold">{ep.name}</p>
                      <p className="text-[10px] opacity-75">{ep.air_date || 'N/A'}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <MediaSlider
            title="زنجیرە پێشنیازکراوەکانی تر"
            subtitle="زنجیرەی هاوشێوە کە ڕەنگە حەزت لێی بێت"
            items={recommendations}
            mediaTypeOverride="tv"
            onRouteChange={onRouteChange}
            isInWatchlist={isInWatchlist}
            onToggleWatchlist={onToggleWatchlist}
          />
        )}
      </div>

      {/* Episode Picker Drawer Modal */}
      {showEpisodeDrawer && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-t-3xl sm:rounded-2xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-4 bg-zinc-950 flex items-center justify-between border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-red-500" />
                <h3 className="text-sm font-bold text-white">{show.name} - هەڵبژاردنی ئەڵقە</h3>
              </div>
              <button
                onClick={() => setShowEpisodeDrawer(false)}
                className="px-3 py-1 bg-zinc-800 text-zinc-300 hover:text-white text-xs font-bold rounded-lg"
              >
                داخستن
              </button>
            </div>

            {/* Season tabs in Drawer */}
            <div className="flex items-center gap-2 p-3 bg-zinc-900 border-b border-zinc-800 overflow-x-auto scrollbar-none">
              {validSeasons.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedSeasonForDrawer(s.season_number)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedSeasonForDrawer === s.season_number
                      ? 'bg-red-600 text-white'
                      : 'bg-zinc-950 text-zinc-400 hover:text-white'
                  }`}
                >
                  وەرزی {s.season_number}
                </button>
              ))}
            </div>

            {/* Episode List in Drawer */}
            <div className="p-4 overflow-y-auto space-y-2 flex-1">
              {!drawerSeasonData || !drawerSeasonData.episodes ? (
                <div className="py-12 text-center text-xs text-zinc-400">تکایە چاوەڕێ بکە... ئامادەکردنی ئەڵقەکان</div>
              ) : (
                drawerSeasonData.episodes.map((ep) => {
                  const isCurrent =
                    selectedSeasonForDrawer === seasonNum && ep.episode_number === episodeNum;
                  return (
                    <div
                      key={ep.id}
                      onClick={() => {
                        onRouteChange({
                          mode: 'watch-tv',
                          id: tvId,
                          season: selectedSeasonForDrawer,
                          episode: ep.episode_number,
                        });
                        setShowEpisodeDrawer(false);
                      }}
                      className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                        isCurrent
                          ? 'bg-red-950/60 border-red-500/80 text-white font-bold'
                          : 'bg-zinc-950 hover:bg-zinc-800 border-zinc-800/80 text-zinc-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center text-xs font-black text-red-500 flex-shrink-0">
                          {ep.episode_number}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold truncate">{ep.name}</p>
                          <p className="text-[10px] text-zinc-500">
                            {ep.air_date ? ep.air_date : 'N/A'} {ep.runtime ? `• ${ep.runtime} خولەک` : ''}
                          </p>
                        </div>
                      </div>

                      <button className="p-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold flex items-center gap-1">
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>سەیرکردن</span>
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

