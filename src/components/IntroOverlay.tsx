"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  cycleFrames,
  FINAL_FRAME,
  FRAME_MS,
  WordmarkGlyph,
  type Frame,
} from "./FlipWordmark";

const HOLD_MS = 400;
const SETTLE_MS = 550;
const REVEAL_MS = 550;
const ZOOM_IN_SCALE = 1.6;
const STORAGE_KEY = "west-three-intro-played";

// Safe bounds for the zoomed-in intro, as a fraction of the viewport —
// leaves comfortable margin on every side, on both mobile and desktop.
const MAX_WIDTH_RATIO = 0.86;
const MAX_HEIGHT_RATIO = 0.46;
// "WEST THREE" / "West Three" isn't a fixed shape (varies per font), so text
// frames use a conservative estimated width-to-height ratio rather than a
// real one — wide enough to be safe for the widest of the cycle's fonts.
const TEXT_ASPECT_ESTIMATE = 4.5;

// The four logo images vary wildly in shape (the widest is >8:1), so a flat
// zoom multiplier can't work for all of them — a very wide logo needs a
// smaller zoom than a squarer one to avoid overflowing horizontally. This
// computes, per frame, the largest zoom that still fits both dimensions.
function computeSafeZoom(frame: Frame, desiredZoom: number): number {
  if (typeof window === "undefined") return desiredZoom;

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const rootPx = 16;
  const baseFontSizePx = Math.min(
    Math.max(3.5 * rootPx, 0.13 * vw),
    11 * rootPx,
  );
  const heightAtRest = (frame.scale ?? 1) * baseFontSizePx;
  const aspect =
    frame.type === "logo" ? frame.width / frame.height : TEXT_ASPECT_ESTIMATE;
  const widthAtRest = heightAtRest * aspect;

  const maxWidth = vw * MAX_WIDTH_RATIO;
  const maxHeight = vh * MAX_HEIGHT_RATIO;

  const zoomLimitByWidth = maxWidth / widthAtRest;
  const zoomLimitByHeight = maxHeight / heightAtRest;

  return Math.min(desiredZoom, zoomLimitByWidth, zoomLimitByHeight);
}

// cycling: playing through fonts/logos, zoomed in.
// holding: landed on the real logo, still zoomed in, brief pause.
// settling: scales down to actual size — still fully opaque, so nothing
//   underneath is visible yet. This has to finish *before* any fade starts,
//   otherwise the shrinking overlay copy and the static one underneath are
//   different sizes at the same time and it reads as the image swapping.
// revealing: now that the overlay copy is pixel-identical to the real one
//   beneath it, only the white background fades — invisible handoff.
type Phase = "cycling" | "holding" | "settling" | "revealing";

export default function IntroOverlay() {
  // Both start in the "playing" state on server and first client render —
  // resolved to skip (if already seen this session) only after mount below.
  const [visible, setVisible] = useState(true);
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("cycling");
  // Safe default matches server/first-client render exactly (no window
  // access yet) — corrected to the real per-frame value in the effect below.
  const [zoomScale, setZoomScale] = useState(ZOOM_IN_SCALE);

  useEffect(() => {
    if (!visible) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [visible]);

  useEffect(() => {
    const currentFrame = phase === "cycling" ? cycleFrames[index] : FINAL_FRAME;
    const recompute = () => setZoomScale(computeSafeZoom(currentFrame, ZOOM_IN_SCALE));
    recompute();
    window.addEventListener("resize", recompute);
    return () => window.removeEventListener("resize", recompute);
  }, [index, phase]);

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
      // Runs once after mount, post-hydration — server and client both start
      // "visible", so this never disagrees with the server-rendered HTML.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(false);
      return;
    }

    let frame = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const cycleId = setInterval(() => {
      frame += 1;
      if (frame >= cycleFrames.length) {
        clearInterval(cycleId);
        setPhase("holding");
        timers.push(
          setTimeout(() => {
            setPhase("settling");
            timers.push(
              setTimeout(() => {
                setPhase("revealing");
                timers.push(
                  setTimeout(() => {
                    setVisible(false);
                    try {
                      sessionStorage.setItem(STORAGE_KEY, "1");
                    } catch {
                      // ignore
                    }
                  }, REVEAL_MS),
                );
              }, SETTLE_MS),
            );
          }, HOLD_MS),
        );
        return;
      }
      setIndex(frame);
    }, FRAME_MS);

    return () => {
      clearInterval(cycleId);
      timers.forEach(clearTimeout);
    };
  }, []);

  if (!visible) return null;

  const frame = phase === "cycling" ? cycleFrames[index] : FINAL_FRAME;
  const settledScale = phase === "settling" || phase === "revealing";
  const revealing = phase === "revealing";

  return (
    <motion.div
      className="fixed inset-0 z-[100] overflow-hidden bg-white"
      animate={{ opacity: revealing ? 0 : 1 }}
      transition={{ duration: REVEAL_MS / 1000, ease: [0.4, 0, 0.2, 1] }}
      style={{ pointerEvents: revealing ? "none" : "auto" }}
    >
      <div className="px-6 pt-28 md:px-10 md:pt-36">
        <motion.div
          style={{ transformOrigin: "top left" }}
          animate={{ scale: settledScale ? 1 : zoomScale }}
          transition={{
            duration: settledScale ? SETTLE_MS / 1000 : 0,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <WordmarkGlyph frame={frame} />
        </motion.div>
      </div>
    </motion.div>
  );
}
