export interface Env {
	ASSETS: { fetch: (request: Request | string) => Promise<Response> };
	TMDB_API_KEY?: string;
}

// Local definitions for Cloudflare-specific features to resolve TypeScript errors
export interface ExecutionContext {
	waitUntil(promise: Promise<unknown>): void;
	passThroughOnException(): void;
}

interface CloudflareCache {
	match(request: Request | string): Promise<Response | undefined>;
	put(request: Request | string, response: Response): Promise<void>;
}

interface CloudflareCacheStorage {
	default: CloudflareCache;
}

const DEFAULT_TMDB_API_KEY = "9b121a7c344eeb23baad7647d6b2eabe";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

function escapeXml(unsafe: string): string {
	return unsafe.replace(/[<>&'"]/g, (c) => {
		switch (c) {
			case "<":
				return "&lt;";
			case ">":
				return "&gt;";
			case "&":
				return "&amp;";
			case "'":
				return "&apos;";
			case '"':
				return "&quot;";
			default:
				return c;
		}
	});
}

export default {
	async fetch(
		request: Request,
		env: Env,
		ctx: ExecutionContext,
	): Promise<Response> {
		const url = new URL(request.url);
		const apiKey = env.TMDB_API_KEY || DEFAULT_TMDB_API_KEY;

		// 1. Robots.txt Route
		if (url.pathname === "/robots.txt") {
			const host = url.host || "jerfilm.vip";
			const protocol = url.protocol || "https:";
			const baseUrl = `${protocol}//${host}`;
			const robotsTxt = `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${baseUrl}/sitemap.xml\n`;
			return new Response(robotsTxt, {
				headers: { "Content-Type": "text/plain; charset=utf-8" },
			});
		}

		// 2. Sitemap.xml Route (with Cloudflare CDN Caching)
		if (url.pathname === "/sitemap.xml") {
			const cacheKey = new Request(url.toString(), request);
			// Resolved: Safely cast the global 'caches' to bypass standard DOM typings
			const cache = (caches as unknown as CloudflareCacheStorage).default;
			const cachedResponse = await cache.match(cacheKey);
			if (cachedResponse) {
				return cachedResponse;
			}

			try {
				const host = url.host || "jerfilm.vip";
				const protocol = url.protocol || "https:";
				const baseUrl = `${protocol}//${host}`;
				const today = new Date().toISOString().split("T")[0];

				const staticRoutes = [
					{ url: "/", priority: "1.0", changefreq: "daily" },
					{ url: "/movies", priority: "0.9", changefreq: "daily" },
					{ url: "/tv", priority: "0.9", changefreq: "daily" },
					{ url: "/actors", priority: "0.8", changefreq: "weekly" },
					{ url: "/collections", priority: "0.8", changefreq: "weekly" },
					{ url: "/about", priority: "0.5", changefreq: "monthly" },
					{ url: "/search", priority: "0.6", changefreq: "daily" },
				];

				// Fetch dynamic lists helper
				// Resolved: Replaced 'any' with typed assertions to satisfy Biome
				const fetchJson = (endpoint: string) =>
					fetch(`${TMDB_BASE_URL}/${endpoint}?api_key=${apiKey}`)
						.then((r) => (r.ok ? r.json() : { results: [] }))
						.then((d: unknown) => (d as { results?: unknown[] }).results || [])
						.catch(() => []);

				const moviePromises = [1, 2, 3].map((p) =>
					fetchJson(`movie/popular?page=${p}`),
				);
				const tvPromises = [1, 2, 3].map((p) =>
					fetchJson(`tv/popular?page=${p}`),
				);
				const actorPromise = fetchJson("person/popular?page=1");

				const [moviePages, tvPages, actors] = await Promise.all([
					Promise.all(moviePromises),
					Promise.all(tvPromises),
					actorPromise,
				]);

				const movies = moviePages.flat() as Record<string, any>[];
				const tvShows = tvPages.flat() as Record<string, any>[];

				let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://sitemaps.org" xmlns:image="http://google.com">\n`;

				for (const route of staticRoutes) {
					xml += `  <url>\n    <loc>${baseUrl}${route.url}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${route.changefreq}</changefreq>\n    <priority>${route.priority}</priority>\n  </url>\n`;
				}

				for (const movie of movies) {
					if (!movie.id) continue;
					const title = escapeXml(movie.title || movie.original_title || "");
					const imageTag = movie.poster_path
						? `\n    <image:image>\n      <image:loc>https://image.tmdb.org/t/p/w500${movie.poster_path}</image:loc>\n      <image:title>${title}</image:title>\n    </image:image>`
						: "";
					xml += `  <url>\n    <loc>${baseUrl}/movie/${movie.id}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>${imageTag}\n  </url>\n`;
					xml += `  <url>\n    <loc>${baseUrl}/watch-movie/${movie.id}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
				}

				for (const tv of tvShows) {
					if (!tv.id) continue;
					const name = escapeXml(tv.name || tv.original_name || "");
					const imageTag = tv.poster_path
						? `\n    <image:image>\n      <image:loc>https://image.tmdb.org/t/p/w500${tv.poster_path}</image:loc>\n      <image:title>${name}</image:title>\n    </image:image>`
						: "";
					xml += `  <url>\n    <loc>${baseUrl}/tv/${tv.id}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>${imageTag}\n  </url>\n`;
					xml += `  <url>\n    <loc>${baseUrl}/watch-tv/${tv.id}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
				}

				for (const actor of actors as Record<string, any>[]) {
					if (!actor.id) continue;
					xml += `  <url>\n    <loc>${baseUrl}/actor/${actor.id}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>\n`;
				}

				xml += `</urlset>`;

				const response = new Response(xml, {
					headers: {
						"Content-Type": "application/xml; charset=utf-8",
						"Cache-Control": "public, max-age=3600",
					},
				});

				ctx.waitUntil(cache.put(cacheKey, response.clone()));
				return response;
			} catch (err) {
				console.error("Sitemap generation error:", err);
				return new Response("Error generating sitemap", { status: 500 });
			}
		}

		// 3. TMDB Proxy Route
		if (url.pathname.startsWith("/api/tmdb/")) {
			try {
				const endpoint = url.pathname.slice("/api/tmdb/".length);
				const query = new URLSearchParams(url.search);

				if (!query.has("api_key")) {
					query.set("api_key", apiKey);
				}

				const targetUrl = `${TMDB_BASE_URL}/${endpoint}?${query.toString()}`;
				const response = await fetch(targetUrl, {
					method: request.method,
					headers: { Accept: "application/json" },
				});

				const data = await response.text();
				return new Response(data, {
					status: response.status,
					headers: {
						"Content-Type": "application/json",
						"Access-Control-Allow-Origin": "*",
					},
				});
			} catch (error) {
				console.error("TMDB Proxy Error:", error);
				return new Response(
					JSON.stringify({ error: "Failed to fetch from TMDB" }),
					{ status: 500, headers: { "Content-Type": "application/json" } },
				);
			}
		}

		// 4. API Health Route
		if (url.pathname === "/api/health") {
			return new Response(
				JSON.stringify({
					status: "ok",
					app: "CineStream TMDB Client (Cloudflare Worker)",
					sitemap: "/sitemap.xml",
				}),
				{ headers: { "Content-Type": "application/json" } },
			);
		}

		// 5. Fallback to Static Assets served by Cloudflare Pages/Workers Assets
		let response = await env.ASSETS.fetch(request);

		// Single Page Application Route fallback (Redirect undefined asset paths to index.html)
		if (response.status === 404 && !url.pathname.startsWith("/api/")) {
			const indexRequest = new Request(`${url.origin}/index.html`, request);
			response = await env.ASSETS.fetch(indexRequest);
		}

		return response;
	},
};
