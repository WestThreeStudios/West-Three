"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { BigStackedWordmark, StaticWordmark } from "./FlipWordmark";
import { GRADUATION_COMING_SOON } from "@/config/graduation";

// The category tiles on the homepage. `thumbPosition` is where each photo is
// anchored inside its 4:3 crop so faces stay in frame. Each image needs to be
// at least ~1920px wide so it stays sharp on large screens.
const works = [
  {
    id: 1,
    label: "Brand Photography",
    image: "/work/brand-photography/02.jpg",
    href: "/brand-photography",
    // Tight portrait — eyes/nose sit just above vertical center, so a
    // slight upward nudge keeps the whole face in frame in the 4:3 crop.
    thumbPosition: "center 30%",
  },
  {
    id: 2,
    label: "Models Portfolio Work",
    image: "/work/models-portfolio/01.jpg",
    href: "/models-portfolio-work",
    // Front-facing close-up from the white-tee session — his head fills
    // more of this tighter frame, so anchor a touch lower than a top crop
    // to fit the whole head plus a little headroom.
    thumbPosition: "center 20%",
  },
  {
    id: 3,
    label: "Fashion Photography",
    image: "/work/fashion-photography/01.jpg",
    href: "/fashion-photography",
    // Black-and-white profile shot — face/glasses sit about a quarter of
    // the way down, with empty backdrop above and hair trailing below.
    thumbPosition: "center 25%",
  },
  {
    id: 4,
    label: "Graduation",
    // While GRADUATION_COMING_SOON is on (src/config/graduation.ts) this tile
    // is a plain "Coming Soon" panel with no link and no photo. When it's
    // switched off the tile links to /graduation and shows this image, so
    // replace public/work/graduation/01.jpg with a real photo before then.
    image: "/work/graduation/01.jpg",
    href: "/graduation",
    thumbPosition: "center 30%",
    comingSoon: GRADUATION_COMING_SOON,
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
};

// "pending": intro is still playing — stay hidden, overlay is covering us.
// "instant": intro was skipped (already seen this session) — snap straight
//   to resting, no animation.
// "animate": intro just finished a real first-visit play — slide up and
//   zoom to fit as the overlay's white fades away.
export type HeroPhase = "pending" | "instant" | "animate";

// Starts lower and slightly zoomed in, then slides up and settles to size —
// echoes wakawaka.world's imagery sliding into place after their intro.
const galleryVariants = {
  hidden: { opacity: 0, y: 90, scale: 1.08 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

// The gallery blocks are keyed on `phase` (key passed directly in JSX —
// React ignores keys inside spreads), so when it resolves
// (pending → instant/animate) they remount rather than transition:
// "instant" then renders directly at rest (initial={false}) with no
// dependence on a runtime animation ever firing, and "animate" plays the
// mount animation from `hidden`. Transitioning the existing element on a
// prop flip proved fragile — a dropped animation tick left the gallery
// permanently stuck at opacity 0.
function galleryMotionProps(phase: HeroPhase, delay = 0) {
  return {
    variants: galleryVariants,
    initial: phase === "animate" ? ("hidden" as const) : false,
    animate:
      phase === "pending" ? ("hidden" as const) : ("visible" as const),
    transition:
      phase === "animate"
        ? { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const, delay }
        : { duration: 0 },
  };
}

// Second stage of the wakawaka-style reveal: the boxes slide up first as
// empty layout (placeholder background showing), then each image fades in
// and settles from a slight over-zoom to fit its box. Lives inside the
// phase-keyed gallery blocks, so it mounts with the phase already resolved:
// "animate" plays the reveal, anything else renders at rest immediately.
function imageRevealProps(phase: HeroPhase, delay = 0) {
  if (phase !== "animate") {
    return { initial: false as const, animate: { opacity: 1, scale: 1 } };
  }
  return {
    initial: { opacity: 0, scale: 1.18 },
    animate: { opacity: 1, scale: 1 },
    transition: {
      opacity: { duration: 0.5, delay, ease: "easeOut" as const },
      scale: { duration: 1.3, delay, ease: [0.16, 1, 0.3, 1] as const },
    },
  };
}

// Top of the page gets the giant edge-to-edge text wordmark (what the intro
// overlay settles onto); the bottom shows the West Three Studios logo tile —
// the only place that logo appears.
function Wordmark({ delay = 0, big = false }: { delay?: number; big?: boolean }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      variants={fadeUp}
      transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1], delay }}
    >
      {big ? <BigStackedWordmark /> : <StaticWordmark />}
    </motion.div>
  );
}

export default function Hero({ phase = "instant" }: { phase?: HeroPhase }) {
  const [cursor, setCursor] = useState({ x: 0, y: 0, visible: false });

  // Fixed display order — Brand, Fashion, Models, Graduation — as indices into
  // `works` (whose own array order differs). Nothing here ever reorders,
  // reflows, or hides on hover, so the tiles never shift under the cursor.
  const DISPLAY_ORDER = [0, 2, 1, 3];

  return (
    <section className="bg-white px-6 pt-28 pb-20 md:px-10 md:pt-36">
      <Wordmark big />

      <div
        className="relative mt-10 overflow-x-hidden md:mt-14"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setCursor({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            visible: true,
          });
        }}
        onMouseLeave={() => setCursor((c) => ({ ...c, visible: false }))}
      >
        <motion.div
          key={`tiles-${phase}`}
          {...galleryMotionProps(phase)}
          className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6"
        >
          {DISPLAY_ORDER.map((workIndex, slot) => {
            const work = works[workIndex];

            if (work.comingSoon) {
              // Not a link: nothing to click, no hover zoom, and the "View"
              // cursor pill hides while the pointer is over it.
              return (
                <div
                  key={work.id}
                  className="relative flex aspect-[4/3] cursor-default select-none items-center justify-center overflow-hidden bg-[#ece8e2] text-center"
                  onMouseEnter={() =>
                    setCursor((c) => ({ ...c, visible: false }))
                  }
                  onMouseMove={(e) => e.stopPropagation()}
                >
                  <motion.div
                    className="absolute inset-0 flex flex-col items-center justify-center"
                    {...imageRevealProps(phase, 0.55 + slot * 0.12)}
                  >
                    <span className="pointer-events-none absolute inset-3 border border-ink/40 md:inset-4" />
                    <p className="font-display text-[clamp(2.25rem,13vw,4rem)] font-black uppercase leading-[0.86] tracking-[-0.02em] text-ink md:text-[clamp(2.25rem,6vw,5.5rem)]">
                      Coming
                      <br />
                      Soon
                    </p>
                    <p className="mt-4 font-body text-[10px] uppercase tracking-[0.28em] text-ink md:mt-5 md:text-xs">
                      {work.label} Shoots
                    </p>
                  </motion.div>
                  <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1.5 font-body text-[10px] uppercase tracking-[0.1em] text-ink md:bottom-4 md:left-4 md:text-xs">
                    {work.label}
                  </span>
                </div>
              );
            }

            return (
              <Link
                key={work.id}
                href={work.href}
                className="group relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-ink/5 text-center"
              >
                <motion.div
                  className="absolute inset-0"
                  {...imageRevealProps(phase, 0.55 + slot * 0.12)}
                >
                  <Image
                    src={work.image}
                    alt={work.label}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    priority={slot < 2}
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    style={{ objectPosition: work.thumbPosition }}
                  />
                </motion.div>
                <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1.5 font-body text-[10px] uppercase tracking-[0.1em] text-ink md:bottom-4 md:left-4 md:text-xs">
                  {work.label}
                </span>
              </Link>
            );
          })}
        </motion.div>

        <motion.div
          className="pointer-events-none absolute z-10 hidden -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-ink px-4 py-2 md:flex"
          style={{ left: cursor.x, top: cursor.y }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: cursor.visible ? 1 : 0,
            scale: cursor.visible ? 1 : 0.8,
          }}
          transition={{ duration: 0.2 }}
        >
          <span className="font-body text-[10px] uppercase tracking-[0.14em] text-white">
            View
          </span>
        </motion.div>
      </div>

      <div className="mt-20 md:mt-28">
        <Wordmark />
      </div>
    </section>
  );
}
