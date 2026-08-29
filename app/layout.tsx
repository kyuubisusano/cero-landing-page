import type { Metadata } from "next";
import { Archivo, Martian_Mono } from "next/font/google";
import "./globals.css";

// Archivo carries the scale; Martian Mono is the technical face and appears
// only where a machine produced the value. Deliberately no serif: a serif
// display is the tell that makes a page read as generically "tasteful".
const display = Archivo({
  subsets: ["latin"],
  variable: "--font-display-loaded",
  axes: ["wdth"],
  display: "swap",
});

const body = Archivo({
  subsets: ["latin"],
  variable: "--font-body-loaded",
  display: "swap",
});

const mono = Martian_Mono({
  subsets: ["latin"],
  variable: "--font-mono-loaded",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cero — the middle is private, the ends are not",
  description:
    "USDCx hides the body of a payment. Cero handles the ends: it scores how much a pay-run gives away at mint, burn and bridge exit, routes the quiet path, then opens only the slice each reviewer is cleared for. Private dollars on Aleo.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
