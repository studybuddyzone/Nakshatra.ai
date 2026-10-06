"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";
import CharacterSelector from "./CharacterSelector";
import CTAButtons from "./CTAButtons";
import { Shape } from "@/lib/particleMorph";
import { prefersReducedMotion } from "@/lib/animation";
const ParticleCharacter = dynamic(() => import("./ParticleCharacter"), { ssr: false });
export default function Hero() {
  const [shape, setShape] = useState<Shape>("core");
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) return;
      gsap.from("[data-stage]", { opacity: 0, duration: 2.2, ease: "power2.out", delay: 0.2 });
      gsap.from("[data-in]", { opacity: 0, y: 26, duration: 1, ease: "power3.out", stagger: 0.18, delay: 0.9 });
      gsap.to("[data-parallax]", { yPercent: 8, opacity: 0.55, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true } });
    }, root);
    return () => ctx.revert();
  }, []);
  return (<section ref={root} className="relative flex min-h-[100svh] flex-col items-center overflow-hidden px-5 pt-20 sm:pt-24">
    <div aria-hidden className="pointer-events-none absolute left-1/2 top-[34%] h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: "radial-gradient(circle,rgba(70,140,255,.14),transparent 62%)" }} />
    <div data-parallax className="relative w-full max-w-4xl"><div data-stage className="relative h-[46svh] min-h-[280px] w-full sm:h-[52svh] lg:h-[56svh]"><ParticleCharacter shape={shape} /></div></div>
    <div data-in className="-mt-2"><CharacterSelector value={shape} onChange={setShape} /></div>
    <h1 data-in className="mt-8 max-w-4xl text-balance text-center text-[2.25rem] font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.6rem]">It&rsquo;s an emotional character<br className="hidden sm:block" /> that lives inside the system.</h1>
    <p data-in className="mt-4 max-w-xl text-center text-base text-white/60 sm:text-lg">It talks. It remembers you. It gets real work done on your PC.</p>
    <div data-in className="mt-8 w-full pb-16 sm:w-auto"><CTAButtons /></div>
  </section>);
}
