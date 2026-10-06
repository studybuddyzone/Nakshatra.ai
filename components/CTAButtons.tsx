import { Download, ArrowRight } from "lucide-react";
const DOWNLOAD_URL = process.env.NEXT_PUBLIC_DOWNLOAD_URL || "/downloads/yourai-setup.exe";
const Win = () => (<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden><path d="M3 5.5 10.5 4.4v7.1H3zM11.500 4.300 21 3v8.500h-9.500zM3 12.500h7.500v7.100L3 18.500zM11.500 12.500H21V21l-9.500-1.300z"/></svg>);
export default function CTAButtons() {
  return (<div className="flex flex-col items-center gap-5">
    <div className="flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row">
      <a href="#plans" className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-black transition hover:-translate-y-0.5 hover:bg-white/90">See Plans <ArrowRight size={16} className="transition group-hover:translate-x-0.5" aria-hidden /></a>
      <a href={DOWNLOAD_URL} download className="group inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-7 py-3.5 text-[15px] font-semibold text-white transition hover:-translate-y-0.5 hover:border-white/35 hover:bg-white/5">Download Now <Download size={16} className="transition group-hover:translate-y-0.5" aria-hidden /></a>
    </div>
    <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-white/45"><span className="inline-flex items-center gap-1.5 text-white/65"><Win /> Windows 10/11</span><span>Free to download. A paid plan is required to use it.</span></p>
  </div>);
}
