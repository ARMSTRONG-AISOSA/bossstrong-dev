"use client";

import { useEffect, useRef, type ReactNode } from "react";

// Scroll-triggered entrance (ui-design-system-specification.md §7.1/§7.4):
// fade + slight upward translate as a section enters the viewport.
//
// - Content is always rendered visible by the server. Only blocks that start
//   below the fold are hidden, after hydration, so nothing on screen at load
//   ever flashes or delays the Largest Contentful Paint.
// - Without JavaScript, or with prefers-reduced-motion, nothing is hidden
//   (§7.3 is a hard requirement).
// - Each block reveals once and then stops observing.
// - The styles live in app/globals.css under [data-reveal].
export function Reveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    el.dataset.reveal = "hidden";
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.dataset.reveal = "shown";
        observer.disconnect();
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
