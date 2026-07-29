import { useState, useEffect } from 'react';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_API_KEY =
  import.meta.env.PUBLIC_TMDB_API_KEY || process.env.PUBLIC_TMDB_API_KEY || '';

export interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

export async function fetchTMDB<T = unknown>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<T> {
  if (!TMDB_API_KEY) {
    throw new Error('TMDB API Key is missing. Please check your .env file.');
  }

  const { params, headers, ...restOptions } = options;

  const formattedEndpoint = endpoint.startsWith('/')
    ? endpoint
    : `/${endpoint}`;
  const url = new URL(`${TMDB_BASE_URL}${formattedEndpoint}`);

  url.searchParams.append('api_key', TMDB_API_KEY);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  const response = await fetch(url.toString(), {
    ...restOptions,
    headers: {
      Accept: 'application/json',
      ...headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.status_message ||
        `HTTP Request failed with status ${response.status}`,
    );
  }

  return response.json();
}

export function useTMDB<T = unknown>(
  endpoint: string | null,
  options?: FetchOptions,
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(Boolean(endpoint));
  const [error, setError] = useState<Error | null>(null);
  const [prevEndpoint, setPrevEndpoint] = useState<string | null>(endpoint);

  if (endpoint !== prevEndpoint) {
    setPrevEndpoint(endpoint);
    setData(null);
    setLoading(Boolean(endpoint));
    setError(null);
  }

  const serializedOptions = JSON.stringify(options);

  useEffect(() => {
    if (!endpoint) {
      return;
    }

    let isMounted = true;

    const parsedOptions: FetchOptions | undefined = serializedOptions
      ? (JSON.parse(serializedOptions) as FetchOptions)
      : undefined;

    fetchTMDB<T>(endpoint, parsedOptions)
      .then((res) => {
        if (isMounted) {
          setData(res);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [endpoint, serializedOptions]);

  return [data, loading, error] as const;
}

export interface TMDBResponseList<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface Movie {
  adult?: boolean;
  id: number;
  title?: string;
  overview?: string;
  poster_path?: string;
  backdrop_path?: string;
  release_date?: string;
  vote_average?: number;
  cta_text?: string;
  cta_link?: string;
  cta_type?: 'gold' | 'default';
}

export interface Serie {
  adult: boolean;
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  first_air_date: string;
  vote_average: number;
}

export interface MovieDetail {
  adult?: boolean;
  id: number;
  status?: string;
  runtime?: number;
  title?: string;
  original_title?: string;
  overview?: string;
  poster_path?: string;
  vote_average?: number;
  vote_count?: number;
  release_date?: string;
  belongs_to_collection?: {
    id: number;
    name?: string;
  };
  genres?: { id: number; name: string }[];
  origin_country?: string[];
  original_language?: string;
  backdrop_path?: string;
}

export interface TVDetail {
  adult?: boolean;
  id: number;
  status?: string;
  name?: string;
  original_name?: string;
  first_air_date?: string;
  overview?: string;
  poster_path?: string;
  backdrop_path?: string;
  vote_average?: number;
  vote_count?: number;
  genres?: { id: number; name: string }[];
  languages?: string[];
  number_of_episodes?: number;
  number_of_seasons?: number;
  original_language?: string;
  origin_country?: string[];
  production_countries?: { name: string }[];
  seasons: {
    air_date: string;
    episode_count: number;
    id: number;
    name: string;
    overview: string;
    poster_path: string;
    season_number: number;
    vote_average: number;
  }[];
  spoken_languages?: {
    english_name?: string;
  };
}
