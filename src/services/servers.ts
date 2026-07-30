import { StreamServer } from '../types';

export const STREAM_SERVERS: StreamServer[] = [
  {
    id: 'vidsrc-embed',
    name: 'VidSrc Embed (Fast HD)',
    getMovieUrl: (tmdbId: number) => `https://vidsrc-embed.ru/embed/movie?tmdb=${tmdbId}`,
    getTvUrl: (tmdbId: number, season: number, episode: number) => 
      `https://vidsrc-embed.ru/embed/tv?tmdb=${tmdbId}&season=${season}&episode=${episode}`,
  },
  {
    id: 'vidsrc-me',
    name: 'VidSrc.me',
    getMovieUrl: (tmdbId: number) => `https://vidsrc.me/embed/movie?tmdb=${tmdbId}`,
    getTvUrl: (tmdbId: number, season: number, episode: number) => 
      `https://vidsrc.me/embed/tv?tmdb=${tmdbId}&season=${season}&episode=${episode}`,
  },
  {
    id: 'vidsrc-cc',
    name: 'VidSrc.cc (Pro)',
    getMovieUrl: (tmdbId: number) => `https://vidsrc.cc/v2/embed/movie/${tmdbId}`,
    getTvUrl: (tmdbId: number, season: number, episode: number) => 
      `https://vidsrc.cc/v2/embed/tv/${tmdbId}/${season}/${episode}`,
  },
  {
    id: 'embed-2',
    name: '2Embed Server',
    getMovieUrl: (tmdbId: number) => `https://www.2embed.cc/embed/${tmdbId}`,
    getTvUrl: (tmdbId: number, season: number, episode: number) => 
      `https://www.2embed.cc/embed/tv/${tmdbId}/${season}/${episode}`,
  },
  {
    id: 'autoembed',
    name: 'AutoEmbed Stream',
    getMovieUrl: (tmdbId: number) => `https://player.autoembed.cc/embed/movie/${tmdbId}`,
    getTvUrl: (tmdbId: number, season: number, episode: number) => 
      `https://player.autoembed.cc/embed/tv/${tmdbId}/${season}/${episode}`,
  }
];
