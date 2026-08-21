"use client";

import { useEffect, useRef } from "react";

import { usePrefersReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/utils";

/**
 * A looping, muted screen recording used as a media block.
 *
 * `autoPlay` is deliberately *not* set in JSX. Setting it would make the
 * element start playing during hydration regardless of the user's motion
 * setting, and pausing it a tick later still shows a frame of movement. Instead
 * the element renders paused with its poster and an effect starts playback only
 * once we know the user hasn't asked for less motion — which also keeps the
 * server and client trees identical.
 */
export function FuelVideo({
  src,
  poster,
  alt,
  className,
}: {
  src: string;
  poster: string;
  alt: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (reduceMotion) {
      el.pause();
      return;
    }

    // Playback is gated on visibility. A playing <video> is decoded every frame
    // whether or not it is on screen, and this page carries more than one of
    // them — leaving them all running is a steady main-thread and GPU cost paid
    // for something nobody is looking at.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Autoplay can still be refused (low-power mode, a browser policy).
          // The poster stays up in that case, which is a perfectly good still.
          void el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: 0 },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      el.pause();
    };
  }, [reduceMotion]);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      /* `none`, not `metadata`: there are two of these on the homepage and
         neither is above the fold. Metadata alone is a request and a range
         read per video on first paint, spent on a band most visitors have not
         reached. The poster is a real still, so the frame is never empty, and
         the IntersectionObserver below starts playback — which fetches — only
         once the band is actually on screen. */
      preload="none"
      aria-label={alt}
      className={cn("h-full w-full object-cover", className)}
    />
  );
}

export default FuelVideo;
