import { 
  MediaItem, 
  MovieDetails, 
  TVDetails, 
  Season, 
  Credits, 
  Video, 
  Person,
  PersonDetails,
  PersonCredits,
  CollectionItem,
  Genre
} from '../types';

const DIRECT_TMDB_KEY = "9b121a7c344eeb23baad7647d6b2eabe";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/";

export function getImageUrl(path: string | null, size: 'w200' | 'w300' | 'w500' | 'w780' | 'w1280' | 'original' = 'w500'): string {
  if (!path) {
    return 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=500&auto=format&fit=crop';
  }
  return `${IMAGE_BASE_URL}${size}${path}`;
}

export const COUNTRIES_LIST = [
  { code: '', name: 'هەموو وڵاتان' },
  { code: 'US', name: 'ئەمریکا (USA)' },
  { code: 'GB', name: 'بەریتانیا (UK)' },
  { code: 'KR', name: 'کۆریای باشوور' },
  { code: 'TR', name: 'تورکیا' },
  { code: 'IN', name: 'هیندستان' },
  { code: 'FR', name: 'فەرەنسا' },
  { code: 'DE', name: 'ئەڵمانیا' },
  { code: 'JP', name: 'ژاپۆن' },
  { code: 'ES', name: 'ئیسپانیا' },
  { code: 'IT', name: 'ئیتالیا' },
  { code: 'CN', name: 'چین' },
  { code: 'IR', name: 'ئێران' },
  { code: 'EG', name: 'میصر' },
  { code: 'SY', name: 'سوریا' },
  { code: 'IQ', name: 'عێراق' },
];

async function fetchTMDB<T>(endpoint: string, params: Record<string, string | number> = {}): Promise<T> {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null) {
      query.set(key, String(val));
    }
  });

  query.set("api_key", DIRECT_TMDB_KEY);
  const directUrl = `https://api.themoviedb.org/3/${endpoint}?${query.toString()}`;
  const resDirect = await fetch(directUrl);
  if (!resDirect.ok) {
    throw new Error(`TMDB Error: ${resDirect.statusText}`);
  }
  return await resDirect.json();
}

export function filterAdultItems<T extends { adult?: boolean }>(items: T[]): T[] {
  if (!items || !Array.isArray(items)) return [];
  return items.filter(item => !item.adult);
}

export async function getTrending(mediaType: 'all' | 'movie' | 'tv' = 'all', timeWindow: 'day' | 'week' = 'day'): Promise<{ results: MediaItem[] }> {
  const data = await fetchTMDB<{ results: MediaItem[] }>(`trending/${mediaType}/${timeWindow}`);
  return { ...data, results: filterAdultItems(data.results) };
}

export async function getPopularMovies(page = 1): Promise<{ results: MediaItem[], total_pages: number }> {
  const data = await fetchTMDB<{ results: MediaItem[], total_pages: number }>('movie/popular', { page });
  return { ...data, results: filterAdultItems(data.results) };
}

export async function getTopRatedMovies(page = 1): Promise<{ results: MediaItem[], total_pages: number }> {
  const data = await fetchTMDB<{ results: MediaItem[], total_pages: number }>('movie/top_rated', { page });
  return { ...data, results: filterAdultItems(data.results) };
}

export async function getUpcomingMovies(page = 1): Promise<{ results: MediaItem[], total_pages: number }> {
  const data = await fetchTMDB<{ results: MediaItem[], total_pages: number }>('movie/upcoming', { page });
  return { ...data, results: filterAdultItems(data.results) };
}

export async function getPopularTV(page = 1): Promise<{ results: MediaItem[], total_pages: number }> {
  const data = await fetchTMDB<{ results: MediaItem[], total_pages: number }>('tv/popular', { page });
  return { ...data, results: filterAdultItems(data.results) };
}

export async function getTopRatedTV(page = 1): Promise<{ results: MediaItem[], total_pages: number }> {
  const data = await fetchTMDB<{ results: MediaItem[], total_pages: number }>('tv/top_rated', { page });
  return { ...data, results: filterAdultItems(data.results) };
}

export async function getAiringTodayTV(page = 1): Promise<{ results: MediaItem[], total_pages: number }> {
  const data = await fetchTMDB<{ results: MediaItem[], total_pages: number }>('tv/airing_today', { page });
  return { ...data, results: filterAdultItems(data.results) };
}

export async function getGenres(mediaType: 'movie' | 'tv'): Promise<{ genres: Genre[] }> {
  return fetchTMDB<{ genres: Genre[] }>(`genre/${mediaType}/list`);
}

export async function discoverMedia(
  mediaType: 'movie' | 'tv', 
  options: { genreId?: number; countryCode?: string; sortBy?: string; page?: number } = {}
): Promise<{ results: MediaItem[]; total_pages: number }> {
  const params: Record<string, string | number> = {
    page: options.page || 1,
    sort_by: options.sortBy || 'popularity.desc',
  };
  if (options.genreId) {
    params.with_genres = options.genreId;
  }
  if (options.countryCode) {
    params.with_origin_country = options.countryCode;
  }
  const data = await fetchTMDB<{ results: MediaItem[]; total_pages: number }>(`discover/${mediaType}`, params);
  return { ...data, results: filterAdultItems(data.results) };
}

export async function searchMulti(query: string, page = 1): Promise<{ results: MediaItem[]; total_pages: number }> {
  const data = await fetchTMDB<{ results: MediaItem[]; total_pages: number }>('search/multi', { query, page, include_adult: 'false' });
  return { ...data, results: filterAdultItems(data.results) };
}

export async function getMovieDetails(id: number): Promise<MovieDetails> {
  return fetchTMDB<MovieDetails>(`movie/${id}`);
}

export async function getTVDetails(id: number): Promise<TVDetails> {
  return fetchTMDB<TVDetails>(`tv/${id}`);
}

export async function getTVSeasonDetails(tvId: number, seasonNumber: number): Promise<Season> {
  return fetchTMDB<Season>(`tv/${tvId}/season/${seasonNumber}`);
}

export async function getCredits(mediaType: 'movie' | 'tv', id: number): Promise<Credits> {
  return fetchTMDB<Credits>(`${mediaType}/${id}/credits`);
}

export async function getVideos(mediaType: 'movie' | 'tv', id: number): Promise<{ results: Video[] }> {
  return fetchTMDB<{ results: Video[] }>(`${mediaType}/${id}/videos`);
}

export async function getRecommendations(mediaType: 'movie' | 'tv', id: number): Promise<{ results: MediaItem[] }> {
  const data = await fetchTMDB<{ results: MediaItem[] }>(`${mediaType}/${id}/recommendations`);
  return { ...data, results: filterAdultItems(data.results) };
}

export async function getSimilar(mediaType: 'movie' | 'tv', id: number): Promise<{ results: MediaItem[] }> {
  const data = await fetchTMDB<{ results: MediaItem[] }>(`${mediaType}/${id}/similar`);
  return { ...data, results: filterAdultItems(data.results) };
}

export async function getPopularPersons(page = 1): Promise<{ results: Person[]; total_pages: number }> {
  return fetchTMDB<{ results: Person[]; total_pages: number }>('person/popular', { page });
}

export async function getPersonDetails(id: number): Promise<PersonDetails> {
  return fetchTMDB<PersonDetails>(`person/${id}`);
}

export async function getPersonCredits(id: number): Promise<PersonCredits> {
  const data = await fetchTMDB<PersonCredits>(`person/${id}/combined_credits`);
  return {
    ...data,
    cast: filterAdultItems(data.cast || []),
    crew: filterAdultItems(data.crew || [])
  };
}

export async function getCollectionDetails(id: number): Promise<CollectionItem> {
  return fetchTMDB<CollectionItem>(`collection/${id}`);
}

