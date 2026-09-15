import type { MetadataRoute } from "next";
import { DEFAULT_TITLE, DEVELOPER_NAME } from "@/lib/site-config";

// seo-specification.md §4/§12.8. theme/background colors match the light
// palette's --color-accent / --color-background (app/globals.css).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: DEFAULT_TITLE,
    short_name: DEVELOPER_NAME,
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
    theme_color: "#12b886",
    background_color: "#fafafa",
    display: "standalone",
  };
}
