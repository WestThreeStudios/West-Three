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

// Played once, in order, by IntroOverlay — then it lands on FINAL_FRAME (the real logo).
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

export const FINAL_FRAME: Frame = {
  type: "logo",
  src: "/logos/flip-bubble.png",
  width: 1590,
  height: 987,
  scale: 1.25,
};

export const FRAME_MS = 220;

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

// Shared h1 shell so the overlay's intro frames and the Hero's resting
// wordmark are pixel-identical in size — required for the overlay's
// zoom-down to land exactly on top of the real one underneath.
export function WordmarkGlyph({ frame }: { frame: Frame }) {
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
  return <WordmarkGlyph frame={FINAL_FRAME} />;
}
