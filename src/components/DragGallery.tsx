"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  animate,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useVelocity,
  type AnimationPlaybackControls,
} from "motion/react";

// Interactive drag-to-scroll gallery, after burocratik.com/studios' team
// strip: a full-bleed horizontal row of photos you grab (hand cursor) and
// throw left/right, with a subtle velocity lean while it moves.
//
// The strip is an INFINITE LOOP: the photo sequence repeats forever in both
// directions (the Models set is ordered as one continuous turn, so cycling
// reads like him rotating). Implementation: the images render three times
// over, and the strip's translation is the raw drag value wrapped into
// [-period, 0) — since the content repeats every `period` px, jumping by
// exactly one period is pixel-identical, so the wrap is invisible. Starts
// at 0 so the sequence opens on its first photo at the left edge.
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
  const stripRef = useRef<HTMLDivElement>(null);
  const momentumRef = useRef<AnimationPlaybackControls | null>(null);
  // Width of one repetition of the image set (items + gaps).
  const [period, setPeriod] = useState(0);
  const [dragging, setDragging] = useState(false);

  // Raw, unbounded drag position — grows forever in either direction.
  const x = useMotionValue(0);
  // What the strip actually renders: x wrapped into [-period, 0).
  const wrappedX = useTransform(x, (v) => {
    if (period <= 0) return v;
    return ((v % period) + period) % period - period;
  });

  // The burocratik-style juice: the strip leans into a fast flick and
  // settles upright as it slows.
  const velocity = useVelocity(x);
  const lean = useSpring(useTransform(velocity, [-1500, 0, 1500], [3, 0, -3]), {
    stiffness: 300,
    damping: 40,
  });

  useLayoutEffect(() => {
    const measure = () => {
      const strip = stripRef.current;
      if (!strip || strip.children.length <= images.length) return;
      const first = strip.children[0] as HTMLElement;
      const copyStart = strip.children[images.length] as HTMLElement;
      // Distance between copy #1's and copy #2's first card = exact period,
      // gaps included.
      setPeriod(copyStart.offsetLeft - first.offsetLeft);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [images.length]);

  const tripled = [...images, ...images, ...images];

  return (
    // Full-bleed: cancel the page's horizontal padding so photos run edge
    // to edge while dragging. The outer div is the drag surface — pinned in
    // place by zero-width constraints (it never moves itself); its drag
    // deltas feed the raw x value and the release velocity feeds a manual
    // momentum glide, which the wrap keeps seamless no matter how far it
    // runs. touch-action pan-y keeps vertical page scrolling alive on touch.
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0}
      dragMomentum={false}
      onDragStart={() => {
        momentumRef.current?.stop();
        setDragging(true);
      }}
      onDrag={(_, info) => x.set(x.get() + info.delta.x)}
      onDragEnd={(_, info) => {
        setDragging(false);
        // Popmotion-style inertia: throw distance scales with release
        // velocity, eased out on an expo-like curve.
        const target = x.get() + 0.4 * info.velocity.x;
        momentumRef.current = animate(x, target, {
          duration: 0.9,
          ease: [0.05, 0.7, 0.1, 1],
        });
      }}
      className={`-mx-6 overflow-hidden md:-mx-10 ${
        dragging ? "cursor-grabbing" : "cursor-grab"
      }`}
      style={{ touchAction: "pan-y" }}
    >
      <motion.div
        ref={stripRef}
        style={{ x: wrappedX, skewX: lean }}
        className="flex w-max select-none gap-4 md:gap-6"
      >
        {tripled.map((src, i) => (
          <div
            key={`${src}-${i}`}
            className="relative h-[380px] shrink-0 overflow-hidden bg-ink/5 md:h-[560px]"
            style={{ aspectRatio: aspect }}
          >
            <Image
              src={src}
              alt={`${alt} ${(i % images.length) + 1}`}
              fill
              sizes="(min-width: 768px) 40vw, 85vw"
              className="pointer-events-none select-none object-cover"
              draggable={false}
              // First photos of the first copy are what's on screen at
              // load — fetch those eagerly. Every copy shares the same
              // srcs, so each image is only ever downloaded once.
              loading={i < 3 ? "eager" : "lazy"}
              // Serve originals straight from /public: the earliest
              // /_next/image requests reproducibly hung on first hit,
              // leaving blank frames (see git history) — and these are
              // local, already web-sized JPEGs.
              unoptimized
            />
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}
