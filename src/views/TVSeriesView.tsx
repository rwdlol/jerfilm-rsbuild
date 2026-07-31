import { ChevronLeft, ChevronRight, Globe, Tv } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { GenrePills } from "../components/GenrePills";
import { MediaCard } from "../components/MediaCard";
import { SEO } from "../components/SEO";
import {
	COUNTRIES_LIST,
	discoverMedia,
	getAiringTodayTV,
	getGenres,
	getPopularTV,
	getTopRatedTV,
} from "../services/tmdb";
import type { ActiveRoute, Genre, MediaItem } from "../types";

interface TVSeriesViewProps {
	onRouteChange: (route: ActiveRoute) => void;
	isInWatchlist: (id: number, type: "movie" | "tv") => boolean;
	onToggleWatchlist: (
		e: React.MouseEvent,
		media: MediaItem,
		type: "movie" | "tv",
	) => void;
}

type TvCategory = "popular" | "top_rated" | "airing_today";

export default function Page({
	onRouteChange,
	isInWatchlist,
	onToggleWatchlist,
}: TVSeriesViewProps) {
	const [category, setCategory] = useState<TvCategory>("airing_today");
	const [shows, setShows] = useState<MediaItem[]>([]);
	const [genres, setGenres] = useState<Genre[]>([]);
	const [selectedGenreId, setSelectedGenreId] = useState<number | undefined>(
		undefined,
	);
	const [selectedCountry, setSelectedCountry] = useState<string>("");
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchGenres() {
			try {
				const res = await getGenres("tv");
				setGenres(res.genres || []);
			} catch (e) {
				console.error(e);
			}
		}
		fetchGenres();
	}, []);

	useEffect(() => {
		async function fetchShows() {
			try {
				setLoading(true);
				let res: { results: MediaItem[]; total_pages: number };

				if (selectedGenreId || selectedCountry) {
					res = await discoverMedia("tv", {
						genreId: selectedGenreId,
						countryCode: selectedCountry || undefined,
						page,
						sortBy:
							category === "top_rated"
								? "vote_average.desc"
								: "popularity.desc",
					});
				} else {
					if (category === "popular") {
						res = await getPopularTV(page);
					} else if (category === "top_rated") {
						res = await getTopRatedTV(page);
					} else {
						res = await getAiringTodayTV(page);
					}
				}

				setShows(res.results || []);
				setTotalPages(Math.min(res.total_pages || 1, 500));
			} catch (err) {
				console.error("Failed to fetch TV series:", err);
			} finally {
				setLoading(false);
			}
		}
		fetchShows();
	}, [category, selectedGenreId, selectedCountry, page]);

	return (
		<div className="pt-20 pb-24 max-w-7xl mx-auto px-4 sm:px-6">
			<SEO
				title="زنجیرەکان - سەیرکردنی زنجیرە تەلەڤزیۆنییەکان بە ژێرنووسی کوردی"
				description="باشترین و بەناوبانگترین زنجیرە تەلەڤزیۆنییەکانی جیهان بە ژێرنووسی کوردی بە کوالێتی بەرز."
				keywords={[
					"زنجیرەکان",
					"زنجیرەی کوردی",
					"ژێرنووسی کوردی",
					"سەیرکردنی زنجیرە",
					"Jerfilm",
				]}
			/>
			{/* Page Title & Sort Filters */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
				<div>
					<h1 className="text-2xl sm:text-3xl font-black text-white font-display flex items-center gap-2.5">
						<Tv className="w-7 h-7 text-amber-400" />
						<span>گەڕان لە زنجیرەکاندا</span>
					</h1>
					<p className="text-xs text-zinc-400 mt-1">
						پێشبینیکردنی زنجیرە تەلەڤزیۆنییە باوەکان، دراما و ئەنیمێیەکان
					</p>
				</div>

				{/* Filters & Country Selector */}
				<div className="flex flex-wrap items-center gap-2.5">
					{/* Select Country Filter */}
					<div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-2xl">
						<Globe className="w-4 h-4 text-amber-400" />
						<span className="text-xs text-zinc-400 font-bold whitespace-nowrap">
							وڵات:
						</span>
						<select
							value={selectedCountry}
							onChange={(e) => {
								setSelectedCountry(e.target.value);
								setPage(1);
							}}
							className="bg-transparent text-xs text-white font-bold outline-none cursor-pointer pr-1"
						>
							{COUNTRIES_LIST.map((c) => (
								<option
									key={c.code}
									value={c.code}
									className="bg-zinc-950 text-white"
								>
									{c.name}
								</option>
							))}
						</select>
					</div>

					{/* Category Switcher Tabs */}
					<div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 p-1 rounded-2xl">
						<button
							type="button"
							onClick={() => {
								setCategory("airing_today");
								setPage(1);
							}}
							className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
								category === "airing_today"
									? "bg-amber-400 text-zinc-950 shadow"
									: "text-zinc-400 hover:text-white"
							}`}
						>
							پەخشی ئەمڕۆ
						</button>
						<button
							type="button"
							onClick={() => {
								setCategory("top_rated");
								setPage(1);
							}}
							className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
								category === "top_rated"
									? "bg-amber-400 text-zinc-950 shadow"
									: "text-zinc-400 hover:text-white"
							}`}
						>
							بەرزترین هەڵسەنگاندن
						</button>
						<button
							type="button"
							onClick={() => {
								setCategory("popular");
								setPage(1);
							}}
							className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
								category === "popular"
									? "bg-amber-400 text-zinc-950 shadow"
									: "text-zinc-400 hover:text-white"
							}`}
						>
							پڕبینەر
						</button>
					</div>
				</div>
			</div>

			{/* Genre Pills */}
			<div className="mb-6 -mx-4 sm:mx-0">
				<GenrePills
					genres={genres}
					selectedGenreId={selectedGenreId}
					onSelectGenre={(g) => {
						setSelectedGenreId(g);
						setPage(1);
					}}
				/>
			</div>

			{/* Series Cards Grid */}
			{loading ? (
				<div className="py-20 flex flex-col items-center justify-center gap-3">
					<div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
					<span className="text-xs text-zinc-400 font-medium">
						تکایە چاوەڕێ بکە... زنجیرەکان بەدەست دەگەڕێن
					</span>
				</div>
			) : shows.length === 0 ? (
				<div className="py-20 text-center text-zinc-500 text-sm">
					هیچ زنجیرەیەک بۆ ئەم ژانەرە یان پۆلێنە نەدۆزرایەوە.
				</div>
			) : (
				<>
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
						{shows.map((show) => (
							<MediaCard
								key={show.id}
								media={show}
								mediaTypeOverride="tv"
								onRouteChange={onRouteChange}
								isInWatchlist={isInWatchlist(show.id, "tv")}
								onToggleWatchlist={onToggleWatchlist}
							/>
						))}
					</div>

					{/* Pagination Controls in RTL: Prev button is right arrow, Next button is left arrow */}
					<div className="mt-10 flex items-center justify-center gap-3">
						<button
							type="button"
							disabled={page <= 1}
							onClick={() => setPage((p) => Math.max(p - 1, 1))}
							className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 text-xs font-semibold"
						>
							<ChevronRight className="w-4 h-4" />
							<span>پێشوو</span>
						</button>

						<span className="text-xs font-bold text-zinc-400 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-xl">
							پەڕەی {page} لە {totalPages}
						</span>

						<button
							type="button"
							disabled={page >= totalPages}
							onClick={() => setPage((p) => p + 1)}
							className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 text-xs font-semibold"
						>
							<span>داهاتوو</span>
							<ChevronLeft className="w-4 h-4" />
						</button>
					</div>
				</>
			)}
		</div>
	);
}
