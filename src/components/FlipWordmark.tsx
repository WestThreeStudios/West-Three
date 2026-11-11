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

export type Frame =
  | {
      type: "text";
      className: string;
      scale?: number;
      caps?: boolean;
      // Real measured width-to-height ratio of the rendered text at scale 1
      // (see src/app/debug-frames, used to derive this) — text width can't
      // be derived from a formula the way a logo's can, since it depends on
      // the specific font's actual glyph metrics, and guessing a single
      // conservative estimate for every font undershot several of these by
      // a wide margin (one measured 8.3:1 — wider than any of the logos).
      aspect: number;
    }
  | { type: "logo"; src: string; width: number; height: number; scale?: number };

// Played once, in order, by IntroOverlay — then it lands on FINAL_TEXT_FRAME
// (the giant edge-to-edge text wordmark).
// Each text frame's `aspect` is the real measured value for that exact
// className + scale combination (see src/app/debug-frames) — recompute it
// there if the frame's font, weight, scale, or copy ever changes.
export const cycleFrames: Frame[] = [
  { type: "text", className: "font-display font-black", caps: true, aspect: 6.93 },
  { type: "logo", src: "/logos/flip-varsity.png", width: 1212, height: 374, scale: 1.1 },
  { type: "text", className: bodoni.className, caps: true, scale: 0.95, aspect: 6.66 },
  { type: "text", className: bebas.className, caps: true, aspect: 3.53 },
  { type: "logo", src: "/logos/flip-script.png", width: 1126, height: 306, scale: 1.05 },
  { type: "text", className: marker.className, scale: 0.82, aspect: 5.4 },
  { type: "text", className: rubikMono.className, caps: true, scale: 0.62, aspect: 8.3 },
  { type: "text", className: playfair.className, scale: 0.95, aspect: 4.97 },
  { type: "text", className: monoton.className, caps: true, scale: 0.72, aspect: 6.8 },
  { type: "logo", src: "/logos/flip-serif.png", width: 1102, height: 134, scale: 0.65 },
  { type: "text", className: abril.className, scale: 0.95, aspect: 5.06 },
];

// The "West Three Studios" logo — a cream brush-stroke W with two eyes on a
// cobalt tile. Lives at the bottom of the landing page (via StaticWordmark).
// It replaced the black bubble logo (public/logos/flip-bubble.png, still in
// the repo if it's ever wanted back: 1590×987, scale 1.25).
export const FINAL_FRAME: Frame = {
  type: "logo",
  src: "/logos/west-three-studios.png",
  width: 1200,
  height: 1200,
  scale: 1.75,
};

export const FRAME_MS = 220;

// One flip frame: a single-line "WEST THREE" in that frame's font, or one of
// the logo images. Its height is `frame.scale` em and its width that height
// × the frame's aspect, so the parent's font-size alone sets its size.
export function FrameContent({ frame }: { frame: Frame }) {
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

// The h1 shell for a single logo/wordmark frame. Its font-size sets the
// frame's size (see FrameContent); its height wraps the frame, so spacing
// above and below is whatever the page gives it.
export function WordmarkGlyph({ frame }: { frame: Frame }) {
  return (
    <h1
      aria-label="West Three Studios"
      className="relative flex select-none items-center text-ink"
      style={{ fontSize: "clamp(5.5rem, 13vw, 11rem)" }}
    >
      <FrameContent frame={frame} />
    </h1>
  );
}

export function StaticWordmark() {
  return <WordmarkGlyph frame={FINAL_FRAME} />;
}

// The Waka-scale resting wordmark: "WEST" over "THREE", each line's font
// size derived from the content width over its measured aspect so both
// lines span edge to edge — per-word full-bleed, like wakawaka.world's
// stacked giant "Waka" headings. 3.086 and 3.677 are the measured
// width÷font-size ratios of "WEST" and "THREE" in the display font at
// -0.02em tracking (remeasure if the font, weight, tracking or copy change).
// The intro overlay renders this exact component for its settle, so it
// lands pixel-perfectly on the Hero's copy.
export function BigStackedWordmark() {
  return (
    <h1
      aria-label="West Three"
      className="font-display select-none text-ink font-black"
    >
      <span className="block leading-[0.84] whitespace-nowrap tracking-[-0.02em] text-[calc((100vw-3rem)/3.086)] md:text-[calc((100vw-5rem)/3.086)]">
        WEST
      </span>
      <span className="block leading-[0.84] whitespace-nowrap tracking-[-0.02em] text-[calc((100vw-3rem)/3.677)] md:text-[calc((100vw-5rem)/3.677)]">
        THREE
      </span>
    </h1>
  );
}
