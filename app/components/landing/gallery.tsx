"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import styles from "./landing.module.css";

export default function Gallery() {
  const galleryRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger, Flip);

    const galleryElement = galleryRef.current;
    if (!galleryElement) return;

    const galleryItems = galleryElement.querySelectorAll(`.${styles.galleryItem}`);
    const galleryWrap = galleryElement.parentElement;
    if (!galleryWrap) return;

    const ctx = gsap.context(() => {
      galleryElement.classList.add(styles.galleryFinal);
      const flipState = Flip.getState(galleryItems);
      galleryElement.classList.remove(styles.galleryFinal);

      const flip = Flip.to(flipState, {
        simple: true,
        ease: "expoScale(1, 5)"
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: galleryWrap,
          start: "center center",
          end: "+=100%",
          scrub: true,
          pin: galleryWrap,
          pinSpacing: true
        }
      });

      tl.add(flip);
      return () => gsap.set(galleryItems, { clearProps: "all" });
    }, galleryElement);

    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      ctx.revert();
    };
  }, { scope: galleryRef });

  return (
    <div className={styles.galleryWrap}>
      <div
        ref={galleryRef}
        className={`${styles.gallery} ${styles.galleryBento} ${styles.gallerySwitch}`}
        id="gallery-8"
      >
        <div className={styles.galleryItem}>
          <Image src="/landing-page/pattern-1.jpg" alt="" fill />
        </div>
        <div className={styles.galleryItem}>
          <Image src="/landing-page/beans.jpg" alt="" fill />
        </div>
        <div className={styles.galleryItem}>
          <Image src="/landing-page/drip.jpg" alt="" fill />
        </div>
        <div className={styles.galleryItem}>
          <Image src="/landing-page/pattern-2.jpg" alt="" fill />
        </div>
        <div className={styles.galleryItem}>
          <Image src="/landing-page/sign.jpg" alt="" fill />
        </div>
        <div className={styles.galleryItem}>
          <Image src="/landing-page/keyboard.jpg" alt="" fill />
        </div>
        <div className={styles.galleryItem}>
          <Image src="/landing-page/pattern-3.jpg" alt="" fill />
        </div>
        <div className={styles.galleryItem}>
          <Image src="/landing-page/code.jpg" alt="" fill />
        </div>
      </div>
    </div>
  );
}
