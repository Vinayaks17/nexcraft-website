import type { Metadata, Viewport } from "next";

import "./globals.css";
import { fontVariables } from "@/lib/fonts";
import { site } from "@/lib/site";
import { MotionProvider } from "@/components/providers/MotionProvider";
import { SmoothScrollProvider } from "@/components/providers/SmoothScroll";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingContact } from "@/components/layout/FloatingContact";

export const metadata: Metadata = {
  title: {
    default: `${site.name} — Websites & Business Automations`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  metadataBase: new URL(site.url),
  openGraph: {
    title: `${site.name} — Websites & Business Automations`,
    description: site.description,
    siteName: site.name,
    type: "website",
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
            <Footer />
            <FloatingContact />
          </SmoothScrollProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
