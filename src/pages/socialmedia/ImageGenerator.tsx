import { useState, useEffect, useRef } from 'react';
import { useLocation, useParams } from 'react-router';
import { useTMDB } from '../../utils/tmdb';
import {
  LaptopMinimalCheck,
  Loader,
  Star,
  Download,
  Globe,
  Film,
} from 'lucide-react';
import { tToSoraniList } from '../../utils/tToSorani';
import { InstagramIcon } from '../../components/icons/instagram';
import { TelegramIcon } from '../../components/icons/telegram';
import { TiktokIcon } from '../../components/icons/tiktok';

interface SeasonDetail {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  season_number: number;
  episodes: any[];
}

// Helper to convert non-CORS image URLs to CORS-friendly URLs
const getCorsImageUrl = (url: string) => {
  if (!url) return '';
  return `https://images.weserv.nl/?url=${encodeURIComponent(url)}`;
};

export default function ImageGenerator() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();

  const instagramRef = useRef<HTMLDivElement>(null);
  const tiktokRef = useRef<HTMLDivElement>(null);

  const isTV = location.pathname.includes('/tv/');
  const endpoint = isTV ? `/tv/${id}` : `/movie/${id}`;

  const [selectedSeason, setSelectedSeason] = useState<number | null>(null);
  const [downloadingType, setDownloadingType] = useState<
    'instagram' | 'tiktok' | null
  >(null);

  // Fetch movie/series details
  const [data, loading, error] = useTMDB<any>(id ? endpoint : null);

  // Fetch season-specific details if TV show
  const [seasonData, seasonLoading] = useTMDB<SeasonDetail>(
    isTV && id && selectedSeason !== null
      ? `/tv/${id}/season/${selectedSeason}`
      : null,
  );

  // Auto-set to first season on TV load
  useEffect(() => {
    if (
      isTV &&
      data?.seasons &&
      data.seasons.length > 0 &&
      selectedSeason === null
    ) {
      setSelectedSeason(data.seasons[0].season_number);
    }
  }, [data, isTV, selectedSeason]);

  // Handle Download for Instagram / TikTok
  const handleDownload = async (target: 'instagram' | 'tiktok') => {
    const ref =
      target === 'instagram' ? instagramRef.current : tiktokRef.current;
    if (!ref) return;

    setDownloadingType(target);

    try {
      const { toPng } = await import('html-to-image');

      const dataUrl = await toPng(ref, {
        quality: 0.95,
        pixelRatio: 2,
        cacheBust: true,
      });

      const fileName = `${data?.title || data?.name || 'poster'}_${target}.png`;
      const link = document.createElement('a');
      link.download = fileName;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error generating image export:', err);
      alert('داگرتنی وێنەکە سەرکەوتوو نەبوو. تکایە دووبارە هەوڵبدەرەوە.');
    } finally {
      setDownloadingType(null);
    }
  };

  if (loading || (isTV && seasonLoading)) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-3">
        <Loader className="text-gold animate-spin" size={32} />
        <span className="text-zinc-400 text-sm">
          ئامادەکردنی زانیارییەکان...
        </span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-3 text-right p-4">
        <span className="text-red-500 text-sm">
          کێشەیەک لە بارکردنی داتاکاندا دروست بوو.
        </span>
      </div>
    );
  }

  // Formatting & Fallbacks
  const title = data.title || data.name || 'ناونیشان';
  const originalTitle = data.original_title || data.original_name;
  const dateStr = data.release_date || data.first_air_date;
  const year = dateStr ? new Date(dateStr).getFullYear() : '2025';

  const activePosterPath =
    isTV && seasonData?.poster_path ? seasonData.poster_path : data.poster_path;
  const activeOverview =
    isTV && seasonData?.overview ? seasonData.overview : data.overview;

  const rawPosterUrl = `https://image.tmdb.org/t/p/w780${activePosterPath}`;
  const posterUrl = getCorsImageUrl(rawPosterUrl);

  const rawBackdropUrl = `https://image.tmdb.org/t/p/original${data.backdrop_path}`;
  const backdropUrl = getCorsImageUrl(rawBackdropUrl);

  const genresList = tToSoraniList(data.genres?.map((g: any) => g.name) || []);

  return (
    <div className="min-h-screen bg-zinc-950 py-10 flex flex-col items-center gap-8 select-none">
      {/* Download Action Buttons */}
      <div className="hidden md:flex w-full px-4 justify-center items-center gap-4">
        <button
          onClick={() => handleDownload('instagram')}
          disabled={downloadingType !== null}
          className="flex items-center gap-2 bg-gold hover:bg-yellow-400 disabled:opacity-50 text-black font-black text-lg py-3.5 px-6 rounded-2xl transition shadow-xl cursor-pointer"
        >
          {downloadingType === 'instagram' ? (
            <Loader className="animate-spin" size={20} />
          ) : (
            <Download size={20} />
          )}
          <span>داگرتنی پۆستەری ئینستاگرام (1080x1440)</span>
        </button>

        <button
          onClick={() => handleDownload('tiktok')}
          disabled={downloadingType !== null}
          className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-white font-black text-lg py-3.5 px-6 rounded-2xl border border-zinc-700 transition shadow-xl cursor-pointer"
        >
          {downloadingType === 'tiktok' ? (
            <Loader className="animate-spin" size={20} />
          ) : (
            <Download size={20} />
          )}
          <span>داگرتنی پۆستەری تیک تۆک (1080x1920)</span>
        </button>
      </div>

      {/* Season Selection Pills (For TV Shows) */}
      {isTV && data.seasons && data.seasons.length > 0 && (
        <div
          className="hidden md:flex w-full max-w-7xl px-4 flex-col items-center justify-center gap-2 text-right"
          dir="rtl"
        >
          <div className="flex flex-row items-center justify-center overflow-x-auto gap-2 pb-2 scrollbar-none">
            {data.seasons.map((season: any) => (
              <button
                key={season.id}
                onClick={() => setSelectedSeason(season.season_number)}
                className={`shrink-0 text-xl font-bold py-2.5 px-4 rounded-xl transition cursor-pointer border ${
                  selectedSeason === season.season_number
                    ? 'bg-gold text-black border-gold shadow-md'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                {season.name} ({season.episode_count} ئەڵقە)
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Desktop Workspace: Both Canvas Rendered */}
      <div className="hidden md:flex flex-col gap-12 items-center">
        {/* ========================================================= */}
        {/* LAYOUT 1: Instagram Format (1080 x 1440) - 1 Grid Stack   */}
        {/* ========================================================= */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-zinc-400 font-bold text-sm">
            پێشبینینی ئینستاگرام (1080 x 1440)
          </span>

          <div
            ref={instagramRef}
            className="relative flex flex-col justify-between p-10 overflow-hidden bg-zinc-950 text-white border border-zinc-900 shadow-2xl"
            style={{ width: '1080px', height: '1440px' }}
          >
            {/* Blurred Background Layer */}
            {data.backdrop_path && (
              <img
                src={backdropUrl}
                alt="blur backdrop"
                crossOrigin="anonymous"
                className="absolute inset-0 w-full h-full object-cover blur-[50px] opacity-25 scale-110 pointer-events-none z-0"
              />
            )}
            <div className="absolute inset-0 bg-radial from-transparent via-zinc-950/40 to-zinc-950 z-0" />

            {/* Header */}
            <div className="font-bold text-3xl w-full flex items-center justify-between relative z-10 px-2">
              <span
                className="text-4xl text-white flex items-center"
                dir="ltr"
              >
                JERFILM<span className="text-gold">.VIP</span>
              </span>
              <h2 className="text-gold">
                {isTV
                  ? 'زنجیرەی ژێرنووسکراوی کوردی'
                  : 'فیلمی سینەمایی ژێرنووسکراوی کوردی'}
              </h2>
            </div>

            {/* Main Single Column Stack */}
            <div className="flex flex-col items-center gap-6 relative z-10 my-auto w-full">
              {/* Central Poster Frame */}
              <div className="w-[440px] h-[580px] bg-zinc-950 border-[3px] border-zinc-800 overflow-hidden relative shadow-2xl rounded-2xl flex flex-col justify-between">
                <img
                  src={posterUrl}
                  alt={title}
                  crossOrigin="anonymous"
                  className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent z-0" />

                {/* Rating & Badge Bar */}
                <div
                  className="mt-auto relative z-10 p-4 flex items-center justify-between text-2xl text-zinc-300 font-bold bg-zinc-950/85 border-t border-zinc-900"
                  dir="rtl"
                >
                  <span className="flex items-center gap-2 text-white">
                    <Film size={24} className="text-gold" />
                    {year}
                  </span>
                  <span className="flex items-center gap-1 text-gold">
                    <Star size={26} fill="currentColor" stroke="currentColor" />
                    {data.vote_average?.toFixed(1) || '0'} / 10
                  </span>
                </div>
              </div>

              {/* Text & Metadata Details Stack */}
              <div
                className="flex flex-col gap-5 text-center w-full max-w-4xl"
                dir="rtl"
              >
                <div>
                  <h3 className="text-5xl font-black text-white leading-tight">
                    {title}
                  </h3>
                  <p className="text-2xl font-semibold text-zinc-300 mt-1 uppercase tracking-wide">
                    {isTV
                      ? `${seasonData?.name || `وەرزی ${selectedSeason}`} — `
                      : ''}
                    {originalTitle}
                  </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4 text-xl text-white">
                  {isTV ? (
                    <>
                      <div className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-2xl flex flex-col items-center justify-center text-center gap-1">
                        <span className="text-zinc-400 text-lg">وەرزی</span>
                        <span className="text-4xl font-bold">
                          {selectedSeason}
                        </span>
                      </div>
                      <div className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-2xl flex flex-col items-center justify-center text-center gap-1">
                        <span className="text-zinc-400 text-lg">
                          ئەڵقەکانی وەرز
                        </span>
                        <span className="text-4xl font-bold">
                          {seasonData?.episodes?.length || '0'}
                        </span>
                      </div>
                      <div className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-2xl flex flex-col items-center justify-center text-center gap-1">
                        <span className="text-zinc-400 text-lg">
                          گشتی وەرزەکان
                        </span>
                        <span className="text-4xl font-bold">
                          {data.number_of_seasons}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-2xl flex flex-col items-center justify-center text-center gap-1">
                        <span className="text-zinc-400 text-lg">
                          ساڵی بەرهەم
                        </span>
                        <span className="text-4xl font-bold">{year}</span>
                      </div>
                      <div className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-2xl flex flex-col items-center justify-center text-center gap-1">
                        <span className="text-zinc-400 text-lg">
                          هەڵسەنگاندن
                        </span>
                        <span className="text-4xl font-bold text-gold">
                          {data.vote_average?.toFixed(1) || '0'}
                        </span>
                      </div>
                      <div className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-2xl flex flex-col items-center justify-center text-center gap-1">
                        <span className="text-zinc-400 text-lg">
                          ماوەی فیلم
                        </span>
                        <span className="text-4xl font-bold">
                          {data.runtime ? `${data.runtime} خولەک` : 'سینەمایی'}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {/* Genres & Overview */}
                <div className="flex items-center justify-center gap-3 text-xl text-zinc-300 font-bold bg-zinc-900/40 border border-zinc-800 py-3 px-6 rounded-xl">
                  <span>ژانەر:</span>
                  <span className="text-gold">
                    {genresList.slice(0, 3).join('  -  ')}
                  </span>
                </div>

                <p className="text-zinc-300 text-lg leading-relaxed line-clamp-3 px-4">
                  {activeOverview || 'کورتەباس بۆ ئەم بەرهەمە بەردەست نییە.'}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div
              className="w-full text-2xl font-bold uppercase flex items-center justify-between border-t border-zinc-900/60 pt-6 text-white tracking-wider px-2 relative z-10"
              dir="ltr"
            >
              <span className="flex items-center gap-3">
                <Globe size={30} className="mb-1" /> https://jerfilm.vip
              </span>
              <div className="flex items-center gap-3">
                <TelegramIcon className="text-white" width={30} height={30} />
                <TiktokIcon className="text-white" width={30} height={30} />
                <InstagramIcon className="text-white" width={30} height={30} />
                <span>JERFILM_VIP</span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* LAYOUT 2: TikTok Format (1080 x 1920) - 1 Grid Vertical   */}
        {/* ========================================================= */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-zinc-400 font-bold text-sm">
            پێشبینینی تیک تۆک (1080 x 1920)
          </span>

          <div
            ref={tiktokRef}
            className="relative flex flex-col justify-between p-12 overflow-hidden bg-zinc-950 text-white border border-zinc-900 shadow-2xl"
            style={{ width: '1080px', height: '1920px' }}
          >
            {/* Blurred Background Layer */}
            {data.backdrop_path && (
              <img
                src={backdropUrl}
                alt="blur backdrop"
                crossOrigin="anonymous"
                className="absolute inset-0 w-full h-full object-cover blur-[55px] opacity-25 scale-110 pointer-events-none z-0"
              />
            )}
            <div className="absolute inset-0 bg-radial from-transparent via-zinc-950/40 to-zinc-950 z-0" />

            {/* Top Brand Banner */}
            <div className="font-bold text-3xl w-full flex items-center justify-between relative z-10 px-4 pt-4">
              <span
                className="text-5xl text-white flex items-center"
                dir="ltr"
              >
                JERFILM<span className="text-gold">.VIP</span>
              </span>
              <h2 className="text-3xl text-gold font-black">
                {isTV
                  ? 'زنجیرەی ژێرنووسکراوی کوردی'
                  : 'فیلمی سینەمایی ژێرنووسکراوی کوردی'}
              </h2>
            </div>

            {/* Main Center Single Column Container */}
            <div className="flex flex-col items-center gap-10 relative z-10 my-auto w-full">
              {/* Larger Poster Frame */}
              <div className="w-[540px] h-[720px] bg-zinc-950 border-[4px] border-zinc-800 overflow-hidden relative shadow-2xl rounded-3xl flex flex-col justify-between">
                <img
                  src={posterUrl}
                  alt={title}
                  crossOrigin="anonymous"
                  className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/85 via-transparent to-transparent z-0" />

                <div
                  className="mt-auto relative z-10 p-5 flex items-center justify-between text-3xl text-zinc-300 font-bold bg-zinc-950/90 border-t border-zinc-900"
                  dir="rtl"
                >
                  <span className="flex items-center gap-2 text-white">
                    <Film size={32} className="text-gold" />
                    {year}
                  </span>
                  <span className="flex items-center gap-2 text-gold">
                    <Star size={32} fill="currentColor" stroke="currentColor" />
                    {data.vote_average?.toFixed(1) || '0'} / 10
                  </span>
                </div>
              </div>

              {/* Title & Metadata Details */}
              <div
                className="flex flex-col gap-6 text-center w-full max-w-4xl"
                dir="rtl"
              >
                <div>
                  <h3 className="text-6xl font-black text-white leading-tight">
                    {title}
                  </h3>
                  <p className="text-3xl font-bold text-zinc-300 mt-2 uppercase tracking-wide">
                    {isTV
                      ? `${seasonData?.name || `وەرزی ${selectedSeason}`} — `
                      : ''}
                    {originalTitle}
                  </p>
                </div>

                {/* Genre Bar */}
                <div className="flex items-center justify-center gap-3 text-2xl text-zinc-200 font-bold bg-zinc-900/60 border border-zinc-800 py-4 px-8 rounded-2xl">
                  <span className="text-zinc-400">ژانەر:</span>
                  <span className="text-gold font-black">
                    {genresList.slice(0, 3).join(' • ')}
                  </span>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4 text-2xl text-white">
                  {isTV ? (
                    <>
                      <div className="bg-zinc-900/60 border border-zinc-800 p-5 rounded-2xl flex flex-col items-center justify-center text-center gap-2">
                        <span className="text-zinc-400 text-xl">وەرزی</span>
                        <span className="text-5xl font-black">
                          {selectedSeason}
                        </span>
                      </div>
                      <div className="bg-zinc-900/60 border border-zinc-800 p-5 rounded-2xl flex flex-col items-center justify-center text-center gap-2">
                        <span className="text-zinc-400 text-xl">
                          ئەڵقەکانی وەرز
                        </span>
                        <span className="text-5xl font-black">
                          {seasonData?.episodes?.length || '0'}
                        </span>
                      </div>
                      <div className="bg-zinc-900/60 border border-zinc-800 p-5 rounded-2xl flex flex-col items-center justify-center text-center gap-2">
                        <span className="text-zinc-400 text-xl">
                          گشتی وەرزەکان
                        </span>
                        <span className="text-5xl font-black">
                          {data.number_of_seasons}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="bg-zinc-900/60 border border-zinc-800 p-5 rounded-2xl flex flex-col items-center justify-center text-center gap-2">
                        <span className="text-zinc-400 text-xl">
                          ساڵی بەرهەم
                        </span>
                        <span className="text-5xl font-black">{year}</span>
                      </div>
                      <div className="bg-zinc-900/60 border border-zinc-800 p-5 rounded-2xl flex flex-col items-center justify-center text-center gap-2">
                        <span className="text-zinc-400 text-xl">
                          هەڵسەنگاندن
                        </span>
                        <span className="text-5xl font-black text-gold">
                          {data.vote_average?.toFixed(1) || '0'}
                        </span>
                      </div>
                      <div className="bg-zinc-900/60 border border-zinc-800 p-5 rounded-2xl flex flex-col items-center justify-center text-center gap-2">
                        <span className="text-zinc-400 text-xl">
                          ماوەی فیلم
                        </span>
                        <span className="text-5xl font-black">
                          {data.runtime ? `${data.runtime} خولەک` : 'سینەمایی'}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {/* Summary Box */}
                <div className="bg-zinc-900/30 border border-zinc-800/80 p-6 rounded-2xl">
                  <p className="text-zinc-300 text-xl leading-relaxed line-clamp-4">
                    {activeOverview || 'کورتەباس بۆ ئەم بەرهەمە بەردەست نییە.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom URL Bar */}
            <div
              className="w-full text-3xl font-bold uppercase flex items-center justify-between border-t border-zinc-900/60 pt-8 pb-4 text-white tracking-wider px-4 relative z-10"
              dir="ltr"
            >
              <span className="flex items-center gap-3">
                <Globe size={36} className="mb-1" /> https://jerfilm.vip
              </span>
              <div className="flex items-center gap-4">
                <TelegramIcon className="text-white" width={36} height={36} />
                <TiktokIcon className="text-white" width={30} height={30} />
                <InstagramIcon className="text-white" width={36} height={36} />
                <span>JERFILM_VIP</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fallback Message for Mobile viewport */}
      <div
        className="relative md:hidden flex flex-col text-center justify-center items-center gap-4 h-fit min-h-[calc(100dvh-64px)] px-4 py-48 overflow-hidden select-none"
        dir="rtl"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex items-center justify-center w-20 h-20 bg-zinc-900/80 border border-zinc-800 rounded-3xl mb-2 shadow-2xl shadow-black/40">
          <LaptopMinimalCheck size={36} strokeWidth={2} className="text-gold" />
        </div>

        <div className="flex flex-col gap-2 max-w-xl z-10">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            ئەم لاپەڕەیە بۆ شاشەی بچووک گونجاو نییە
          </h1>
          <p className="text-zinc-400 text-sm leading-relaxed px-2">
            تکایە شاشەیەکی گەورە وەک ئایپاد یان کۆمپیوتەر بەکاربهێنن بۆ
            دروستکردن و کارپێکردنی پۆستەرە فەرمییەکان بە کوالیتی بەرز.
          </p>
        </div>
      </div>
    </div>
  );
}
