import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://trad3wise.vercel.app";
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/account/",
        "/billing/",
        "/settings/",
        "/alerts/",
        "/developer/",
        "/watchlist/",
        "/reports/",
        "/portfolio/",
        "/referrals/",
        "/ai/",
        "/api/",
      ],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
