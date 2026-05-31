import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://jnv-alumni.netlify.app"

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/privacy", "/terms"],
        disallow: ["/api/", "/admin/", "/settings", "/profile/edit"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
