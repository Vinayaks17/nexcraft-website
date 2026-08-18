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

    // Autoplay can still be refused (low-power mode, a browser policy). The
    // poster stays up in that case, which is a perfectly good still.
    void el.play().catch(() => {});
  }, [reduceMotion]);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={alt}
      className={cn("h-full w-full object-cover", className)}
    />
  );
}

export default FuelVideo;
