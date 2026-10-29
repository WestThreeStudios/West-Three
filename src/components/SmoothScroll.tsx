"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

// Lenis smooth scroll (the eased, floaty wheel feel on burocratik.com).
// Mounted per page rather than in the root layout, so only pages that ask
// for it get it — it starts on mount and fully tears down on unmount, so
// navigating away leaves the rest of the site on native scrolling.
// Skipped entirely for people who prefer reduced motion.
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ autoRaf: true });
    return () => lenis.destroy();
  }, []);

  return null;
}
