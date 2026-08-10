import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

/** Assistant — the typeface used across the Figma design (Web/* text styles). */
const assistant = localFont({
  src: [
    { path: "./fonts/assistant-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/assistant-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "./fonts/assistant-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "./fonts/assistant-latin-700-normal.woff2", weight: "700", style: "normal" },
    { path: "./fonts/assistant-latin-800-normal.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-assistant",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Helpet — Everything your pet needs.",
  description:
    "Helpet is the platform for everything your pet needs: lost & found reports, adoption listings and breeding requests — all in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${assistant.variable} font-sans antialiased`}>
        <Navbar />
        <main className="min-h-screen pt-[120px]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
