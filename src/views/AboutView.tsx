import {
	Code2,
	Film,
	Globe,
	ShieldCheck,
	Sparkles,
	Tv,
	Zap,
} from "lucide-react";
import { SEO } from "../components/SEO";
import type { ActiveRoute } from "../types";

interface AboutViewProps {
	onRouteChange: (route: ActiveRoute) => void;
}

export default function AboutView({ onRouteChange }: AboutViewProps) {
	return (
		<div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto animate-in fade-in duration-300">
			<SEO
				title="دەربارەی ئێمە - Jerfilm.VIP"
				description="دەربارەی مالپەڕی Jerfilm.VIP - گەورەترین پلاتفۆرمی پەخشی فیلم و زنجیرەی جیهانی بە ژێرنووسی کوردی."
			/>
			{/* Hero Header */}
			<div className="relative rounded-3xl overflow-hidden bg-linear-to-b from-zinc-900 via-zinc-950 to-zinc-950 border border-zinc-800 p-8 sm:p-12 mb-12 shadow-2xl">
				<div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
				<div className="absolute bottom-0 left-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

				<div className="relative z-10 max-w-3xl">
					<div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-black mb-4">
						<Sparkles className="w-4 h-4" />
						<span>Jerfilm.VIP - www.jerfilm.vip</span>
					</div>

					<h1 className="text-3xl sm:text-5xl font-black text-white font-display leading-tight mb-4">
						گەورەترین ماڵپەڕی کوردی بۆ فیلم و زنجیرەی جیهانی
					</h1>

					<p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-medium mb-6">
						Jerfilm.VIP سەکۆیەکی پەرەپێدراوی سەردەمییە بۆ پەخشی خێرای فیلم و
						زنجیرە نێودەوڵەتییەکان بە ژێرنووسی کوردیی پاراو. ئێمە تەکنەلۆژیای
						زیرەکی دەستکرد (AI) بەکار دەهێنین بۆ هاوکاتکردنی ژێرنووس و وەرگێڕانی
						خێرا.
					</p>

					<div className="flex flex-wrap gap-3">
						<button
							type="button"
							onClick={() => onRouteChange({ mode: "movies" })}
							className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs sm:text-sm transition-all shadow-lg shadow-amber-400/20 flex items-center gap-2"
						>
							<Film className="w-4 h-4" />
							<span>گەڕان لە فیلمەکان</span>
						</button>
						<button
							type="button"
							onClick={() => onRouteChange({ mode: "tv" })}
							className="px-6 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white font-bold text-xs sm:text-sm transition-all flex items-center gap-2"
						>
							<Tv className="w-4 h-4 text-amber-400" />
							<span>گەڕان لە زنجیرەکان</span>
						</button>
					</div>
				</div>
			</div>

			{/* Feature Highlights Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
				<div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800/90 hover:border-amber-400/40 transition-all">
					<div className="w-12 h-12 rounded-xl bg-linear-to-tr from-amber-500 to-amber-300 p-0.5 mb-4">
						<div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
							<Sparkles className="w-6 h-6 text-amber-400" />
						</div>
					</div>
					<h2 className="text-lg font-black text-white mb-2">
						سیستەمی وەرگێڕانی زیرەک (AI)
					</h2>
					<p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
						بەستراوەتەوە بە سیستەمی زیرەکی دەستکرد بۆ هاوکاتکردن و خێراکردنی
						وەرگێڕانی ژێرنووسەکان لەگەڵ کاتی ڕاستەقینەی ڕووداوەکان بە باڵاترین
						کواڵتی.
					</p>
				</div>

				<div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800/90 hover:border-amber-400/40 transition-all">
					<div className="w-12 h-12 rounded-xl bg-linear-to-tr from-amber-500 to-amber-300 p-0.5 mb-4">
						<div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
							<ShieldCheck className="w-6 h-6 text-amber-400" />
						</div>
					</div>
					<h2 className="text-lg font-black text-white mb-2">
						بێ ڕێکلامی بێزارکەر
					</h2>
					<p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
						ئێمە هیچ جۆرە ڕێکلامێکی بێزارکەر یان پاڵپێوەنەری بەکارناهێنین کە
						ئەزموونی بینینت تێکبدات. پلاتفۆرمەکە بە تەواوی خاوێن و بێبەرامبەرە.
					</p>
				</div>

				<div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800/90 hover:border-amber-400/40 transition-all">
					<div className="w-12 h-12 rounded-xl bg-linear-to-tr from-amber-500 to-amber-300 p-0.5 mb-4">
						<div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
							<Zap className="w-6 h-6 text-amber-400" />
						</div>
					</div>
					<h2 className="text-lg font-black text-white mb-2">
						خێرایی پەخشی نایاب
					</h2>
					<p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
						سێرڤەرە جۆراوجۆرەکانمان دڵنیایی دەدەن لەوەی کە بە خێراترین کات و
						بەبێ وەستان لەسەر مۆبایل و دێسکتۆپ و سمارت تیڤی بتوانێت پەخش ببێت.
					</p>
				</div>

				<div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800/90 hover:border-amber-400/40 transition-all">
					<div className="w-12 h-12 rounded-xl bg-linear-to-tr from-amber-500 to-amber-300 p-0.5 mb-4">
						<div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
							<Code2 className="w-6 h-6 text-amber-400" />
						</div>
					</div>
					<h2 className="text-lg font-black text-white mb-2">
						پڕۆژەی فێرکاری ئۆپن سۆرس
					</h2>
					<p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
						کۆدەکانمان بە تەواوی لەسەر کۆگای گشتی لە گیتهەب بەردەستن. پڕۆژەکە
						تەنها تاقیکردنەوەی زانستی و فێرکاری و کارپێکردنی APIـەکانی TMDBـەیە
						بەبێ هیچ پاشەکەوتکردنێکی داتای تایبەت.
					</p>
				</div>
			</div>

			{/* Domain Specs & Stats */}
			<div className="p-8 rounded-3xl bg-zinc-950 border border-zinc-800/90 text-center mb-12">
				<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs mb-4">
					<Globe className="w-3.5 h-3.5 text-amber-400" />
					<span>ماڵپەڕی فەرمی: www.jerfilm.vip</span>
				</div>
				<h2 className="text-2xl font-black text-white font-display mb-2">
					Jerfilm.VIP
				</h2>
				<p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
					ئامانجمان بەرزکردنەوەی ئاستی ماڵپەڕە کوردییەکانە بۆ ستانداری جیهانی لە
					ڕووی خێرایی، دیزاین و ئەزموونی بەکارهێنەر.
				</p>

				<div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-zinc-800/80">
					<div>
						<div className="text-2xl font-black text-amber-400">4K / 1080p</div>
						<div className="text-xs text-zinc-500 mt-1">کواڵتی بەرز</div>
					</div>
					<div>
						<div className="text-2xl font-black text-amber-400">0%</div>
						<div className="text-xs text-zinc-500 mt-1">ڕێکلامی بێزارکەر</div>
					</div>
					<div>
						<div className="text-2xl font-black text-amber-400">24/7</div>
						<div className="text-xs text-zinc-500 mt-1">سێرڤەری چالاک</div>
					</div>
					<div>
						<div className="text-2xl font-black text-amber-400">100%</div>
						<div className="text-xs text-zinc-500 mt-1">ژێرنووسی کوردی</div>
					</div>
				</div>
			</div>
		</div>
	);
}
