import { AnimatePresence } from "motion/react";
import { lazy, type MouseEvent, useEffect } from "react";
import {
	BrowserRouter,
	Navigate,
	Route,
	Routes,
	useLocation,
	useNavigate,
	useParams,
	useSearchParams,
} from "react-router";
import { useWatchlist } from "./hooks/useWatchlist";
import type { ActiveRoute, MediaItem } from "./types";
import { routeToPath } from "./utils/navigation";

const PageTransition = lazy(() => import("./components/PageTransition"));
const Header = lazy(() => import("./components/Header"));
const BottomNav = lazy(() => import("./components/BottomNav"));
const Footer = lazy(() => import("./components/Footer"));

// Views
const HomeView = lazy(() => import("./views/HomeView"));
const MoviesView = lazy(() => import("./views/MoviesView"));
const TVSeriesView = lazy(() => import("./views/TVSeriesView"));
const MovieDetailView = lazy(() => import("./views/MovieDetailView"));
const TVDetailView = lazy(() => import("./views/TVDetailView"));
const WatchlistView = lazy(() => import("./views/WatchlistView"));
const WatchMovieView = lazy(() => import("./views/WatchMovieView"));
const WatchTVView = lazy(() => import("./views/WatchTVView"));
const SearchView = lazy(() => import("./views/SearchView"));
const AboutView = lazy(() => import("./views/AboutView"));
const CollectionsView = lazy(() => import("./views/CollectionsView"));
const ActorsView = lazy(() => import("./views/ActorsView"));
const ActorDetailView = lazy(() => import("./views/ActorDetailView"));

// Smooth Scroll To Top Component on Route Change
function ScrollToTop() {
	useEffect(() => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	}, []);
	return null;
}

// Inner App Layout with Router Logic
function AppContent() {
	const location = useLocation();
	const navigate = useNavigate();

	const {
		watchlist,
		addToWatchlist,
		removeFromWatchlist,
		updateWatchlistStatus,
		updateTvProgress,
		isInWatchlist,
		getWatchlistItem,
	} = useWatchlist();

	const handleRouteChange = (route: ActiveRoute) => {
		navigate(routeToPath(route));
	};

	const handleToggleWatchlist = (
		e: MouseEvent,
		media: MediaItem,
		type: "movie" | "tv",
	) => {
		e.stopPropagation();
		if (isInWatchlist(media.id, type)) {
			removeFromWatchlist(media.id, type);
		} else {
			addToWatchlist({
				id: media.id,
				mediaType: type,
				title: media.title || media.name || " بێ ناونیشان",
				posterPath: media.poster_path,
				backdropPath: media.backdrop_path,
				voteAverage: media.vote_average || 0,
				releaseDate: media.release_date || media.first_air_date,
				status: "plan",
			});
		}
	};

	// Route Wrappers to parse URL Params
	const MovieDetailWrapper = () => {
		const { id } = useParams<{ id: string }>();
		const movieId = Number(id);
		if (!movieId || Number.isNaN(movieId))
			return <Navigate to="/movies" replace />;
		return (
			<MovieDetailView
				movieId={movieId}
				onRouteChange={handleRouteChange}
				isInWatchlist={isInWatchlist}
				onToggleWatchlist={handleToggleWatchlist}
			/>
		);
	};

	const TVDetailWrapper = () => {
		const { id } = useParams<{ id: string }>();
		const tvId = Number(id);
		if (!tvId || Number.isNaN(tvId)) return <Navigate to="/tv" replace />;
		return (
			<TVDetailView
				tvId={tvId}
				onRouteChange={handleRouteChange}
				isInWatchlist={isInWatchlist}
				onToggleWatchlist={handleToggleWatchlist}
				getWatchlistItem={getWatchlistItem}
			/>
		);
	};

	const WatchMovieWrapper = () => {
		const { id } = useParams<{ id: string }>();
		const movieId = Number(id);
		if (!movieId || Number.isNaN(movieId))
			return <Navigate to="/movies" replace />;
		return (
			<WatchMovieView
				movieId={movieId}
				onRouteChange={handleRouteChange}
				isInWatchlist={isInWatchlist}
				onToggleWatchlist={handleToggleWatchlist}
			/>
		);
	};

	const WatchTVWrapper = () => {
		const { id, season, episode } = useParams<{
			id: string;
			season?: string;
			episode?: string;
		}>();
		const [searchParams] = useSearchParams();
		const tvId = Number(id);
		const seasonNum = Number(season || searchParams.get("s") || 1);
		const episodeNum = Number(episode || searchParams.get("e") || 1);
		if (!tvId || isNaN(tvId)) return <Navigate to="/tv" replace />;
		return (
			<WatchTVView
				tvId={tvId}
				seasonNum={seasonNum}
				episodeNum={episodeNum}
				onRouteChange={handleRouteChange}
				isInWatchlist={isInWatchlist}
				onToggleWatchlist={handleToggleWatchlist}
				updateTvProgress={updateTvProgress}
			/>
		);
	};

	const ActorDetailWrapper = () => {
		const { id } = useParams<{ id: string }>();
		const actorId = Number(id);
		if (!actorId || Number.isNaN(actorId))
			return <Navigate to="/actors" replace />;
		return (
			<ActorDetailView actorId={actorId} onRouteChange={handleRouteChange} />
		);
	};

	const SearchWrapper = () => {
		const [searchParams] = useSearchParams();
		const query = searchParams.get("q") || "";
		return (
			<SearchView
				initialQuery={query}
				onRouteChange={handleRouteChange}
				isInWatchlist={isInWatchlist}
				onToggleWatchlist={handleToggleWatchlist}
			/>
		);
	};

	return (
		<div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-amber-400 selection:text-zinc-950 flex flex-col antialiased">
			<ScrollToTop />

			{/* Header */}
			<Header
				onRouteChange={handleRouteChange}
				watchlistCount={watchlist.length}
			/>

			{/* Main Animated View Router */}
			<main className="flex-1 flex flex-col">
				<AnimatePresence
					mode="wait"
					initial={false}
					onExitComplete={() => window.scrollTo(0, 0)}
				>
					<Routes location={location}>
						<Route
							path="/"
							element={
								<PageTransition>
									<HomeView
										onRouteChange={handleRouteChange}
										isInWatchlist={isInWatchlist}
										onToggleWatchlist={handleToggleWatchlist}
									/>
								</PageTransition>
							}
						/>
						<Route
							path="/movies"
							element={
								<PageTransition>
									<MoviesView
										onRouteChange={handleRouteChange}
										isInWatchlist={isInWatchlist}
										onToggleWatchlist={handleToggleWatchlist}
									/>
								</PageTransition>
							}
						/>
						<Route
							path="/tv"
							element={
								<PageTransition>
									<TVSeriesView
										onRouteChange={handleRouteChange}
										isInWatchlist={isInWatchlist}
										onToggleWatchlist={handleToggleWatchlist}
									/>
								</PageTransition>
							}
						/>
						<Route
							path="/movie/:id"
							element={
								<PageTransition>
									<MovieDetailWrapper />
								</PageTransition>
							}
						/>
						<Route
							path="/tv/:id"
							element={
								<PageTransition>
									<TVDetailWrapper />
								</PageTransition>
							}
						/>
						<Route
							path="/watch-movie/:id"
							element={
								<PageTransition>
									<WatchMovieWrapper />
								</PageTransition>
							}
						/>
						<Route
							path="/watch-tv/:id"
							element={
								<PageTransition>
									<WatchTVWrapper />
								</PageTransition>
							}
						/>
						<Route
							path="/watch-tv/:id/:season/:episode"
							element={
								<PageTransition>
									<WatchTVWrapper />
								</PageTransition>
							}
						/>
						<Route
							path="/watchlist"
							element={
								<PageTransition>
									<WatchlistView
										watchlist={watchlist}
										onRemove={removeFromWatchlist}
										onUpdateStatus={updateWatchlistStatus}
										onRouteChange={handleRouteChange}
									/>
								</PageTransition>
							}
						/>
						<Route
							path="/search"
							element={
								<PageTransition>
									<SearchWrapper />
								</PageTransition>
							}
						/>
						<Route
							path="/about"
							element={
								<PageTransition>
									<AboutView onRouteChange={handleRouteChange} />
								</PageTransition>
							}
						/>
						<Route
							path="/collections"
							element={
								<PageTransition>
									<CollectionsView onRouteChange={handleRouteChange} />
								</PageTransition>
							}
						/>
						<Route
							path="/actors"
							element={
								<PageTransition>
									<ActorsView onRouteChange={handleRouteChange} />
								</PageTransition>
							}
						/>
						<Route
							path="/actor/:id"
							element={
								<PageTransition>
									<ActorDetailWrapper />
								</PageTransition>
							}
						/>
						<Route path="*" element={<Navigate to="/" replace />} />
					</Routes>
				</AnimatePresence>
			</main>

			{/* Website Footer */}
			<Footer onRouteChange={handleRouteChange} />

			{/* Fixed Bottom Navigation for Mobile */}
			<BottomNav onRouteChange={handleRouteChange} />
		</div>
	);
}

export default function App() {
	return (
		<BrowserRouter>
			<AppContent />
		</BrowserRouter>
	);
}
