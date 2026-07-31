import type { ActiveRoute } from "../types";

export function routeToPath(route: ActiveRoute): string {
	switch (route.mode) {
		case "home":
			return "/";
		case "movies":
			return "/movies";
		case "tv":
			return "/tv";
		case "watchlist":
			return "/watchlist";
		case "movie-detail":
			return `/movie/${route.id}`;
		case "tv-detail":
			return `/tv/${route.id}`;
		case "watch-movie":
			return `/watch-movie/${route.id}`;
		case "watch-tv":
			return `/watch-tv/${route.id}/${route.season || 1}/${route.episode || 1}`;
		case "search":
			return route.searchQuery
				? `/search?q=${encodeURIComponent(route.searchQuery)}`
				: "/search";
		case "about":
			return "/about";
		case "collections":
			return "/collections";
		case "actors":
			return "/actors";
		case "actor-detail":
			return `/actor/${route.id}`;
		default:
			return "/";
	}
}
