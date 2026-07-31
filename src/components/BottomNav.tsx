import { Film, Home, Layers, Tv } from "lucide-react";
import { Link, useLocation } from "react-router";

export default function BottomNav() {
	const location = useLocation();
	const pathname = location.pathname;

	const items = [
		{
			id: "home",
			label: "ماڵەوە",
			icon: Home,
			path: "/",
		},
		{
			id: "movies",
			label: "فیلم",
			icon: Film,
			path: "/movies",
		},
		{
			id: "tv",
			label: "زنجیرە",
			icon: Tv,
			path: "/tv",
		},
		{
			id: "collections",
			label: "کۆکراوە",
			icon: Layers,
			path: "/collections",
		},
	];

	return (
		<div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#060709]/95 backdrop-blur-xl border-t border-zinc-800/80 px-1 py-1.5 shadow-2xl">
			<div className="grid grid-cols-4 items-center">
				{items.map((item) => {
					const Icon = item.icon;
					const isActive =
						(item.path === "/" && pathname === "/") ||
						(item.path === "/movies" &&
							(pathname.startsWith("/movies") ||
								pathname.startsWith("/movie/") ||
								pathname.startsWith("/watch-movie/"))) ||
						(item.path === "/tv" &&
							(pathname.startsWith("/tv") ||
								pathname.startsWith("/watch-tv/"))) ||
						(item.path === "/collections" &&
							pathname.startsWith("/collections"));

					return (
						<Link
							key={item.id}
							to={item.path}
							className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all relative ${
								isActive
									? "text-amber-400 font-bold"
									: "text-zinc-400 hover:text-zinc-200"
							}`}
						>
							<div className="relative">
								<Icon
									className={`w-5 h-5 transition-transform ${
										isActive ? "scale-110 text-amber-400" : ""
									}`}
								/>
							</div>
							<span className="text-xs sm:text-sm mt-1 font-semibold tracking-wide line-clamp-1">
								{item.label}
							</span>
							{isActive && (
								<span className="absolute bottom-0 w-6 h-0.5 bg-amber-400 rounded-full shadow-sm shadow-amber-400/50" />
							)}
						</Link>
					);
				})}
			</div>
		</div>
	);
}
