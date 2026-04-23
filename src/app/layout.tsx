import type { Metadata } from "next";
import { Geist, Geist_Mono, Nunito, Caveat } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "BabyLog - Track Your Baby's Feedings & Diapers",
  description:
    "Simple, beautiful baby feeding and diaper tracker. Log breast and bottle feedings, track wet and dirty diapers, and view insightful analytics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="babylog" className={`${nunito.variable} ${geistSans.variable} ${geistMono.variable} ${caveat.variable}`}>
      <body className="antialiased min-h-screen bg-base-100">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
