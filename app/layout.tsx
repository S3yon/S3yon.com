import type { Metadata, Viewport } from "next";
import { Anton, Bricolage_Grotesque, Instrument_Sans } from "next/font/google";
import "./globals.css";
import { themeBootScript } from "@/lib/theme-boot";

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
  applicationName: "Seyon Sri",
  // iOS home-screen app: full screen, content runs under a translucent status bar
  appleWebApp: { capable: true, title: "Seyon", statusBarStyle: "black-translucent" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#212225" },
    { media: "(prefers-color-scheme: dark)", color: "#131315" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${heading.variable} ${sans.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
        {/* older iOS reads this instead of the manifest's display mode */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
