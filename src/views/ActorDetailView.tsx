import {
	ArrowRight,
	Calendar,
	Film,
	MapPin,
	Play,
	Sparkles,
	Star,
} from "lucide-react";
import { useEffect, useState } from "react";
import { SEO } from "../components/SEO";
import {
	getImageUrl,
	getPersonCredits,
	getPersonDetails,
} from "../services/tmdb";
import type { ActiveRoute, MediaItem, PersonDetails } from "../types";

interface ActorDetailViewProps {
	actorId: number;
	onRouteChange: (route: ActiveRoute) => void;
}

export default function ActorDetailView({
	actorId,
	onRouteChange,
}: ActorDetailViewProps) {
	const [details, setDetails] = useState<PersonDetails | null>(null);
	const [credits, setCredits] = useState<MediaItem[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchActorData();
	}, [actorId]);

	const fetchActorData = async () => {
		setLoading(true);
		try {
			const [personRes, creditsRes] = await Promise.all([
				getPersonDetails(actorId),
				getPersonCredits(actorId),
			]);
			setDetails(personRes);
			if (creditsRes && creditsRes.cast) {
				// Sort credits by popularity
				const sorted = creditsRes.cast
					.filter((item) => item.poster_path)
					.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
				setCredits(sorted);
			}
		} catch (err) {
			console.error("Error fetching actor details:", err);
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 max-w-7xl mx-auto flex items-center justify-center">
				<div className="flex flex-col items-center gap-3">
					<div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
					<span className="text-xs font-bold text-zinc-400">
						تکایە چاوەڕێ بکە...
					</span>
				</div>
			</div>
		);
	}

	if (!details) {
		return (
			<div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 max-w-3xl mx-auto text-center">
				<h2 className="text-xl font-bold text-white mb-4">
					زانیارییەکانی ئەکتەر نەدۆزرایەوە
				</h2>
				<button
					type="button"
					onClick={() => onRouteChange({ mode: "actors" })}
					className="px-5 py-2.5 rounded-xl bg-amber-400 text-zinc-950 font-bold text-xs"
				>
					گەڕانەوە بۆ ئەکتەران
				</button>
			</div>
		);
	}

	const profileUrl = getImageUrl(details.profile_path, "w500");

	return (
		<div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-in fade-in duration-300">
			<SEO
				title={`${details.name} - فیلم و زنجیرەکان`}
				description={
					details.biography
						? details.biography.slice(0, 160)
						: `هەموو فیلم و زنجیرەکانی ${details.name} بە ژێرنووسی کوردی.`
				}
				image={profileUrl}
				type="profile"
				keywords={[
					details.name,
					`فیلمەکانی ${details.name}`,
					"ئەکتەر",
					"Jerfilm",
				]}
				schemaData={{
					"@context": "https://schema.org",
					"@type": "Person",
					name: details.name,
					image: profileUrl,
					birthDate: details.birthday,
					birthPlace: details.place_of_birth,
					description: details.biography
						? details.biography.slice(0, 200)
						: undefined,
				}}
			/>
			{/* Back Button */}
			<button
				type="button"
				onClick={() => onRouteChange({ mode: "actors" })}
				className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 text-xs font-bold transition-all"
			>
				<ArrowRight className="w-4 h-4" />
				<span>گەڕانەوە بۆ ئەکتەران</span>
			</button>

			{/* Actor Bio Header Card */}
			<div className="rounded-3xl bg-zinc-900/80 border border-zinc-800 p-6 sm:p-8 mb-12 shadow-2xl flex flex-col md:flex-row gap-8 items-center md:items-start">
				<div className="w-44 sm:w-56 aspect-3/4 rounded-2xl overflow-hidden bg-zinc-950 shrink-0 border border-amber-400/30 shadow-xl shadow-amber-400/5">
					<img
						src={profileUrl}
						alt={details.name}
						className="w-full h-full object-cover"
					/>
				</div>

				<div className="flex-1 text-center md:text-right">
					<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-bold mb-3">
						<Sparkles className="w-3.5 h-3.5" />
						<span>{details.known_for_department || "ئەکتەر"}</span>
					</div>

					<h1 className="text-2xl sm:text-4xl font-black text-white font-display mb-4">
						{details.name}
					</h1>

					<div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-zinc-400 mb-6 font-medium">
						{details.birthday && (
							<div className="flex items-center gap-1.5 bg-zinc-950 px-3 py-1.5 rounded-xl border border-zinc-800">
								<Calendar className="w-3.5 h-3.5 text-amber-400" />
								<span>لەدایکبوون: {details.birthday}</span>
							</div>
						)}
						{details.place_of_birth && (
							<div className="flex items-center gap-1.5 bg-zinc-950 px-3 py-1.5 rounded-xl border border-zinc-800">
								<MapPin className="w-3.5 h-3.5 text-amber-400" />
								<span>شوێنی لەدایکبوون: {details.place_of_birth}</span>
							</div>
						)}
					</div>

					{details.biography ? (
						<p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-3xl line-clamp-6">
							{details.biography}
						</p>
					) : (
						<p className="text-xs text-zinc-500">
							هیچ کورتەیەکی ژیاننامە بەردەست نییە.
						</p>
					)}
				</div>
			</div>

			{/* Filmography Section */}
			<div>
				<div className="flex items-center justify-between mb-6">
					<h2 className="text-xl font-black text-white font-display flex items-center gap-2 border-r-2 border-amber-400 pr-3">
						<Film className="w-5 h-5 text-amber-400" />
						<span>بەرهەمەکان و فیلمەکانی ({credits.length})</span>
					</h2>
				</div>

				{credits.length === 0 ? (
					<div className="p-12 text-center bg-zinc-900/50 rounded-2xl border border-zinc-800 text-zinc-400 text-xs">
						هیچ فیلم یان زنجیرەیەک بۆ ئەم ئەکتەرە تۆمار نەکراوە.
					</div>
				) : (
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
						{credits.map((item) => {
							const isTv =
								item.media_type === "tv" || item.first_air_date !== undefined;
							const title = item.title || item.name || "بێ ناونیشان";
							const posterUrl = getImageUrl(item.poster_path, "w500");

							return (
								<div
									key={`${item.id}-${item.media_type}`}
									onClick={() => {
										if (isTv) {
											onRouteChange({ mode: "tv-detail", id: item.id });
										} else {
											onRouteChange({ mode: "movie-detail", id: item.id });
										}
									}}
									className="group cursor-pointer bg-zinc-950 rounded-2xl border border-zinc-800/80 overflow-hidden hover:border-amber-400/80 transition-all hover:shadow-xl hover:shadow-amber-400/10"
								>
									<div className="relative aspect-2/3 bg-zinc-900">
										<img
											src={posterUrl}
											alt={title}
											loading="lazy"
											className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
										/>
										<div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-md text-xs text-amber-400 font-bold flex items-center gap-1">
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
											{title}
										</h4>
										<p className="text-xs text-zinc-400 mt-0.5">
											{isTv ? "زنجیرە" : "فیلم"}
										</p>
									</div>
								</div>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
}
