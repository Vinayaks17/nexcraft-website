"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";

import { services } from "@/lib/home-content";
import { useMediaQuery, usePrefersReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/utils";

type Video = (typeof services.web.videos)[number];

/**
 * Overlap geometry. The pair is composed rather than tiled: the front phone
 * sits lower-left, the back one peeks from upper-right at 92% and slightly
 * dimmed, so the group reads as depth instead of as two equal thumbnails.
 *
 * `PAIR_ASPECT` reserves the box before any video loads. It is derived, not
 * guessed: a phone is 63% of the wrapper wide and ~1.78x its own width tall, so
 * with the back one offset 18% down the wrapper needs 0.63 * 1.78 / 0.82 ≈ 1.37
 * of its width in height.
 */
const PHONE_W = "63%";
const PAIR_ASPECT = "100 / 137";

function Screen({
  video,
  reduceMotion,
}: {
  video: Video;
  reduceMotion: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  /* Play only while on screen. A 19-second loop running behind three other
     sections is wasted decode work and battery, and Safari on low-power mode
     refuses to autoplay anyway — hence tracking state rather than assuming
     play() succeeded. */
  useEffect(() => {
    const el = ref.current;
    if (!el || reduceMotion) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.play()
            .then(() => setPlaying(true))
            .catch(() => setPlaying(false));
        } else {
          el.pause();
          setPlaying(false);
        }
      },
      { threshold: 0.5 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [reduceMotion]);

  const start = () => {
    ref.current?.play().then(
      () => setPlaying(true),
      () => setPlaying(false),
    );
  };

  return (
    <div className="relative aspect-[9/16] overflow-hidden rounded-[2.4rem] bg-surface-raised">
      <video
        ref={ref}
        src={video.src}
        poster={video.poster}
        aria-label={video.alt}
        muted
        loop
        playsInline
        preload="metadata"
        className="h-full w-full object-cover"
      />

      {/* Diagonal glare — what makes the screen read as glass rather than as a
          hole cut in the bezel. Kept under 5% so it never fights the content. */}
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent_28%,rgba(255,255,255,0.05)_42%,rgba(255,255,255,0.02)_52%,transparent_62%)]"
        aria-hidden
      />

      {/* Reduced motion (or a refused autoplay) gets the poster plus a way in,
          rather than a still that looks broken. */}
      {!playing && (
        <button
          type="button"
          onClick={start}
          aria-label={`Play: ${video.alt}`}
          className="absolute inset-0 flex items-center justify-center bg-ink/35 transition-colors duration-200 hover:bg-ink/20"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-cream/90 text-ink shadow-lift">
            <Play className="ml-0.5 h-4 w-4 fill-current" aria-hidden />
          </span>
        </button>
      )}
    </div>
  );
}

/** The device itself: slim dark bezel, hairline metallic edge, layered shadow. */
function Phone({
  video,
  reduceMotion,
  className,
  style,
}: {
  video: Video;
  reduceMotion: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={style}
      className={cn(
        "relative rounded-[2.75rem] bg-[#0a0a0c] p-[4px]",
        // Two shadows doing different jobs: a tight contact shadow that grounds
        // the device, and a wide soft one that puts air behind it.
        "shadow-[0_2px_10px_-2px_rgba(0,0,0,0.9),0_40px_80px_-24px_rgba(0,0,0,0.85)]",
        className,
      )}
    >
      <Screen video={video} reduceMotion={reduceMotion} />

      {/* Hairline edge highlight — the "machined" cue. Inset so it traces the
          bezel's outer lip rather than sitting on the screen. */}
      <span
        className="pointer-events-none absolute inset-0 rounded-[2.75rem] ring-1 ring-cream/12 ring-inset"
        aria-hidden
      />
      {/* Single camera punch-hole. */}
      <span
        className="pointer-events-none absolute top-[3%] left-1/2 h-[7px] w-[7px] -translate-x-1/2 rounded-full bg-black/80 ring-1 ring-white/10"
        aria-hidden
      />
    </div>
  );
}

/** Composed, overlapping pair — sm and up. */
function ComposedPair({ reduceMotion }: { reduceMotion: boolean }) {
  const [hovered, setHovered] = useState(false);
  const [front, back] = services.web.videos;
  const apart = hovered && !reduceMotion;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative mx-auto w-full max-w-[380px] md:max-w-[440px] lg:max-w-[480px]"
      style={{ aspectRatio: PAIR_ASPECT }}
    >
      {/* Back phone — upper right, smaller, dimmed. */}
      <motion.div
        className="absolute top-0 right-0"
        style={{ width: PHONE_W }}
        animate={{
          rotate: reduceMotion ? 0 : apart ? 1 : 2.5,
          x: apart ? 14 : 0,
          y: apart ? -10 : 0,
          scale: 0.92,
        }}
        transition={{ type: "spring", stiffness: 220, damping: 26 }}
      >
        <motion.div
          animate={reduceMotion ? undefined : { y: [0, -10, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1.1 }}
          className="opacity-75"
        >
          <Phone video={back} reduceMotion={reduceMotion} />
        </motion.div>
      </motion.div>

      {/* Front phone — lower left, full scale. */}
      <motion.div
        className="absolute bottom-0 left-0"
        style={{ width: PHONE_W }}
        animate={{
          rotate: reduceMotion ? 0 : apart ? -1 : -2.5,
          x: apart ? -14 : 0,
          y: apart ? 8 : 0,
        }}
        transition={{ type: "spring", stiffness: 220, damping: 26 }}
      >
        <motion.div
          animate={reduceMotion ? undefined : { y: [0, -10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          <Phone video={front} reduceMotion={reduceMotion} />
        </motion.div>
      </motion.div>
    </div>
  );
}

/** Below sm the overlap has no room — two small phones, side by side. */
function SimplePair({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <div className="flex items-start justify-center gap-3">
      {services.web.videos.map((video) => (
        <div key={video.src} className="w-full max-w-[132px] shrink-0">
          <Phone video={video} reduceMotion={reduceMotion} />
        </div>
      ))}
    </div>
  );
}

export function PhoneMockups() {
  const reduceMotion = usePrefersReducedMotion();
  // false through SSR and hydration, so the small layout is the default render.
  const composed = useMediaQuery("(min-width: 640px)");

  return (
    <div className="flex items-center justify-center gap-5 sm:gap-7">
      {/* Vertical mono label rather than a centred caption: it reads as a spine
          label on a spec sheet, and it keeps the pair's own composition clean
          instead of hanging a line of text under it. */}
      <p
        className="hidden shrink-0 font-mono text-[0.5625rem] tracking-[0.35em] text-cream/45 uppercase sm:block"
        style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
      >
        {services.web.videoCaption}
      </p>

      <div className="min-w-0 flex-1">
        {composed ? (
          <ComposedPair reduceMotion={reduceMotion} />
        ) : (
          <SimplePair reduceMotion={reduceMotion} />
        )}
        {/* The vertical label is hidden below sm, so the caption returns here. */}
        <p className="mt-6 text-center font-mono text-[0.5625rem] tracking-[0.3em] text-cream/45 uppercase sm:hidden">
          {services.web.videoCaption}
        </p>
      </div>
    </div>
  );
}

export default PhoneMockups;
