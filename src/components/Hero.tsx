"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";

const works = [
  {
    id: 1,
    label: "Brand Photography",
    image: "/work/brand-photography/01.jpg",
    href: "/brand-photography",
  },
  { id: 2, label: "Placeholder — Work 2" },
  { id: 3, label: "Placeholder — Work 3" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
};

function Wordmark({ delay = 0 }: { delay?: number }) {
  return (
    <motion.h1
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      variants={fadeUp}
      transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1], delay }}
      className="select-none font-display text-[clamp(4rem,16vw,13rem)] font-black uppercase leading-[0.85] tracking-[-0.02em] text-ink"
    >
      West Three
    </motion.h1>
  );
}

export default function Hero() {
  const [active, setActive] = useState(0);
  const [cursor, setCursor] = useState({ x: 0, y: 0, visible: false });
  const activeWork = works[active];

  return (
    <section className="bg-white px-6 pt-28 pb-20 md:px-10 md:pt-36">
      <Wordmark />

      <div
        className="relative mt-10 grid grid-cols-1 gap-6 md:mt-14 md:grid-cols-[1fr_1.4fr]"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setCursor({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            visible: true,
          });
        }}
        onMouseLeave={() => setCursor((c) => ({ ...c, visible: false }))}
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          className="order-2 flex flex-col gap-4 md:order-1"
        >
          {works.map((work, i) =>
            work.href ? (
              <Link
                key={work.id}
                href={work.href}
                onMouseEnter={() => setActive(i)}
                className={`relative flex aspect-[4/3] items-center justify-center overflow-hidden text-center transition-colors ${
                  active === i ? "ring-1 ring-ink/50" : ""
                }`}
              >
                <Image
                  src={work.image!}
                  alt={work.label}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover"
                />
                <span className="absolute bottom-2 left-2 rounded-full bg-white/90 px-2.5 py-1 font-body text-[10px] uppercase tracking-[0.1em] text-ink">
                  {work.label}
                </span>
              </Link>
            ) : (
              <button
                key={work.id}
                type="button"
                onMouseEnter={() => setActive(i)}
                className={`flex aspect-[4/3] items-center justify-center border border-dashed p-4 text-center transition-colors ${
                  active === i
                    ? "border-ink/50 bg-ink/[0.03]"
                    : "border-ink/20 hover:border-ink/40"
                }`}
              >
                <span className="font-body text-[11px] uppercase tracking-[0.1em] text-ink/50">
                  {work.label}
                </span>
              </button>
            ),
          )}
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1], delay: 0.1 }}
          className="order-1 md:order-2"
        >
          {activeWork.href ? (
            <Link
              href={activeWork.href}
              className="relative flex aspect-[4/5] items-center justify-center overflow-hidden md:aspect-auto md:h-full md:min-h-[420px]"
            >
              <Image
                src={activeWork.image!}
                alt={activeWork.label}
                fill
                sizes="(min-width: 768px) 56vw, 100vw"
                className="object-cover"
                priority
              />
              <span className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1.5 font-body text-xs uppercase tracking-[0.1em] text-ink">
                {activeWork.label}
              </span>
            </Link>
          ) : (
            <div className="flex aspect-[4/5] items-center justify-center border border-dashed border-ink/25 p-6 text-center md:aspect-auto md:h-full md:min-h-[420px]">
              <span className="font-body text-xs uppercase tracking-[0.12em] text-ink/50">
                {activeWork.label}
                <br />— photo coming soon —
              </span>
            </div>
          )}
        </motion.div>

        <motion.div
          className="pointer-events-none absolute z-10 hidden -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-ink px-4 py-2 md:flex"
          style={{ left: cursor.x, top: cursor.y }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: cursor.visible ? 1 : 0,
            scale: cursor.visible ? 1 : 0.8,
          }}
          transition={{ duration: 0.2 }}
        >
          <span className="font-body text-[10px] uppercase tracking-[0.14em] text-white">
            {activeWork.href ? "View" : "Coming Soon"}
          </span>
        </motion.div>
      </div>

      <div className="mt-20 md:mt-28">
        <Wordmark />
      </div>
    </section>
  );
}
