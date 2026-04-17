"use client";

import React, { RefObject, Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, Environment, ContactShadows } from '@react-three/drei';
import { useGSAP } from '@gsap/react';
import { Group } from 'three';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import gsap from 'gsap';
import { useEffect } from 'react';
import { PriceTag } from '../price-tag';
import Button from './button';
import { FlavorNote } from '@/app/generated/prisma/client';

gsap.registerPlugin(ScrollTrigger);

function Model({ containerRef }: { containerRef: RefObject<HTMLDivElement | null> }) {
  const { scene } = useGLTF("/models/coffee-bag.glb");
  const groupRef = useRef<Group>(null);

  useGSAP(() => {
    if (!groupRef.current || !containerRef.current) return;

    // Set the initial state (where the bag is before any animation)
    gsap.set(groupRef.current.position, { x: -13, y: -4, z: 5 });
    gsap.set(groupRef.current.rotation, { y: -0.5, z: 0.5 });

    // Create a master timeline
    const tl = gsap.timeline();

    // The Intro Animation (Runs once on load)
    tl.to(groupRef.current.position, {
      x: -5, y: -4, z: 5,
      duration: 3,
      ease: "expo.out"
    })
      .to(groupRef.current.rotation, {
        y: 0.5, z: -0.5,
        duration: 3,
        ease: "expo.out"
      }, "<"); // "<" means start at the same time as the previous animation

    // The Scroll Animation (Starts after the intro)
    // We create a separate ScrollTriggered timeline to handle the scrubbing
    gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 2,
      }
    })
      .to(groupRef.current.position, {
        x: 4,
        y: -4.5,
        z: 3,
        ease: 'power1.inOut',
        immediateRender: false
      })
      .to(groupRef.current.rotation, {
        y: Math.PI * 1.9,
        ease: 'power1.inOut',
        immediateRender: false
      }, 0);

  }, { dependencies: [containerRef] });

  return (
    <group ref={groupRef}>
      <primitive scale={40} object={scene} />
    </group>
  );
}

interface ProductDetailProps {
  id: string;
  name: string;
  description: string;
  price: number;
  roastLevel: string;
  origin: string;
  flavorNotes: FlavorNote[];
}


export default function ProductDetails3D({ id, name, description, price, roastLevel, origin, flavorNotes }: ProductDetailProps) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Refs for animations
  const containerRef = useRef<HTMLDivElement>(null);
  const text1Ref = useRef<HTMLDivElement>(null);
  const text2Ref = useRef<HTMLDivElement>(null);

  // hook for 2D UI animations
  useGSAP(() => {
    if (!containerRef.current) return;

    const tl = gsap.timeline();

    // Slide-in text 1
    tl.fromTo(text1Ref.current,
      {
        opacity: 0,
        x: 100,
        immediateRender: false,
      },
      {
        opacity: 1,
        x: 0,
        duration: 2,
      },
    );

    tl.fromTo(text1Ref.current,
      { opacity: 1, x: 0 },
      {
        opacity: 0,
        x: 200,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "20% top",
          end: "60% top",
          scrub: 1,
        }
      }
    );

    // Slide-in text 2
    gsap.fromTo(text2Ref.current,
      { opacity: 0, x: 100 },
      {
        opacity: 1,
        x: 0,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "50% top", // Starts at 50% scroll depth
          end: "60% top",
          scrub: 1,
        }
      }
    );
  }, { dependencies: [containerRef] });

  return (
    <div ref={containerRef} className="w-screen h-[350vh] relative">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* HTML Text Overlay Layer */}
        <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-center max-w-7xl mx-auto px-8">
          <div ref={text1Ref} className="absolute top-1/3 right-10 max-w-md opacity-0">
            <h1 className="text-5xl font-black mb-4">{name}</h1>
            <p className="text-xl">{origin} • {roastLevel} Roast</p>
          </div>
          <div ref={text2Ref} className="absolute top-1/2 left-10 max-w-md text-right opacity-0">
            <div className="flex flex-row justify-between item-center">
              {flavorNotes.map((note: FlavorNote) =>
                <h2 key={note.id} className="text-3xl font-black mb-2 italic">{note.name}</h2>
              )}
            </div>
            <p className="text-lg mb-2">{description}</p>
            <div className="flex flex-row justify-between item-center">
              <Button>Add to Cart</Button>
              <PriceTag price={price} />
            </div>
          </div>
        </div>
        {/* 3D Canvas Layer */}
        <Canvas
          camera={{ position: [0, 0, 15], fov: 45 }}
          gl={{
            antialias: true,
            toneMappingExposure: 0.2
          }}
        >
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1.5} />
          <ambientLight intensity={0.5} />
          <Environment preset="studio" />
          <Suspense fallback={null}>
            <Model containerRef={containerRef} />
          </Suspense>
          <ContactShadows position={[0, -4.5, 0]} opacity={0.5} scale={20} blur={2} far={10} />
        </Canvas>
      </div>
    </div>
  );
}
