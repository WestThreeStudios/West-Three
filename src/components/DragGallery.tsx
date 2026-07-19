"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";

// Interactive drag-to-scroll gallery, after burocratik.com/studios' team
// strip: a full-bleed horizontal row of photos you grab (hand cursor) and
// throw left/right, with a subtle velocity lean while it moves. Starts
// centered so there's somewhere to go in both directions.
export default function DragGallery({
  images,
  alt,
  // Per-category aspect ratio of the photos ("w/h") — each card gets this
  // exact ratio so object-cover never actually crops anything.
  aspect = "2/3",
}: {
  images: string[];
  alt: string;
  aspect?: string;
}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  // How much wider the strip is than the viewport — drag range is [-overflow, 0].
  const [overflow, setOverflow] = useState(0);
  const [dragging, setDragging] = useState(false);
  const x = useMotionValue(0);

  // The burocratik-style juice: the strip leans into a fast flick and
  // settles upright as it slows.
  const velocity = useVelocity(x);
  const lean = useSpring(useTransform(velocity, [-1500, 0, 1500], [3, 0, -3]), {
    stiffness: 300,
    damping: 40,
  });

  useLayoutEffect(() => {
    const measure = () => {
      const vp = viewportRef.current;
      const strip = stripRef.current;
      if (!vp || !strip) return;
      const next = Math.max(0, strip.scrollWidth - vp.clientWidth);
      // Runs before paint, so the centered start never flashes. Re-runs on
      // resize (recentering then is fine — the layout just changed anyway).
      setOverflow(next);
      x.set(-next / 2);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [x, images.length]);

  const middle = (images.length - 1) / 2;

  return (
    // Full-bleed: cancel the page's horizontal padding so photos run edge
    // to edge while dragging. touch-action pan-y keeps vertical page
    // scrolling alive on touch screens.
    <div
      ref={viewportRef}
      className="-mx-6 overflow-hidden md:-mx-10"
      style={{ touchAction: "pan-y" }}
    >
      <motion.div
        ref={stripRef}
        drag="x"
        dragConstraints={{ left: -overflow, right: 0 }}
        dragElastic={0.08}
        dragTransition={{ power: 0.4, timeConstant: 200 }}
        onDragStart={() => setDragging(true)}
        onDragEnd={() => setDragging(false)}
        style={{ x, skewX: lean }}
        className={`flex w-max select-none gap-4 md:gap-6 ${
          dragging ? "cursor-grabbing" : "cursor-grab"
        }`}
      >
        {images.map((src, i) => (
          <div
            key={src}
            className="relative h-[380px] shrink-0 overflow-hidden bg-ink/5 md:h-[560px]"
            style={{ aspectRatio: aspect }}
          >
            <Image
              src={src}
              alt={`${alt} ${i + 1}`}
              fill
              sizes="(min-width: 768px) 40vw, 85vw"
              className="pointer-events-none select-none object-cover"
              draggable={false}
              // The gallery opens centered, so the middle photos are what's
              // on screen first — load those eagerly, not the strip's start.
              priority={Math.abs(i - middle) <= 1}
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
