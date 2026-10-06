import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
export const metadata: Metadata = { title: "NAKSHATRA — The character that lives in your PC", description: "It talks. It remembers you. It gets real work done on your PC." };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en" className={inter.variable}><body className="font-sans">{children}<div className="grain" aria-hidden /></body></html>);
}
