"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const TOKENS = ["COFFEE", "CODE", "REPEAT"] as const;

export function ProductHero() {
  const rootRef = useRef<HTMLElement>(null);
  const tokensRef = useRef<(HTMLSpanElement | null)[]>([]);

  useGSAP(
    () => {
      const nodes = tokensRef.current.filter(Boolean) as HTMLSpanElement[];
      if (nodes.length === 0) return;

      const setHighlight = (activeIndex: number) => {
        nodes.forEach((n, j) =>
          n.setAttribute("data-active", j === activeIndex ? "true" : "false")
        );
      };

      gsap.set(nodes, {
        scale: 1,
        rotateX: 0,
        transformPerspective: 720,
        transformOrigin: "50% 50% 0",
      });

      const tl = gsap.timeline({
        repeat: -1,
        defaults: { ease: "power2.inOut" },
      });
      const hold = 0.82;
      const settle = 0.42;

      nodes.forEach((el, i) => {
        tl.call(() => setHighlight(i))
          .to(nodes, {
            scale: 1,
            rotateX: 0,
            duration: settle,
          })
          .to(
            el,
            {
              scale: 1.07,
              rotateX: -11,
              duration: 0.52,
              ease: "power3.out",
            },
            "<0.08"
          )
          .to(el, { duration: hold })
          .to(el, {
            scale: 1,
            rotateX: 0,
            duration: settle,
            ease: "power2.in",
          });
      });

      tl.to({}, { duration: 0.38 });

      return () => {
        tl.kill();
        gsap.set(nodes, { clearProps: "scale,rotateX,transform" });
      };
    },
    { scope: rootRef }
  );

  return (
    <section
      ref={rootRef}
      className="relative w-full overflow-hidden border-b border-base-content/10 bg-base-100/30"
      aria-labelledby="product-hero-heading"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,color-mix(in_oklch,var(--color-primary),transparent_82%),transparent)]" />

      <div className="relative mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
        <div className="rounded-sm border border-base-content/10 bg-base-200/40 px-4 py-5 shadow-inner shadow-black/20 md:px-8 md:py-7">
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-base-content/45 md:text-xs">
            <span className="text-primary/80">~/next-cafe</span>
            <span className="text-base-content/35">/products</span>
            <span className="text-base-content/50"> $ </span>
            <span className="text-base-content/70">while true; do</span>
          </p>

          <h1
            id="product-hero-heading"
            className="mt-5 font-mono font-bold leading-tight tracking-tight"
            style={{
              fontSize: "clamp(1.35rem, 3.5vw + 0.6rem, 3.25rem)",
            }}
          >
            <span className="sr-only">
              Product catalog. Coffee, code, repeat.
            </span>
            <span className="block" aria-hidden>
              <span className="inline-flex flex-wrap items-baseline gap-x-2 gap-y-1 md:gap-x-4 [perspective:720px]">
                {TOKENS.map((word, i) => (
                  <span
                    key={word}
                    className="inline-flex items-baseline gap-x-2 md:gap-x-4"
                  >
                    {i > 0 ? (
                      <span className="select-none text-base-content/25 font-normal">
                        ;
                      </span>
                    ) : null}
                    <span
                      ref={(el) => {
                        tokensRef.current[i] = el;
                      }}
                      data-token=""
                      data-active={i === 0 ? "true" : "false"}
                      className="inline-block origin-center will-change-transform text-base-content/35 transition-colors duration-300 ease-out data-[active=true]:text-white"
                    >
                      {word}
                    </span>
                  </span>
                ))}
              </span>
              <span className="mt-3 block text-base-content/35 text-sm font-normal tracking-normal md:mt-4 md:text-base">
                ; done
              </span>
            </span>
          </h1>
        </div>
      </div>
    </section>
  );
}
