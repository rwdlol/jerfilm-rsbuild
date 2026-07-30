import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Film, Tv, Layers, Users, Bookmark } from 'lucide-react';
import { ActiveRoute } from '../types';

interface BottomNavProps {
  currentRoute?: ActiveRoute;
  onRouteChange?: (route: ActiveRoute) => void;
  watchlistCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  watchlistCount,
}) => {
  const location = useLocation();
  const pathname = location.pathname;

  const items = [
    {
      id: 'home',
      label: 'ماڵەوە',
      icon: Home,
      path: '/',
    },
    {
      id: 'movies',
      label: 'فیلم',
      icon: Film,
      path: '/movies',
    },
    {
      id: 'tv',
      label: 'زنجیرە',
      icon: Tv,
      path: '/tv',
    },
    {
      id: 'collections',
      label: 'کۆکراوە',
      icon: Layers,
      path: '/collections',
    },
    {
      id: 'actors',
      label: 'ئەکتەران',
      icon: Users,
      path: '/actors',
    },
    {
      id: 'watchlist',
      label: 'لیستەکەم',
      icon: Bookmark,
      badge: watchlistCount > 0 ? watchlistCount : undefined,
      path: '/watchlist',
    },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#060709]/95 backdrop-blur-xl border-t border-zinc-800/80 px-1 py-1.5 shadow-2xl">
      <div className="grid grid-cols-6 items-center">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive =
            (item.path === '/' && pathname === '/') ||
            (item.path === '/movies' && (pathname.startsWith('/movies') || pathname.startsWith('/movie/') || pathname.startsWith('/watch-movie/'))) ||
            (item.path === '/tv' && (pathname.startsWith('/tv') || pathname.startsWith('/watch-tv/'))) ||
            (item.path === '/collections' && pathname.startsWith('/collections')) ||
            (item.path === '/actors' && (pathname.startsWith('/actors') || pathname.startsWith('/actor/'))) ||
            (item.path === '/watchlist' && pathname.startsWith('/watchlist'));

          return (
            <Link
              key={item.id}
              to={item.path}
              className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all relative ${
                isActive
                  ? 'text-amber-400 font-bold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${
                    isActive ? 'scale-110 text-amber-400' : ''
                  }`}
                />
                {item.badge !== undefined && (
                  <span className="absolute -top-1.5 -left-2 bg-red-600 text-white text-[8px] font-black px-1 py-0.2 rounded-full border border-zinc-950">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[9px] sm:text-[10px] mt-1 font-semibold tracking-wide line-clamp-1">
                {item.label}
              </span>
              {isActive && (
                <span className="absolute bottom-0 w-6 h-0.5 bg-amber-400 rounded-full shadow-sm shadow-amber-400/50" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
};



