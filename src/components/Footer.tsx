import { ExternalLink } from 'lucide-react';
import { Link } from 'react-router';

export default function Footer() {
  return (
    <footer className="relative z-0 flex flex-col w-full h-fit bg-zinc-900">
      <div className="grid md:grid-cols-4 gap-5 py-10 w-full max-w-7xl mx-auto px-4 h-fit">
        <div className="col-span-2 flex flex-col gap-2 mb-5 md:mb-0">
          <h2 className="text-2xl font-bold text-white">
            JerFilm<span className="text-gold">.VIP</span>
          </h2>
          <p className="max-w-md">
            گەورەترین ماڵپەڕی کوردی بۆ فیلم و زنجیرەی جیهانی بە ژێرنووسی کوردی.
            خێراترین سیستەمی وەرگێڕانی بێ ڕێکلام. ئیتر چاوەڕوانی نییە، سیستەمی
            ai ی ئۆتۆماتیکی هەموو شتێکت بۆ وەرگێڕاوە
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="uppercase">لاپەڕەکان</h3>
          <ul>
            <li>
              <Link
                to="/"
                className="text-zinc-400 hover:text-gold hover:underline"
              >
                ماڵەوە
              </Link>
            </li>
            <li>
              <Link
                to="/movie"
                className="text-zinc-400 hover:text-gold hover:underline"
              >
                فیلمەکان
              </Link>
            </li>
            <li>
              <Link
                to="/tv"
                className="text-zinc-400 hover:text-gold hover:underline"
              >
                زنجیرە
              </Link>
            </li>
            <li>
              <Link
                to="/person"
                className="text-zinc-400 hover:text-gold hover:underline"
              >
                ئەکتەرەکان
              </Link>
            </li>
            <li>
              <Link
                to="/collection"
                className="text-zinc-400 hover:text-gold hover:underline"
              >
                کۆکراوەکان
              </Link>
            </li>
          </ul>
        </div>
        <div className="flex flex-col gap-2">
          <h3>فۆڵۆومان بکەن لە...</h3>
          <ul>
            <li>
              <Link
                to="/"
                className="text-zinc-400 hover:text-gold hover:underline"
              >
                TikTok
              </Link>
            </li>
            <li>
              <Link
                to="/"
                className="text-zinc-400 hover:text-gold hover:underline"
              >
                Instagram
              </Link>
            </li>
            <li>
              <Link
                to="/"
                className="text-zinc-400 hover:text-gold hover:underline"
              >
                GitHub
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="p-2 py-5 flex gap-4 flex-col items-center justify-center text-center">
        <p dir="ltr">
          &copy; {new Date().getFullYear()}{' '}
          <span className="text-white">
            JerFilm<span className="text-gold">.VIP</span>
          </span>{' '}
          -{' '}
          <Link
            to="https://github.com/rwdlol/jerfilm-vip"
            className="inline-flex items-center gap-1 underline hover:no-underline"
          >
            <span>Open Source Project</span> <ExternalLink size={14} />
          </Link>
        </p>
        <p dir="ltr" className="max-w-xl text-sm text-zinc-400">
          This site does not store files on its server; it only links to
          third-party media. Hosted on GitHub Pages as an educational project.
          We use the TMDB API but are not endorsed or certified by TMDB. We do
          not Save any user data or track users.
        </p>
      </div>
    </footer>
  );
}
