import type { StreamServer } from "../types";

export const STREAM_SERVERS: StreamServer[] = [
	{
		id: "server-one",
		name: "سێرڤەری 1 (VaPlayer HD)",
		getMovieUrl: (tmdbId: number) =>
			`https://vaplayer.ru/embed/movie/${tmdbId}?color=ffd700`,
		getTvUrl: (tmdbId: number, season: number, episode: number) =>
			`https://vaplayer.ru/embed/tv/${tmdbId}/${season}/${episode}?color=ffd700`,
	},
	{
		id: "server-two",
		name: "سێرڤەری 2 (VsEmbed)",
		getMovieUrl: (tmdbId: number) =>
			`https://vsembed.ru/embed/movie?tmdb=${tmdbId}`,
		getTvUrl: (tmdbId: number, season: number, episode: number) =>
			`https://vsembed.ru/embed/tv?tmdb=${tmdbId}&season=${season}&episode=${episode}`,
	},
	{
		id: "server-three",
		name: "سێرڤەری 3 (Videasy Fast)",
		getMovieUrl: (tmdbId: number) =>
			`https://player.videasy.net/movie/${tmdbId}?color=ffd700&overlay=true`,
		getTvUrl: (tmdbId: number, season: number, episode: number) =>
			`https://player.videasy.net/tv/${tmdbId}/${season}/${episode}?color=ffd700&overlay=true`,
	},
	{
		id: "server-four",
		name: "سێرڤەری 4 (VidLink Pro)",
		getMovieUrl: (tmdbId: number) =>
			`https://vidlink.pro/movie/${tmdbId}?primaryColor=ffd700&secondaryColor=0028ff`,
		getTvUrl: (tmdbId: number, season: number, episode: number) =>
			`https://vidlink.pro/tv/${tmdbId}/${season}/${episode}?primaryColor=ffd700&secondaryColor=0028ff`,
	},
	{
		id: "server-five",
		name: "سێرڤەری 5 (EmbedMaster)",
		getMovieUrl: (tmdbId: number) =>
			`https://embedmaster.link/j2wmgzaw0so4wj6m/movie/${tmdbId}`,
		getTvUrl: (tmdbId: number, season: number, episode: number) =>
			`https://embedmaster.link/j2wmgzaw0so4wj6m/tv/${tmdbId}/${season}/${episode}`,
	},
];
