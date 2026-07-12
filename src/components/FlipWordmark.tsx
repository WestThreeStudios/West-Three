"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Abril_Fatface,
  Bebas_Neue,
  Bodoni_Moda,
  Monoton,
  Permanent_Marker,
  Playfair_Display,
  Rubik_Mono_One,
} from "next/font/google";

const bodoni = Bodoni_Moda({ subsets: ["latin"], weight: "700" });
const bebas = Bebas_Neue({ subsets: ["latin"], weight: "400" });
const marker = Permanent_Marker({ subsets: ["latin"], weight: "400" });
const monoton = Monoton({ subsets: ["latin"], weight: "400" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: "800",
  style: "italic",
});
const rubikMono = Rubik_Mono_One({ subsets: ["latin"], weight: "400" });
const abril = Abril_Fatface({ subsets: ["latin"], weight: "400" });

type Frame =
  | { type: "text"; className: string; scale?: number; caps?: boolean }
  | { type: "logo"; src: string; width: number; height: number; scale?: number };

// Played once, in order, then the animation stops on FINAL_FRAME (the real logo).
const cycleFrames: Frame[] = [
  { type: "text", className: "font-display font-black", caps: true },
  { type: "logo", src: "/logos/flip-varsity.png", width: 1212, height: 374, scale: 1.1 },
  { type: "text", className: bodoni.className, caps: true, scale: 0.95 },
  { type: "text", className: bebas.className, caps: true },
  { type: "logo", src: "/logos/flip-script.png", width: 1126, height: 306, scale: 1.05 },
  { type: "text", className: marker.className, scale: 0.82 },
  { type: "text", className: rubikMono.className, caps: true, scale: 0.62 },
  { type: "text", className: playfair.className, scale: 0.95 },
  { type: "text", className: monoton.className, caps: true, scale: 0.72 },
  { type: "logo", src: "/logos/flip-serif.png", width: 1102, height: 134, scale: 0.65 },
  { type: "text", className: abril.className, scale: 0.95 },
];

const FINAL_FRAME: Frame = {
  type: "logo",
  src: "/logos/flip-bubble.png",
  width: 1590,
  height: 987,
  scale: 1.25,
};

const FRAME_MS = 220;
const STORAGE_KEY = "west-three-wordmark-played";

function FrameContent({ frame }: { frame: Frame }) {
  return frame.type === "text" ? (
    <span
      className={`${frame.className} block whitespace-nowrap tracking-[-0.02em]`}
      style={{ lineHeight: 1, fontSize: `${frame.scale ?? 1}em` }}
    >
      {frame.caps ? "WEST THREE" : "West Three"}
    </span>
  ) : (
    <span
      aria-hidden
      className="relative block h-full"
      style={{
        height: `${frame.scale ?? 1}em`,
        aspectRatio: `${frame.width} / ${frame.height}`,
      }}
    >
      <Image
        src={frame.src}
        alt=""
        fill
        sizes="90vw"
        className="object-contain object-left"
        priority
      />
    </span>
  );
}

export default function FlipWordmark() {
  const [index, setIndex] = useState(0);
  // Must start false on both server and client so the first paint matches
  // (avoids a hydration mismatch); resolved to the real value in the effect below.
  const [done, setDone] = useState(false);

  useEffect(() => {
    let alreadyPlayed = false;
    try {
      alreadyPlayed = sessionStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      // sessionStorage unavailable (private mode, etc.) — just play the intro.
    }
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduced || alreadyPlayed) {
      // Runs once after mount, post-hydration — not a render-loop risk.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDone(true);
      return;
    }

    let frame = 0;
    const id = setInterval(() => {
      frame += 1;
      if (frame >= cycleFrames.length) {
        clearInterval(id);
        setDone(true);
        try {
          sessionStorage.setItem(STORAGE_KEY, "1");
        } catch {
          // ignore
        }
        return;
      }
      setIndex(frame);
    }, FRAME_MS);

    return () => clearInterval(id);
  }, []);

  const frame = done ? FINAL_FRAME : cycleFrames[index];

  return (
    <h1
      aria-label="West Three"
      className="relative flex select-none items-center text-ink"
      style={{ fontSize: "clamp(3.5rem, 13vw, 11rem)", height: "1.1em" }}
    >
      <FrameContent frame={frame} />
    </h1>
  );
}

export function StaticWordmark() {
  return (
    <h1
      aria-label="West Three"
      className="relative flex select-none items-center text-ink"
      style={{ fontSize: "clamp(3.5rem, 13vw, 11rem)", height: "1.1em" }}
    >
      <FrameContent frame={FINAL_FRAME} />
    </h1>
  );
}
