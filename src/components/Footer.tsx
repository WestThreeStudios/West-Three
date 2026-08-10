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
        <a
          href="https://mail.google.com/mail/?view=cm&fs=1&to=westthreestudio@gmail.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 transition-colors hover:text-ink"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-ink" />
          <span>westthreestudio@gmail.com</span>
        </a>

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
        {/* Same treatment as the header wordmark: mix-blend-difference on
            white text inverts against whatever sits behind it — solid ink
            here since the footer background is plain white, but it stays
            consistent if that ever changes. */}
        <span className="font-display font-black uppercase tracking-[0.02em] text-white mix-blend-difference">
          West Three
        </span>{" "}
        — Phoenix-based photography studio. Brand, fashion, and portrait
        work, shot in-studio and on location.
      </p>
    </motion.footer>
  );
}
