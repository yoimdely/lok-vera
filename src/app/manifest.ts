import type { MetadataRoute } from "next";
import { SITE } from "./lib/site";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.name,
    short_name: "ЛОК VERA",
    description:
      "Апартаменты в ЛОК VERA в Сочи, Уч-Дере. Инвестиционный формат и курортная инфраструктура.",
    start_url: "/",
    display: "standalone",
    background_color: "#090b10",
    theme_color: "#090b10",
    lang: "ru-RU",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
