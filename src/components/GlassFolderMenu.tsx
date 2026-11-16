"use client";

// Liquid-glass folders (after Apple's clear "liquid glass" dock): a folder of
// thick, clear, glossy glass with the coloured papers inside showing through
// the front pane. Hover magnifies it like the dock bulging under a finger; a
// specular highlight follows the cursor. Same Folder data as FolderMenu.

import { useRef, useState } from "react";
import { motion } from "motion/react";
import type { Folder } from "@/components/FolderMenu";

const ease = [0.4, 0, 0.2, 1] as const;
const CREAM = "#f3ede2";
// Inspired by Apple's clear "liquid glass" dock: a folder made of thick, clear,
// glossy glass. The coloured papers inside show through the front pane,
// softly blurred. Hover "lenses" the folder up like the dock bulging under a
// finger; a specular highlight follows the cursor across the glass.

const glass = {
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.62) 0%, rgba(255,255,255,0.28) 55%, rgba(255,255,255,0.18) 100%)",
  border: "1px solid rgba(255,255,255,0.75)",
  boxShadow: [
    "inset 0 1.5px 0 rgba(255,255,255,0.95)", // top rim light
    "inset 0 -10px 18px rgba(10,10,10,0.06)", // thickness at the bottom
    "inset 0 0 0 1px rgba(255,255,255,0.25)",
  ].join(", "),
  backdropFilter: "blur(14px) saturate(170%)",
  WebkitBackdropFilter: "blur(14px) saturate(170%)",
} as const;

function GlassFolder({ folder, index }: { folder: Folder; index: number }) {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const front = useRef<HTMLDivElement>(null);
  const lift = open ? 1 : hover ? 0.55 : 0;

  // Specular highlight that follows the cursor (CSS vars, no re-render).
  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = front.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  }

  const papers = [
    { color: folder.accents[1], left: "8%", right: "34%", rot: -4, rise: 15 },
    { color: CREAM, left: "22%", right: "18%", rot: 1.5, rise: 11 },
    { color: folder.accents[0], left: "44%", right: "6%", rot: 4, rise: 18 },
  ];

  return (
    <motion.div
      className="relative md:flex-1"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      animate={{ scale: hover && !open ? 1.035 : 1, y: hover ? -3 : 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Coloured glow underneath, like the reflections under dock icons */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-[12%] -bottom-3 h-6 rounded-full blur-xl"
        style={{ background: folder.accents[0] }}
        animate={{ opacity: hover || open ? 0.45 : 0.25 }}
      />

      <div className="relative pt-6">
        {/* Back pane + tab */}
        <div
          aria-hidden
          className="absolute left-0 top-0.5 h-4 w-[38%] rounded-t-xl border-b-0"
          style={glass}
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 top-4 rounded-2xl rounded-tl-none"
          style={{ ...glass, boxShadow: `${glass.boxShadow}, 0 14px 24px -12px rgba(10,10,10,0.3)` }}
        />

        {/* Papers inside, peeking out of the top */}
        {papers.map((p, i) => (
          <motion.div
            key={i}
            aria-hidden
            className="absolute top-1 h-14 rounded-lg"
            style={{
              left: p.left,
              right: p.right,
              background: p.color,
              boxShadow: "0 2px 6px rgba(10,10,10,0.18), inset 0 1px 0 rgba(255,255,255,0.5)",
            }}
            animate={{ y: -lift * p.rise, rotate: p.rot * (1 + lift * 0.6) }}
            transition={{ type: "spring", stiffness: 260, damping: 18, delay: i * 0.03 }}
          />
        ))}

        {/* Front pane — clear glass the papers show through */}
        <div
          ref={front}
          onMouseMove={onMove}
          className="relative z-10 overflow-hidden rounded-2xl"
          style={{
            ...glass,
            background: [
              "radial-gradient(110px circle at var(--mx, 70%) var(--my, 0%), rgba(255,255,255,0.55), transparent 70%)",
              glass.background,
            ].join(", "),
            backdropFilter: "blur(18px) saturate(180%)",
            WebkitBackdropFilter: "blur(18px) saturate(180%)",
          }}
        >
          {/* Gloss across the top half */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-2 top-0.5 h-1/2 rounded-t-[14px]"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.7), rgba(255,255,255,0) 85%)",
              opacity: 0.55,
            }}
          />

          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            className="relative flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
          >
            <span className="flex flex-col gap-0.5">
              <span className="font-body text-[9px] tracking-[0.14em] text-ink/50">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="font-display text-base font-black uppercase tracking-[-0.01em] text-ink">
                {folder.label}
              </span>
            </span>
            <motion.span
              animate={{ rotate: open ? 45 : 0 }}
              transition={{ duration: 0.3, ease }}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-display text-base font-black text-ink"
              style={glass}
              aria-hidden
            >
              +
            </motion.span>
          </button>

          <motion.div
            initial={false}
            animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden"
          >
            <div className="px-4 pb-4 font-body text-xs leading-relaxed text-ink/75">
              {folder.content}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default function GlassFolderMenu({ folders }: { folders: Folder[] }) {
  return (
    // Glass needs something behind it, so it sits on a soft grey stage
    // (the same light studio grey as the reference video).
    <div
      className="mx-auto max-w-[50rem] rounded-3xl px-4 py-7 md:px-8 md:py-9"
      style={{ background: "radial-gradient(120% 90% at 50% 0%, #f7f7f8 0%, #e6e6e9 100%)" }}
    >
      <div className="flex flex-col gap-8 md:flex-row md:items-start md:gap-5">
        {folders.map((f, i) => (
          <GlassFolder key={f.id} folder={f} index={i} />
        ))}
      </div>
    </div>
  );
}
