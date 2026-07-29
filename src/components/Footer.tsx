import { ExternalLink } from 'lucide-react';
import { Link } from 'react-router';

export default function Footer() {
  return (
    <footer className="relative z-0 flex flex-col w-full h-fit bg-zinc-950 border-t border-zinc-900">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-12 w-full max-w-7xl mx-auto px-4 h-fit">
        {/* Logo and About Section */}
        <div className="col-span-1 md:col-span-2 flex flex-col gap-3 mb-4 md:mb-0">
          <h2 className="text-2xl text-white tracking-tight">
            JerFilm<span className="text-gold">.VIP</span>
          </h2>
          <p className="max-w-md text-zinc-400 leading-relaxed">
            گەورەترین ماڵپەڕی کوردی بۆ فیلم و زنجیرەی جیهانی بە ژێرنووسی کوردی.
            خێراترین سیستەمی وەرگێڕانی بێ ڕێکلام. ئیتر چاوەڕوانی نییە، سیستەمی
            ai ی ئۆتۆماتیکی هەموو شتێکت بۆ وەرگێڕاوە.
          </p>
        </div>

        {/* Quick Links Column */}
        <div className="flex flex-col gap-3">
          <h3 className="text-white font-bold tracking-wide">لاپەڕەکان</h3>
          <ul className="flex flex-col gap-2.5">
            <li>
              <Link
                to="/"
                className="text-zinc-400 hover:text-gold transition-colors duration-200"
              >
                ماڵەوە
              </Link>
            </li>
            <li>
              <Link
                to="/movie"
                className="text-zinc-400 hover:text-gold transition-colors duration-200"
              >
                فیلمەکان
              </Link>
            </li>
            <li>
              <Link
                to="/tv"
                className="text-zinc-400 hover:text-gold transition-colors duration-200"
              >
                زنجیرە
              </Link>
            </li>
            <li>
              <Link
                to="/person"
                className="text-zinc-400 hover:text-gold transition-colors duration-200"
              >
                ئەکتەرەکان
              </Link>
            </li>
            <li>
              <Link
                to="/collection"
                className="text-zinc-400 hover:text-gold transition-colors duration-200"
              >
                کۆکراوەکان
              </Link>
            </li>
          </ul>
        </div>

        {/* Social Links Column */}
        <div className="flex flex-col gap-3">
          <h3 className="text-white font-bold tracking-wide">
            فۆڵۆومان بکەن لە...
          </h3>
          <ul className="flex flex-col gap-2.5">
            <li>
              <Link
                to="/"
                className="text-zinc-400 hover:text-gold transition-colors duration-200"
              >
                TikTok
              </Link>
            </li>
            <li>
              <Link
                to="/"
                className="text-zinc-400 hover:text-gold transition-colors duration-200"
              >
                Instagram
              </Link>
            </li>
            <li>
              <Link
                to="/"
                className="text-zinc-400 hover:text-gold transition-colors duration-200"
              >
                GitHub
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Copyright and Legal Bar */}
      <div
        dir="ltr"
        className="border-t border-zinc-900/60 bg-zinc-950/40 py-8 px-4 flex flex-col gap-4 items-center justify-center text-center"
      >
        <p className="text-zinc-400">
          &copy; {new Date().getFullYear()}{' '}
          <span className="text-white">
            JerFilm<span className="text-gold">.VIP</span>
          </span>{' '}
          -{' '}
          <Link
            to="https://github.com/rwdlol/jerfilm-vip"
            className="inline-flex items-center gap-1 text-zinc-300 hover:text-gold underline hover:no-underline transition-colors duration-200"
          >
            <span>Open Source Project</span> <ExternalLink size={12} />
          </Link>
        </p>

        {/* Legal Disclaimer in English */}
        <p className="max-w-2xl text-sm text-zinc-400 leading-relaxed">
          THIS PROJECT IS FOR EDUCATIONAL PURPOSES ONLY! This site does not
          store any files and we do not track users; it only links to
          third-party media. Hosted on GitHub Pages. We use the TMDB API but are
          not endorsed or certified by TMDB. We do not Save any user data or
          track users.
        </p>
      </div>
    </footer>
  );
}
