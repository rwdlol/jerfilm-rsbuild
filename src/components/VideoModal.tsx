import React from 'react';
import { X, Youtube } from 'lucide-react';
import { Video } from '../types';

interface VideoModalProps {
  video: Video | null;
  title: string;
  onClose: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({ video, title, onClose }) => {
  if (!video) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        {/* Modal Header */}
        <div className="p-3.5 sm:p-4 bg-zinc-950 flex items-center justify-between border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Youtube className="w-5 h-5 text-red-500" />
            <h3 className="text-sm sm:text-base font-bold text-white line-clamp-1">
              {title} - {video.name || 'ترایلەر'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player iFrame */}
        <div className="relative aspect-video w-full bg-black">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.key}?autoplay=1`}
            title={video.name}
            style={{ width: '100%', height: '100%' }}
            frameBorder="0"
            allow="autoplay *; fullscreen *; picture-in-picture *; encrypted-media *"
            referrerPolicy="no-referrer"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
};
