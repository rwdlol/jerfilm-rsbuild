import { Info, Target, ShieldAlert, Mail } from 'lucide-react';

export default function About() {
  return (
    <div className="relative flex flex-col w-full gap-8 pb-8 py-6">
      {/* Background subtle amber/gold glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

      {/* Page Header */}
      <section className="relative z-10 flex flex-col gap-1.5 border-b border-zinc-900 pb-4">
        <h1 className="text-3xl font-black text-white tracking-tight">
          سەبارەت بە JerFilm.<span className="text-gold">VIP</span>
        </h1>
        <p className="text-zinc-400">
          پلاتفۆرمێکی فێرکاری و سەرچاوە کراوە بۆ فیلم و زنجیرە جیهانییەکان
        </p>
      </section>

      {/* Grid Layout for Core Content */}
      <section className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: About Us / Website Idea */}
        <div className="bg-zinc-900/25 backdrop-blur-sm border border-zinc-800 p-6 rounded-3xl flex flex-col gap-3 shadow-xl">
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-3 mb-1">
            <Info size={18} className="text-gold" />
            <h2 className="font-bold text-white">بیرۆکەی ماڵپەڕەکەمان</h2>
          </div>
          <p className="text-zinc-300 text-sm leading-relaxed">
            بەرخێرهاتی بۆ JerFilm.VIP! ئەم ماڵپەڕە وەک سەکۆیەکی سادە و گونجاو
            دروستکراوە بۆ گەڕان و دۆزینەوەی کۆتا فیلم و زنجیرە جیهانییەکان بە
            شێوازێکی ئاسان و خێرا.
          </p>
          <p className="text-zinc-400 text-sm leading-relaxed mt-1">
            <span className="text-zinc-500 font-semibold">ئامانجی پڕۆژە:</span>{' '}
            دابینکردنی پلاتفۆرمێکی گونجاوە بۆ بەکارهێنەران بۆ دۆزینەوەی فیلمە
            دڵخوازەکانیان بەبێ تێپەڕبوون بە ڕێڕەوە ئاڵۆزەکانی ماڵپەڕە
            ئاساییەکان.
          </p>
        </div>

        {/* Card 2: Our Mission */}
        <div className="bg-zinc-900/25 backdrop-blur-sm border border-zinc-800 p-6 rounded-3xl flex flex-col gap-3 shadow-xl">
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-3 mb-1">
            <Target size={18} className="text-gold" />
            <h2 className="font-bold text-white">ئامانجی سەرەکیمان</h2>
          </div>
          <p className="text-zinc-300 text-sm leading-relaxed">
            ئامانجمان دابینکردنی ژینگەیەکی بینینی ئاسان و بێ بەرامبەرە بۆ
            خولیایانی فیلم و زنجیرەکان، بەبێ بوونی هیچ جۆرە ڕێکلامێکی بێزارکەر
            کە کار بکاتە سەر ئەزموونی بەکارهێنانی ڕۆژانەتان.
          </p>
          <p className="text-zinc-400 text-sm leading-relaxed mt-1">
            ئێمە هەوڵدەدەین بە خێراترین کات کۆتا داتاکان بخەینە بەردەستان لەگەڵ
            ڕێکخستنی سیستەمی بزوێنەری گەڕان و پەخشکردنی هاوچەرخ.
          </p>
        </div>

        {/* Card 3: Content & Educational Licensing Disclaimer */}
        <div className="bg-zinc-900/25 backdrop-blur-sm border border-zinc-800 p-6 rounded-3xl flex flex-col gap-3 shadow-xl md:col-span-2">
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-3 mb-1">
            <ShieldAlert size={18} className="text-rose-500" />
            <h2 className="font-bold text-white">
              ڕوونکردنەوەی یاسایی و ناوەڕۆکی میدیا
            </h2>
          </div>
          <p className="text-zinc-300 text-sm leading-relaxed">
            ئەم پڕۆژەیە تەنها بۆ مەبەستی فێربوون و تاقیکردنەوەی تەکنەلۆژیاکانی
            وێب پەرەی پێدراوە. ماڵپەڕی JerFilm.VIP بە هیچ شێوەیەک هیچ جۆرە
            مەلەفێکی ڤیدیۆیی لەسەر سێرڤەرەکانی خۆی پاشەکەوت ناکات و دابەشناکات.
          </p>
          <p className="text-zinc-400 text-sm leading-relaxed">
            سەرجەم داتاکان، پۆستەرەکان، و ژیاننامەی کەسایەتییەکان لە ڕێگەی
            ناردنی داواکاری لە API فەرمییەکانی TMDB دابینکراون. لینکی پەخشەکانیش
            بەستراونەتەوە بە سێرڤەرەکانی دەرەکی مێدیای لایەنی سێیەم (Third-Party
            Media) کە کۆنترۆڵکردنیان لە دەرەوەی دەسەڵاتی ئێمەدایە.
          </p>
        </div>

        {/* Card 4: Contact Us */}
        <div className="bg-zinc-900/25 backdrop-blur-sm border border-zinc-800 p-6 rounded-3xl flex flex-col gap-3 shadow-xl md:col-span-2">
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-3 mb-1">
            <Mail size={18} className="text-gold" />
            <h2 className="font-bold text-white">پەیوەندیکردن بە ئێمە</h2>
          </div>
          <p className="text-zinc-300 text-sm leading-relaxed">
            ئەگەر هەر پرسیارێک، پێشنیارێک، یان سەرنجێکتان هەیە لەسەر کارکردنی
            ماڵپەڕەکە یان پڕۆژەکە، بە خۆشحاڵییەوە دەتوانن لە ڕێگەی ئیمەیڵی
            فەرمیمانەوە پەیوەندیمان پێوە بکەن:
          </p>

          {/* Styled Premium Email Link */}
          <a
            href="mailto:contact@jerfilm.vip"
            className="w-fit flex items-center gap-2 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 p-2 px-4 rounded-xl text-white text-sm transition-all shadow-md mt-1"
          >
            <span>contact@jerfilm.vip</span>
          </a>
        </div>
      </section>
    </div>
  );
}
