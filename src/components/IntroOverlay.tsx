"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { cycleFrames, FINAL_FRAME, FRAME_MS, WordmarkGlyph } from "./FlipWordmark";

const HOLD_MS = 400;
const ZOOM_MS = 700;
const ZOOM_IN_SCALE = 1.6;
const STORAGE_KEY = "west-three-intro-played";

type Phase = "cycling" | "holding" | "zooming";

export default function IntroOverlay() {
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
            setPhase("zooming");
            timers.push(
              setTimeout(() => {
                setVisible(false);
                try {
                  sessionStorage.setItem(STORAGE_KEY, "1");
                } catch {
                  // ignore
                }
              }, ZOOM_MS),
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
  const zoomedOut = phase === "zooming";

  return (
    <motion.div
      className="fixed inset-0 z-[100] overflow-hidden bg-white"
      animate={{ opacity: zoomedOut ? 0 : 1 }}
      transition={{ duration: ZOOM_MS / 1000, ease: [0.6, 0, 0.2, 1] }}
      style={{ pointerEvents: zoomedOut ? "none" : "auto" }}
    >
      <div className="px-6 pt-28 md:px-10 md:pt-36">
        <motion.div
          style={{ transformOrigin: "top left" }}
          animate={{ scale: zoomedOut ? 1 : ZOOM_IN_SCALE }}
          transition={{ duration: ZOOM_MS / 1000, ease: [0.6, 0, 0.2, 1] }}
        >
          <WordmarkGlyph frame={frame} />
        </motion.div>
      </div>
    </motion.div>
  );
}
