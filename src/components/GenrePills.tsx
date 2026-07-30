import React from 'react';
import { Genre } from '../types';
import { tToSorani } from '../utils/translate';

interface GenrePillsProps {
  genres: Genre[];
  selectedGenreId?: number;
  onSelectGenre: (genreId?: number) => void;
}

export const GenrePills: React.FC<GenrePillsProps> = ({
  genres,
  selectedGenreId,
  onSelectGenre,
}) => {
  if (!genres || genres.length === 0) return null;

  return (
    <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-2 px-4 sm:px-6">
      <button
        onClick={() => onSelectGenre(undefined)}
        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
          selectedGenreId === undefined
            ? 'bg-amber-400 text-zinc-950 border-amber-300 shadow-md shadow-amber-400/20'
            : 'bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 border-zinc-800'
        }`}
      >
        هەموو ژانەرەکان
      </button>

      {genres.map((genre) => (
        <button
          key={genre.id}
          onClick={() => onSelectGenre(genre.id)}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
            selectedGenreId === genre.id
              ? 'bg-amber-400 text-zinc-950 border-amber-300 shadow-md shadow-amber-400/20'
              : 'bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 border-zinc-800'
          }`}
        >
          {tToSorani(genre.name)}
        </button>
      ))}
    </div>
  );
};

