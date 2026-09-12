import type { Metadata, Viewport } from "next";
import { Anton, Bricolage_Grotesque, Instrument_Sans } from "next/font/google";
import "./globals.css";

const display = Anton({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400"],
});

const heading = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["600", "700", "800"],
});

const sans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Seyon Sri",
  description:
    "Seyon Sri — Software Engineer Intern at Scotiabank. Data pipelines, diagnostic AI, and full-stack products shipped from hackathon to deploy.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${heading.variable} ${sans.variable}`}
    >
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
