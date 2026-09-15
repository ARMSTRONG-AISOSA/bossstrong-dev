import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {
  DEFAULT_DESCRIPTION,
  DEVELOPER_NAME,
  SITE_URL,
} from "@/lib/site-config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// Root fallback only — every real route sets its own title/description via
// buildMetadata (lib/seo.ts, seo-specification.md §2). Search-engine
// verification tags (§11) stay unset until the owner creates the Search
// Console / Bing Webmaster properties and supplies the real codes.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: DEVELOPER_NAME, template: `%s | ${DEVELOPER_NAME}` },
  description: DEFAULT_DESCRIPTION,
  verification: {
    ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
      ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
      : {}),
    ...(process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? {
          other: {
            "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION,
          },
        }
      : {}),
  },
};

// Runs before first paint to set the initial color theme with no flash.
// An explicit choice in localStorage wins; otherwise follow the system
// preference, and keep following it live until the visitor chooses. (design spec §2.3)
const themeInitScript = `(function(){try{var s=localStorage.getItem('theme');var m=window.matchMedia('(prefers-color-scheme: dark)');document.documentElement.classList.toggle('dark',s?s==='dark':m.matches);if(!s){m.addEventListener('change',function(e){if(!localStorage.getItem('theme'))document.documentElement.classList.toggle('dark',e.matches);});}}catch(e){}})();`;

// iOS Safari only applies :active styles to non-form/anchor elements (e.g. a
// hover-card <div>) when a touchstart listener exists somewhere in the
// document — this is that listener, a documented no-op workaround, not
// application logic.
const activateTouchScript = `document.addEventListener('touchstart',function(){},{passive:true});`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script dangerouslySetInnerHTML={{ __html: activateTouchScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
