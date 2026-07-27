import { useState, useEffect } from 'react';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_API_KEY =
  import.meta.env.PUBLIC_TMDB_API_KEY || process.env.PUBLIC_TMDB_API_KEY || '';

export interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

export async function fetchTMDB<T = any>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<T> {
  if (!TMDB_API_KEY) {
    throw new Error('TMDB API Key is missing. Please check your .env file.');
  }

  const { params, headers, ...restOptions } = options;

  // Ensure path structure
  const formattedEndpoint = endpoint.startsWith('/')
    ? endpoint
    : `/${endpoint}`;
  const url = new URL(`${TMDB_BASE_URL}${formattedEndpoint}`);

  // Automatically append the API key
  url.searchParams.append('api_key', TMDB_API_KEY);

  // Append other parameters if provided
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

export function useTMDB<T = any>(
  endpoint: string | null,
  options?: FetchOptions,
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const paramsString = JSON.stringify(options?.params);

  useEffect(() => {
    if (!endpoint) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setError(null);

    fetchTMDB<T>(endpoint, options)
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
  }, [endpoint, paramsString]);

  return [data, loading, error] as const;
}

export interface TMDBResponseList<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
}
