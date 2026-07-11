import type { Metadata } from "next";
import Link from "next/link";
import ImageCarousel from "@/components/ImageCarousel";

export const metadata: Metadata = {
  title: "Brand Photography",
};

const images = [
  "/work/brand-photography/01.jpg",
  "/work/brand-photography/02.jpg",
  "/work/brand-photography/03.jpg",
  "/work/brand-photography/04.jpg",
  "/work/brand-photography/05.jpg",
  "/work/brand-photography/06.jpg",
  "/work/brand-photography/07.jpg",
  "/work/brand-photography/08.jpg",
];

export default function BrandPhotographyPage() {
  return (
    <div className="bg-white px-6 pt-28 pb-24 md:px-10 md:pt-36">
      <Link
        href="/"
        className="font-body text-xs uppercase tracking-[0.1em] text-ink/50 transition-colors hover:text-ink"
      >
        ← Portfolio
      </Link>

      <p className="mt-8 font-body text-xs uppercase tracking-[0.1em] text-ink/50">
        Object 001 — Lifestyle / Apparel
      </p>

      <h1 className="mt-3 font-display text-[clamp(2.5rem,9vw,7rem)] font-black uppercase leading-[0.9] tracking-[-0.02em] text-ink">
        Brand
        <br />
        Photography.
      </h1>

      <p className="mt-8 max-w-[52ch] font-body text-[1.05rem] leading-[1.75] text-ink/70">
        Product and lifestyle photography featuring Lonely Ghost apparel.
      </p>

      <div className="mt-16 md:mt-20">
        <ImageCarousel images={images} alt="Brand photography" />
      </div>
    </div>
  );
}
