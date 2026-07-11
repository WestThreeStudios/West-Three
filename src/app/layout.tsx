import type { Metadata } from "next";
import { Archivo, Inter } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
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

export const metadata: Metadata = {
  title: "West Three — Photography Studio",
  description:
    "West Three is a Phoenix-based photography studio (@shotbyjdavisiii).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${inter.variable} antialiased`}
    >
      <body className="bg-white font-body text-ink">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
