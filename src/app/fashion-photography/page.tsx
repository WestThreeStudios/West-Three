import type { Metadata } from "next";
import Link from "next/link";
import ImageCarousel from "@/components/ImageCarousel";
import FolderMenu, { type Folder } from "@/components/FolderMenu";

export const metadata: Metadata = {
  title: "Fashion Photography",
};

const folders: Folder[] = [
  {
    id: "contact",
    label: "Contact",
    content:
      "[Placeholder] Ready to book a portfolio session? Reach out and we'll get you scheduled — replace with real contact details once finalized.",
    accents: ["#5a18f0", "#2c2cf5"],
  },
  {
    id: "pricing",
    label: "Pricing",
    content:
      "[Placeholder] Portfolio session packages and rates go here — replace with real pricing once finalized.",
    accents: ["#ef2d3c", "#ff4d00"],
  },
  {
    id: "more-info",
    label: "More Info",
    content:
      "[Placeholder] What to expect, session length, and deliverables go here — replace with real copy once finalized.",
    accents: ["#f8f858", "#2c2cf5"],
  },
];

const images = [
  "/work/fashion-photography/01.jpg",
  "/work/fashion-photography/02.jpg",
  "/work/fashion-photography/03.jpg",
  "/work/fashion-photography/04.jpg",
  "/work/fashion-photography/05.jpg",
];

export default function FashionPhotographyPage() {
  return (
    <div className="bg-white px-6 pt-28 pb-24 md:px-10 md:pt-36">
      <Link
        href="/"
        className="font-body text-xs uppercase tracking-[0.1em] text-ink/50 transition-colors hover:text-ink"
      >
        ← Portfolio
      </Link>

      <p className="mt-8 font-body text-xs uppercase tracking-[0.1em] text-ink/50">
        Object 003 — Editorial / Styling
      </p>

      <h1 className="mt-3 font-display text-[clamp(2.5rem,9vw,7rem)] font-black uppercase leading-[0.9] tracking-[-0.02em] text-ink">
        Fashion
        <br />
        Photography.
      </h1>

      <p className="mt-8 max-w-[52ch] font-body text-[1.05rem] leading-[1.75] text-ink/70">
        [Placeholder] Editorial styling session — replace with real copy
        once finalized.
      </p>

      <div className="mt-16 md:mt-20">
        <ImageCarousel images={images} alt="Fashion photography" />
      </div>

      <div className="mt-8">
        <FolderMenu folders={folders} />
      </div>
    </div>
  );
}
