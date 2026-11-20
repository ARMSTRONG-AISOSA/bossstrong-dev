"use client";

import { useEffect, useRef } from "react";
import type { COBEOptions, Globe } from "cobe";

// Interactive background globe for the Home hero (approved 2026-11-20, see
// ui-design-system-specification.md §7.4). Built on `cobe` (~6KB gzipped,
// WebGL, no texture image), loaded with a dynamic import after hydration so
// it never blocks the hero text from painting.
//
// - Drag (mouse or touch) anywhere on the hero to spin it; vertical touch
//   scrolling still works (touch-action: pan-y on the hero section).
// - Slow auto-rotation, turned off under prefers-reduced-motion (§7.3). The
//   globe stays draggable then, since dragging is user-initiated.
// - Colours come from the live design tokens and follow the theme toggle.
// - The animation loop stops while the hero is scrolled out of view.
// - No WebGL: cobe returns a no-op, and the canvas just stays invisible.

type Rgb = [number, number, number];

const AUTO_SPIN = 0.003; // radians per frame
const DRAG_SPEED = 0.005; // radians per dragged pixel
const THETA = 0.25;
const MAX_TILT = 0.6;

function hexToRgb(hex: string): Rgb | null {
  const match = /^#([0-9a-f]{6})$/i.exec(hex.trim());
  if (!match) return null;
  const n = parseInt(match[1], 16);
  return [(n >> 16) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

function isDark() {
  return document.documentElement.classList.contains("dark");
}

// Kept low so the hero text stays the clear focus and keeps its contrast.
function canvasOpacity() {
  return isDark() ? "0.85" : "0.5";
}

function themeColors(): Partial<COBEOptions> {
  const root = document.documentElement;
  const dark = isDark();
  const accent: Rgb = hexToRgb(
    getComputedStyle(root).getPropertyValue("--color-accent"),
  ) ?? [0.07, 0.72, 0.53];
  return dark
    ? {
        dark: 1,
        diffuse: 1.2,
        mapBrightness: 5,
        baseColor: [0.3, 0.36, 0.34],
        markerColor: accent,
        glowColor: [accent[0] * 0.35, accent[1] * 0.35, accent[2] * 0.35],
      }
    : {
        dark: 0,
        diffuse: 1.2,
        mapBrightness: 4,
        baseColor: [0.93, 0.95, 0.94],
        markerColor: accent,
        glowColor: [0.85, 0.89, 0.87],
      };
}

export function HeroGlobe() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const section = container?.closest("section");
    if (!container || !canvas || !section) return;

    let globe: Globe | null = null;
    let frame = 0;
    let cancelled = false;
    let visible = true;
    let phi = 0;
    let theta = THETA;
    let dragging: { x: number; y: number } | null = null;
    let size = container.offsetWidth;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const tick = () => {
      if (!globe) return;
      if (!dragging && !reducedMotion.matches) phi += AUTO_SPIN;
      globe.update({ phi, theta });
      frame = requestAnimationFrame(tick);
    };
    const start = () => {
      if (!frame && visible && !cancelled) frame = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    const onPointerDown = (e: PointerEvent) => {
      // Leave links and buttons alone so clicks behave normally.
      if ((e.target as Element).closest("a, button")) return;
      // Stop a mouse drag from selecting hero text (touch keeps scrolling).
      if (e.pointerType === "mouse") e.preventDefault();
      dragging = { x: e.clientX, y: e.clientY };
      section.style.cursor = "grabbing";
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      phi += (e.clientX - dragging.x) * DRAG_SPEED;
      theta = Math.max(
        -MAX_TILT,
        Math.min(MAX_TILT, theta + (e.clientY - dragging.y) * DRAG_SPEED),
      );
      dragging = { x: e.clientX, y: e.clientY };
    };
    const onPointerUp = () => {
      dragging = null;
      section.style.cursor = "";
    };

    const onResize = () => {
      size = container.offsetWidth;
      globe?.update({ width: size, height: size });
    };
    const themeObserver = new MutationObserver(() => {
      if (!globe) return;
      globe.update(themeColors());
      container.style.opacity = canvasOpacity();
    });
    const viewObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });

    import("cobe").then(({ default: createGlobe }) => {
      if (cancelled) return;
      globe = createGlobe(canvas, {
        devicePixelRatio: dpr,
        width: size,
        height: size,
        phi,
        theta,
        mapSamples: 16000,
        mapBaseBrightness: 0,
        markers: [],
        scale: 1,
        ...themeColors(),
      } as COBEOptions);
      globe.update({ phi, theta });
      container.style.opacity = canvasOpacity();
      start();
    });

    section.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
    window.addEventListener("resize", onResize);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    viewObserver.observe(section);

    return () => {
      cancelled = true;
      stop();
      section.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      window.removeEventListener("resize", onResize);
      themeObserver.disconnect();
      viewObserver.disconnect();
      globe?.destroy();
    };
  }, []);

  // cobe v2 wraps the canvas in its own full-size div, so all positioning,
  // masking and opacity live on this outer container instead of the canvas.
  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-[42%] aspect-square w-[min(900px,150vw)] -translate-x-1/2 opacity-0 transition-opacity duration-700 ease-out [mask-image:linear-gradient(to_bottom,transparent_0%,black_30%)]"
    >
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
