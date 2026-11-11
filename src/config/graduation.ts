// Graduation booking — everything you're likely to edit lives in this file:
// packages, prices, deposits, add-ons, the Founding switch and the gallery.
// (Square checkout links are NOT here — they're environment variables, see
// src/lib/checkout.ts and .env.example.)

// Soft launch switch. While true, the homepage's Graduation tile reads
// "Coming Soon" and can't be clicked, and /graduation is left out of the
// sitemap. Flip to false when graduation bookings open. Redeploy after.
// (The /graduation page itself still loads for anyone with the direct link.)
export const GRADUATION_COMING_SOON = true;

// Flip to false to hide the Founding package on the page and in the form
// (anyone mid-form with it selected is told it's closed). Redeploy after.
export const FOUNDING_ENABLED = true;
export const FOUNDING_SPOTS = 5;

export const GROUP_MIN = 2;
export const GROUP_MAX = 4;

export type PackageId = "founding" | "standard" | "mini" | "group";
export type AddonId = "extra-location" | "extra-cover" | "prints" | "recap-reel";

export type PackageInfo = {
  id: PackageId;
  name: string;
  // Cents. For Group these are PER PERSON.
  priceCents: number;
  depositCents: number;
  perPerson?: boolean;
  tag?: string;
  // One line shown on the package card before you open the full preview.
  summary: string;
  features: string[];
};

const STANDARD_FEATURES = [
  "60 minutes",
  "2 outfits",
  "2 locations",
  "100+ color-corrected images",
  "35 fully edited (5 also in B&W)",
  "1 magazine cover",
  "Full gallery in 7 days",
];

export const PACKAGES: Record<PackageId, PackageInfo> = {
  founding: {
    id: "founding",
    name: "Founding",
    priceCents: 19500,
    depositCents: 7500,
    tag: `First ${FOUNDING_SPOTS} clients only`,
    summary: "Everything in Standard, at a founding price.",
    features: ["Same as Standard", ...STANDARD_FEATURES],
  },
  standard: {
    id: "standard",
    name: "Standard",
    priceCents: 26000,
    depositCents: 7500,
    summary: "60 min · 2 outfits · 2 locations · 35 edited photos",
    features: STANDARD_FEATURES,
  },
  mini: {
    id: "mini",
    name: "Mini",
    priceCents: 14500,
    depositCents: 5000,
    summary: "30 min · 1 location · 15 edited photos",
    features: ["30 minutes", "1 location", "15 edited photos"],
  },
  group: {
    id: "group",
    name: "Group",
    priceCents: 15000,
    depositCents: 5000,
    perPerson: true,
    tag: `${GROUP_MIN}–${GROUP_MAX} people`,
    summary: "60–90 min · 15 edited photos each · group shots",
    features: [
      "60–90 minutes",
      "15 edited photos each",
      "Group shots included",
    ],
  },
};

export type AddonInfo = { id: AddonId; name: string; priceCents: number };

export const ADDONS: Record<AddonId, AddonInfo> = {
  "extra-location": { id: "extra-location", name: "Extra location", priceCents: 4000 },
  "extra-cover": { id: "extra-cover", name: "Extra magazine cover", priceCents: 2000 },
  prints: { id: "prints", name: "10 prints", priceCents: 2500 },
  "recap-reel": { id: "recap-reel", name: "Recap Reel", priceCents: 7500 },
};

export const PACKAGE_IDS = Object.keys(PACKAGES) as PackageId[];
export const ADDON_IDS = Object.keys(ADDONS) as AddonId[];

// Packages visitors can currently pick.
export function openPackages(): PackageInfo[] {
  return PACKAGE_IDS.filter((id) => id !== "founding" || FOUNDING_ENABLED).map(
    (id) => PACKAGES[id],
  );
}

export function quote(pkg: PackageId, groupSize: number, addons: AddonId[]) {
  const info = PACKAGES[pkg];
  const people = pkg === "group" ? groupSize : 1;
  const addonTotal = addons.reduce((sum, id) => sum + ADDONS[id].priceCents, 0);
  return {
    totalCents: info.priceCents * people + addonTotal,
    depositCents: info.depositCents * people,
  };
}

export function usd(cents: number): string {
  const dollars = cents / 100;
  return `$${Number.isInteger(dollars) ? dollars : dollars.toFixed(2)}`;
}

// "Class of '27 preview" gallery. These are placeholders — to replace them,
// drop real photos into public/work/graduation/ with the same names
// (01.jpg … 06.jpg, 2:3 portrait). Add or remove slots by changing the count.
export const GALLERY_COUNT = 6;
export const GALLERY = Array.from(
  { length: GALLERY_COUNT },
  (_, i) => `/work/graduation/${String(i + 1).padStart(2, "0")}.jpg`,
);
export const GALLERY_ASPECT = "2/3";
