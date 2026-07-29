import { useState, useEffect, useRef } from 'react';
import { useLocation, useParams } from 'react-router';
import { useTMDB } from '../../utils/tmdb';
import {
  LaptopMinimalCheck,
  Loader,
  Star,
  Download,
  Globe,
} from 'lucide-react';
import { tToSorani, tToSoraniList } from '../../utils/tToSorani';
import { InstagramIcon } from '../../components/icons/instagram';
import { TelegramPlaneIcon } from '../../components/icons/telegram';

interface SeasonDetail {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  season_number: number;
  episodes: any[];
}

export default function ImageGenerator() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const captureRef = useRef<HTMLDivElement>(null);

  const isTV = location.pathname.includes('/tv/');
  const endpoint = isTV ? `/tv/${id}` : `/movie/${id}`;

  const [selectedSeason, setSelectedSeason] = useState<number | null>(null);

  // Fetch movie/series details
  const [data, loading, error] = useTMDB<any>(id ? endpoint : null);

  // Fetch season-specific details if it is a TV show and a season is selected
  const [seasonData, seasonLoading] = useTMDB<SeasonDetail>(
    isTV && id && selectedSeason !== null
      ? `/tv/${id}/season/${selectedSeason}`
      : null,
  );

  // Auto-set to the first season on TV load
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

  // Action to export/download the image
  const handleDownload = async () => {
    if (!captureRef.current) return;
    try {
      const { toPng } = await import('html-to-image');
      const dataUrl = await toPng(captureRef.current, {
        quality: 1.0,
        pixelRatio: 2, // Generates ultra-high-definition images
      });
      const link = document.createElement('a');
      link.download = `${data?.title || data?.name || 'poster'}-instagram.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error generating image export:', err);
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

  // Fallbacks and formatting
  const title = data.title || data.name || 'ناونیشان';
  const originalTitle = data.original_title || data.original_name;
  const dateStr = data.release_date || data.first_air_date;
  const year = dateStr ? new Date(dateStr).getFullYear() : '2025';

  // Decide which poster and metadata to show (Selected Season or Series Default)
  const activePosterPath =
    isTV && seasonData?.poster_path ? seasonData.poster_path : data.poster_path;
  const activeOverview =
    isTV && seasonData?.overview ? seasonData.overview : data.overview;

  const posterUrl = `https://image.tmdb.org/t/p/w780${activePosterPath}`;
  const backdropUrl = `https://image.tmdb.org/t/p/original${data.backdrop_path}`;
  const genresList = tToSoraniList(data.genres?.map((g: any) => g.name) || []);

  return (
    <div className="min-h-screen bg-zinc-950 py-10 flex flex-col items-center gap-6 select-none">
      {/* Action panel header */}
      <div className="w-full px-4 flex justify-center items-center ">
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 bg-gold hover:bg-yellow-400 text-black font-black text-xl py-3 px-6 rounded-2xl transition shadow-xl cursor-pointer"
        >
          <Download size={14} /> <span>داگرتنی وێنەی پۆستەر</span>
        </button>
      </div>

      {/* Season Selection Pills (Only visible for TV Shows) */}
      {isTV && data.seasons && data.seasons.length > 0 && (
        <div
          className="w-full max-w-7xl px-4 flex flex-col gap-2 text-right"
          dir="rtl"
        >
          <span className="text-xs font-semibold text-zinc-500">
            دەستنیشانکردنی وەرزی بڵاوکراوە:
          </span>
          <div className="flex flex-row overflow-x-auto gap-2 pb-2 scrollbar-none">
            {data.seasons.map((season: any) => (
              <button
                key={season.id}
                onClick={() => setSelectedSeason(season.season_number)}
                className={`shrink-0 text-xs font-bold py-2.5 px-4 rounded-xl transition cursor-pointer border ${
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

      {/* C. Image Generator Workspace Canvas (Hidden on small mobile viewports) */}
      <div className="hidden md:block">
        {/* Layout 1: Movie Canvas (Vertical 1080 x 1440) */}
        {!isTV && (
          <div
            ref={captureRef}
            className="relative flex flex-col items-center justify-between p-12 overflow-hidden bg-zinc-950 text-white border border-zinc-900 shadow-2xl"
            style={{ width: '1080px', height: '1440px' }}
          >
            {/* Blurred Background layer */}
            {data.backdrop_path && (
              <img
                src={backdropUrl}
                alt="backdrop"
                className="absolute inset-0 w-full h-full object-cover blur-[40px] opacity-25 scale-110 pointer-events-none z-0"
              />
            )}
            <div className="absolute inset-0 bg-radial from-transparent via-zinc-950/40 to-zinc-950 z-0" />

            {/* Top Brand Logo */}
            <div className="font-bold text-3xl w-full flex items-center justify-between relative z-10 px-4">
              <span className="text-4xl text-white flex items-center gap-2">
                JERFILM<span className="text-gold">.VIP</span>
              </span>
              <h2 className="text-gold">فیلمی سینەمایی ژێرنووسکراوی کوردی</h2>
            </div>

            {/* Central Phone Mockup frame */}
            <div className="w-[760px] h-[1060px] rounded-2xl bg-zinc-950/90 border-8 border-zinc-800/80 overflow-hidden relative shadow-2xl shadow-black/85 flex flex-col z-10">
              {data.poster_path && (
                <img
                  src={posterUrl}
                  alt={title}
                  className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
                />
              )}

              {/* Top Capsule title */}
              <div className="relative z-10 w-fit px-8 py-2.5 border border-zinc-800 bg-zinc-950/75 backdrop-blur-xl text-white font-bold text-2xl mx-auto mt-6 shadow-xl rounded-full tracking-wide">
                {title} ({year})
              </div>

              {/* Bottom capsule meta bar */}
              <div
                className="mt-auto relative z-10 bg-zinc-950 border-t border-zinc-900 p-4.5 flex items-center justify-between text-2xl font-bold text-white px-8"
                dir="rtl"
              >
                <span>بەرهەم: {year}</span>
                <span className="flex items-center gap-1 text-gold">
                  <Star size={30} fill="currentColor" stroke="currentColor" />{' '}
                  {data.vote_average?.toFixed(1) || '0'} / 10
                </span>
              </div>
            </div>

            {/* Bottom URL Bar */}
            <div
              className="w-full text-2xl font-bold uppercase flex items-center justify-between border-t border-zinc-900/60 pt-6 text-white  tracking-wider px-6 relative z-10"
              dir="ltr"
            >
              <span className="flex items-center gap-3">
                <Globe size={30} className="mb-1" /> WWW.JERFILM.VIP
              </span>
              <div className="flex items-center gap-3">
                <TelegramPlaneIcon
                  className="text-white"
                  width={30}
                  height={30}
                />
                <InstagramIcon className="text-white" width={30} height={30} />
                <span>JERFILM_VIP</span>
              </div>
            </div>
          </div>
        )}

        {/* Layout 2: TV Series Landscape Canvas (1200 x 1080) */}
        {isTV && (
          <div
            ref={captureRef}
            className="relative flex flex-col justify-between p-12 overflow-hidden bg-zinc-950 text-white border border-zinc-900 shadow-2xl"
            style={{ width: '1080px', height: '1080px' }}
          >
            {/* Blurred Background layer */}
            {data.backdrop_path && (
              <img
                src={backdropUrl}
                alt="blur backdrop"
                className="absolute inset-0 w-full h-full object-cover blur-[45px] opacity-20 scale-110 pointer-events-none z-0"
              />
            )}
            <div className="absolute inset-0 bg-radial from-transparent via-zinc-950/30 to-zinc-950 z-0" />

            {/* 1. Header Banner */}
            <div className="font-bold text-3xl w-full flex items-center justify-between relative z-10 px-4">
              <span className="text-4xl text-white flex items-center gap-2">
                JERFILM<span className="text-gold">.VIP</span>
              </span>
              <h2 className="text-gold">زنجیرەی ژێرنووسکراوی کوردی</h2>
            </div>

            {/* 2. Content Layout split in two halves */}
            <div className="grid grid-cols-2 gap-8 items-center relative z-10 my-auto">
              {/* Left Column: Vertical TV Poster Frame */}
              <div className="flex justify-center">
                <div className="w-[560px] h-[720px] bg-zinc-950 border-[3px] border-zinc-800 overflow-hidden relative shadow-2xl flex flex-col justify-between">
                  <img
                    src={posterUrl}
                    alt={title}
                    className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent z-0" />

                  {/* Poster bottom info */}
                  <div
                    className="mt-auto relative z-10 p-4 flex items-center justify-between text-2xl text-zinc-300 font-bold bg-zinc-950/80 border-t border-zinc-900"
                    dir="rtl"
                  >
                    <span>SIGMA BOY</span>
                    <span className="flex items-center gap-1 text-gold">
                      <Star
                        size={26}
                        fill="currentColor"
                        stroke="currentColor"
                      />{' '}
                      {data.vote_average?.toFixed(1) || '0'}/10
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: TV Series Metadata details (Matching design 2) */}
              <div
                className="flex flex-col gap-6 text-right"
                dir="rtl"
              >
                <div>
                  <h3 className="text-3xl font-black text-white leading-tight">
                    {title}
                  </h3>
                  <p className="text-sm font-semibold text-zinc-500 mt-1  uppercase tracking-wide">
                    {seasonData?.name || `وەرزی ${selectedSeason}`} —{' '}
                    {originalTitle}
                  </p>
                </div>

                {/* Metadata list */}
                <div className="flex flex-col gap-2.5 bg-zinc-900/40 border border-zinc-800 p-5 rounded-2xl text-xs text-zinc-300">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500">وەرگێڕان:</span>
                    <span className="font-bold text-white">
                      هەستیار | جێرفیلم
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-zinc-900 pt-2.5">
                    <span className="text-zinc-500">ژانەری زنجیرە:</span>
                    <span className="font-bold text-zinc-200">
                      {genresList.slice(0, 3).join(' - ')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-zinc-900 pt-2.5">
                    <span className="text-zinc-500">بارودۆخ:</span>
                    <span className="font-bold text-zinc-200">
                      {data.status ? tToSorani(data.status) : 'نادیار'}
                    </span>
                  </div>
                </div>

                {/* Grid of stats boxes */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-2xl flex flex-col items-center justify-center text-center gap-1">
                    <span className="text-[10px] text-zinc-500 font-bold">
                      ژمارەی وەرز
                    </span>
                    <span className="text-2xl font-black text-white">
                      {selectedSeason}
                    </span>
                  </div>
                  <div className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-2xl flex flex-col items-center justify-center text-center gap-1">
                    <span className="text-[10px] text-zinc-500 font-bold">
                      ژمارەی ئەڵقەکان
                    </span>
                    <span className="text-2xl font-black text-white">
                      {seasonData?.episodes ? seasonData.episodes.length : '12'}
                    </span>
                  </div>
                  <div className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-2xl flex flex-col items-center justify-center text-center gap-1">
                    <span className="text-[10px] text-zinc-500 font-bold">
                      گشتی وەرزەکان
                    </span>
                    <span className="text-2xl font-black text-white">
                      {data.number_of_seasons}
                    </span>
                  </div>
                </div>

                {/* Overview/Summary Box */}
                <div className="flex flex-col gap-1.5">
                  <h4 className="text-xs font-bold text-zinc-500">
                    کورتەی داتا:
                  </h4>
                  <p className="text-zinc-400 text-xs leading-relaxed line-clamp-4">
                    {activeOverview || 'بۆ ئەم وەرزە کورتەباس بەردەست نییە.'}
                  </p>
                </div>
              </div>
            </div>

            {/* 3. Bottom Indicator bar */}
            <div
              className="w-full text-2xl font-bold uppercase flex items-center justify-between border-t border-zinc-900/60 pt-6 text-white  tracking-wider px-6 relative z-10"
              dir="ltr"
            >
              <span className="flex items-center gap-3">
                <Globe size={30} className="mb-1" /> WWW.JERFILM.VIP
              </span>
              <div className="flex items-center gap-3">
                <TelegramPlaneIcon
                  className="text-white"
                  width={30}
                  height={30}
                />
                <InstagramIcon className="text-white" width={30} height={30} />
                <span>JERFILM_VIP</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* D. Fallback Message (Visible on Small/Mobile screens) */}
      <div
        className="relative md:hidden flex flex-col text-center justify-center items-center gap-4 h-fit min-h-[calc(100dvh-64px)] px-4 py-48 overflow-hidden select-none"
        dir="rtl"
      >
        {/* Background subtle gold glow */}
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
