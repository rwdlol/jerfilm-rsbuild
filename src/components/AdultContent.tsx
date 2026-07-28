import { Ban } from 'lucide-react';
import { Link } from 'react-router';

export default function AdultContent() {
  return (
    <div className="flex flex-col text-center justify-center items-center gap-2 h-fit min-h-[calc(100dvh-64px)]">
      <Ban size={48} className="text-red-600" />
      <h1 className="text-xl text-white font-bold">ئاگاداری ناوەڕۆکی ١٨+</h1>
      <p className="max-w-md">
        ماڵپەڕەکەمان ناوەڕۆکی ١٨+ (بۆ سەرووی هەژدە ساڵ) پیشان نادات. بۆ
        دۆزینەوەی ناوەڕۆکی گونجاو، تکایە بگەڕێوە بۆ پەڕەی سەرەکی.
      </p>
      <Link
        to="/"
        className="mt-2 bg-gold text-zinc-950 font-bold p-2 px-4 rounded-full"
      >
        بڕۆ بۆ پەڕەی سەرەکی
      </Link>
    </div>
  );
}
