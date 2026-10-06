"use client";
import { Shape } from "@/lib/particleMorph";
const opts: { id: Shape; label: string }[] = [{ id: "core", label: "CORE" }, { id: "female", label: "FEMALE" }, { id: "male", label: "MALE" }];
export default function CharacterSelector({ value, onChange }: { value: Shape; onChange: (s: Shape) => void }) {
  return (<div role="radiogroup" aria-label="Character form" className="inline-flex rounded-full border border-white/10 bg-white/[0.03] p-1 backdrop-blur">
    {opts.map((o) => { const on = o.id === value; return (
      <button key={o.id} role="radio" aria-checked={on} onClick={() => onChange(o.id)}
        className={`rounded-full px-5 py-2 text-sm font-medium tracking-wide transition sm:px-7 ${on ? "text-white shadow-[0_0_0_1px_rgba(90,215,255,.7),0_0_18px_rgba(90,215,255,.25)]" : "text-white/50 hover:text-white/80"}`}>{o.label}</button>); })}
  </div>);
}
