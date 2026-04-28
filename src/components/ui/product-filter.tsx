"use client";

import { useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function ProductFilter({ origins }: { origins: string[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const animationContainer = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);


  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (params.get(key) === value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    router.push(`?${params.toString()}`, { scroll: false });
  };

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    gsap.fromTo(
      ".toggle-btn",
      {
        opacity: 0,
        x: -500
      },
      {
        opacity: 1,
        x: 0,
        scrollTrigger: {
          trigger: ".toggle-btn",
          toggleActions: "play none none reverse",
        }
      }
    )
  }, { scope: animationContainer })

  useGSAP(() => {
    if (!isMenuOpen || !menuRef.current) return;

    gsap.fromTo(
      menuRef.current,
      { autoAlpha: 0, y: -10, scale: 0.98 },
      { autoAlpha: 1, y: 0, scale: 1, duration: 0.25, ease: "power2.out" }
    );
  }, { dependencies: [isMenuOpen], scope: animationContainer });

  const isActive = (key: string, value: string) => {
    return searchParams.get(key) === value ? "font-bold text-info-content hover:cursor-pointer" : "hover:cursor-pointer hover:text-info-content transition-colors duration-300";
  };

  return (
    <div
      ref={animationContainer}
      className={`sticky z-40 top-10 left-0 transition-all duration-300 ${isMenuOpen
        ? "bg-accent/90 p-10 shadow-xl ring-1 ring-info-content/15 backdrop-blur"
        : "p-4"
        }`}
    >
      <button
        type="button"
        onClick={() => setIsMenuOpen((prev) => !prev)}
        className="toggle-btn mb-6 inline-flex items-center gap-2 border bg-accent/70 px-4 py-2 text-sm font-semibold uppercase tracking-wide shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-info-content hover:bg-info-content/10 hover:shadow-md"
        aria-expanded={isMenuOpen}
        aria-controls="product-filter-menu"
      >
        {isMenuOpen ? "Hide Filters" : "Show Filters"}
      </button>
      {isMenuOpen && (
        <div
          ref={menuRef}
          id="product-filter-menu"
          className="flex justify-start gap-15 items-start border border-info-content/10 bg-accent/80 p-6 shadow-lg"
        >
          <div>
            <h1 className="text-2xl font-bold mb-4">Order By</h1>
            <ul className="space-y-2">
              <li><button onClick={() => updateFilter('sort', 'best-sellers')} className={isActive('sort', 'best-sellers')}>Best Sellers</button></li>
              <li><button onClick={() => updateFilter('sort', 'newest')} className={isActive('sort', 'newest')}>Newest</button></li>
              <li><button onClick={() => updateFilter('sort', 'a-z')} className={isActive('sort', 'a-z')}>A-Z</button></li>
              <li><button onClick={() => updateFilter('sort', 'price-asc')} className={isActive('sort', 'price-asc')}>Price Low - High</button></li>
              <li><button onClick={() => updateFilter('sort', 'price-desc')} className={isActive('sort', 'price-desc')}>Price High - Low</button></li>
            </ul>
          </div>

          <div>
            <h1 className="text-2xl font-bold mb-4">Roast Level</h1>
            <ul className="space-y-2">
              <li><button onClick={() => updateFilter('roast', 'light')} className={isActive('roast', 'light')}>Light</button></li>
              <li><button onClick={() => updateFilter('roast', 'medium')} className={isActive('roast', 'medium')}>Medium</button></li>
              <li><button onClick={() => updateFilter('roast', 'dark')} className={isActive('roast', 'dark')}>Dark</button></li>
            </ul>
          </div>

          <div>
            <h1 className="text-2xl font-bold mb-4">Origin</h1>
            <ul className="space-y-2">
              {origins.map((o: string) => (
                <li key={o}>
                  <button
                    onClick={() => updateFilter('origin', o.toLowerCase())}
                    className={isActive('origin', o.toLowerCase())}
                  >
                    {o}
                  </button>
                </li>
              ))}
            </ul>
          </div>

        </div>
      )}
    </div>
  );
}
