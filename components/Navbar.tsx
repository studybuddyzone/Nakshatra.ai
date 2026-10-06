"use client";
import { useEffect } from "react";
import { ChevronDown, User, Hexagon } from "lucide-react";
import gsap from "gsap";
export default function Navbar() {
  useEffect(() => { gsap.fromTo("#nav", { y: -24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "power3.out" }); }, []);
  return (<header id="nav" className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-[#050608]/70 backdrop-blur-md">
    <nav aria-label="Main" className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:h-16 sm:px-8">
      <a href="/" aria-label="NAKSHATRA home" className="flex items-center gap-2.5 text-sm font-semibold tracking-[0.2em]"><Hexagon size={20} className="text-cyan-300" aria-hidden />NAKSHATRA</a>
      <div className="flex items-center gap-2 sm:gap-4">
        <button aria-label="Account menu" aria-haspopup="menu" className="flex items-center gap-1 rounded-full border border-white/10 py-1 pl-1 pr-2 text-white/70 hover:border-white/25">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-white/10"><User size={15} aria-hidden /></span><ChevronDown size={14} aria-hidden /></button>
        <a href="#plans" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-white/90 sm:px-5">Get Started</a>
      </div></nav></header>);
}
