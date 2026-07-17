"use client";

import { useState } from "react";
import { motion } from "motion/react";

export type Folder = {
  id: string;
  label: string;
  content: string;
  // The colored folders peeking out from behind the front one, in order:
  // [directly behind, deepest]. Palette borrowed from therawmaterials.com's
  // folder drawer — the one deliberate splash of color on a B&W site.
  accents: [string, string];
};

// Each layer's motion within the stack. rest: the colored folders peek out
// a few px above the front one, tabs visible like a filing drawer. hover /
// open: the stack fans apart — back folders slide further up (with a hint
// of rotation so it feels physical), the front one dips down a touch, like
// a folder being pulled out from the pile.
const deepLayer = {
  rest: { y: -8, rotate: 0 },
  fanned: { y: -20, rotate: 1.2 },
};
const midLayer = {
  rest: { y: -4, rotate: 0 },
  fanned: { y: -11, rotate: -0.8 },
};
const frontLayer = {
  rest: { y: 0 },
  fanned: { y: 2 },
};

const layerTransition = { duration: 0.3, ease: [0.4, 0, 0.2, 1] as const };

// A colored folder sitting behind the front one: same footprint (inset-0
// tracks the front card's height, including while it expands), plus its own
// little rounded tab poking above the top edge. Tabs sit at different
// horizontal spots per layer so each layer reads as a separate folder.
function BackFolder({
  color,
  tabLeft,
  variants,
  zIndex,
}: {
  color: string;
  tabLeft: string;
  variants: typeof deepLayer;
  zIndex: number;
}) {
  return (
    <motion.div
      aria-hidden
      variants={variants}
      transition={layerTransition}
      className="absolute inset-0"
      style={{ zIndex }}
    >
      <div
        className="absolute -top-2.5 h-3 w-16 rounded-t-lg"
        style={{ background: color, left: tabLeft }}
      />
      <div
        className="absolute inset-0 rounded-2xl"
        style={{ background: color }}
      />
    </motion.div>
  );
}

// Only one open at a time, expanding in place — each card's own height
// animates from 0 to its content's natural height, so following cards
// (stacked on mobile) reflow smoothly frame by frame with no separate
// layout-shift animation needed.
export default function FolderMenu({ folders }: { folders: Folder[] }) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    // Extra vertical gap on mobile (folders stack) so each stack's tabs and
    // hover fan have headroom without sliding under the card above.
    <div className="flex flex-col items-stretch gap-8 md:flex-row md:items-start md:gap-4">
      {folders.map((folder, index) => {
        const isOpen = open === folder.id;

        return (
          <motion.div
            key={folder.id}
            initial="rest"
            animate={isOpen ? "fanned" : "rest"}
            whileHover="fanned"
            className="relative md:flex-1"
          >
            <BackFolder
              color={folder.accents[1]}
              tabLeft="72%"
              variants={deepLayer}
              zIndex={0}
            />
            <BackFolder
              color={folder.accents[0]}
              tabLeft="42%"
              variants={midLayer}
              zIndex={10}
            />

            <motion.div
              variants={frontLayer}
              transition={layerTransition}
              className="relative z-20"
            >
              {/* The front folder's own tab — outside the overflow-hidden
                  card below so it isn't clipped, flush against its top. */}
              <div className="absolute -top-2.5 left-6 h-3 w-20 rounded-t-lg bg-ink" />

              <div className="relative overflow-hidden rounded-2xl bg-ink text-white">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : folder.id)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="flex flex-col gap-1">
                    <span className="font-body text-[10px] tracking-[0.14em] text-white/50">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-lg font-black uppercase tracking-[-0.01em]">
                      {folder.label}
                    </span>
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    className="font-display text-2xl font-black leading-none"
                    aria-hidden
                  >
                    +
                  </motion.span>
                </button>

                <motion.div
                  initial={false}
                  animate={{ height: isOpen ? "auto" : 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <p className="px-6 pb-6 font-body text-sm leading-relaxed text-white/70">
                    {folder.content}
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}
