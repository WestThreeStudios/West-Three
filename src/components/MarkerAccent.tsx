"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { motion } from "motion/react";

const REVEAL_DELAY = 0.05;
const REVEAL_DURATION = 1.3;
const STROKE_MAIN_DELAY = 1.35;
const STROKE_MAIN_DURATION = 1.0;
const STROKE_PASS2_DELAY = 1.55;
const STROKE_PASS2_DURATION = 0.9;

const HIDDEN_CLIP = "inset(-15% 100% -15% 0%)";
const VISIBLE_CLIP = "inset(-15% 0% -15% 0%)";

export type MarkerAccentHandle = {
  replay: () => void;
};

const MarkerAccent = forwardRef<MarkerAccentHandle, { text?: string }>(
  function MarkerAccent({ text = "Bold Work." }, ref) {
    const wrapperRef = useRef<HTMLSpanElement>(null);
    const [played, setPlayed] = useState(false);
    const [playCount, setPlayCount] = useState(0);

    useImperativeHandle(ref, () => ({
      replay: () => {
        setPlayed(false);
        setPlayCount((c) => c + 1);
      },
    }));

    useEffect(() => {
      const el = wrapperRef.current;
      if (!el || played) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setPlayed(true);
          }
        },
        { threshold: 0.6 },
      );
      observer.observe(el);
      return () => observer.disconnect();
    }, [played, playCount]);

    return (
      <span
        ref={wrapperRef}
        className="relative inline-block whitespace-nowrap"
        style={{ perspective: 500 }}
      >
        <motion.span
          key={`text-${playCount}`}
          className="relative inline-block"
          initial={{ clipPath: HIDDEN_CLIP }}
          animate={played ? { clipPath: VISIBLE_CLIP } : undefined}
          transition={{
            duration: REVEAL_DURATION,
            delay: REVEAL_DELAY,
            ease: [0.4, 0, 0.2, 1],
          }}
        >
          <span
            className="marker-ink whitespace-nowrap font-marker text-[clamp(3.2rem,8vw,5.6rem)] leading-none"
            style={{
              filter: "url(#marker-roughen) url(#marker-grain-alpha)",
              transform: "rotate(-3deg) rotateX(14deg)",
              transformStyle: "preserve-3d",
              display: "inline-block",
              padding: "0 4px",
            }}
          >
            {text}
          </span>
        </motion.span>

        <motion.svg
          key={`underline-${playCount}`}
          className="pointer-events-none absolute left-[-2%] h-[0.24em] w-[104%] overflow-visible"
          style={{ bottom: "0.08em" }}
          viewBox="0 0 200 20"
          preserveAspectRatio="none"
          aria-hidden
        >
          <motion.path
            d="M2,12 Q25,4 50,11 T100,10 T150,12 T198,9"
            fill="none"
            stroke="var(--marker)"
            strokeWidth="5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={played ? { pathLength: 1 } : undefined}
            transition={{
              duration: STROKE_MAIN_DURATION,
              delay: STROKE_MAIN_DELAY,
              ease: "easeInOut",
            }}
          />
          <motion.path
            d="M4,13 Q26,6 52,12 T101,11 T149,13 T196,10"
            fill="none"
            stroke="var(--marker)"
            strokeWidth="3"
            strokeLinecap="round"
            opacity={0.55}
            style={{ filter: "url(#marker-roughen) url(#marker-grain-alpha)" }}
            initial={{ pathLength: 0 }}
            animate={played ? { pathLength: 1 } : undefined}
            transition={{
              duration: STROKE_PASS2_DURATION,
              delay: STROKE_PASS2_DELAY,
              ease: "easeInOut",
            }}
          />
        </motion.svg>
      </span>
    );
  },
);

export default MarkerAccent;
