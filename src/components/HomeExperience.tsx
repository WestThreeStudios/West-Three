"use client";

import { useState } from "react";
import Hero, { type HeroPhase } from "./Hero";
import IntroOverlay from "./IntroOverlay";

export default function HomeExperience() {
  // "pending" until the intro tells us whether it actually played — Hero
  // stays hidden behind the overlay's opaque white in that state, then
  // either animates in (real first visit) or snaps straight to resting
  // (already seen this session / reduced motion).
  const [heroPhase, setHeroPhase] = useState<HeroPhase>("pending");

  return (
    <>
      <IntroOverlay
        onComplete={(played) => setHeroPhase(played ? "animate" : "instant")}
      />
      <Hero phase={heroPhase} />
    </>
  );
}
