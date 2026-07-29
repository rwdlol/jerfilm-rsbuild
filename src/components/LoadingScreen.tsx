import { Loader } from 'lucide-react';

export default function LoadingScreen() {
  return (
    <div className="relative flex flex-col text-center justify-center items-center gap-4 h-fit min-h-[calc(100dvh-64px)] px-4 py-48 overflow-hidden select-none">
      {/* Background subtle gold glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

      {/* Rotating Loader Icon Badge */}
      <div className="relative flex items-center justify-center w-20 h-20 bg-zinc-900/80 border border-zinc-800 rounded-3xl mb-2 shadow-2xl shadow-black/40">
        <Loader size={36} strokeWidth={2} className="text-gold animate-spin" />
      </div>

      {/* Text Info Container */}
      <div className="flex flex-col gap-2 max-w-xl z-10">
        <h1 className="text-2xl font-bold text-white tracking-tight">
          بارکردنی داتاکان و ئامادەکردنی ناوەڕۆک...
        </h1>
        <p className="text-zinc-400 text-sm leading-relaxed px-2">
          تکایە کەمێک چاوەڕوان بە تا لاپەڕەی داواکراو بە تەواوی ئامادە دەبێت
        </p>
      </div>
    </div>
  );
}
