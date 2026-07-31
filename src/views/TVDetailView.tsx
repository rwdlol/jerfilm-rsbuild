import {
	Bookmark,
	BookmarkCheck,
	ChevronRight,
	Layers,
	Play,
	Sparkles,
	Star,
} from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { AdultBlockedNotice } from "../components/AdultBlockedNotice";
import { MediaSlider } from "../components/MediaSlider";
import { SEO } from "../components/SEO";
import {
	getCredits,
	getImageUrl,
	getRecommendations,
	getTVDetails,
	getTVSeasonDetails,
} from "../services/tmdb";
import type { ActiveRoute, Cast, MediaItem, Season, TVDetails } from "../types";
import { tToSorani } from "../utils/translate";

interface TVDetailViewProps {
	tvId: number;
	onRouteChange: (route: ActiveRoute) => void;
	isInWatchlist: (id: number, type: "movie" | "tv") => boolean;
	onToggleWatchlist: (
		e: React.MouseEvent,
		media: MediaItem,
		type: "movie" | "tv",
	) => void;
	getWatchlistItem?: (id: number, type: "movie" | "tv") => any;
}

export default function TVDetailView({
	tvId,
	onRouteChange,
	isInWatchlist,
	onToggleWatchlist,
	getWatchlistItem,
}: TVDetailViewProps) {
	const [show, setShow] = useState<TVDetails | null>(null);
	const [selectedSeasonNum, setSelectedSeasonNum] = useState<number>(1);
	const [seasonData, setSeasonData] = useState<Season | null>(null);
	const [cast, setCast] = useState<Cast[]>([]);
	const [recommendations, setRecommendations] = useState<MediaItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [seasonLoading, setSeasonLoading] = useState(false);

	// Check saved progress if any
	const savedItem = getWatchlistItem ? getWatchlistItem(tvId, "tv") : null;
	const resumeSeason = savedItem?.lastWatchedSeason || 1;
	const resumeEpisode = savedItem?.lastWatchedEpisode || 1;

	useEffect(() => {
		let isMounted = true;
		async function fetchShowDetails() {
			try {
				setLoading(true);
				const showRes = await getTVDetails(tvId);
				if (isMounted) setShow(showRes);

				try {
					const [creditsRes, recsRes] = await Promise.all([
						getCredits("tv", tvId).catch(() => ({ cast: [], crew: [] })),
						getRecommendations("tv", tvId).catch(() => ({ results: [] })),
					]);

					if (isMounted) {
						setCast((creditsRes.cast || []).slice(0, 15));
						setRecommendations(recsRes.results || []);
					}
				} catch (e) {
					console.warn("Sub-details error:", e);
				}

				const validSeasons = (showRes.seasons || []).filter(
					(s) => s.season_number > 0,
				);
				const initialSeason = validSeasons.some(
					(s) => s.season_number === resumeSeason,
				)
					? resumeSeason
					: validSeasons[0]?.season_number || 1;

				if (isMounted) setSelectedSeasonNum(initialSeason);
			} catch (err) {
				console.error("Failed to load TV details:", err);
			} finally {
				if (isMounted) setLoading(false);
			}
		}
		fetchShowDetails();
		return () => {
			isMounted = false;
		};
	}, [tvId]);

	useEffect(() => {
		async function fetchSeason() {
			if (!tvId || selectedSeasonNum === undefined) return;
			try {
				setSeasonLoading(true);
				const sData = await getTVSeasonDetails(tvId, selectedSeasonNum);
				setSeasonData(sData);
			} catch (err) {
				console.error(`Failed to load season ${selectedSeasonNum}:`, err);
			} finally {
				setSeasonLoading(false);
			}
		}
		fetchSeason();
	}, [tvId, selectedSeasonNum]);

	if (loading) {
		return (
			<div className="min-h-screen pt-20 flex flex-col items-center justify-center gap-3">
				<div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
				<span className="text-xs font-semibold text-zinc-400">
					تکایە چاوەڕێ بکە... گواستنەوەی زانیارییەکانی زنجیرەکە
				</span>
			</div>
		);
	}

	if (!show) {
		return (
			<div className="min-h-screen pt-24 text-center px-4">
				<h2 className="text-xl font-bold text-white">زنجیرەکە نەدۆزرایەوە</h2>
				<button
					type="button"
					onClick={() => onRouteChange({ mode: "home" })}
					className="mt-4 px-4 py-2 bg-amber-400 text-zinc-950 text-xs font-bold rounded-xl"
				>
					گەڕانەوە بۆ سەرەتا
				</button>
			</div>
		);
	}

	if (show.adult) {
		return <AdultBlockedNotice onRouteChange={onRouteChange} />;
	}

	const inWatchlist = isInWatchlist(show.id, "tv");
	const backdropUrl = getImageUrl(
		show.backdrop_path || show.poster_path,
		"original",
	);
	const posterUrl = getImageUrl(show.poster_path, "w500");
	const releaseYear = (show.first_air_date || "").substring(0, 4);

	const availableSeasons = (show.seasons || []).filter(
		(s) => s.season_number > 0,
	);

	const handlePlayEpisode = (seasonNum: number, episodeNum: number) => {
		onRouteChange({
			mode: "watch-tv",
			id: show.id,
			season: seasonNum,
			episode: episodeNum,
		});
	};

	return (
		<div className="pb-24">
			<SEO
				title={`زنجیرەی ${show.name} (${releaseYear}) - ژێرنووسی کوردی`}
				description={
					show.overview
						? tToSorani(show.overview)
						: `سەیرکردنی زنجیرەی ${show.name} بە ژێرنووسی کوردی بە هەموو وەرزەکان و ئەڵقەکان.`
				}
				image={backdropUrl || posterUrl}
				type="video.tv_show"
				keywords={[
					show.name as string,
					`زنجیرەی ${show.name}`,
					"ژێرنووسی کوردی",
					"زنجیرەی کوردی",
					"Jerfilm",
					"سەیرکردنی زنجیرە",
				]}
				schemaData={{
					"@context": "https://schema.org",
					"@type": "TVSeries",
					name: show.name,
					alternateName: show.original_name,
					description: show.overview
						? tToSorani(show.overview)
						: `زنجیرەی ${show.name} بە ژێرنووسی کوردی`,
					image: posterUrl,
					startDate: show.first_air_date,
					numberOfSeasons: show.number_of_seasons,
					numberOfEpisodes: show.number_of_episodes,
					aggregateRating: show.vote_average
						? {
								"@type": "AggregateRating",
								ratingValue: show.vote_average,
								bestRating: "10",
								ratingCount: show.vote_count || 100,
							}
						: undefined,
				}}
			/>
			{/* Back Button */}
			<div className="fixed top-16 right-4 z-30">
				<button
					type="button"
					onClick={() =>
						window.history.length > 1
							? window.history.back()
							: onRouteChange({ mode: "tv" })
					}
					className="p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/10 shadow-lg transition-all"
				>
					<ChevronRight className="w-5 h-5" />
				</button>
			</div>

			{/* Hero Backdrop Header */}
			<div className="relative w-full h-[55vh] min-h-95 bg-zinc-950">
				<img
					src={backdropUrl}
					alt={show.name}
					className="w-full h-full object-cover"
				/>
				<div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/70 to-transparent" />
				<div className="absolute inset-0 bg-linear-to-l from-zinc-950 via-zinc-950/50 to-transparent" />
			</div>

			{/* Main Details Container */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-32 relative z-10">
				<div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
					{/* Poster Image */}
					<div className="w-40 sm:w-52 md:w-64 shrink-0 rounded-2xl overflow-hidden border-2 border-zinc-800 shadow-2xl bg-zinc-900 mx-auto md:mx-0">
						<img
							src={posterUrl}
							alt={show.name}
							className="w-full h-auto object-cover"
						/>
					</div>

					{/* Details Content */}
					<div className="flex-1 space-y-4 text-center md:text-right">
						<div>
							<div className="flex items-center justify-center md:justify-start gap-2 flex-wrap mb-2">
								<span className="bg-amber-400 text-zinc-950 text-xs font-black uppercase px-2.5 py-0.5 rounded-md">
									زنجیرە
								</span>
								<div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-md border border-white/10 text-xs font-bold text-amber-400">
									<Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
									<span>
										{show.vote_average ? show.vote_average.toFixed(1) : "N/A"}
									</span>
								</div>
								{releaseYear && (
									<span className="text-xs text-zinc-300 font-medium bg-zinc-900/80 px-2.5 py-0.5 rounded-md border border-zinc-800">
										{releaseYear}
									</span>
								)}
								<span className="text-xs text-zinc-300 font-medium bg-zinc-900/80 px-2.5 py-0.5 rounded-md border border-zinc-800">
									{show.number_of_seasons} وەرز ({show.number_of_episodes}{" "}
									ئەڵقە)
								</span>
							</div>

							<h1 className="text-2xl sm:text-4xl font-black text-white font-display tracking-tight">
								{show.name}
							</h1>

							{show.tagline && (
								<p className="text-xs sm:text-sm text-amber-400/90 font-medium italic mt-1">
									"{show.tagline}"
								</p>
							)}
						</div>

						{/* Genres */}
						{show.genres && show.genres.length > 0 && (
							<div className="flex items-center justify-center md:justify-start gap-1.5 flex-wrap">
								{show.genres.map((g) => (
									<span
										key={g.id}
										className="text-xs font-semibold bg-zinc-900 text-zinc-300 border border-zinc-800 px-2.5 py-1 rounded-lg"
									>
										{tToSorani(g.name)}
									</span>
								))}
							</div>
						)}

						{/* Action Buttons */}
						<div className="flex items-center justify-center md:justify-start gap-3 pt-2 flex-wrap">
							<button
								type="button"
								onClick={() => handlePlayEpisode(resumeSeason, resumeEpisode)}
								className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-lg shadow-amber-400/20 flex items-center gap-2 group transform active:scale-95"
							>
								<Play className="w-4 h-4 fill-zinc-950 group-hover:scale-110 transition-transform" />
								<span>
									{savedItem
										? `بەردەوامبوون لە وەرزی ${resumeSeason} ئەڵقەی ${resumeEpisode}`
										: "دەستپێکردنی سەیرکردنی وەرزی ۱ ئەڵقەی ۱"}
								</span>
							</button>

							<button
								type="button"
								onClick={(e) => onToggleWatchlist(e, show, "tv")}
								className={`px-4 py-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
									inWatchlist
										? "bg-amber-400/20 border-amber-400/60 text-amber-400"
										: "bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-white"
								}`}
							>
								{inWatchlist ? (
									<BookmarkCheck className="w-4 h-4 text-amber-400" />
								) : (
									<Bookmark className="w-4 h-4" />
								)}
								<span>
									{inWatchlist
										? "لە لیستی سەیرکردندایە"
										: "زیادکردن بۆ لیستی سەیرکردن"}
								</span>
							</button>
						</div>

						{/* Overview */}
						<div className="pt-2 text-right bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4">
							<h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">
								کورتە
							</h3>
							<p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal">
								{show.overview || "هیچ کورتەیەک بۆ ئەم زنجیرەیە بەردەست نییە."}
							</p>
						</div>
					</div>
				</div>

				{/* Episode Selector & Season Picker */}
				<section className="my-10 bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 sm:p-6 backdrop-blur-md">
					<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-zinc-800">
						<div className="flex items-center gap-2">
							<Layers className="w-5 h-5 text-amber-500" />
							<h2 className="text-lg font-bold text-white">
								ئەڵقەکان و وەرزەکان
							</h2>
						</div>

						{/* Season Dropdown */}
						<div className="flex items-center gap-2">
							<span className="text-xs text-zinc-400 font-semibold">
								هەڵبژاردنی وەرز:
							</span>
							<select
								value={selectedSeasonNum}
								onChange={(e) => setSelectedSeasonNum(Number(e.target.value))}
								className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-white font-bold focus:outline-none focus:border-amber-500"
							>
								{availableSeasons.map((s) => (
									<option key={s.id} value={s.season_number}>
										وەرزی {s.season_number} ({s.episode_count} ئەڵقە)
									</option>
								))}
							</select>
						</div>
					</div>

					{/* Episode List Grid / Rows */}
					{seasonLoading ? (
						<div className="py-12 text-center text-xs text-zinc-400 flex flex-col items-center gap-2">
							<div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
							<span>تکایە چاوەڕێ بکە... هێنانی ئەڵقەکانی وەرز</span>
						</div>
					) : !seasonData ||
						!seasonData.episodes ||
						seasonData.episodes.length === 0 ? (
						<div className="py-8 text-center text-xs text-zinc-500">
							هیچ ئەڵقەیەک بۆ وەرزی {selectedSeasonNum} نەدۆزرایەوە.
						</div>
					) : (
						<div className="space-y-3">
							{seasonData.episodes.map((episode) => {
								const stillUrl = getImageUrl(
									episode.still_path || show.backdrop_path,
									"w500",
								);
								const isPlaying =
									resumeSeason === selectedSeasonNum &&
									resumeEpisode === episode.episode_number;

								return (
									<div
										key={episode.id}
										onClick={() =>
											handlePlayEpisode(
												selectedSeasonNum,
												episode.episode_number,
											)
										}
										className={`group p-3 rounded-xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 cursor-pointer ${
											isPlaying
												? "bg-amber-950/40 border-amber-500/60 shadow-lg shadow-amber-950/20"
												: "bg-zinc-950/80 hover:bg-zinc-800/80 border-zinc-800/80"
										}`}
									>
										<div className="flex items-center gap-3 w-full sm:w-auto">
											{/* Thumbnail */}
											<div className="relative w-28 sm:w-36 aspect-video rounded-lg overflow-hidden shrink-0 bg-zinc-900">
												<img
													src={stillUrl}
													alt={episode.name}
													className="w-full h-full object-cover group-hover:scale-105 transition-transform"
												/>
												<div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all flex items-center justify-center">
													<Play className="w-5 h-5 text-white fill-white opacity-80 group-hover:scale-110 transition-all" />
												</div>
												<span className="absolute bottom-1 right-1 bg-black/70 px-1.5 py-0.2 rounded text-xs font-extrabold text-white">
													ئەڵقەی {episode.episode_number}
												</span>
											</div>

											{/* Info */}
											<div className="flex-1 min-w-0">
												<div className="flex items-center gap-2">
													<h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1">
														{episode.episode_number}. {episode.name}
													</h4>
													{isPlaying && (
														<span className="text-xs font-extrabold bg-amber-600 text-white px-1.5 py-0.2 rounded uppercase">
															سەیرکردنی ئێستا
														</span>
													)}
												</div>

												<div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
													{episode.air_date && <span>{episode.air_date}</span>}
													{episode.runtime && (
														<>
															<span>&middot;</span>
															<span>{episode.runtime}خولەک</span>
														</>
													)}
													{episode.vote_average > 0 && (
														<>
															<span>&middot;</span>
															<span className="text-amber-400 font-bold">
																★ {episode.vote_average.toFixed(1)}
															</span>
														</>
													)}
												</div>

												<p className="text-xs text-zinc-400 line-clamp-2 mt-1 font-normal">
													{episode.overview ||
														"هیچ کورتەیەک بۆ ئەم ئەڵقەیە بەردەست نییە."}
												</p>
											</div>
										</div>

										<button
											type="button"
											onClick={(e) => {
												e.stopPropagation();
												handlePlayEpisode(
													selectedSeasonNum,
													episode.episode_number,
												);
											}}
											className="w-full sm:w-auto px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 shadow-md shadow-amber-950/40"
										>
											<Play className="w-3.5 h-3.5 fill-white" />
											<span>لێدان</span>
										</button>
									</div>
								);
							})}
						</div>
					)}
				</section>

				{/* Cast Carousel */}
				{cast.length > 0 && (
					<section className="my-10">
						<h2 className="text-base sm:text-lg font-bold text-white mb-4 flex items-center gap-2">
							<Sparkles className="w-4 h-4 text-amber-500" />
							<span>ئەکتەرە سەرەکییەکان</span>
						</h2>

						<div className="flex gap-3 overflow-x-auto scrollbar-none pb-2 snap-x">
							{cast.map((actor) => (
								<div
									key={actor.id}
									className="flex-none w-28 sm:w-32 bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 p-2 text-center snap-start"
								>
									<img
										src={getImageUrl(actor.profile_path, "w200")}
										alt={actor.name}
										className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl mx-auto mb-2 bg-zinc-950"
									/>
									<p className="text-xs font-bold text-white line-clamp-1">
										{actor.name}
									</p>
									<p className="text-xs text-zinc-400 line-clamp-1 mt-0.5">
										{actor.character}
									</p>
								</div>
							))}
						</div>
					</section>
				)}

				{/* Recommendations */}
				{recommendations.length > 0 && (
					<MediaSlider
						title="زنجیرە پێشنیازکراوەکان"
						subtitle="زنجیرەی تر کە ڕەنگە حەزت لێی بێت"
						items={recommendations}
						mediaTypeOverride="tv"
						onRouteChange={onRouteChange}
						isInWatchlist={isInWatchlist}
						onToggleWatchlist={onToggleWatchlist}
					/>
				)}
			</div>
		</div>
	);
}
