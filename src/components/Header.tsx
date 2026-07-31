import {
	Bookmark,
	Film,
	Home,
	Info,
	Search,
	Sparkles,
	Tv,
	X,
} from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import type { ActiveRoute } from "../types";
import { routeToPath } from "../utils/navigation";

interface HeaderProps {
	onRouteChange?: (route: ActiveRoute) => void;
	watchlistCount: number;
}

export default function Header({ onRouteChange, watchlistCount }: HeaderProps) {
	const [isScrolled, setIsScrolled] = useState(false);
	const [searchOpen, setSearchOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");

	const location = useLocation();
	const navigate = useNavigate();

	const navigateTo = (route: ActiveRoute) => {
		if (onRouteChange) {
			onRouteChange(route);
		} else {
			navigate(routeToPath(route));
		}
	};

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 20);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const handleSearchSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (searchQuery.trim()) {
			navigateTo({ mode: "search", searchQuery: searchQuery.trim() });
			setSearchOpen(false);
		}
	};

	const pathname = location.pathname;

	return (
		<>
			<header
				className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
					isScrolled
						? "bg-[#060709]/95 backdrop-blur-md border-b border-zinc-800/80 shadow-2xl py-2.5"
						: "bg-linear-to-b from-[#060709]/95 via-[#060709]/60 to-transparent py-3.5"
				}`}
			>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
					{/* Logo - Jerfilm.VIP with Gold Brand Touch */}
					<Link
						to="/"
						className="flex items-center gap-2.5 group text-right focus:outline-none"
					>
						<div className="text-xl font-black text-white tracking-wider font-display">
							JerFilm.<span className="text-amber-400">VIP</span>
						</div>
					</Link>

					{/* Desktop Navigation Links */}
					<nav className="hidden md:flex items-center gap-1 bg-zinc-900/80 border border-zinc-800/90 p-1.5 rounded-full text-xs font-semibold backdrop-blur-md shadow-inner">
						<Link
							to="/"
							className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
								pathname === "/"
									? "bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-400/20"
									: "text-zinc-300 hover:text-white hover:bg-zinc-800/60"
							}`}
						>
							<Home className="w-3.5 h-3.5" />
							<span>ماڵەوە</span>
						</Link>
						<Link
							to="/movies"
							className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
								pathname.startsWith("/movies") ||
								pathname.startsWith("/movie/") ||
								pathname.startsWith("/watch-movie/")
									? "bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-400/20"
									: "text-zinc-300 hover:text-white hover:bg-zinc-800/60"
							}`}
						>
							<Film className="w-3.5 h-3.5" />
							<span>فیلمەکان</span>
						</Link>
						<Link
							to="/tv"
							className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
								pathname.startsWith("/tv") || pathname.startsWith("/watch-tv/")
									? "bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-400/20"
									: "text-zinc-300 hover:text-white hover:bg-zinc-800/60"
							}`}
						>
							<Tv className="w-3.5 h-3.5" />
							<span>زنجیرەکان</span>
						</Link>
						<Link
							to="/about"
							className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
								pathname.startsWith("/about")
									? "bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-400/20"
									: "text-zinc-300 hover:text-white hover:bg-zinc-800/60"
							}`}
						>
							<Info className="w-3.5 h-3.5" />
							<span>دەربارەی ئێمە</span>
						</Link>
						<Link
							to="/watchlist"
							className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 relative ${
								pathname.startsWith("/watchlist")
									? "bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-400/20"
									: "text-zinc-300 hover:text-white hover:bg-zinc-800/60"
							}`}
						>
							<Bookmark className="w-3.5 h-3.5" />
							<span>لیستی سەیرکردن</span>
							{watchlistCount > 0 && (
								<span className="mr-0.5 px-1.5 py-0.2 text-xs bg-amber-600 text-white font-black rounded-full">
									{watchlistCount}
								</span>
							)}
						</Link>
					</nav>

					{/* Right Action Tools */}
					<div className="flex items-center gap-2">
						<button
							type="button"
							onClick={() => setSearchOpen(true)}
							className="p-2 sm:px-3.5 sm:py-2 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition-all flex items-center gap-2 text-xs font-semibold group shadow-sm cursor-pointer"
							title="گەڕان"
						>
							<Search className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
							<span className="hidden sm:inline text-zinc-400 group-hover:text-zinc-200">
								گەڕان...
							</span>
						</button>

						<Link
							to="/watchlist"
							className="md:hidden p-2 rounded-xl bg-zinc-900 text-zinc-300 border border-zinc-800 relative"
						>
							<Bookmark className="w-4 h-4 text-amber-400" />
							{watchlistCount > 0 && (
								<span className="absolute -top-1 -left-1 w-4 h-4 bg-amber-600 text-white text-xs font-black rounded-full flex items-center justify-center">
									{watchlistCount}
								</span>
							)}
						</Link>
					</div>
				</div>
			</header>

			{/* Quick Search Overlay Modal */}
			{searchOpen && (
				<div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start justify-center p-4 pt-20 animate-in fade-in duration-200">
					<div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-4 overflow-hidden">
						<div className="flex items-center justify-between pb-3 border-b border-zinc-800">
							<div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
								<Sparkles className="w-4 h-4" />
								<span>گەڕان لە بەرهەمەکان و ئەکتەرەکاندا</span>
							</div>
							<button
								type="button"
								onClick={() => setSearchOpen(false)}
								className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
							>
								<X className="w-5 h-5" />
							</button>
						</div>

						<form onSubmit={handleSearchSubmit} className="mt-4 flex gap-2">
							<div className="relative flex-1">
								<Search className="w-5 h-5 absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
								<input
									type="text"
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									placeholder="ناوی فیلم، زنجیرە یان ئەکتەر بنووسە..."
									className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pr-11 pl-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all text-right"
								/>
							</div>
							<button
								type="submit"
								className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-sm rounded-xl transition-all shadow-md shadow-amber-400/20"
							>
								گەڕان
							</button>
						</form>

						<div className="mt-4 pt-3 border-t border-zinc-800/50 flex items-center justify-between text-xs text-zinc-500">
							<span>ناوی فیلم یان زنجیرەکە بنووسە بۆ دۆزینەوە</span>
							<span className="hidden sm:inline">
								داگرتنی Enter بۆ گەڕانی تەواو
							</span>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
