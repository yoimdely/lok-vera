import type { MetadataRoute } from "next";
import { SITE } from "./lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE.url,
      lastModified: "2026-02-16T00:00:00.000Z",
      changeFrequency: "weekly",
      priority: 1,
      alternates: {
        languages: {
          "ru-RU": SITE.url,
        },
      },
      images: [
        `${SITE.url}/images/facade-day.jpg`,
        `${SITE.url}/images/night-facade.jpg`,
        `${SITE.url}/images/resort-pool.jpg`,
      ],
    },
  ];
}
