"use client";

import { useState } from "react";
import { motion } from "motion/react";

type Folder = {
  id: string;
  label: string;
  content: string;
};

// Only one open at a time, expanding in place — each card's own height
// animates from 0 to its content's natural height, so following cards
// (stacked on mobile) reflow smoothly frame by frame with no separate
// layout-shift animation needed.
export default function FolderMenu({ folders }: { folders: Folder[] }) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-stretch gap-3 md:flex-row md:items-start md:gap-4">
      {folders.map((folder) => {
        const isOpen = open === folder.id;

        return (
          <motion.div
            key={folder.id}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden rounded-2xl bg-ink text-white md:flex-1"
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : folder.id)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
            >
              <span className="font-display text-lg font-black uppercase tracking-[-0.01em]">
                {folder.label}
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
          </motion.div>
        );
      })}
    </div>
  );
}
