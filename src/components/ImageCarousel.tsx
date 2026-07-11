"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";

const ADVANCE_INTERVAL = 3500;

export default function ImageCarousel({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (!playing || images.length < 2) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % images.length),
      ADVANCE_INTERVAL,
    );
    return () => clearInterval(id);
  }, [playing, images.length]);

  return (
    <div className="relative aspect-[2/3] w-full overflow-hidden bg-ink/5 md:aspect-auto md:h-[85vh]">
      <AnimatePresence mode="sync">
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={images[index]}
            alt={`${alt} ${index + 1}`}
            fill
            sizes="100vw"
            className="object-cover"
            priority={index === 0}
          />
        </motion.div>
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setPlaying((p) => !p)}
        className="absolute bottom-4 left-4 z-10 rounded bg-white/90 px-3 py-1.5 font-body text-xs uppercase tracking-[0.1em] text-ink transition-colors hover:bg-white"
      >
        {playing ? "Pause" : "Play"}
      </button>

      <div className="absolute bottom-4 right-4 z-10 font-body text-xs uppercase tracking-[0.1em] text-white mix-blend-difference">
        {index + 1} / {images.length}
      </div>
    </div>
  );
}
