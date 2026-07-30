import React from 'react';
import { ShieldAlert, Home, ArrowRight } from 'lucide-react';
import { ActiveRoute } from '../types';

interface AdultBlockedNoticeProps {
  onRouteChange: (route: ActiveRoute) => void;
}

export const AdultBlockedNotice: React.FC<AdultBlockedNoticeProps> = ({ onRouteChange }) => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-zinc-900/90 border border-zinc-800 rounded-3xl p-8 text-center backdrop-blur-xl shadow-2xl animate-in zoom-in-95 duration-300 relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        
        {/* 18+ Warning Badge */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 shadow-inner">
          <ShieldAlert className="w-10 h-10" />
        </div>

        <div className="inline-block px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-black tracking-widest uppercase mb-3">
          ناوەڕۆکی شیاو نییە (18+)
        </div>

        <h2 className="text-xl font-black text-white mb-3 font-display">
          پیشاندانی ئەم بەرهەمە ڕێگەپێدراو نییە
        </h2>

        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-8">
          بەپێی یاساکانی جێر فیلم (Jerfilm.VIP)، بڵاوکردنەوە و نیشاندانی بەرهەم و فیلم و زنجیرەی تایبەت بە گەورەساڵان (+18) بە هەموو شێوەیەک قەدەغەیە.
        </p>

        <button
          onClick={() => onRouteChange({ mode: 'home' })}
          className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-zinc-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-95"
        >
          <Home className="w-4 h-4" />
          <span>گەڕانەوە بۆ پەڕەی سەرەکی</span>
        </button>
      </div>
    </div>
  );
};
