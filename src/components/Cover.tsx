"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

type CoverPage = {
  edition: string;
  headlineLine1: string;
  headlineLine2: string;
  tagline: string;
  label: string;
};

const pages: CoverPage[] = [
  {
    edition: "001",
    headlineLine1: "Davis",
    headlineLine2: "III.",
    tagline:
      "Story-driven photography for brands that want to be remembered, not just seen.",
    label: "Commercial & Branding",
  },
  {
    edition: "002",
    headlineLine1: "Bold",
    headlineLine2: "Vision.",
    tagline:
      "Photography that actually feels like you — not a stiff, posed version of you.",
    label: "Portrait & Lifestyle",
  },
  {
    edition: "003",
    headlineLine1: "Seen",
    headlineLine2: "Clearly.",
    tagline: "Images built to make people stop scrolling and actually look.",
    label: "Brand & Product",
  },
];

const FLIP_INTERVAL = 3000;
const FLIP_DURATION = 1.05;
const FLIP_EASE = [0.61, 0.06, 0.4, 0.99] as const;

function CoverFace({ page }: { page: CoverPage }) {
  return (
    <div className="absolute inset-0 flex h-full w-full flex-col bg-white px-7 py-10 md:px-16 md:py-14">
      <div className="flex items-start justify-between gap-4">
        <span className="max-w-[45%] font-body text-[11px] uppercase tracking-[0.12em] text-ink/60">
          Shot by J. Davis III
        </span>
        <span className="max-w-[45%] text-right font-body text-[11px] uppercase tracking-[0.12em] text-ink/60">
          {page.label}
        </span>
      </div>

      <h1 className="mt-[9vh] font-display font-black uppercase leading-[0.9] text-ink text-[clamp(3.5rem,10vw,8.5rem)]">
        {page.headlineLine1}
        <br />
        {page.headlineLine2}
      </h1>

      <div className="flex-1" />

      <div className="flex items-end justify-between gap-4">
        <span className="max-w-[32ch] font-body text-xs uppercase tracking-[0.1em] text-ink/60">
          {page.tagline}
        </span>
        <span className="shrink-0 font-display text-[clamp(2.5rem,6vw,4.5rem)] font-black leading-none text-ink">
          {page.edition}
        </span>
      </div>
    </div>
  );
}

export default function Cover() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [flippingFrom, setFlippingFrom] = useState<number | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.6 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || pages.length < 2 || flippingFrom !== null) return;
    const timer = setTimeout(() => {
      setFlippingFrom(index);
      setIndex((current) => (current + 1) % pages.length);
    }, FLIP_INTERVAL);
    return () => clearTimeout(timer);
  }, [inView, index, flippingFrom]);

  return (
    <section
      ref={sectionRef}
      className="scroll-section relative h-screen w-full overflow-hidden bg-white"
    >
      <div
        className="absolute inset-4"
        style={{ perspective: 900, perspectiveOrigin: "20% 50%" }}
      >
        <div
          className="relative h-full w-full"
          style={{ transformStyle: "preserve-3d" }}
        >
          <CoverFace page={pages[index]} />

          <AnimatePresence>
            {flippingFrom !== null && (
              <motion.div
                key="flipping-page"
                className="absolute inset-0"
                style={{
                  transformOrigin: "0% 50%",
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "hidden",
                }}
                initial={{ rotateY: 0 }}
                animate={{ rotateY: -150 }}
                transition={{ duration: FLIP_DURATION, ease: FLIP_EASE }}
                onAnimationComplete={() => setFlippingFrom(null)}
              >
                <CoverFace page={pages[flippingFrom]} />
                <motion.div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(0,0,0,0.55), transparent 65%)",
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.5, 0.55] }}
                  transition={{ duration: FLIP_DURATION, times: [0, 0.55, 1] }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-4 border border-line" />
    </section>
  );
}
