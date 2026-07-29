import { SearchX } from 'lucide-react';
import { Link } from 'react-router';

export default function NotFound() {
  return (
    <div className="relative flex flex-col text-center justify-center items-center gap-4 h-fit px-4 py-48 overflow-hidden select-none">
      {/* Background subtle gold glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

      {/* Not Found Icon Badge */}
      <div className="relative flex items-center justify-center w-20 h-20 bg-zinc-900/80 border border-zinc-800 rounded-3xl mb-2 shadow-2xl shadow-black/40">
        <SearchX size={36} strokeWidth={1.5} className="text-zinc-400" />
      </div>

      {/* Text Info Container */}
      <div className="flex flex-col gap-2 max-w-xl z-10">
        <h1 className="text-2xl font-bold text-white tracking-tight">
          نەدۆزرایەوە
        </h1>
        <p className="text-zinc-400 leading-relaxed px-2">
          هیچ پێناسەیەک نەدۆزرایەوە. تکایە بۆ دۆزینەوەی بەرهەمی تر بگەڕێوە بۆ
          پەڕەی سەرەکی.
        </p>
      </div>

      {/* Smooth Navigating Button */}
      <Link
        to="/"
        className="mt-4 bg-gold text-zinc-950 font-bold py-3 px-6 rounded-2xl shadow-lg shadow-gold/10 hover:bg-gold active:scale-95 transition-all duration-300 z-10"
      >
        بڕۆ بۆ پەڕەی سەرەکی
      </Link>
    </div>
  );
}
