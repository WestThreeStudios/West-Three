"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const formatPhoenixTime = () =>
  new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: false,
    timeZone: "America/Phoenix",
  }).format(new Date());

function useClock() {
  const [time, setTime] = useState(formatPhoenixTime);

  useEffect(() => {
    const id = setInterval(() => setTime(formatPhoenixTime()), 1000 * 15);
    return () => clearInterval(id);
  }, []);

  return time;
}

export default function Header() {
  const time = useClock();

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-5 mix-blend-difference md:px-10">
      <Link
        href="/"
        className="font-display text-sm font-black uppercase tracking-[0.02em] text-white"
      >
        West Three
      </Link>

      <div className="flex items-center gap-2 font-body text-xs uppercase tracking-[0.1em] text-white/80">
        <span suppressHydrationWarning>Phoenix, AZ {time}</span>
        <span className="h-1.5 w-1.5 rounded-full bg-white" />
      </div>
    </header>
  );
}
