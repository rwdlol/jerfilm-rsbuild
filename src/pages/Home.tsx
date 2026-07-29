import { SEO } from '../components/SEO';
import TrendingMovies from '../components/sections/TrendingMovies';
import TrendingSeries from '../components/sections/TrendingSeries';
import { HeroCarousel } from '../components/ui/HeroCarousel';
import type { Movie } from '../utils/tmdb';
import FristSlideImage from '../assets/images/netflix_banner.jpg';
import { ShieldCheck, Cpu, Zap, Heart } from 'lucide-react';

const slides: Movie[] = [
  {
    id: 0,
    title: 'بەبێ چاوەڕوانی، فیلمەکان بە کوردی ببینە!',
    poster_path: FristSlideImage,
    overview:
      'چیتر پێویست بە چاوەڕوانی وەرگێڕان ناکات. سیستەمە فەورییەکەمان ڕاستەوخۆ کار دەکات بۆت، زۆرترین خێرایی و باشترین کوالیتی بەبێ ڕێکلام.',
    cta_text: 'بینینی فیلمەکان',
    cta_link: '/movie',
    cta_type: 'gold',
  },
  {
    id: 1,
    title: 'خێراترین پەخشی زنجیرە جیهانییەکان',
    poster_path: FristSlideImage,
    overview:
      'دواین ئەڵقەی زنجیرە بەردەوامەکانی جیهان بە کوالیتی بەرز و بە خێراترین کات لێرە دەست دەکەوێت. بەدواداچوون بۆ نوێترین سیزۆنەکان بکە بە ژێرنووسی کوردی.',
    cta_text: 'گەڕان لە زنجیرەکان',
    cta_link: '/tv',
    cta_type: 'gold',
  },
  {
    id: 2,
    title: 'پڕۆژەیەکی سەرچاوە کراوە و فێرکاری',
    poster_path: FristSlideImage,
    overview:
      'ئەم ماڵپەڕە بە تەواوی ئۆپن سۆرسە و بۆ مەبەستی فێربوون و تاقیکردنەوەی تەکنەلۆژیا دروستکراوە. هیچ زانیارییەکی بەکارهێنەران پاشەکەوت ناکرێت.',
    cta_text: 'گیتهەبی پڕۆژە',
    cta_link: 'https://github.com/rwdlol/jerfilm-vip',
    cta_type: 'default',
  },
];

export default function Home() {
  return (
    <>
      <SEO
        title="Home | JerFilm.VIP"
        description="Welcome to JerFilm.VIP - Best Kurdish Platform for Movies & TV Series"
      />

      {/* 1. Main Premium Slider */}
      <HeroCarousel slides={slides} />

      {/* 2. Content Sections */}
      <TrendingMovies />
      <TrendingSeries />

      {/* 3. New Content: Why Choose Us Section (Grid) */}
      <section className="w-full py-10 border-t border-zinc-900/60 mt-4">
        <div className="max-w-7xl mx-auto flex flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <h2 className="text-xl font-bold text-white tracking-tight">
              تایبەتمەندییە ناوازەکانی سەکۆکەمان
            </h2>
            <p className="text-zinc-500 text-sm">
              ئەزموونێکی جیاواز لە سەیرکردنی فیلم و زنجیرە جیهانییەکان بەبێ
              بێزارکردن
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            {/* Feature 1 */}
            <div className="bg-zinc-900/20 border border-zinc-800 p-6 rounded-2xl flex flex-col gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold">
                <Cpu size={20} />
              </div>
              <h3 className="font-bold text-white">وەرگێڕانی زیرەک (AI)</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                بەستراوەتەوە بە سیستەمی زیرەکی دەستکرد بۆ هاوکاتکردن و خێراکردنی
                وەرگێڕانی ژێرنووسەکان لەگەڵ کاتی ڕاستەقینەی ڕووداوەکان.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-zinc-900/20 border border-zinc-800 p-6 rounded-2xl flex flex-col gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
                <ShieldCheck size={20} />
              </div>
              <h3 className="font-bold text-white">بێ ڕێکلامی بێزارکەر</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                ئێمە هیچ جۆرە ڕێکلامێکی بێزارکەر یان پاڵپێوەنەری بەکارناهێنین کە
                ئەزموونی بینینت تێکبدات. پلاتفۆرمەکە بە تەواوی خاوێنە.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-zinc-900/20 border border-zinc-800 p-6 rounded-2xl flex flex-col gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                <Zap size={20} />
              </div>
              <h3 className="font-bold text-white">خێرایی پەخشی نایاب</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                سێرڤەرە جۆراوجۆرەکانمان دڵنیایی دەدەن لەوەی کە بە خێراترین کات و
                بەبێ وەستان لەسەر مۆبایل و دێسکتۆپ بتوانێت پەخش ببێت.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. New Content: Open Source Commitment Banner */}
      <section className="w-full pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-col gap-1.5 max-w-2xl">
              <span className="flex items-center gap-1.5 text-sm text-rose-500 font-bold bg-rose-500/10 w-fit px-3 py-1 rounded-full border border-rose-500/20">
                <Heart size={12} fill="currentColor" /> پڕۆژەی فێرکاری ئۆپن سۆرس
              </span>
              <h3 className="font-bold text-white mt-1">
                یارمەتیدەربین لە پەرەپێدانی ئەم پڕۆژەیە
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                کۆدەکانمان بە تەواوی لەسەر کۆگای گشتی لە گیتهەب بەردەستن.
                پڕۆژەکە تەنها تاقیکردنەوەی زانستی و فێرکاری و کارپێکردنی
                APIـەکانی TMDBـەیە بەبێ هیچ پاشەکەوتکردنێکی داتای تایبەت.
              </p>
            </div>
            <a
              href="https://github.com/rwdlol/jerfilm-vip"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white font-bold text-sm py-3 px-5 rounded-2xl transition-all duration-200 shrink-0 cursor-pointer"
            >
              کۆدی پڕۆژە لە گیتهەب
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
