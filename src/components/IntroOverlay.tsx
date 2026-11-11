"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { animate, motion } from "motion/react";
import {
  BigStackedWordmark,
  cycleFrames,
  FRAME_MS,
  FrameContent,
  type Frame,
} from "./FlipWordmark";

const SETTLE_MS = 750;
const HOLD_MS = 400;
const REVEAL_MS = 550;
const STORAGE_KEY = "west-three-intro-played";
const EASE_OUT = [0.16, 1, 0.3, 1] as const;

// Each flip frame is sized in pure CSS — as large as fits within 86% of the
// screen width and a target height — and centered with flexbox. Because it's
// CSS, the server-rendered HTML is already the right size and dead-centre,
// so there's no jump when the page's JavaScript loads, and every frame
// shares the same centre no matter how wide its font or logo is.
// (A frame's width is scale × aspect × font-size; its height scale × font-size.)
function frameFontSize(frame: Frame): string {
  const scale = frame.scale ?? 1;
  const aspect = frame.type === "logo" ? frame.width / frame.height : frame.aspect;
  return `min(calc(86vw / ${(scale * aspect).toFixed(3)}), calc(min(30vh, 15vw) / ${scale}))`;
}

// cycling: flipping through fonts/logos, centered on screen.
// settling: the stacked lockup appears exactly where (and as big as) the last
//   frame was, then glides and grows into its resting spot — the same spot
//   the real wordmark occupies on the page underneath.
// holding: brief pause at rest on white.
// revealing: only the white fades; the overlay's lockup sits pixel-for-pixel
//   on top of the page's own, so the handoff is invisible.
type Phase = "cycling" | "settling" | "holding" | "revealing";

type IntroOverlayProps = {
  // Fires once, telling the page whether the intro actually played (fresh
  // visit) or was skipped (already seen this session / reduced motion), so
  // its own reveal can either animate or snap straight to rest.
  onComplete?: (played: boolean) => void;
};

export default function IntroOverlay({ onComplete }: IntroOverlayProps) {
  // Both start in the "playing" state on the server and first client render —
  // resolved to skip (if already seen this session) only after mount below.
  const [visible, setVisible] = useState(true);
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("cycling");

  const frameRef = useRef<HTMLDivElement>(null);
  const lockupRef = useRef<HTMLDivElement>(null);
  // Where the most recent flip frame sat on screen — the lockup starts here.
  const lastFrameBox = useRef<DOMRect | null>(null);

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
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced || alreadyPlayed) {
      // Runs once after mount, post-hydration — server and client both start
      // "visible", so this never disagrees with the server-rendered HTML.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(false);
      onComplete?.(false);
      return;
    }

    // The lockup has to land exactly on the page's own wordmark, which sits
    // at the very top — so start from the top even if the browser restored
    // an old scroll position on reload.
    window.scrollTo(0, 0);

    let frame = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const cycleId = setInterval(() => {
      frame += 1;
      if (frame < cycleFrames.length) {
        setIndex(frame);
        return;
      }
      clearInterval(cycleId);
      // The swap to the lockup lands on the beat the next flip would have.
      setPhase("settling");
      timers.push(
        setTimeout(() => {
          setPhase("holding");
          timers.push(
            setTimeout(() => {
              setPhase("revealing");
              // Cue the page's own reveal as the white starts fading.
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
    }, FRAME_MS);

    return () => {
      clearInterval(cycleId);
      timers.forEach(clearTimeout);
    };
    // Intentionally run once on mount only — onComplete is a fresh inline
    // function on every parent render, and depending on it would restart
    // the cycle each time the parent re-renders after we call it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Remember each frame's on-screen box as it's shown.
  useLayoutEffect(() => {
    if (phase === "cycling" && frameRef.current) {
      lastFrameBox.current = frameRef.current.getBoundingClientRect();
    }
  }, [index, phase]);

  // The handoff (FLIP): measure the lockup at its resting spot, jump it —
  // before the browser paints — to where and how big the last frame was,
  // then animate it home.
  useLayoutEffect(() => {
    if (phase !== "settling") return;
    const lockup = lockupRef.current;
    if (!lockup) return;

    const rest = lockup.getBoundingClientRect();
    const firstLine = lockup.querySelector("span")?.getBoundingClientRect();
    const from = lastFrameBox.current;

    // Start with the lockup's "WEST" line as tall as the last frame was, and
    // its centre on the last frame's centre (the middle of the screen).
    const lineHeight = firstLine?.height || rest.height;
    const startScale = from && lineHeight ? Math.min(1, from.height / lineHeight) : 0.4;
    const startX = (from ? from.left + from.width / 2 : window.innerWidth / 2) - (rest.left + rest.width / 2);
    const startY = (from ? from.top + from.height / 2 : window.innerHeight / 2) - (rest.top + rest.height / 2);

    lockup.style.transformOrigin = "50% 50%";
    lockup.style.transform = `translate(${startX}px, ${startY}px) scale(${startScale})`;

    const controls = animate(
      lockup,
      { x: [startX, 0], y: [startY, 0], scale: [startScale, 1] },
      { duration: SETTLE_MS / 1000, ease: EASE_OUT },
    );
    return () => controls.stop();
  }, [phase]);

  if (!visible) return null;

  const cycling = phase === "cycling";
  const revealing = phase === "revealing";
  const current = cycleFrames[index];

  return (
    <motion.div
      // Decorative — the real, readable wordmark is on the page underneath.
      aria-hidden="true"
      className="fixed inset-0 z-[100] overflow-hidden bg-white"
      animate={{ opacity: revealing ? 0 : 1 }}
      transition={{ duration: REVEAL_MS / 1000, ease: [0.4, 0, 0.2, 1] }}
      style={{ pointerEvents: revealing ? "none" : "auto" }}
    >
      {cycling ? (
        <div className="flex h-full w-full items-center justify-center">
          <div
            ref={frameRef}
            className="flex select-none items-center text-ink"
            style={{ fontSize: frameFontSize(current) }}
          >
            <FrameContent frame={current} />
          </div>
        </div>
      ) : (
        // Same padding as the homepage's top section, so at rest this lockup
        // sits exactly over the page's own wordmark.
        <div className="px-6 pt-28 md:px-10 md:pt-36">
          <div ref={lockupRef}>
            <BigStackedWordmark />
          </div>
        </div>
      )}
    </motion.div>
  );
}
