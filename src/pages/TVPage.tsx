import { useState } from 'react';
import { Link } from 'react-router';
import {
  useTMDB,
  type Serie,
  type Movie,
  type TMDBResponseList,
} from '../utils/tmdb';
import { HeroCarousel } from '../components/ui/HeroCarousel';
import {
  Play,
  Star,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Search,
  ChevronDown,
} from 'lucide-react';
import { tToSorani } from '../utils/tToSorani';

interface Genre {
  id: number;
  name: string;
}

const POPULAR_COUNTRIES = [
  { code: 'US', name: 'ئەمریکا' },
  { code: 'KR', name: 'کۆریای باشوور' },
  { code: 'JP', name: 'ژاپۆن' },
  { code: 'GB', name: 'بەریتانیا' },
  { code: 'TR', name: 'تورکیا' },
  { code: 'ES', name: 'ئیسپانیا' },
  { code: 'FR', name: 'فەڕەنسا' },
];

const SORT_OPTIONS = [
  { value: 'discover', label: 'پیشاندانی گشتی (Discover)' },
  { value: 'popular', label: 'زنجیرە بەناوبانگەکان (Popular)' },
  { value: 'trending_day', label: 'ترێندی ئەمڕۆ (Trending Today)' },
  { value: 'trending_week', label: 'ترێندی ئەم هەفتەیە (Trending Week)' },
  { value: 'top_rated', label: 'بەرزترین نمرەکان (Top Rated)' },
  { value: 'airing_today', label: 'پەخشی ئەمڕۆ (Airing Today)' },
];

export default function TVPage() {
  const [page, setPage] = useState(1);
  const [filterType, setFilterType] = useState<string>('trending_week');
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);

  // Custom dropdown open/close states
  const [isGenreDropdownOpen, setIsGenreDropdownOpen] = useState(false);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  // 1. Fetch featured popular series for the top Carousel
  const [popularData] = useTMDB<TMDBResponseList<Serie>>(
    '/trending/tv/week?page=1',
  );

  // Transform Serie data to Movie shape for the HeroCarousel
  const featuredSlides: Movie[] = (popularData?.results || [])
    .slice(0, 6)
    .map((serie) => ({
      id: serie.id,
      title: serie.name,
      backdrop_path: serie.backdrop_path || '',
      poster_path: serie.poster_path || '',
      overview: serie.overview,
      cta_text: 'سەیرکردنی زنجیرە',
      cta_link: `/tv/${serie.id}`,
      cta_type: 'gold',
    }));

  // 2. Fetch the TV Genre list dynamically
  const [genreData] = useTMDB<{ genres: Genre[] }>(
    '/genre/tv/list?language=en',
  );

  // 3. Construct the API path dynamically based on Search Query, Countries, or Genre
  let apiPath = '';
  if (searchQuery.trim() !== '') {
    apiPath = `/search/tv?include_adult=false&query=${encodeURIComponent(searchQuery)}&page=${page}`;
  } else if (filterType === 'discover') {
    const countriesParam =
      selectedCountries.length > 0
        ? `&with_origin_country=${selectedCountries.join(',')}`
        : '';
    const genresParam = selectedGenre ? `&with_genres=${selectedGenre}` : '';
    apiPath = `/discover/tv?include_adult=false&include_null_first_air_dates=false&sort_by=popularity.desc&page=${page}${genresParam}${countriesParam}`;
  } else if (filterType === 'trending_day') {
    apiPath = `/trending/tv/day?page=${page}`;
  } else if (filterType === 'trending_week') {
    apiPath = `/trending/tv/week?page=${page}`;
  } else if (filterType === 'popular') {
    apiPath = `/tv/popular?page=${page}`;
  } else if (filterType === 'top_rated') {
    apiPath = `/tv/top_rated?page=${page}`;
  } else if (filterType === 'airing_today') {
    apiPath = `/tv/airing_today?page=${page}`;
  }

  // Fetch filtered/searched TV series
  const [seriesData, seriesLoading, seriesError] =
    useTMDB<TMDBResponseList<Serie>>(apiPath);

  // Handle search input changes (resets pagination page to 1)
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  // Close all open dropdown panels
  const closeAllDropdowns = () => {
    setIsGenreDropdownOpen(false);
    setIsCountryDropdownOpen(false);
    setIsSortDropdownOpen(false);
  };

  // Handle filter/genre changes
  const handleFilterTypeChange = (type: string) => {
    setSearchQuery('');
    setFilterType(type);
    setSelectedGenre('');
    setSelectedCountries([]);
    setPage(1);
    closeAllDropdowns();
  };

  const handleGenreChange = (genreId: string) => {
    setSearchQuery('');
    setFilterType('discover'); // Genre selection defaults back to discover mode
    setSelectedGenre(genreId);
    setPage(1);
    closeAllDropdowns();
  };

  // Toggle Country code in the checkboxes list
  const handleCountryToggle = (code: string) => {
    setSearchQuery('');
    setFilterType('discover'); // Country filtering triggers discover mode
    setSelectedCountries((prev) => {
      const updated = prev.includes(code)
        ? prev.filter((c) => c !== code)
        : [...prev, code];
      setPage(1);
      return updated;
    });
  };

  // Find active label texts for display
  const activeGenreObj = genreData?.genres?.find(
    (g) => String(g.id) === selectedGenre,
  );
  const selectedGenreLabel = activeGenreObj
    ? tToSorani(activeGenreObj.name)
    : 'هەموو پۆلێنەکان';

  const activeSortObj = SORT_OPTIONS.find((o) => o.value === filterType);
  const selectedSortLabel = activeSortObj?.label || 'پیشاندانی گشتی (Discover)';

  return (
    <div className="flex flex-col w-full gap-8 pb-8">
      {/* A. Featured Series Carousel */}
      {featuredSlides.length > 0 && (
        <section className="w-full">
          <HeroCarousel slides={featuredSlides} />
        </section>
      )}

      {/* B. Filter and Control Hub (Search, Genre, Country & Sort Columns) */}
      <section className="flex flex-col">
        <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-6 flex flex-col gap-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={18} className="text-gold" />
              <h2 className="text-lg font-bold text-white">
                دۆزینەوە و فلتەرکردنی زنجیرەکان
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Dynamic Text Search Input */}
            <div className="flex flex-col gap-1.5 relative">
              <label className="text-xs text-zinc-500">گەڕانی خێرا</label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="ناوی زنجیرە بنووسە..."
                  className="w-full bg-zinc-900 border border-zinc-800 text-zinc-300 text-sm p-3 pr-10 rounded-2xl outline-none focus:border-zinc-700/80 transition-colors"
                />
                <Search
                  size={16}
                  className="absolute right-3.5 text-zinc-500"
                />
              </div>
            </div>

            {/* 2. Custom Category/Genre Dropdown */}
            <div className="flex flex-col gap-1.5 relative z-20">
              <label className="text-xs text-zinc-500">
                پۆلێنەکان (Genres)
              </label>
              <button
                type="button"
                disabled={searchQuery.trim() !== ''}
                onClick={() => {
                  setIsGenreDropdownOpen(!isGenreDropdownOpen);
                  setIsCountryDropdownOpen(false);
                  setIsSortDropdownOpen(false);
                }}
                className="w-full flex items-center justify-between bg-zinc-900 border border-zinc-800 text-zinc-300 text-sm p-3 rounded-2xl outline-none focus:border-zinc-700 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <span>{selectedGenreLabel}</span>
                <ChevronDown
                  size={16}
                  className={`text-zinc-500 transition-transform ${isGenreDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Genre Menu panel */}
              {isGenreDropdownOpen && searchQuery.trim() === '' && (
                <div className="absolute top-17 right-0 left-0 bg-zinc-900 border border-zinc-800/80 p-2 rounded-2xl flex flex-col gap-1 max-h-56 overflow-y-auto shadow-2xl z-30">
                  <button
                    type="button"
                    onClick={() => handleGenreChange('')}
                    className="w-full text-zinc-300 text-xs py-2 px-3 hover:text-white hover:bg-zinc-800 rounded-xl cursor-pointer select-none transition-colors"
                  >
                    هەموو پۆلێنەکان
                  </button>
                  {genreData?.genres?.map((genre) => (
                    <button
                      key={genre.id}
                      type="button"
                      onClick={() => handleGenreChange(String(genre.id))}
                      className="w-full text-zinc-300 text-xs py-2 px-3 hover:text-white hover:bg-zinc-800 rounded-xl cursor-pointer select-none transition-colors"
                    >
                      {tToSorani(genre.name)}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 3. Filter by Countries Dropdown with Checkboxes */}
            <div className="flex flex-col gap-1.5 relative z-20">
              <label className="text-xs text-zinc-500">وڵاتی بەرهەمهێنان</label>
              <button
                type="button"
                disabled={searchQuery.trim() !== ''}
                onClick={() => {
                  setIsCountryDropdownOpen(!isCountryDropdownOpen);
                  setIsGenreDropdownOpen(false);
                  setIsSortDropdownOpen(false);
                }}
                className="w-full flex items-center justify-between bg-zinc-900 border border-zinc-800 text-zinc-300 text-sm p-3 rounded-2xl outline-none focus:border-zinc-700 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <span>
                  {selectedCountries.length === 0
                    ? 'هەموو وڵاتەکان'
                    : `وڵاتەکان (${selectedCountries.length})`}
                </span>
                <ChevronDown
                  size={16}
                  className={`text-zinc-500 transition-transform ${isCountryDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Checkbox Floating List panel */}
              {isCountryDropdownOpen && searchQuery.trim() === '' && (
                <div className="absolute top-17 right-0 left-0 bg-zinc-900 border border-zinc-800/80 p-3 rounded-2xl flex flex-col gap-2 max-h-56 overflow-y-auto shadow-2xl z-30">
                  {POPULAR_COUNTRIES.map((country) => (
                    <label
                      key={country.code}
                      className="flex items-center gap-2.5 text-zinc-300 text-xs py-1.5 px-1 hover:text-white cursor-pointer select-none"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCountries.includes(country.code)}
                        onChange={() => handleCountryToggle(country.code)}
                        className="rounded accent-gold w-4 h-4 cursor-pointer"
                      />
                      <span>{country.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* 4. Custom Sort Dropdown */}
            <div className="flex flex-col gap-1.5 relative z-20">
              <label className="text-xs text-zinc-500">
                پێشاندانی زنجیرە بەپێی:
              </label>
              <button
                type="button"
                disabled={searchQuery.trim() !== ''}
                onClick={() => {
                  setIsSortDropdownOpen(!isSortDropdownOpen);
                  setIsGenreDropdownOpen(false);
                  setIsCountryDropdownOpen(false);
                }}
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

      {/* C. Series Grid Section (Responsive 2 to 5 columns) */}
      <section className="px-4 md:px-8 flex flex-col gap-6">
        {seriesLoading && (
          <div className="text-zinc-500 text-sm text-center py-12">
            بارکردنی داتا فلتەرکراوەکان...
          </div>
        )}

        {seriesError && (
          <div className="text-red-500 text-sm text-center py-12">
            هەڵەیەک لە بارکردنی داتاکاندا ڕوویدا: {seriesError.message}
          </div>
        )}

        {!seriesLoading && !seriesError && seriesData?.results && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {seriesData.results.map((serie) => {
                if (serie.adult) return null;
                return (
                  <Link
                    to={`/tv/${serie.id}`}
                    key={serie.id}
                    title={serie.name}
                    className="group relative flex flex-col w-full transition-all duration-300"
                  >
                    {/* Poster Element with Play Trigger hover */}
                    <div className="relative w-full aspect-2/3 rounded-2xl overflow-hidden border border-zinc-900 bg-zinc-950 shadow-md group-hover:border-zinc-700/50 group-hover:shadow-lg group-hover:shadow-gold/10 transition-all duration-350">
                      <img
                        src={`https://image.tmdb.org/t/p/w300${serie.poster_path}`}
                        alt={serie.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />

                      {/* Interactive Play icon overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
                        <div className="w-12 h-12 rounded-full bg-gold text-zinc-950 flex items-center justify-center font-bold shadow-xl shadow-gold/20 scale-90 group-hover:scale-100 transition-transform duration-300">
                          <Play
                            size={20}
                            fill="currentColor"
                            stroke="currentColor"
                            className="translate-x-[1.5px]"
                          />
                        </div>
                      </div>

                      {/* Glassmorphism Star Badge */}
                      {serie.vote_average && (
                        <div className="absolute top-2.5 right-2.5 flex items-center gap-1 text-xs bg-zinc-950/75 backdrop-blur-md border border-zinc-800/80 text-white p-1.5 px-2 rounded-xl font-bold">
                          <Star size={12} fill="gold" stroke="gold" />
                          <span>{serie.vote_average.toFixed(1)}</span>
                        </div>
                      )}
                    </div>

                    {/* Metadata Section */}
                    <div className="flex flex-col gap-0.5 mt-2.5 px-1">
                      <h3 className="text-sm font-bold text-zinc-200 group-hover:text-gold transition-colors duration-200 truncate leading-tight">
                        {serie.name}
                      </h3>
                      {serie.first_air_date && (
                        <p className="text-sm text-zinc-500 font-medium">
                          {new Date(serie.first_air_date).getFullYear()}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* D. Bottom Pagination bar */}
            {seriesData.total_pages > 1 && (
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
                  {seriesData.total_pages.toLocaleString('ku-IQ')}
                </span>

                <button
                  type="button"
                  disabled={page >= seriesData.total_pages}
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
