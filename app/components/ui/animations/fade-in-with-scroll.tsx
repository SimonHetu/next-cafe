"use client"
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ReactNode, useRef } from "react"


export function FadeInWithScroll({
  children,
  className,
}: Readonly<{
  children: React.ReactNode;
  className?: string;
}>) {
  const animationContainer = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    gsap.fromTo(
      animationContainer.current,
      {
        opacity: 0,
        y: 300
      },
      {
        opacity: 1,
        y: 0,
        scrollTrigger: {
          trigger: animationContainer.current,
          toggleActions: "play none none reverse",
          end: "top 60%",
          scrub: true,
        }
      }
    )
  }, { scope: animationContainer })

  return (
    <div ref={animationContainer} className={`${className}`}>
      {children}
    </div >
  )
}
