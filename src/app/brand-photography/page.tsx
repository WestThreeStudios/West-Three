import type { Metadata } from "next";
import Link from "next/link";
import DragGallery from "@/components/DragGallery";
import FolderMenu, { type Folder } from "@/components/FolderMenu";
import SmoothScroll from "@/components/SmoothScroll";
import StudioCollage from "@/components/StudioCollage";

export const metadata: Metadata = {
  title: "Brand Photography",
};

const folders: Folder[] = [
  {
    id: "contact",
    label: "Contact",
    content:
      "For bookings and inquiries: westthreestudio@gmail.com. Based in Phoenix, AZ — available for studio and on-location work.",
    accents: ["#5a18f0", "#2c2cf5"],
  },
  {
    id: "pricing",
    label: "Pricing",
    content:
      "Rates are based on session length, number of looks/setups, and usage (personal portfolio vs. commercial/brand use). Tell me what you need at westthreestudio@gmail.com and I'll send a quote within a day or two.",
    accents: ["#ef2d3c", "#ff4d00"],
  },
  {
    id: "more-info",
    label: "More Info",
    content:
      "Every session includes professionally edited, high-resolution images delivered digitally. Turnaround is typically 3–5 business days. Prints and rush delivery available on request.",
    accents: ["#f8f858", "#2c2cf5"],
  },
];

const images = Array.from(
  { length: 12 },
  (_, i) => `/work/brand-photography/${String(i + 1).padStart(2, "0")}.jpg`,
);

export default function BrandPhotographyPage() {
  return (
    <div className="bg-white px-6 pt-28 pb-24 md:px-10 md:pt-36">
      <SmoothScroll />
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
        I work with brands of every size — from first launches to
        established names — shooting editorial, professional, and media
        content built to actually get used. Primarily studio-based, but
        open to on-location when the project calls for it. Every job is a
        conversation: reach out for pricing and let&apos;s figure out what
        makes sense.
      </p>

      <div className="mt-16 md:mt-20">
        <DragGallery images={images} alt="Brand photography" />
      </div>

      <StudioCollage />

      <div className="mt-16 md:mt-24">
        <FolderMenu folders={folders} />
      </div>
    </div>
  );
}
