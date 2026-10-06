const WA = process.env.NEXT_PUBLIC_WHATSAPP_URL || "https://wa.me/";
export default function FloatingContact() {
  return (<a href={WA} target="_blank" rel="noopener noreferrer" aria-label="Chat with us on WhatsApp"
    className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_8px_30px_rgba(37,211,102,.35)] transition hover:scale-110 sm:bottom-7 sm:right-7">
    <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" aria-hidden><path d="M12 2a10 10 0 0 0-8.600 15.100L2 22l5-1.300A10 10 0 1 0 12 2zm5.800 14.200c-.2.700-1.400 1.300-2 1.400-.5.100-1.200.100-1.900-.1-.4-.1-1-.3-1.700-.6-3-1.300-4.900-4.300-5-4.500s-1.200-1.600-1.200-3 .8-2.100 1-2.400.6-.3.800-.3h.6c.2 0 .4 0 .6.500l.8 2c.1.200.1.300 0 .5l-.3.400-.4.500c-.1.100-.3.300-.1.600.2.300.7 1.200 1.500 1.900 1 .9 1.900 1.200 2.200 1.300.3.100.4.100.6-.1l.8-1c.2-.3.400-.2.600-.1l1.900.9c.3.100.5.200.5.300.1.200.1.800-.1 1.400z"/></svg></a>);
}
