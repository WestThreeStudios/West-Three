"use client";

import { motion } from "motion/react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export default function Footer() {
  return (
    <motion.footer
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      variants={fadeUp}
      transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
      className="border-t border-line px-6 py-8 md:px-10"
    >
      <div className="flex flex-col gap-6 font-body text-xs uppercase tracking-[0.1em] text-ink/60 md:flex-row md:items-start md:justify-between">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-ink" />
          <span>Photography Studio</span>
        </div>

        <span>Phoenix, AZ</span>

        <a
          href="https://instagram.com/shotbyjdavisiii"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-ink"
        >
          Instagram
        </a>

        <div className="text-ink/60">
          <div>West Three</div>
          <div>©2026</div>
        </div>
      </div>

      <p className="mt-8 max-w-md font-body text-xs leading-relaxed text-ink/40">
        WEST THREE is a Phoenix-based photography studio. [Placeholder]
        Site content is a work in progress — replace with final copy.
      </p>
    </motion.footer>
  );
}
