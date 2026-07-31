import path from "node:path";
import express from "express";
import expressStaticGzip from "express-static-gzip";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

const TMDB_API_KEY =
	process.env.TMDB_API_KEY || "9b121a7c344eeb23baad7647d6b2eabe";
const TMDB_BASE_URL = "https://themoviedb.org";

app.use(express.json());

// In-memory cache for dynamic sitemap (1 hour cache)
let cachedSitemapXml: string | null = null;
let sitemapCacheTime: number = 0;
const SITEMAP_CACHE_DURATION = 60 * 60 * 1000; // 1 hour in ms

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

// Robots.txt generator endpoint
app.get("/robots.txt", (req, res) => {
	const host = req.headers.host || "jerfilm.vip";
	const protocol = req.headers["x-forwarded-proto"] || "https";
	const baseUrl = `${protocol}://${host}`;

	const robotsTxt = `User-agent: *
Allow: /
Disallow: /api/

Sitemap: ${baseUrl}/sitemap.xml
`;

	res.header("Content-Type", "text/plain");
	res.send(robotsTxt);
});

// Automatic Dynamic XML Sitemap Generator
app.get("/sitemap.xml", async (req, res) => {
	const host = req.headers.host || "jerfilm.vip";
	const protocol = req.headers["x-forwarded-proto"] || "https";
	const baseUrl = `${protocol}://${host}`;

	const now = Date.now();
	if (cachedSitemapXml && now - sitemapCacheTime < SITEMAP_CACHE_DURATION) {
		res.header("Content-Type", "application/xml");
		return res.send(cachedSitemapXml);
	}

	try {
		const today = new Date().toISOString().split("T")[0];

		// Static Routes
		const staticRoutes = [
			{ url: "/", priority: "1.0", changefreq: "daily" },
			{ url: "/movies", priority: "0.9", changefreq: "daily" },
			{ url: "/tv", priority: "0.9", changefreq: "daily" },
			{ url: "/actors", priority: "0.8", changefreq: "weekly" },
			{ url: "/collections", priority: "0.8", changefreq: "weekly" },
			{ url: "/about", priority: "0.5", changefreq: "monthly" },
			{ url: "/search", priority: "0.6", changefreq: "daily" },
		];

		// Fetch popular movies (pages 1-3)
		const moviePromises = [1, 2, 3].map((page) =>
			fetch(
				`${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&page=${page}`,
			)
				.then((r) => r.json())
				.then((d) => d.results || [])
				.catch(() => []),
		);

		// Fetch popular TV shows (pages 1-3)
		const tvPromises = [1, 2, 3].map((page) =>
			fetch(`${TMDB_BASE_URL}/tv/popular?api_key=${TMDB_API_KEY}&page=${page}`)
				.then((r) => r.json())
				.then((d) => d.results || [])
				.catch(() => []),
		);

		// Fetch popular actors (page 1)
		const actorPromise = fetch(
			`${TMDB_BASE_URL}/person/popular?api_key=${TMDB_API_KEY}&page=1`,
		)
			.then((r) => r.json())
			.then((d) => d.results || [])
			.catch(() => []);

		const [movieResultsArray, tvResultsArray, actors] = await Promise.all([
			Promise.all(moviePromises),
			Promise.all(tvPromises),
			actorPromise,
		]);

		const movies = movieResultsArray.flat();
		const tvShows = tvResultsArray.flat();

		let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://sitemaps.org"
        xmlns:image="http://google.com">
`;

		// Add static routes
		for (const route of staticRoutes) {
			xml += `  <url>
    <loc>${baseUrl}${route.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>\n`;
		}

		// Add Movie detail & watch URLs
		for (const movie of movies) {
			if (!movie.id) continue;
			const title = escapeXml(movie.title || movie.original_title || "");
			const imageTag = movie.poster_path
				? `\n    <image:image>\n      <image:loc>https://tmdb.org{movie.poster_path}</image:loc>\n      <image:title>${title}</image:title>\n    </image:image>`
				: "";

			xml += `  <url>
    <loc>${baseUrl}/movie/${movie.id}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>${imageTag}
  </url>\n`;

			xml += `  <url>
    <loc>${baseUrl}/watch-movie/${movie.id}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>\n`;
		}

		// Add TV Show detail & watch URLs
		for (const tv of tvShows) {
			if (!tv.id) continue;
			const name = escapeXml(tv.name || tv.original_name || "");
			const imageTag = tv.poster_path
				? `\n    <image:image>\n      <image:loc>https://tmdb.org{tv.poster_path}</image:loc>\n      <image:title>${name}</image:title>\n    </image:image>`
				: "";

			xml += `  <url>
    <loc>${baseUrl}/tv/${tv.id}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>${imageTag}
  </url>\n`;

			xml += `  <url>
    <loc>${baseUrl}/watch-tv/${tv.id}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>\n`;
		}

		// Add Actor detail URLs
		for (const actor of actors) {
			if (!actor.id) continue;
			xml += `  <url>
    <loc>${baseUrl}/actor/${actor.id}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>\n`;
		}

		xml += `</urlset>`;

		cachedSitemapXml = xml;
		sitemapCacheTime = Date.now();

		res.header("Content-Type", "application/xml");
		res.send(xml);
	} catch (err: unknown) {
		// Fixed: Changed 'any' to 'unknown' to fix Biome lint error
		console.error("Sitemap generation error:", err);
		res.status(500).send("Error generating sitemap");
	}
});

// Proxy endpoint for TMDB API to avoid CORS issues and manage API key server-side
app.all("/api/tmdb/*endpoint", async (req, res) => {
	try {
		const endpoint = req.params.endpoint;
		const query = new URLSearchParams(req.query as Record<string, string>);

		if (!query.has("api_key")) {
			query.set("api_key", TMDB_API_KEY);
		}

		const targetUrl = `${TMDB_BASE_URL}/${endpoint}?${query.toString()}`;

		const response = await fetch(targetUrl, {
			method: req.method,
			headers: {
				Accept: "application/json",
			},
		});

		const data = await response.json();
		res.status(response.status).json(data);
	} catch (error: unknown) {
		// Fixed: Changed 'any' to 'unknown' to satisfy Biome lint verification
		console.error("TMDB Proxy Error:", error);
		const message = error instanceof Error ? error.message : "Unknown error";
		res
			.status(500)
			.json({ error: "Failed to fetch from TMDB", details: message });
	}
});

// Health check endpoint
app.get("/api/health", (_req, res) => {
	res.json({
		status: "ok",
		app: "CineStream TMDB Client",
		sitemap: "/sitemap.xml",
	});
});

async function startServer() {
	if (process.env.NODE_ENV !== "production") {
		const vite = await createViteServer({
			server: { middlewareMode: true },
			appType: "spa",
		});
		app.use(vite.middlewares);
	} else {
		const distPath = path.join(process.cwd(), "dist");

		// Fixed: Nest options inside `serveStatic` and explicit string/Response type matching
		app.use(
			"/",
			expressStaticGzip(distPath, {
				enableBrotli: true,
				orderPreference: ["br", "gz"],
				index: false,
				serveStatic: {
					// Remove explicit typings from res and assetPath entirely
					setHeaders: (res, assetPath) => {
						if (
							typeof assetPath === "string" &&
							assetPath.includes("/assets/")
						) {
							res.setHeader(
								"Cache-Control",
								"public, max-age=31536000, immutable",
							);
						}
					},
				},
			}),
		);

		app.get("*", (_req, res) => {
			res.sendFile(path.join(distPath, "index.html"));
		});
	}

	app.listen(PORT, "0.0.0.0", () => {
		console.log(`CineStream Server running on http://0.0.0:${PORT}`);
	});
}

startServer();
