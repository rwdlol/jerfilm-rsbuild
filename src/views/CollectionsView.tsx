import { Layers, Play, Star } from "lucide-react";
import React, { useEffect, useState } from "react";
import { SEO } from "../components/SEO";
import { discoverMedia, getImageUrl } from "../services/tmdb";
import type { ActiveRoute, MediaItem } from "../types";

interface CollectionsViewProps {
	onRouteChange: (route: ActiveRoute) => void;
}

interface CollectionFranchise {
	id: number;
	title: string;
	kurdishTitle: string;
	description: string;
	backdropPath: string;
	posterPath: string;
	itemCount: number;
	featuredIds: number[];
}

const FEATURED_COLLECTIONS: CollectionFranchise[] = [
	{
		id: 1,
		title: "Marvel Cinematic Universe",
		kurdishTitle: "جیهانی مارڤڵ (MCU)",
		description:
			"تەواوی فیلمەکانی مارڤڵ لە ئەڤێنجەرز، ئایرۆن مان، تاوەکو سپایدەرمان و ثۆر.",
		backdropPath: "/yF1R21StR3R32J9R9S71S3.jpg",
		posterPath: "/mA16298R93.jpg",
		itemCount: 32,
		featuredIds: [299536, 299534, 634649, 284054],
	},
	{
		id: 2,
		title: "Batman Collection",
		kurdishTitle: "کۆکراوەی باتمان",
		description:
			"لە دارک نایتەکەی کریستۆفەر نۆلانەوە تاوەکو باتمانەکەی ڕۆبێرت پاتینسۆن.",
		backdropPath: "/nMK21S3.jpg",
		posterPath: "/74x99R9.jpg",
		itemCount: 12,
		featuredIds: [155, 272, 414906, 49026],
	},
	{
		id: 3,
		title: "Harry Potter Saga",
		kurdishTitle: "زنجیرە فیلمەکانی هاری پۆتەر",
		description:
			"کۆکراوەی تەواوی فیلمەکانی جادووگەری هاری پۆتەر و فانتاسیک بیستس.",
		backdropPath: "/hp123.jpg",
		posterPath: "/hpPoster.jpg",
		itemCount: 10,
		featuredIds: [671, 672, 673, 674],
	},
	{
		id: 4,
		title: "Fast & Furious Franchise",
		kurdishTitle: "سەری خێرا و تووڕە (Fast & Furious)",
		description:
			"تەواوی بەشەکانی خێرا و تووڕە لەگەڵ دۆمینیک تۆریتۆ و تیمی پێشبڕکێکاران.",
		backdropPath: "/fast123.jpg",
		posterPath: "/fastPoster.jpg",
		itemCount: 11,
		featuredIds: [385687, 337404, 335988, 9799],
	},
	{
		id: 5,
		title: "John Wick Collection",
		kurdishTitle: "کۆکراوەی جۆن ویک",
		description:
			"بەشەکانی جۆن ویک لەگەڵ کیانو ڕیڤس لە جیهانی بکوژە پیشەگەرەکاندا.",
		backdropPath: "/jw123.jpg",
		posterPath: "/jwPoster.jpg",
		itemCount: 4,
		featuredIds: [603692, 458156, 324552, 245891],
	},
	{
		id: 6,
		title: "The Lord of the Rings & Hobbit",
		kurdishTitle: "پاشای ئەڵقەکان و هۆبێت",
		description:
			"گەشتە ئەفساناوییەکەی خاکی ناوەڕاست بۆ لەناوبردنی ئەڵقەی دەسەڵات.",
		backdropPath: "/lotr123.jpg",
		posterPath: "/lotrPoster.jpg",
		itemCount: 6,
		featuredIds: [120, 121, 122, 49051],
	},
];

export default function CollectionsView({
	onRouteChange,
}: CollectionsViewProps) {
	const [activeCollection, setActiveCollection] =
		useState<CollectionFranchise | null>(FEATURED_COLLECTIONS[0]);
	const [collectionMovies, setCollectionMovies] = useState<MediaItem[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (activeCollection) {
			fetchCollectionItems(activeCollection);
		}
	}, [activeCollection]);

	const fetchCollectionItems = async (collection: CollectionFranchise) => {
		setLoading(true);
		try {
			// Fetch Action / Popular movies to populate rich collection lists
			const res = await discoverMedia("movie", {
				page: 1,
				sortBy: "popularity.desc",
			});
			if (res && res.results) {
				setCollectionMovies(res.results.slice(0, 12));
			}
		} catch (err) {
			console.error("Error loading collection items:", err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-in fade-in duration-300">
			<SEO
				title="کۆکراوەکان - زنجیرە فیلمەکانی هۆڵیوود بە ژێرنووسی کوردی"
				description="تەواوی زنجیرە فیلمە ناودارەکانی جیهان (مارڤڵ، هاری پۆتەر، بەتمان، تایران، هتد) بە ژێرنووسی کوردی."
				keywords={[
					"کۆکراوەکان",
					"زنجیرە فیلم",
					"مارڤڵ کوردی",
					"هاری پۆتەر کوردی",
					"Jerfilm",
				]}
			/>
			{/* Title Header */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
				<div>
					<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-bold mb-2">
						<Layers className="w-3.5 h-3.5" />
						<span>کۆکراوەی بەناوبانگ و فرانچایزەکان</span>
					</div>
					<h1 className="text-2xl sm:text-4xl font-black text-white font-display">
						کۆکراوەکانی فیلم و زنجیرەکان
					</h1>
					<p className="text-xs sm:text-sm text-zinc-400 mt-1">
						سەیرکردنی تەواوی بەشەکانی زنجیرە فیلمە جیهانییەکان بە دوای یەکدا
					</p>
				</div>
			</div>

			{/* Featured Collections Selectors */}
			<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
				{FEATURED_COLLECTIONS.map((c) => {
					const isSelected = activeCollection?.id === c.id;
					return (
						<button
							type="button"
							key={c.id}
							onClick={() => setActiveCollection(c)}
							className={`p-3.5 rounded-2xl border text-right transition-all flex flex-col justify-between h-28 relative overflow-hidden group ${
								isSelected
									? "bg-amber-400 text-zinc-950 border-amber-300 font-bold shadow-lg shadow-amber-400/20"
									: "bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 border-zinc-800"
							}`}
						>
							<div className="flex items-center justify-between w-full z-10">
								<Layers
									className={`w-4 h-4 ${isSelected ? "text-zinc-950" : "text-amber-400"}`}
								/>
								<span
									className={`text-[10px] px-1.5 py-0.5 rounded ${isSelected ? "bg-zinc-950/20 text-zinc-950" : "bg-zinc-800 text-zinc-400"}`}
								>
									{c.itemCount} بەش
								</span>
							</div>
							<div className="z-10">
								<h3 className="text-xs font-black line-clamp-2 leading-tight">
									{c.kurdishTitle}
								</h3>
							</div>
						</button>
					);
				})}
			</div>

			{/* Active Collection Spotlight */}
			{activeCollection && (
				<div className="relative rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800 mb-12 shadow-2xl p-6 sm:p-10">
					<div className="max-w-2xl">
						<span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
							کۆکراوەی هەڵبژێردراو
						</span>
						<h2 className="text-2xl sm:text-4xl font-black text-white font-display mt-1 mb-3">
							{activeCollection.kurdishTitle}
						</h2>
						<p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-6">
							{activeCollection.description}
						</p>
					</div>

					{/* Collection Grid Items */}
					<div className="mt-8">
						<h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2 border-r-2 border-amber-400 pr-2">
							<span>فیلمەکانی ناو ئەم کۆکراوەیە</span>
						</h3>

						{loading ? (
							<div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
								{[1, 2, 3, 4, 5, 6].map((n) => (
									<div
										key={n}
										className="aspect-2/3 bg-zinc-800 animate-pulse rounded-2xl"
									/>
								))}
							</div>
						) : (
							<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
								{collectionMovies.map((item) => (
									<div
										key={item.id}
										onClick={() =>
											onRouteChange({ mode: "movie-detail", id: item.id })
										}
										className="group cursor-pointer bg-zinc-950 rounded-2xl border border-zinc-800/80 overflow-hidden hover:border-amber-400/80 transition-all hover:shadow-xl hover:shadow-amber-400/10"
									>
										<div className="relative aspect-2/3 bg-zinc-900">
											<img
												src={getImageUrl(item.poster_path, "w500")}
												alt={item.title || item.name}
												loading="lazy"
												className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
											/>
											<div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] text-amber-400 font-bold flex items-center gap-1">
												<Star className="w-3 h-3 fill-amber-400" />
												<span>
													{item.vote_average
														? item.vote_average.toFixed(1)
														: "N/A"}
												</span>
											</div>
											<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
												<div className="w-10 h-10 rounded-full bg-amber-400 text-zinc-950 flex items-center justify-center font-bold">
													<Play className="w-5 h-5 fill-zinc-950" />
												</div>
											</div>
										</div>
										<div className="p-2.5">
											<h4 className="text-xs font-bold text-white line-clamp-1 group-hover:text-amber-400 transition-colors">
												{item.title || item.name}
											</h4>
											<p className="text-[10px] text-zinc-400 mt-0.5">
												{item.release_date
													? item.release_date.split("-")[0]
													: "2024"}
											</p>
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
}
