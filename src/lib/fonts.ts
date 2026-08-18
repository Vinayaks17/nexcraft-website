import localFont from "next/font/local";
import { IBM_Plex_Mono } from "next/font/google";

/**
 * The whole grotesque layer — headlines, body, UI, buttons, cards.
 *
 * Variable (100–900) in both styles, so every weight utility resolves to a real
 * instance. That removes the constraint the previous pairing imposed: nothing
 * here needs to avoid `font-semibold`, and there are no synthetic weights.
 *
 * Source: Fontshare (ITF Free Font License, free for commercial use).
 */
export const switzer = localFont({
  src: [
    {
      path: "../fonts/Switzer/Switzer-Variable.woff2",
      weight: "100 900",
      style: "normal",
    },
    {
      path: "../fonts/Switzer/Switzer-VariableItalic.woff2",
      weight: "100 900",
      style: "italic",
    },
  ],
  display: "swap",
  variable: "--font-switzer",
});

/**
 * The detail layer, and a large one: eyebrows, index labels, tags, step
 * numbers, form labels, nav — plus, since the portfolio rebuild, project
 * descriptions, image tag chips and "view project" links.
 */
export const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
});

export const fontVariables = `${switzer.variable} ${plexMono.variable}`;
