"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  cycleFrames,
  FRAME_MS,
  BigWordmarkGlyph,
  BigStackedWordmark,
  STACKED_HANDOFF_SCALE,
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
// Fallback only, in case a future frame is added without its own measured
// `aspect` — deliberately generous (wider than every current frame,
// including the 8.3:1 Rubik Mono one) so it fails safe rather than overflows.
const TEXT_ASPECT_FALLBACK = 9;

// The four logo images vary wildly in shape (the widest is >8:1), and it
// turns out several of the text frames are just as extreme once actually
// measured (Rubik Mono comes in at 8.3:1 — wider than any of the logos) —
// so a flat zoom multiplier can't work for all of them on every screen size.
// This computes, per frame, the largest zoom that still fits both
// dimensions, computed fresh on every render (no separate effect/listener,
// so there's nothing to get out of sync or left dangling).
function computeSafeZoom(frame: Frame, desiredZoom: number): number {
  if (typeof window === "undefined") return desiredZoom;

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  // Mirrors BigWordmarkGlyph's CSS exactly: (100vw − section padding) ÷ the
  // final wordmark's 6.93 aspect, with padding 3rem below the md breakpoint
  // and 5rem at/above it. Must stay in sync with that className.
  const sectionPaddingPx = vw >= 768 ? 80 : 48;
  const baseFontSizePx = (vw - sectionPaddingPx) / 6.93;
  const heightAtRest = (frame.scale ?? 1) * baseFontSizePx;
  const aspect =
    frame.type === "logo"
      ? frame.width / frame.height
      : (frame.aspect ?? TEXT_ASPECT_FALLBACK);
  const widthAtRest = heightAtRest * aspect;

  if (widthAtRest <= 0 || heightAtRest <= 0) return 1;

  const maxWidth = vw * MAX_WIDTH_RATIO;
  const maxHeight = vh * MAX_HEIGHT_RATIO;

  const zoomLimitByWidth = maxWidth / widthAtRest;
  const zoomLimitByHeight = maxHeight / heightAtRest;

  const safeZoom = Math.min(desiredZoom, zoomLimitByWidth, zoomLimitByHeight);
  return Number.isFinite(safeZoom) && safeZoom > 0 ? safeZoom : 1;
}

// cycling: playing through fonts/logos, zoomed in.
// settling: the stacked lockup mounts at STACKED_HANDOFF_SCALE — where its
//   "WEST" line is exactly as tall as the cycle frames were, so the swap
//   reads as just another flip beat — then grows into the resting layout.
// holding: at full size, brief pause on white before the fade.
// revealing: the overlay copy is now pixel-identical to the real wordmark
//   beneath it, so only the white background fades — invisible handoff. The
//   grow has to fully finish *before* any fade starts, otherwise two
//   different-sized copies overlap mid-fade and it reads as a swap.
type Phase = "cycling" | "settling" | "holding" | "revealing";

type IntroOverlayProps = {
  // Fires once, telling the page whether the full cycle actually played
  // (fresh visit) or was skipped (already seen this session / reduced
  // motion) — the caller uses this to decide whether its own reveal
  // animations should run or just snap straight to their resting state.
  onComplete?: (played: boolean) => void;
};

export default function IntroOverlay({ onComplete }: IntroOverlayProps) {
  // Both start in the "playing" state on server and first client render —
  // resolved to skip (if already seen this session) only after mount below.
  const [visible, setVisible] = useState(true);
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("cycling");

  useEffect(() => {
    if (!visible) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [visible]);

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
      onComplete?.(false);
      return;
    }

    let frame = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const cycleId = setInterval(() => {
      frame += 1;
      if (frame >= cycleFrames.length) {
        clearInterval(cycleId);
        // Grow first (settling), then pause at full size (holding), then
        // fade — the swap to the lockup lands on the same beat the next
        // flip would have.
        setPhase("settling");
        timers.push(
          setTimeout(() => {
            setPhase("holding");
            timers.push(
              setTimeout(() => {
                setPhase("revealing");
                // The white background starts fading right here — cue the
                // page's own reveal (images sliding up + zooming to fit) so
                // it plays as the overlay disappears, not after.
                onComplete?.(true);
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
              }, HOLD_MS),
            );
          }, SETTLE_MS),
        );
        return;
      }
      setIndex(frame);
    }, FRAME_MS);

    return () => {
      clearInterval(cycleId);
      timers.forEach(clearTimeout);
    };
    // Intentionally run once on mount only — onComplete comes from the
    // parent as a fresh inline function on every render (it calls setState),
    // so depending on it would re-run this whole effect (restarting the
    // cycle) every time the parent re-renders after we call it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!visible) return null;

  const cycling = phase === "cycling";
  const revealing = phase === "revealing";

  return (
    <motion.div
      className="fixed inset-0 z-[100] overflow-hidden bg-white"
      animate={{ opacity: revealing ? 0 : 1 }}
      transition={{ duration: REVEAL_MS / 1000, ease: [0.4, 0, 0.2, 1] }}
      style={{ pointerEvents: revealing ? "none" : "auto" }}
    >
      <div className="px-6 pt-28 md:px-10 md:pt-36">
        {cycling ? (
          // Safe zoom computed fresh every render (no effect/listener) —
          // always correct for the current frame and current viewport.
          <motion.div
            key="cycle"
            style={{ transformOrigin: "top left" }}
            animate={{
              scale: computeSafeZoom(cycleFrames[index], ZOOM_IN_SCALE),
            }}
            transition={{ duration: 0 }}
          >
            <BigWordmarkGlyph frame={cycleFrames[index]} />
          </motion.div>
        ) : (
          // Keyed separately so it mounts fresh at the handoff scale (where
          // its "WEST" line matches the cycle frames' height) and grows once
          // to full size — a continuous swell out of the flip, no size jump.
          <motion.div
            key="final"
            style={{ transformOrigin: "top left" }}
            initial={{ scale: STACKED_HANDOFF_SCALE }}
            animate={{ scale: 1 }}
            transition={{ duration: SETTLE_MS / 1000, ease: [0.16, 1, 0.3, 1] }}
          >
            <BigStackedWordmark />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
