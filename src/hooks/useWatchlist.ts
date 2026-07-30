import { useState, useEffect, useCallback } from 'react';
import { WatchlistItem, WatchStatus } from '../types';

const STORAGE_KEY = 'cinestream_watchlist_v1';

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlist));
    } catch (e) {
      console.error('Failed to save watchlist to localStorage:', e);
    }
  }, [watchlist]);

  const addToWatchlist = useCallback((item: Omit<WatchlistItem, 'addedAt'>) => {
    setWatchlist(prev => {
      const exists = prev.find(i => i.id === item.id && i.mediaType === item.mediaType);
      if (exists) return prev;
      return [{ ...item, addedAt: Date.now() }, ...prev];
    });
  }, []);

  const removeFromWatchlist = useCallback((id: number, mediaType: 'movie' | 'tv') => {
    setWatchlist(prev => prev.filter(i => !(i.id === id && i.mediaType === mediaType)));
  }, []);

  const updateWatchlistStatus = useCallback((id: number, mediaType: 'movie' | 'tv', status: WatchStatus) => {
    setWatchlist(prev => prev.map(i => {
      if (i.id === id && i.mediaType === mediaType) {
        return { ...i, status };
      }
      return i;
    }));
  }, []);

  const updateTvProgress = useCallback((id: number, season: number, episode: number) => {
    setWatchlist(prev => prev.map(i => {
      if (i.id === id && i.mediaType === 'tv') {
        return {
          ...i,
          lastWatchedSeason: season,
          lastWatchedEpisode: episode,
          status: i.status === 'plan' ? 'watching' : i.status
        };
      }
      return i;
    }));
  }, []);

  const isInWatchlist = useCallback((id: number, mediaType: 'movie' | 'tv') => {
    return watchlist.some(i => i.id === id && i.mediaType === mediaType);
  }, [watchlist]);

  const getWatchlistItem = useCallback((id: number, mediaType: 'movie' | 'tv') => {
    return watchlist.find(i => i.id === id && i.mediaType === mediaType);
  }, [watchlist]);

  return {
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    updateWatchlistStatus,
    updateTvProgress,
    isInWatchlist,
    getWatchlistItem
  };
}
