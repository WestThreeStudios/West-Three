"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";

// burocratik-style image frame: the frame itself holds still while the photo
// inside it drifts vertically as you scroll past. The photo is rendered 18%
// taller than the frame (extra 9% above and below), so it can slide ±9% of
// the frame's height without ever exposing an edge. Because the photo is
// bigger than the frame, `aspect` is the FRAME's ratio — portrait photos in
// a wide frame get cropped, so match the ratio to the photo when you can.
const OVERSCAN = 0.18;
// ±9% of the frame, expressed as a % of the (118%-tall) image it moves.
const TRAVEL = `${((OVERSCAN / 2 / (1 + OVERSCAN)) * 100).toFixed(2)}%`;

export default function ParallaxFrame({
  src,
  alt,
  aspect,
  sizes,
  priority = false,
  className = "",
  objectPosition = "center",
}: {
  src: string;
  alt: string;
  // "w/h", the frame's ratio. Omit it to size the frame with className
  // instead (e.g. `aspect-[4/5] md:aspect-[16/9]` for a responsive ratio).
  aspect?: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  objectPosition?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // 0 when the frame's top enters the bottom of the viewport, 1 when its
  // bottom leaves the top — the whole time it's on screen.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [`-${TRAVEL}`, TRAVEL]);

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden bg-ink/5 ${className}`}
      style={aspect ? { aspectRatio: aspect } : undefined}
    >
      <motion.div
        className="absolute inset-x-0"
        style={{
          top: `-${(OVERSCAN / 2) * 100}%`,
          height: `${(1 + OVERSCAN) * 100}%`,
          y: reduce ? 0 : y,
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
          style={{ objectPosition }}
        />
      </motion.div>
    </div>
  );
}
