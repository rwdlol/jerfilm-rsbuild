import { ChevronLeft, ChevronRight, Flame, Play, Star } from "lucide-react";
import type React from "react";
import { useRef } from "react";
import { getImageUrl } from "../services/tmdb";
import type { ActiveRoute, MediaItem } from "../types";

interface Top10SliderProps {
	items: MediaItem[];
	onRouteChange: (route: ActiveRoute) => void;
}

export const Top10Slider: React.FC<Top10SliderProps> = ({
	items,
	onRouteChange,
}) => {
	const sliderRef = useRef<HTMLDivElement>(null);

	if (!items || items.length === 0) return null;

	const scroll = (direction: "left" | "right") => {
		if (sliderRef.current) {
			const scrollAmount = direction === "left" ? -380 : 380;
			sliderRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
		}
	};

	const toKurdishNumber = (num: number) => {
		const kurdishDigits = [
			"٠",
			"١",
			"٢",
			"٣",
			"٤",
			"٥",
			"٦",
			"٧",
			"٨",
			"٩",
			"١٠",
		];
		return kurdishDigits[num] || num.toString();
	};

	return (
		<div className="max-w-7xl mx-auto my-6 relative group/slider">
			{/* Header */}
			<div className="flex items-center justify-between mb-3 px-4 sm:px-6">
				<div className="flex items-center gap-2">
					<div className="w-7 h-7 rounded-lg bg-linear-to-tr from-amber-500 via-amber-300 to-amber-600 p-0.5 shadow-md shadow-amber-500/20">
						<div className="w-full h-full bg-zinc-950 rounded-md flex items-center justify-center">
							<Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
						</div>
					</div>
					<div>
						<h2 className="text-sm sm:text-base md:text-lg font-black text-white tracking-wide font-display flex items-center gap-2">
							<span>باشترینەکانی ئەمڕۆ لە کوردستان</span>
						</h2>
						<p className="text-xs text-zinc-400 font-medium">
							پڕبینەرترین بەرهەمەکانی هەفتە
						</p>
					</div>
				</div>

				{/* Scroll Buttons */}
				<div className="hidden sm:flex items-center gap-1 ltr" dir="ltr">
					<button
						type="button"
						onClick={() => scroll("left")}
						className="p-1.5 rounded-lg bg-zinc-900/90 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all active:scale-95 shadow-sm"
						title="چەپ"
					>
						<ChevronLeft className="w-4 h-4" />
					</button>
					<button
						type="button"
						onClick={() => scroll("right")}
						className="p-1.5 rounded-lg bg-zinc-900/90 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all active:scale-95 shadow-sm"
						title="ڕاست"
					>
						<ChevronRight className="w-4 h-4" />
					</button>
				</div>
			</div>

			{/* Slider Container */}
			<div
				ref={sliderRef}
				className="flex gap-4 overflow-x-auto overflow-y-hidden no-scrollbar px-4 sm:px-6 py-3 snap-x scroll-smooth"
			>
				{items.slice(0, 9).map((item, index) => {
					const type: "movie" | "tv" =
						item.media_type === "tv" || item.first_air_date ? "tv" : "movie";
					const title = item.title || item.name || "بێ ناونیشان";
					const posterUrl = getImageUrl(item.poster_path, "w500");
					const rating = item.vote_average
						? item.vote_average.toFixed(1)
						: "N/A";
					const rank = index + 1;

					const handleClick = () => {
						if (type === "movie") {
							onRouteChange({ mode: "movie-detail", id: item.id });
						} else {
							onRouteChange({ mode: "tv-detail", id: item.id });
						}
					};

					return (
						<div
							key={item.id}
							onClick={handleClick}
							className="flex-none w-42.5 sm:w-52.5 snap-start relative group cursor-pointer select-none"
						>
							<div className="flex items-end">
								{/* Large Stylized Rank Number */}
								<span className="text-[80px] sm:text-[110px] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-linear-to-b from-zinc-100 via-zinc-400 to-zinc-800 opacity-90 select-none pointer-events-none -mr-4 sm:-mr-6 z-10 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] font-display">
									{toKurdishNumber(rank)}
								</span>

								{/* Poster Card */}
								<div className="relative w-full aspect-2/3 rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 group-hover:border-amber-400/80 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-amber-400/20 z-0">
									<img
										src={posterUrl}
										alt={title}
										loading="lazy"
										className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
									/>

									{/* Gradient Overlay */}
									<div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/20 to-transparent" />

									{/* Top VIP Badge */}
									<div className="absolute top-2 right-2 bg-linear-to-r from-amber-400 to-amber-500 text-zinc-950 text-xs font-black uppercase px-2 py-0.5 rounded-md shadow-md">
										TOP {rank}
									</div>

									{/* Bottom Info & Play button overlay */}
									<div className="absolute inset-x-0 bottom-0 p-3 bg-linear-to-t from-zinc-950 via-zinc-950/90 to-transparent flex flex-col justify-end">
										<div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold mb-1">
											<Star className="w-3 h-3 fill-amber-400" />
											<span>{rating}</span>
											<span className="text-zinc-400">
												&middot; {type === "movie" ? "فیلم" : "زنجیرە"}
											</span>
										</div>

										<h3 className="text-xs sm:text-sm font-bold text-white line-clamp-1 group-hover:text-amber-400 transition-colors">
											{title}
										</h3>
									</div>

									{/* Play Hover Overlay */}
									<div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
										<div className="w-11 h-11 rounded-full bg-amber-400 text-zinc-950 flex items-center justify-center shadow-lg shadow-amber-400/30 transform group-hover:scale-100 scale-75 transition-all">
											<Play className="w-5 h-5 fill-zinc-950" />
										</div>
									</div>
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};
