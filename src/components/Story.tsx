"use client";

import { useRef } from "react";
import MarkerAccent, { type MarkerAccentHandle } from "./MarkerAccent";

export default function Story() {
  const markerRef = useRef<MarkerAccentHandle>(null);

  return (
    <section className="scroll-section bg-white px-7 pt-[18vh] pb-[16vh] md:px-16">
      <p className="mb-9 font-body text-xs uppercase tracking-[0.1em] text-ink/60">
        The Story
      </p>

      <h2 className="mb-11 max-w-[90%] font-display text-[clamp(2rem,5vw,3.2rem)] font-black uppercase leading-[1] text-ink">
        <MarkerAccent ref={markerRef} />
        <br />
        Quiet confidence.
      </h2>

      <p className="max-w-[52ch] font-body text-[1.05rem] leading-[1.75] text-ink/80">
        [Placeholder bio] A short paragraph will sit here introducing James
        Davis III&apos;s approach to commercial and branding photography —
        replace with real copy once finalized.
      </p>

      <button
        type="button"
        onClick={() => markerRef.current?.replay()}
        className="mt-6 block rounded-full border border-line px-3.5 py-1.5 font-body text-xs uppercase tracking-[0.06em] text-ink/60 hover:border-ink hover:text-ink"
      >
        Replay write-on ↻
      </button>
    </section>
  );
}
