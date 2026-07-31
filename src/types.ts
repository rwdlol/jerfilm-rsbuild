export type MediaType = "movie" | "tv" | "person";

export interface Genre {
	id: number;
	name: string;
}

export interface MediaItem {
	id: number;
	title?: string;
	name?: string;
	original_title?: string;
	original_name?: string;
	overview: string;
	poster_path: string | null;
	backdrop_path: string | null;
	media_type?: MediaType;
	genre_ids?: number[];
	genres?: Genre[];
	vote_average: number;
	vote_count: number;
	release_date?: string;
	first_air_date?: string;
	popularity?: number;
	adult?: boolean;
}

export interface Cast {
	id: number;
	name: string;
	character: string;
	profile_path: string | null;
	order: number;
}

export interface Crew {
	id: number;
	name: string;
	job: string;
	department: string;
	profile_path: string | null;
}

export interface Credits {
	cast: Cast[];
	crew: Crew[];
}

export interface Video {
	id: string;
	key: string;
	name: string;
	site: string;
	type: string;
	official: boolean;
}

export interface MovieDetails extends MediaItem {
	runtime: number | null;
	tagline: string | null;
	status: string;
	budget: number;
	revenue: number;
	genres: Genre[];
}

export interface Episode {
	id: number;
	name: string;
	overview: string;
	vote_average: number;
	vote_count: number;
	air_date: string;
	episode_number: number;
	season_number: number;
	still_path: string | null;
	runtime: number | null;
}

export interface Season {
	id: number;
	name: string;
	overview: string;
	poster_path: string | null;
	season_number: number;
	episode_count: number;
	air_date: string;
	episodes?: Episode[];
}

export interface TVDetails extends MediaItem {
	number_of_seasons: number;
	number_of_episodes: number;
	seasons: Season[];
	status: string;
	tagline: string | null;
	genres: Genre[];
	last_episode_to_air?: Episode;
}

export type WatchStatus = "plan" | "watching" | "completed";

export interface WatchlistItem {
	id: number;
	mediaType: "movie" | "tv";
	title: string;
	posterPath: string | null;
	backdropPath: string | null;
	voteAverage: number;
	releaseDate?: string;
	addedAt: number;
	status: WatchStatus;
	lastWatchedSeason?: number;
	lastWatchedEpisode?: number;
}

export interface Person {
	id: number;
	name: string;
	original_name?: string;
	profile_path: string | null;
	known_for_department?: string;
	popularity?: number;
	known_for?: MediaItem[];
}

export interface PersonDetails {
	id: number;
	name: string;
	biography: string;
	birthday: string | null;
	place_of_birth: string | null;
	profile_path: string | null;
	known_for_department: string;
	popularity: number;
}

export interface PersonCredits {
	cast: MediaItem[];
	crew: MediaItem[];
}

export interface CollectionItem {
	id: number;
	name: string;
	overview?: string;
	poster_path: string | null;
	backdrop_path: string | null;
	parts?: MediaItem[];
}

export type ViewMode =
	| "home"
	| "movies"
	| "tv"
	| "watchlist"
	| "movie-detail"
	| "tv-detail"
	| "watch-movie"
	| "watch-tv"
	| "search"
	| "about"
	| "collections"
	| "actors"
	| "actor-detail";

export interface ActiveRoute {
	mode: ViewMode;
	id?: number;
	season?: number;
	episode?: number;
	searchQuery?: string;
}

export interface StreamServer {
	id: string;
	name: string;
	getMovieUrl: (tmdbId: number) => string;
	getTvUrl: (tmdbId: number, season: number, episode: number) => string;
}
