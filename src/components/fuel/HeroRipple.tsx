"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

import { usePrefersReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------
   Tuning

   Every number the effect's feel depends on, in one place. The defaults below
   are what the hero shipped with — see the note on each for what moving it
   does before you move it.
------------------------------------------------------------------------- */

/** Stamp radius as a fraction of the flowmap, i.e. how wide the bloom is. */
const FALLOFF = 0.25;

/**
 * How much of the flowmap survives each frame. 0.965 at 60fps leaves ~12% of a
 * stamp after a second, which is the trail length the reference has: long
 * enough to curve behind a fast flick, short enough that it isn't a smear.
 * Raised with STRENGTH so the bigger wave gets a proportionally longer tail.
 */
const DISSIPATION = 0.965;

/** Flowmap resolution. 128 is deliberate — higher reads sharper, not smoother. */
const FLOWMAP_SIZE = 128;

/**
 * Peak UV displacement per unit of flow. 0.12 is the ceiling: past it the
 * chromatic split separates far enough to read as a colour fringe rather than
 * refraction, and high-frequency source detail starts to alias under the
 * displacement. Keep OVERSCAN in step when changing this.
 */
const STRENGTH = 0.12;

/** R/B sample split along the displacement vector, as a fraction of STRENGTH. */
const CHROMA = 0.4;

/**
 * Pointer smoothing per frame. This is the whole reason fast flicks leave
 * curved trails instead of straight ones: the stamp chases a lagging point,
 * and velocity is measured from that lagging point's own delta, so the trail
 * stays coherent with itself.
 */
const POINTER_LERP = 0.1;

/** Idle drift: amplitude, how long a still pointer waits, and the ramp rates. */
const IDLE_STRENGTH = 0.008;
const IDLE_AFTER_MS = 1800;
const IDLE_RAMP_IN = 0.006;
const IDLE_RAMP_OUT = 0.08;

/** Device pixel ratio ceiling — a 3x phone renders 4x the fragments for nothing. */
const MAX_DPR = 1.5;

/**
 * Extra zoom past `cover`, so displaced samples still land inside the image.
 * Without it the axis that `cover` fits exactly has no margin and the
 * displacement smears the edge pixels.
 *
 * This has to track STRENGTH. A sample at the very edge of the frame stays
 * inside the image while |displacement| <= 0.5/OVERSCAN - 0.5, which at 0.92
 * is 0.0435 UV — so with STRENGTH at 0.12 the edge clamps once flow magnitude
 * passes ~0.36. That is a fast flick with the cursor already against the
 * frame edge, and the artefact is a few pixels of stretch there; ordinary
 * movement stays well inside it. Removing the case entirely would need
 * OVERSCAN 0.806, i.e. cropping a quarter of the picture away, which costs
 * more than the artefact does. 0.92 is the compromise, raised from the 0.94
 * that suited STRENGTH 0.085.
 */
const OVERSCAN = 0.92;

/** ogl clamps its own frame delta this way; matching it keeps velocity sane. */
const MIN_FRAME_MS = 10.4;

const vertex = /* glsl */ `
  attribute vec2 uv;
  attribute vec2 position;

  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0, 1);
  }
`;

/**
 * The flowmap's RG channels carry pointer velocity, decaying by DISSIPATION
 * each frame. We read them as a displacement vector.
 *
 * The displacement is applied *before* the cover transform, not after: the
 * cover scale and its inverse then cancel, so a given flow value moves the
 * image by the same number of screen pixels on both axes. Displacing after
 * cover makes the cropped axis visibly weaker than the other.
 */
const fragment = /* glsl */ `
  precision highp float;

  uniform sampler2D tMap;
  uniform sampler2D tFlow;
  uniform vec2 uCover;
  uniform float uStrength;
  uniform float uChroma;
  uniform float uIdle;
  uniform float uTime;

  varying vec2 vUv;

  vec2 cover(vec2 uv) {
    return (uv - 0.5) * uCover + 0.5;
  }

  void main() {
    vec2 flow = texture2D(tFlow, vUv).rg;

    // Idle life. Two incommensurate frequencies so the drift never visibly
    // repeats, at an amplitude that reads as "not frozen" and nothing more.
    vec2 drift = vec2(
      sin(vUv.y * 7.0 + uTime * 0.30),
      cos(vUv.x * 5.5 + uTime * 0.23)
    ) * uIdle;

    vec2 offset = flow * uStrength + drift;
    vec2 split = offset * uChroma;

    // Chromatic split: R and B sample either side of G along the displacement,
    // so the fringe only appears where the image is actually moving.
    float r = texture2D(tMap, cover(vUv + offset + split)).r;
    vec3 g  = texture2D(tMap, cover(vUv + offset)).rgb;
    float b = texture2D(tMap, cover(vUv + offset - split)).b;

    gl_FragColor = vec4(r, g.g, b, 1.0);
  }
`;

/** True only if this browser can actually give us a context to draw into. */
function webglAvailable() {
  try {
    const probe = document.createElement("canvas");
    return !!(
      probe.getContext("webgl2") ||
      probe.getContext("webgl") ||
      probe.getContext("experimental-webgl")
    );
  } catch {
    return false;
  }
}

/**
 * The hero's background image, with a liquid ripple that follows the pointer.
 *
 * Layering is deliberate: a real `next/image` is rendered underneath and is
 * what the page paints first, server-rendered and responsive. The canvas is
 * appended above it and cross-fades in once its first frame is drawn. Because
 * both draw the same file with the same cover fit, the hand-off is invisible —
 * and the failure modes need no extra code, because the fallback is already
 * on screen:
 *
 *   - no WebGL, or ogl fails to load  → the canvas never appears
 *   - `prefers-reduced-motion: reduce` → no canvas is ever created
 *   - JavaScript off entirely         → the image is still there
 *
 * The texture is taken from that `<img>` element rather than fetched again, so
 * the ripple costs one image download, at whatever size the browser picked for
 * the viewport.
 *
 * Nothing here re-renders React, ever: the component holds no state, the
 * canvas is appended to the DOM rather than rendered, and pointer events write
 * to closure variables the loop reads. A pointer move costs one assignment.
 */
export function HeroRipple({
  src,
  className,
}: {
  src: string;
  className?: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;

    const host = hostRef.current;
    if (!host || !webglAvailable()) return;

    let disposed = false;
    let teardown: (() => void) | undefined;

    void (async () => {
      const img = host.querySelector("img");
      if (!img) return;

      // The texture source is the image the page already loaded.
      if (!img.complete) {
        await new Promise<void>((resolve) => {
          img.addEventListener("load", () => resolve(), { once: true });
          img.addEventListener("error", () => resolve(), { once: true });
        });
      }
      if (disposed || !img.naturalWidth) return;

      let ogl: typeof import("ogl");
      try {
        ogl = await import("ogl");
      } catch {
        return;
      }
      if (disposed) return;

      const { Renderer, Program, Mesh, Triangle, Texture, Flowmap } = ogl;

      let renderer: InstanceType<typeof Renderer>;
      try {
        renderer = new Renderer({
          dpr: Math.min(window.devicePixelRatio || 1, MAX_DPR),
          alpha: true,
          depth: false,
          stencil: false,
          antialias: false,
          powerPreference: "high-performance",
        });
      } catch {
        return;
      }

      const gl = renderer.gl;
      const canvas = gl.canvas as HTMLCanvasElement;
      canvas.setAttribute("aria-hidden", "true");
      canvas.style.cssText =
        "position:absolute;inset:0;width:100%;height:100%;display:block;opacity:0;transition:opacity 700ms ease";

      const texture = new Texture(gl, {
        image: img,
        generateMipmaps: false,
        minFilter: gl.LINEAR,
        magFilter: gl.LINEAR,
        wrapS: gl.CLAMP_TO_EDGE,
        wrapT: gl.CLAMP_TO_EDGE,
      });

      const flowmap = new Flowmap(gl, {
        size: FLOWMAP_SIZE,
        falloff: FALLOFF,
        dissipation: DISSIPATION,
        alpha: 1,
      });

      const program = new Program(gl, {
        vertex,
        fragment,
        uniforms: {
          tMap: { value: texture },
          tFlow: flowmap.uniform,
          uCover: { value: [1, 1] },
          uStrength: { value: STRENGTH },
          uChroma: { value: CHROMA },
          uIdle: { value: 0 },
          uTime: { value: 0 },
        },
        depthTest: false,
        depthWrite: false,
      });

      const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

      /* --- sizing: object-fit: cover, recomputed from the host box --- */

      let width = 1;
      let height = 1;

      const resize = () => {
        const rect = host.getBoundingClientRect();
        width = Math.max(1, rect.width);
        height = Math.max(1, rect.height);

        renderer.setSize(width, height);
        flowmap.aspect = width / height;

        const imageAspect = img.naturalWidth / img.naturalHeight;
        const boxAspect = width / height;
        const cover =
          boxAspect > imageAspect
            ? [1, imageAspect / boxAspect] // box wider than image — crop top/bottom
            : [boxAspect / imageAspect, 1]; // box taller — crop the sides

        program.uniforms.uCover.value = [
          cover[0] * OVERSCAN,
          cover[1] * OVERSCAN,
        ];
      };

      resize();
      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(host);

      /* --- pointer: refs only, so a move never touches React --- */

      const target = { x: width / 2, y: height / 2 };
      const smooth = { x: target.x, y: target.y };
      const previous = { x: smooth.x, y: smooth.y };
      let pointerSeen = false;
      let lastMoveAt = 0;
      let idle = 0;
      let elapsed = 0;
      let lastFrame = 0;

      /** Drop the smoothed point onto the real one without drawing the gap. */
      const snap = () => {
        smooth.x = target.x;
        smooth.y = target.y;
        previous.x = target.x;
        previous.y = target.y;
      };

      const trackPoint = (clientX: number, clientY: number) => {
        const rect = host.getBoundingClientRect();
        target.x = clientX - rect.left;
        target.y = clientY - rect.top;

        if (!pointerSeen) {
          pointerSeen = true;
          snap();
        }
        lastMoveAt = elapsed;
      };

      const onPointerMove = (event: PointerEvent) =>
        trackPoint(event.clientX, event.clientY);

      // Touch is handled explicitly as well as via pointer events. Both are
      // passive and neither calls preventDefault, so a swipe still scrolls.
      const onTouchMove = (event: TouchEvent) => {
        const touch = event.touches[0];
        if (touch) trackPoint(touch.clientX, touch.clientY);
      };

      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("touchmove", onTouchMove, { passive: true });

      /* --- the loop --- */

      let frame = 0;
      let visible = false;
      let shown = false;

      const render = (now: number) => {
        frame = requestAnimationFrame(render);

        const delta = Math.max(MIN_FRAME_MS, lastFrame ? now - lastFrame : 16.7);
        lastFrame = now;
        elapsed += delta;

        smooth.x += (target.x - smooth.x) * POINTER_LERP;
        smooth.y += (target.y - smooth.y) * POINTER_LERP;

        // Velocity comes from the smoothed point's own delta, in px/ms — the
        // same units ogl's Flowmap stamp expects.
        flowmap.velocity.set(
          (smooth.x - previous.x) / delta,
          (smooth.y - previous.y) / delta,
        );
        previous.x = smooth.x;
        previous.y = smooth.y;

        flowmap.mouse.set(smooth.x / width, 1 - smooth.y / height);
        flowmap.update();

        // Idle drift eases in slowly and leaves quickly, so it never fights a
        // pointer that has just arrived.
        const wantsIdle =
          pointerSeen && elapsed - lastMoveAt < IDLE_AFTER_MS ? 0 : IDLE_STRENGTH;
        idle +=
          (wantsIdle - idle) *
          (wantsIdle > idle ? IDLE_RAMP_IN : IDLE_RAMP_OUT);

        program.uniforms.uIdle.value = idle;
        program.uniforms.uTime.value = elapsed / 1000;

        renderer.render({ scene: mesh });

        if (!shown) {
          shown = true;
          canvas.style.opacity = "1";
        }
      };

      const start = () => {
        if (frame) return;
        lastFrame = 0;
        snap(); // a resumed loop must not draw the gap it slept through
        frame = requestAnimationFrame(render);
      };

      const stop = () => {
        if (!frame) return;
        cancelAnimationFrame(frame);
        frame = 0;
      };

      /** Run only while the hero is on screen *and* the tab is in front. */
      const sync = () => {
        if (visible && !document.hidden) start();
        else stop();
      };

      const intersectionObserver = new IntersectionObserver(
        ([entry]) => {
          visible = entry.isIntersecting;
          sync();
        },
        { threshold: 0 },
      );
      intersectionObserver.observe(host);

      const onVisibilityChange = () => sync();
      document.addEventListener("visibilitychange", onVisibilityChange);

      host.appendChild(canvas);

      teardown = () => {
        stop();
        resizeObserver.disconnect();
        intersectionObserver.disconnect();
        document.removeEventListener("visibilitychange", onVisibilityChange);
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("touchmove", onTouchMove);
        canvas.remove();
        gl.getExtension("WEBGL_lose_context")?.loseContext();
      };
    })();

    return () => {
      disposed = true;
      teardown?.();
    };
  }, [reduceMotion]);

  return (
    <div
      ref={hostRef}
      aria-hidden
      className={cn("absolute inset-0 overflow-hidden", className)}
    >
      <Image
        src={src}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
        // The still carries the canvas's overscan so the two are pixel-for-pixel
        // the same shot. The canvas then fades in over an identical image
        // instead of over a differently-zoomed one, and the still simply stays
        // underneath afterwards — hidden by an opaque canvas, and already in
        // place if the canvas never arrives.
        style={{ transform: `scale(${1 / OVERSCAN})` }}
      />
    </div>
  );
}

export default HeroRipple;
