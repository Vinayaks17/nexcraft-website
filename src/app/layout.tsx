import type { Metadata, Viewport } from "next";

import "./globals.css";
import { fontVariables } from "@/lib/fonts";
import { site } from "@/lib/site";
import { MotionProvider } from "@/components/providers/MotionProvider";
import { SmoothScrollProvider } from "@/components/providers/SmoothScroll";
import { Navbar } from "@/components/layout/Navbar";
import { FuelFooter } from "@/components/fuel/FuelFooter";
import { FloatingContact } from "@/components/layout/FloatingContact";

const HOME_TITLE = `${site.name} — Websites & Business Automation`;

export const metadata: Metadata = {
  /**
   * `metadataBase` is what lets every page hand Next a bare path for its
   * canonical and its card image and get an absolute URL back. Set once, here.
   */
  metadataBase: new URL(site.url),
  title: {
    default: HOME_TITLE,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  /* The icon set is picked up from the app directory by file convention —
     icon.svg, apple-icon.png and favicon.ico all sit next to this file. */
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    title: HOME_TITLE,
    description: site.description,
    url: "/",
    siteName: site.name,
    type: "website",
    locale: "en_US",
    images: [
      {
        url: site.ogImage,
        width: 1200,
        height: 630,
        alt: `${site.name} — websites, automations, built from scratch`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_TITLE,
    description: site.description,
    images: [site.ogImage],
  },
};

export const viewport: Viewport = {
  /* Matches the page base so mobile browser chrome blends into the site
     instead of framing it in orange. */
  themeColor: "#0a0a0a",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={fontVariables}>
      <body className="flex min-h-screen flex-col bg-ink font-sans text-cream">
        <MotionProvider>
          <SmoothScrollProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <FuelFooter />
            <FloatingContact />
          </SmoothScrollProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
