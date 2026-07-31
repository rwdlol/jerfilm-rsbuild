import { Bookmark, Play, Trash2 } from "lucide-react";
import { useState } from "react";
import { SEO } from "../components/SEO";
import { getImageUrl } from "../services/tmdb";
import type { ActiveRoute, WatchlistItem, WatchStatus } from "../types";

interface WatchlistViewProps {
	watchlist: WatchlistItem[];
	onRemove: (id: number, type: "movie" | "tv") => void;
	onUpdateStatus: (
		id: number,
		type: "movie" | "tv",
		status: WatchStatus,
	) => void;
	onRouteChange: (route: ActiveRoute) => void;
}

export default function WatchlistView({
	watchlist,
	onRemove,
	onUpdateStatus,
	onRouteChange,
}: WatchlistViewProps) {
	const [filterType, setFilterType] = useState<"all" | "movie" | "tv">("all");
	const [filterStatus, setFilterStatus] = useState<WatchStatus | "all">("all");

	const filteredItems = watchlist.filter((item) => {
		if (filterType !== "all" && item.mediaType !== filterType) return false;
		if (filterStatus !== "all" && item.status !== filterStatus) return false;
		return true;
	});

	const handlePlay = (item: WatchlistItem) => {
		if (item.mediaType === "movie") {
			onRouteChange({ mode: "watch-movie", id: item.id });
		} else {
			onRouteChange({
				mode: "watch-tv",
				id: item.id,
				season: item.lastWatchedSeason || 1,
				episode: item.lastWatchedEpisode || 1,
			});
		}
	};

	return (
		<div className="pt-20 pb-24 max-w-7xl mx-auto px-4 sm:px-6">
			<SEO
				title="لیستی دڵخوازەکان - فیلم و زنجیرە هەڵگیراوەکانت"
				description="بەڕێوەبردن و تەمەاشاکردنی لیستی فیلم و زنجیرە هەڵگیراوەکانت لە Jerfilm.VIP."
			/>
			{/* Title */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
				<div>
					<h1 className="text-2xl sm:text-3xl font-black text-white font-display flex items-center gap-2.5">
						<Bookmark className="w-7 h-7 text-amber-400 fill-amber-400" />
						<span>لیستی سەیرکردنم</span>
					</h1>
					<p className="text-xs text-zinc-400 mt-1">
						ڕێکخستن و بەڕێوەبردنی فیلم و زنجیرە خەزنکراوەکانت
					</p>
				</div>

				{/* Filters */}
				<div className="flex flex-wrap items-center gap-2">
					{/* Media Type Tabs */}
					<div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 p-1 rounded-xl">
						<button
							type="button"
							onClick={() => setFilterType("all")}
							className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
								filterType === "all"
									? "bg-amber-400 text-zinc-950"
									: "text-zinc-400 hover:text-white"
							}`}
						>
							هەمووی ({watchlist.length})
						</button>
						<button
							type="button"
							onClick={() => setFilterType("movie")}
							className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
								filterType === "movie"
									? "bg-amber-400 text-zinc-950"
									: "text-zinc-400 hover:text-white"
							}`}
						>
							فیلمەکان
						</button>
						<button
							type="button"
							onClick={() => setFilterType("tv")}
							className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
								filterType === "tv"
									? "bg-amber-400 text-zinc-950"
									: "text-zinc-400 hover:text-white"
							}`}
						>
							زنجیرەکان
						</button>
					</div>

					{/* Status Select */}
					<select
						value={filterStatus}
						onChange={(e) =>
							setFilterStatus(e.target.value as WatchStatus | "all")
						}
						className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-semibold px-3 py-2 rounded-xl focus:outline-none focus:border-amber-400"
					>
						<option value="all">هەموو بارودۆخەکان</option>
						<option value="plan">پلاندانان بۆ سەیرکردن</option>
						<option value="watching">ئێستا سەیر دەکەم</option>
						<option value="completed">تەواو کراوە</option>
					</select>
				</div>
			</div>

			{/* List / Grid */}
			{filteredItems.length === 0 ? (
				<div className="py-20 text-center bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-8 max-w-md mx-auto">
					<Bookmark className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
					<h3 className="text-base font-bold text-white mb-1">
						لیستی سەیرکردن بەتاڵە
					</h3>
					<p className="text-xs text-zinc-400 mb-6">
						فیلم و زنجیرەکان خەزن بکە بۆ ئەوەی دواتر سەیریان بکەیتەوە.
					</p>
					<button
						type="button"
						onClick={() => onRouteChange({ mode: "home" })}
						className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-amber-950/50"
					>
						گەڕان لە بەرهەمەکاندا
					</button>
				</div>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{filteredItems.map((item) => {
						const posterUrl = getImageUrl(item.posterPath, "w300");
						return (
							<div
								key={`${item.mediaType}-${item.id}`}
								className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl overflow-hidden p-3 flex gap-3.5 group transition-all"
							>
								{/* Poster Image */}
								<div
									onClick={() =>
										onRouteChange({
											mode:
												item.mediaType === "movie"
													? "movie-detail"
													: "tv-detail",
											id: item.id,
										})
									}
									className="w-24 h-36 shrink-0 rounded-xl overflow-hidden bg-zinc-950 relative cursor-pointer group-hover:scale-105 transition-transform"
								>
									<img
										src={posterUrl}
										alt={item.title}
										className="w-full h-full object-cover"
									/>
									<span className="absolute top-1 right-1 bg-amber-400 text-zinc-950 text-[9px] font-black px-1.5 py-0.2 rounded uppercase">
										{item.mediaType === "movie" ? "فیلم" : "زنجیرە"}
									</span>
								</div>

								{/* Content */}
								<div className="flex-1 flex flex-col justify-between min-w-0">
									<div>
										<h3
											onClick={() =>
												onRouteChange({
													mode:
														item.mediaType === "movie"
															? "movie-detail"
															: "tv-detail",
													id: item.id,
												})
											}
											className="text-sm font-bold text-white hover:text-amber-400 transition-colors line-clamp-1 cursor-pointer"
										>
											{item.title}
										</h3>

										<div className="flex items-center gap-2 text-[11px] text-zinc-400 mt-1">
											<span className="text-amber-400 font-bold">
												★ {item.voteAverage.toFixed(1)}
											</span>
											{item.releaseDate && (
												<span>&middot; {item.releaseDate.substring(0, 4)}</span>
											)}
										</div>

										{item.mediaType === "tv" && item.lastWatchedSeason && (
											<div className="mt-2 text-[10px] font-bold text-amber-400 bg-amber-400/10 border border-amber-400/30 px-2 py-0.5 rounded-md inline-block">
												پێشکەوتن: وەرزی {item.lastWatchedSeason} ئەڵقەی{" "}
												{item.lastWatchedEpisode || 1}
											</div>
										)}
									</div>

									{/* Status & Actions */}
									<div className="mt-3 space-y-2">
										<div className="flex items-center justify-between gap-2">
											<select
												value={item.status}
												onChange={(e) =>
													onUpdateStatus(
														item.id,
														item.mediaType,
														e.target.value as WatchStatus,
													)
												}
												className="bg-zinc-950 border border-zinc-800 text-zinc-300 text-[11px] font-semibold px-2 py-1 rounded-lg focus:outline-none focus:border-amber-400"
											>
												<option value="plan">پلاندانان بۆ سەیرکردن</option>
												<option value="watching">سەیرکردن</option>
												<option value="completed">تەواوکراو</option>
											</select>

											<button
												type="button"
												onClick={() => onRemove(item.id, item.mediaType)}
												className="p-1.5 text-zinc-500 hover:text-amber-400 rounded-lg hover:bg-zinc-800 transition-colors"
												title="سڕینەوە لە لیستی سەیرکردن"
											>
												<Trash2 className="w-4 h-4" />
											</button>
										</div>

										<button
											type="button"
											onClick={() => handlePlay(item)}
											className="w-full py-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-amber-400/20"
										>
											<Play className="w-3.5 h-3.5 fill-zinc-950" />
											<span>
												{item.mediaType === "tv" && item.lastWatchedSeason
													? "بەردەوامبوون لە سەیرکردن"
													: "سەیرکردنی ئێستا"}
											</span>
										</button>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}
