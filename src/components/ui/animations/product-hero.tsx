"use client"
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export function ProductHero() {
  const animationContainer = useRef<HTMLDivElement>(null);

  // Example array, assuming you have this defined
  const headings = ["COFFEE", "CODE", "REPEAT"];

  useGSAP(() => {
    // 3D setup
    const width = window.innerWidth;
    const depth = -width / 8;
    const transformOrigin = `50% 50% ${depth}px`;

    const lines = gsap.utils.toArray<HTMLElement>(".line");

    gsap.set(lines, { perspective: 700, transformStyle: "preserve-3d" });

    // Timeline animation
    const animTime = 1.2;
    const tl = gsap.timeline({ repeat: -1 });

    lines.forEach((line, index) => {
      const chars = line.querySelectorAll(".char");

      gsap.set(chars, { rotationX: -90, opacity: 0 });

      tl.fromTo(
        chars,
        { rotationX: -90, opacity: 0 },
        {
          rotationX: 90,
          opacity: 1,
          duration: animTime,
          ease: "none",
          transformOrigin,
          keyframes: {
            autoAlpha: [0, 1, 1, 0]
          }
        },
        index
      );

    });

  }, { scope: animationContainer });

  return (
    <div ref={animationContainer} className="relative flex justify-center items-center w-screen h-screen overflow-hidden">

      <div className="relative w-full h-32 flex justify-center items-center">
        {headings.map((text, lineIdx) => (
          <h1
            key={lineIdx}
            className="line absolute text-center text-9xl mt-5 font-black drop-shadow-[5px_5px_rgba(0,0,0)] uppercase w-full"
          >
            {text.split("").map((c, charIdx) => (
              <span key={charIdx} className="char inline-block whitespace-pre opacity-0">
                {c}
              </span>
            ))}
          </h1>
        ))}
      </div>
    </div>
  );
}

