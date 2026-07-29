import { Ban } from 'lucide-react';
import { Link } from 'react-router';

export default function AdultContent() {
  return (
    <div className="relative flex flex-col text-center justify-center items-center gap-4 h-fit py-48 px-4 overflow-hidden select-none">
      {/* Background subtle red glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Warning Icon Badge */}
      <div className="relative flex items-center justify-center w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-3xl mb-2 shadow-2xl shadow-red-500/5 animate-pulse">
        <Ban size={36} className="text-red-500" />
      </div>

      {/* Text Warning Container */}
      <div className="flex flex-col gap-2 max-w-xl z-10">
        <h1 className="text-2xl font-bold text-white tracking-tight">
          ئاگاداری ناوەڕۆکی +١٨
        </h1>
        <p className="text-zinc-400 leading-relaxed px-2">
          ماڵپەڕەکەمان ناوەڕۆکی +١٨ (بۆ سەرووی هەژدە ساڵ) پیشان نادات. بۆ
          دۆزینەوەی ناوەڕۆکی گونجاو، تکایە بگەڕێوە بۆ پەڕەی سەرەکی.
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
