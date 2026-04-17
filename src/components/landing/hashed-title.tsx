"use client";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import Link from "next/link";


export default function HashedTitle() {
  const containerRef = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    gsap.registerPlugin(ScrambleTextPlugin, ScrollTrigger);

    const q = gsap.utils.selector(containerRef);
    const animatedHeading = q(".animated-heading")[0] as HTMLHeadingElement | undefined;
    const animatedParagraph = q(".animated-box")[0] as HTMLDivElement | undefined;
    if (!animatedHeading || !animatedParagraph) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: animatedHeading,
        toggleActions: "play none none reset",
      }
    });

    tl.to(animatedHeading, {
      scrambleText: {
        text: animatedHeading.textContent ?? "",
        chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()-_=+[]{}|;:,.<>?/~",
        revealDelay: 1,
      },
      overwrite: "auto",
      duration: 4
    });

    tl.fromTo(
      animatedParagraph,
      { opacity: 0, x: -300 },
      { opacity: 1, x: 0, duration: 1.2, ease: "power2.out" }
    );

    const centerHeading = () => {
      const rect = animatedHeading.getBoundingClientRect();
      const top = rect.top + window.scrollY - (window.innerHeight / 2 - rect.height / 2);
      window.scrollTo({ top, behavior: "smooth" });
    };

    ScrollTrigger.create({
      trigger: animatedHeading,
      start: "top 95%",
      onEnter: centerHeading,
    });

  }, { scope: containerRef });

  return (
    <div
      ref={containerRef}
      className="h-screen flex items-center justify-center flex-col"
    >
      <h1 className="animated-heading text-center text-9xl font-black drop-shadow-[0_0_4px_rgba(255,255,255,0.8)] uppercase w-full italic">
        Kernel Coffee
      </h1>
      <div className="animated-box">
        <p className="text-2xl mt-5">Because caffeine is a dependency.</p>
        <div className="flex justify-center gap-5 mt-5">
          <Link href="/products" className="toggle-btn mb-6 inline-flex items-center gap-2 border bg-accent/70 px-4 py-2 text-sm font-semibold uppercase tracking-wide shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-info-content hover:bg-info-content/10 hover:shadow-md">Our Coffee</Link>
          <Link href="" className="toggle-btn mb-6 inline-flex items-center gap-2 border bg-accent/20 px-4 py-2 text-sm font-semibold uppercase tracking-wide shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-info-content hover:bg-info-content/10 hover:shadow-md">Flavor of the month</Link>
        </div>
      </div>
    </div>
  )
}
