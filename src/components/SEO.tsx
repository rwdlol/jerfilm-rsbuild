import { useEffect } from "react";

interface SEOProps {
	title?: string;
	description?: string;
	image?: string;
	type?: "website" | "article" | "video.movie" | "video.tv_show" | "profile";
	canonicalUrl?: string;
	schemaData?: Record<string, any> | Record<string, any>[];
	keywords?: string[];
}

const DEFAULT_TITLE = "Jerfilm.VIP | ژێرنووسی کوردی - فیلم و زنجیرە بێبەرامبەر";
const DEFAULT_DESCRIPTION =
	"سەیرکردنی نوێترین فیلم و زنجیرە سەرکەوتووەکانی جیهان بە ژێرنووسی کوردی بە کوالێتی بەرز (1080p, 4K) بەخۆڕایی لە Jerfilm.VIP.";
const DEFAULT_IMAGE =
	"https://image.tmdb.org/t/p/w1280/8Y43POKjjL3A2S38S3EBR39R3.jpg"; // High quality poster backdrop
const DEFAULT_KEYWORDS = [
	"Jerfilm",
	"ژێرنووسی کوردی",
	"فیلمی کوردی",
	"زنجیرەی کوردی",
	"سەیرکردنی فیلم",
	"Kurdish subtitles",
	"فیلمی ئاکشن",
	"زنجیرەی دۆبلاژکراو",
	"Kurdish movies",
	"Jerfilm.VIP",
];

export function SEO({
	title,
	description = DEFAULT_DESCRIPTION,
	image = DEFAULT_IMAGE,
	type = "website",
	canonicalUrl,
	schemaData,
	keywords = DEFAULT_KEYWORDS,
}: SEOProps) {
	const fullTitle = title ? `${title} | Jerfilm.VIP` : DEFAULT_TITLE;
	const currentUrl =
		canonicalUrl ||
		(typeof window !== "undefined"
			? window.location.href
			: "https://jerfilm.vip");

	useEffect(() => {
		// 1. Update Title
		document.title = fullTitle;

		// Helper to update or create meta tag
		const setMetaTag = (
			selector: string,
			attrName: string,
			attrValue: string,
			content: string,
		) => {
			let element = document.querySelector(selector) as HTMLMetaElement | null;
			if (!element) {
				element = document.createElement("meta");
				element.setAttribute(attrName, attrValue);
				document.head.appendChild(element);
			}
			element.setAttribute("content", content);
		};

		// Helper to update or create link tag
		const setLinkTag = (rel: string, href: string) => {
			let element = document.querySelector(
				`link[rel="${rel}"]`,
			) as HTMLLinkElement | null;
			if (!element) {
				element = document.createElement("link");
				element.setAttribute("rel", rel);
				document.head.appendChild(element);
			}
			element.setAttribute("href", href);
		};

		// 2. Standard Meta Tags
		setMetaTag('meta[name="description"]', "name", "description", description);
		setMetaTag(
			'meta[name="keywords"]',
			"name",
			"keywords",
			keywords.join(", "),
		);
		setMetaTag(
			'meta[name="robots"]',
			"name",
			"robots",
			"index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
		);
		setLinkTag("canonical", currentUrl);

		// 3. OpenGraph Tags
		setMetaTag(
			'meta[property="og:site_name"]',
			"property",
			"og:site_name",
			"Jerfilm.VIP",
		);
		setMetaTag('meta[property="og:type"]', "property", "og:type", type);
		setMetaTag('meta[property="og:title"]', "property", "og:title", fullTitle);
		setMetaTag(
			'meta[property="og:description"]',
			"property",
			"og:description",
			description,
		);
		setMetaTag('meta[property="og:image"]', "property", "og:image", image);
		setMetaTag(
			'meta[property="og:image:alt"]',
			"property",
			"og:image:alt",
			fullTitle,
		);
		setMetaTag('meta[property="og:url"]', "property", "og:url", currentUrl);
		setMetaTag('meta[property="og:locale"]', "property", "og:locale", "ckb_IQ");

		// 4. Twitter Card Tags
		setMetaTag(
			'meta[name="twitter:card"]',
			"name",
			"twitter:card",
			"summary_large_image",
		);
		setMetaTag(
			'meta[name="twitter:title"]',
			"name",
			"twitter:title",
			fullTitle,
		);
		setMetaTag(
			'meta[name="twitter:description"]',
			"name",
			"twitter:description",
			description,
		);
		setMetaTag('meta[name="twitter:image"]', "name", "twitter:image", image);

		// 5. Structured Data (Schema.org JSON-LD)
		const existingScript = document.querySelector("#json-ld-schema");
		if (existingScript) {
			existingScript.remove();
		}

		if (schemaData) {
			const script = document.createElement("script");
			script.id = "json-ld-schema";
			script.type = "application/ld+json";
			script.text = JSON.stringify(schemaData);
			document.head.appendChild(script);
		}
	}, [fullTitle, description, image, type, currentUrl, schemaData, keywords]);

	return null;
}
