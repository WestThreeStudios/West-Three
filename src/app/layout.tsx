import type { Metadata } from "next";
import { Archivo, Inter, Permanent_Marker } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["700", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const permanentMarker = Permanent_Marker({
  variable: "--font-permanent-marker",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "James Davis III — Photography",
  description:
    "Commercial and branding photography by James Davis III (@shotbyjdavisiii).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${inter.variable} ${permanentMarker.variable} antialiased`}
    >
      <body className="bg-white font-body text-ink">{children}</body>
    </html>
  );
}
