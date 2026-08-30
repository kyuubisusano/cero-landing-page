import type { Metadata } from "next";
import { Archivo, Bricolage_Grotesque, Martian_Mono } from "next/font/google";
import "./globals.css";

// Bricolage Grotesque carries the scale — a utilitarian grotesque with enough
// idiosyncrasy in its terminals to read as art-directed rather than defaulted.
// Archivo stays for text, where neutrality is the job. Martian Mono is the
// technical face and appears only where a machine produced the value.
// Deliberately no serif: a serif display is the tell that makes a page read as
// generically "tasteful".
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display-loaded",
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
  title: "Cero — a control room for private dollars on Aleo",
  description:
    "The pool is big; the exit is one. Private stablecoins already hide the middle of a payment — they still leak at the door, and still leave finance teams without a desk that can open only their slice of the book. Working paper v0.1.",
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
