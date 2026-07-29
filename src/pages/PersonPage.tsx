import { useState } from 'react';
import { Link } from 'react-router';
import { useTMDB, type Movie, type TMDBResponseList } from '../utils/tmdb';
import { HeroCarousel } from '../components/ui/HeroCarousel';
import {
  SlidersHorizontal,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  User,
} from 'lucide-react';
import { tToSorani } from '../utils/tToSorani';

interface KnownFor {
  id: number;
  title?: string;
  name?: string;
  backdrop_path?: string;
}

interface Person {
  id: number;
  name: string;
  profile_path: string | null;
  known_for_department?: string;
  known_for?: KnownFor[];
}

const SORT_OPTIONS = [
  { value: 'popular', label: 'ئەکتەرە ناودارەکان (Popular)' },
  { value: 'trending_day', label: 'ترێندی ئەمڕۆ (Trending Today)' },
  { value: 'trending_week', label: 'ترێندی ئەم هەفتە (Trending This Week)' },
];

export default function PersonPage() {
  const [page, setPage] = useState(1);
  const [filterType, setFilterType] = useState<string>('trending_week');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Dropdown toggler
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  // 1. Fetch featured popular actors for the top Carousel
  const [popularData] = useTMDB<TMDBResponseList<Person>>(
    '/person/popular?page=1',
  );

  // Transform Person data to Movie shape for the HeroCarousel (using known_for backdrop for premium looks)
  const featuredSlides: Movie[] = (popularData?.results || [])
    .slice(0, 5)
    .map((person) => {
      // Find a project with a valid backdrop so the actor's slide backdrop is gorgeous
      const projectWithBackdrop = person.known_for?.find(
        (item) => item.backdrop_path,
      );
      const backdropPath =
        projectWithBackdrop?.backdrop_path || person.profile_path || '';

      return {
        id: person.id,
        title: person.name,
        backdrop_path: backdropPath,
        poster_path: person.profile_path || '',
        overview: `ناسراوە بە بەشداریی لە: ${
          person.known_for?.map((m) => m.title || m.name).join('، ') ||
          'ناوەڕۆک'
        }. بەشی سەرەکی کارکردن: ${tToSorani(person.known_for_department as string) || 'ئەکتەر'}.`,
        cta_text: 'بینینی پەڕەی ئەکتەر',
        cta_link: `/person/${person.id}`,
        cta_type: 'gold',
      };
    });

  // 2. Construct API path dynamically for grid listing
  let apiPath = '';
  if (searchQuery.trim() !== '') {
    apiPath = `/search/person?include_adult=false&query=${encodeURIComponent(searchQuery)}&page=${page}`;
  } else if (filterType === 'popular') {
    apiPath = `/person/popular?page=${page}`;
  } else if (filterType === 'trending_day') {
    apiPath = `/trending/person/day?page=${page}`;
  } else if (filterType === 'trending_week') {
    apiPath = `/trending/person/week?page=${page}`;
  }

  // Fetch people data
  const [peopleData, peopleLoading, peopleError] =
    useTMDB<TMDBResponseList<Person>>(apiPath);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  const handleFilterTypeChange = (type: string) => {
    setSearchQuery('');
    setFilterType(type);
    setPage(1);
    setIsSortDropdownOpen(false);
  };

  const activeSortObj = SORT_OPTIONS.find((o) => o.value === filterType);
  const selectedSortLabel =
    activeSortObj?.label || 'ئەکتەرە ناودارەکان (Popular)';

  return (
    <div className="flex flex-col w-full gap-8 pb-8">
      {/* A. Featured Actors Carousel */}
      {featuredSlides.length > 0 && (
        <section className="w-full">
          <HeroCarousel slides={featuredSlides} />
        </section>
      )}

      {/* C. Filter and Search Hub */}
      <section className="flex flex-col">
        <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-6 flex flex-col gap-4 shadow-xl">
          <div className="flex items-center gap-2 border-b border-zinc-900 pb-3">
            <SlidersHorizontal size={18} className="text-gold" />
            <h2 className="text-lg font-bold text-white">
              دۆزینەوەی کەسایەتییەکان
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. Dynamic Text Search Input */}
            <div className="flex flex-col gap-1.5 relative">
              <label className="text-xs text-zinc-500">گەڕانی خێرا</label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="ناوی ئەکتەر یان ستاف بنووسە..."
                  className="w-full bg-zinc-900 border border-zinc-800 text-zinc-300 text-sm p-3 pr-10 rounded-2xl outline-none focus:border-zinc-700/80 transition-colors"
                />
                <Search
                  size={16}
                  className="absolute right-3.5 text-zinc-500"
                />
              </div>
            </div>

            {/* 2. Custom Sort Dropdown */}
            <div className="flex flex-col gap-1.5 relative z-20">
              <label className="text-xs text-zinc-500">
                پێشاندانی ئەکتەر بەپێی:
              </label>
              <button
                type="button"
                disabled={searchQuery.trim() !== ''}
                onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                className="w-full flex items-center justify-between bg-zinc-900 border border-zinc-800 text-zinc-300 text-sm p-3 rounded-2xl outline-none focus:border-zinc-700 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <span>{selectedSortLabel}</span>
                <ChevronDown
                  size={16}
                  className={`text-zinc-500 transition-transform ${isSortDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Sort Menu panel */}
              {isSortDropdownOpen && searchQuery.trim() === '' && (
                <div className="absolute top-17 right-0 left-0 bg-zinc-900 border border-zinc-800/80 p-2 rounded-2xl flex flex-col gap-1 max-h-56 overflow-y-auto shadow-2xl z-30">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleFilterTypeChange(opt.value)}
                      className="w-full text-zinc-300 text-xs py-2 px-3 hover:text-white hover:bg-zinc-800 rounded-xl cursor-pointer select-none transition-colors"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* D. Circular Person Grid Section (Responsive 2 to 5 columns) */}
      <section className="px-4 md:px-8 flex flex-col gap-6">
        {peopleLoading && (
          <div className="text-zinc-500 text-sm text-center py-12">
            بارکردنی زانیاری کەسایەتییەکان...
          </div>
        )}

        {peopleError && (
          <div className="text-red-500 text-sm text-center py-12">
            هەڵەیەک لە بارکردنی داتاکاندا ڕوویدا: {peopleError.message}
          </div>
        )}

        {!peopleLoading && !peopleError && peopleData?.results && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {peopleData.results.map((person) => {
                return (
                  <Link
                    to={`/person/${person.id}`}
                    key={person.id}
                    title={person.name}
                    className="group flex flex-col items-center text-center transition-all duration-300"
                  >
                    {/* Circle Image Wrapper */}
                    <div className="relative aspect-square w-32 sm:w-40 rounded-full overflow-hidden border border-zinc-900 bg-zinc-950 shadow-md group-hover:border-zinc-700/50 group-hover:shadow-lg group-hover:shadow-amber-500/5 transition-all duration-350">
                      {person.profile_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w300${person.profile_path}`}
                          alt={person.name}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 pointer-events-none"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-600 bg-zinc-900">
                          <User size={40} />
                        </div>
                      )}
                    </div>

                    {/* Text Metadata */}
                    <div className="flex flex-col gap-0.5 mt-3 px-2 w-full">
                      <h3 className="text-sm font-bold text-zinc-200 group-hover:text-gold transition-colors duration-200 truncate leading-tight">
                        {person.name}
                      </h3>
                      {person.known_for && person.known_for.length > 0 ? (
                        <p className="text-xs text-zinc-500 truncate mt-0.5">
                          ناسراوە بە:{' '}
                          {person.known_for
                            .map((m) => m.title || m.name)
                            .slice(0, 2)
                            .join('، ')}
                        </p>
                      ) : (
                        <p className="text-xs text-zinc-500">
                          {person.known_for_department}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* E. Bottom Pagination bar */}
            {peopleData.total_pages > 1 && (
              <div className="flex items-center justify-center gap-4 border-t border-zinc-900 pt-6 mt-4 select-none">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="flex items-center gap-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white text-xs font-bold py-2.5 px-4 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                >
                  <ChevronRight size={14} /> <span>پەڕەی پێشوو</span>
                </button>

                <span className="text-xs text-zinc-400">
                  لاپەڕەی {page.toLocaleString('ku-IQ')} لە{' '}
                  {peopleData.total_pages.toLocaleString('ku-IQ')}
                </span>

                <button
                  type="button"
                  disabled={page >= peopleData.total_pages}
                  onClick={() => setPage((p) => p + 1)}
                  className="flex items-center gap-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white text-xs font-bold py-2.5 px-4 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                >
                  <span>پەڕەی داهاتوو</span> <ChevronLeft size={14} />
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
