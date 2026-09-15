import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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

// Placeholder site metadata. Real per-route metadata is Phase 6 (seo-specification.md).
export const metadata: Metadata = {
  title: "bossstrong-dev",
  description: "Full-stack developer portfolio.",
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
