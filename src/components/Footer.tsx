import {
	AlertTriangle,
	Code2,
	ExternalLink,
	Film,
	Home,
	Info,
	Layers,
	ShieldCheck,
	Sparkles,
	Tv,
	Users,
	Zap,
} from "lucide-react";
import { Link } from "react-router";

export default function Footer() {
	return (
		<footer className="mt-20 border-t border-zinc-800/80 bg-black text-zinc-300 relative overflow-hidden pb-28 md:pb-0">
			{/* Background Decorative Glow */}
			<div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
			<div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />

			{/* 1. FEATURES SECTION */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
				<div className="text-center max-w-3xl mx-auto mb-12">
					<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-bold mb-3">
						<Sparkles className="w-3.5 h-3.5" />
						<span>سەکۆی ژمارە یەک &middot; Jerfilm.VIP</span>
					</div>
					<h2 className="text-2xl sm:text-3xl font-black text-white font-display">
						تایبەتمەندییە ناوازەکانی سەکۆکەمان
					</h2>
					<p className="text-sm text-zinc-400 mt-2">
						ئەزموونێکی جیاواز لە سەیرکردنی فیلم و زنجیرە جیهانییەکان بەبێ
						بێزارکردن
					</p>
				</div>

				{/* Feature Cards Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					{/* Feature 1 */}
					<div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 hover:border-amber-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-amber-400/10 group">
						<div className="w-12 h-12 rounded-xl bg-linear-to-tr from-amber-500 via-amber-300 to-amber-600 p-0.5 mb-4 group-hover:scale-110 transition-transform">
							<div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
								<Sparkles className="w-6 h-6 text-amber-400" />
							</div>
						</div>
						<h3 className="text-base font-bold text-white mb-2">
							وەرگێڕانی زیرەک (AI)
						</h3>
						<p className="text-xs text-zinc-400 leading-relaxed">
							بەستراوەتەوە بە سیستەمی زیرەکی دەستکرد بۆ هاوکاتکردن و خێراکردنی
							وەرگێڕانی ژێرنووسەکان لەگەڵ کاتی ڕاستەقینەی ڕووداوەکان.
						</p>
					</div>

					{/* Feature 2 */}
					<div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 hover:border-amber-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-amber-400/10 group">
						<div className="w-12 h-12 rounded-xl bg-linear-to-tr from-amber-500 via-amber-300 to-amber-600 p-0.5 mb-4 group-hover:scale-110 transition-transform">
							<div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
								<ShieldCheck className="w-6 h-6 text-amber-400" />
							</div>
						</div>
						<h3 className="text-base font-bold text-white mb-2">
							بێ ڕێکلامی بێزارکەر
						</h3>
						<p className="text-xs text-zinc-400 leading-relaxed">
							ئێمە هیچ جۆرە ڕێکلامێکی بێزارکەر یان پاڵپێوەنەری بەکارناهێنین کە
							ئەزموونی بینینت تێکبدات. پلاتفۆرمەکە بە تەواوی خاوێنە.
						</p>
					</div>

					{/* Feature 3 */}
					<div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 hover:border-amber-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-amber-400/10 group">
						<div className="w-12 h-12 rounded-xl bg-linear-to-tr from-amber-500 via-amber-300 to-amber-600 p-0.5 mb-4 group-hover:scale-110 transition-transform">
							<div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
								<Zap className="w-6 h-6 text-amber-400" />
							</div>
						</div>
						<h3 className="text-base font-bold text-white mb-2">
							خێرایی پەخشی نایاب
						</h3>
						<p className="text-xs text-zinc-400 leading-relaxed">
							سێرڤەرە جۆراوجۆرەکانمان دڵنیایی دەدەن لەوەی کە بە خێراترین کات و
							بەبێ وەستان لەسەر مۆبایل و دێسکتۆپ بتوانێت پەخش ببێت.
						</p>
					</div>

					{/* Feature 4 */}
					<div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 hover:border-amber-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-amber-400/10 group">
						<div className="w-12 h-12 rounded-xl bg-linear-to-tr from-amber-500 via-amber-300 to-amber-600 p-0.5 mb-4 group-hover:scale-110 transition-transform">
							<div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
								<Code2 className="w-6 h-6 text-amber-400" />
							</div>
						</div>
						<h3 className="text-base font-bold text-white mb-1">
							پڕۆژەی فێرکاری ئۆپن سۆرس
						</h3>
						<p className="text-[11px] font-semibold text-amber-400 mb-2">
							یارمەتیدەربین لە پەرەپێدانی ئەم پڕۆژەیە
						</p>
						<p className="text-xs text-zinc-400 leading-relaxed">
							کۆدەکانمان بە تەواوی لەسەر کۆگای گشتی لە گیتهەب بەردەستن. پڕۆژەکە
							تەنها تاقیکردنەوەی زانستی و فێرکاری و کارپێکردنی APIـەکانی
							TMDBـەیە بەبێ هیچ پاشەکەوتکردنێکی داتای تایبەت.
						</p>
					</div>
				</div>
			</div>

			<div className="border-t border-zinc-800/60" />

			{/* 2. FOOTER LINKS & BRANDING */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<div className="grid grid-cols-1 md:grid-cols-12 gap-8">
					{/* Brand Info */}
					<div className="md:col-span-5 space-y-4">
						<div className="text-2xl font-black text-white tracking-wider font-display">
							JerFilm.<span className="text-amber-400">VIP</span>
						</div>
						<p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-md">
							گەورەترین ماڵپەڕی کوردی بۆ فیلم و زنجیرەی جیهانی بە ژێرنووسی
							کوردی. خێراترین سیستەمی وەرگێڕانی بێ ڕێکلام. ئیتر چاوەڕوانی نییە،
							سیستەمی ai ی ئۆتۆماتیکی هەموو شتێکت بۆ وەرگێڕاوە.
						</p>
					</div>

					{/* Quick Links */}
					<div className="md:col-span-4 space-y-3">
						<h4 className="text-sm font-bold text-white uppercase tracking-wider border-r-2 border-amber-400 pr-2">
							لاپەڕەکان
						</h4>
						<ul className="grid grid-cols-2 gap-2 text-xs font-semibold text-zinc-400">
							<li>
								<Link
									to="/"
									className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
								>
									<Home className="w-3.5 h-3.5" />
									<span>ماڵەوە</span>
								</Link>
							</li>
							<li>
								<Link
									to="/about"
									className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
								>
									<Info className="w-3.5 h-3.5" />
									<span>دەربارەی ئێمە</span>
								</Link>
							</li>
							<li>
								<Link
									to="/movies"
									className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
								>
									<Film className="w-3.5 h-3.5" />
									<span>فیلمەکان</span>
								</Link>
							</li>
							<li>
								<Link
									to="/tv"
									className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
								>
									<Tv className="w-3.5 h-3.5" />
									<span>زنجیرە</span>
								</Link>
							</li>
							<li>
								<Link
									to="/actors"
									className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
								>
									<Users className="w-3.5 h-3.5" />
									<span>ئەکتەرەکان</span>
								</Link>
							</li>
							<li>
								<Link
									to="/collections"
									className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
								>
									<Layers className="w-3.5 h-3.5" />
									<span>کۆکراوەکان</span>
								</Link>
							</li>
						</ul>
					</div>

					{/* Social Links */}
					<div className="md:col-span-3 space-y-3">
						<h4 className="text-sm font-bold text-white uppercase tracking-wider border-r-2 border-amber-400 pr-2">
							فۆڵۆومان بکەن لە...
						</h4>
						<div className="flex flex-col gap-2.5 text-xs font-semibold">
							<a
								href="https://tiktok.com"
								target="_blank"
								rel="noreferrer"
								className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white flex items-center justify-between transition-colors group"
							>
								<span>TikTok</span>
								<ExternalLink className="w-3.5 h-3.5 text-zinc-500 group-hover:text-amber-400" />
							</a>
							<a
								href="https://instagram.com"
								target="_blank"
								rel="noreferrer"
								className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white flex items-center justify-between transition-colors group"
							>
								<div className="flex items-center gap-2">
									<span>Instagram</span>
								</div>
								<ExternalLink className="w-3.5 h-3.5 text-zinc-500 group-hover:text-amber-400" />
							</a>
							<a
								href="https://github.com"
								target="_blank"
								rel="noreferrer"
								className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white flex items-center justify-between transition-colors group"
							>
								<div className="flex items-center gap-2">
									<span>GitHub</span>
								</div>
								<ExternalLink className="w-3.5 h-3.5 text-zinc-500 group-hover:text-amber-400" />
							</a>
						</div>
					</div>
				</div>
			</div>

			{/* 3. CLEAN UI EDUCATIONAL NOTICE ALERT */}
			<div className="bg-zinc-950 border-t border-zinc-800/80 py-6 px-4 sm:px-6">
				<div className="max-w-5xl mx-auto rounded-2xl bg-linear-to-r from-amber-500/10 via-zinc-900/90 to-zinc-900/90 border border-amber-400/30 p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left shadow-lg">
					<div className="p-2 rounded-xl bg-amber-400/20 text-amber-400 shrink-0">
						<AlertTriangle className="w-5 h-5" />
					</div>
					<p
						className="text-xs text-zinc-400 font-mono leading-relaxed ltr"
						dir="ltr"
					>
						THIS PROJECT IS FOR EDUCATIONAL PURPOSES ONLY! This site does not
						store any files and we do not track users; it only links to
						third-party media. Hosted on GitHub Pages. We use the TMDB API but
						are not endorsed or certified by TMDB. We do not Save any user data
						or track users.
					</p>
				</div>
			</div>
		</footer>
	);
}
