import { useState } from 'react';

interface MediaPlayerProps {
  type: 'movie' | 'tv';
  id: number;
  s?: number;
  e?: number;
}

export default function MediaPlayer({ type, id, s, e }: MediaPlayerProps) {
  const [unlocked, setUnlocked] = useState(false);
  const [server, setServer] = useState('one');

  const servers = [
    { id: 'one', name: 'سێرڤەری یەک' },
    { id: 'two', name: 'سێرڤەری دوو' },
    { id: 'three', name: 'سێرڤەری سێ' },
    { id: 'four', name: 'سێرڤەری چوار' },
    { id: 'five', name: 'سێرڤەری پێنج' },
  ];

  return (
    <div className="w-full flex flex-col gap-4 my-2">
      {/* 1. Video Player Container with native aspect-video */}
      <div className="w-full aspect-video rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 shadow-2xl relative">
        {!unlocked ? (
          // Locked screen with professional overlay and English disclaimer
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-radial from-zinc-900 via-zinc-950 to-black select-none">
            <button
              type="button"
              onClick={() => setUnlocked(true)}
              className="group flex items-center gap-3 bg-gold text-black hover:bg-gold/80 font-bold px-6 py-3.5 rounded-2xl shadow-lg shadow-gold/10 hover:shadow-gold/20 active:scale-95 transition-all duration-300 cursor-pointer"
            >
              <svg
                className="w-5 h-5 fill-current transition-transform duration-300 group-hover:scale-110"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
              <span>کرتە بکە بۆ بینینی ڤیدیۆ</span>
            </button>
            <div className="hidden md:block max-w-2xl border-t border-zinc-900/60 pt-4 text-center">
              <p className="text-sm sm:text-sm text-zinc-600 leading-relaxed normal-case tracking-normal">
                Disclaimer: This is an open-source, educational project. We do
                not host, control, or distribute any media streams. All content
                is accessed via independent third-party servers which we cannot
                restrict or modify. Streaming copyrighted material may be
                illegal in your jurisdiction; please use this platform strictly
                for educational analysis.
              </p>
            </div>
          </div>
        ) : (
          <iframe
            id="player-frame"
            className="w-full h-full border-0 outline-none ring-0 overflow-hidden"
            src={`/player.html?video_id=${id}&server=${encodeURIComponent(server)}&type=${encodeURIComponent(type)}${
              s ? `&s=${encodeURIComponent(s)}` : ''
            }${e ? `&e=${encodeURIComponent(e)}` : ''}`}
            title="Media Player"
            allow="autoplay *; fullscreen *; picture-in-picture *; encrypted-media *"
            allowFullScreen
          ></iframe>
        )}
      </div>

      {/* 2. Responsive Server Tabs list */}
      <div className="flex flex-col gap-2 px-1">
        <span className="text-zinc-500">هەڵبژاردنی سێرڤەر:</span>
        <div className="flex flex-row overflow-x-auto gap-2 pb-2 scrollbar-none snap-x snap-mandatory">
          {servers.map((srv) => (
            <ServerSelector
              key={srv.id}
              isSelected={server === srv.id}
              onClick={() => setServer(srv.id)}
            >
              {srv.name}
            </ServerSelector>
          ))}
        </div>
      </div>
    </div>
  );
}

interface ServerSelectorProps {
  isSelected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function ServerSelector({
  isSelected,
  onClick,
  children,
}: ServerSelectorProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`snap-center shrink-0 min-w-32 py-2.5 px-4 text-sm  rounded-xl font-bold transition-all duration-250 cursor-pointer ${
        isSelected
          ? 'bg-gold text-black shadow-md shadow-gold/10'
          : 'bg-zinc-900/60 border border-zinc-800/80 text-zinc-300 hover:text-white hover:bg-zinc-800/80'
      }`}
    >
      {children}
    </button>
  );
}
