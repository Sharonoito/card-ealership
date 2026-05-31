"use client";

import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#005ba3] pt-20 pb-10 px-6 relative overflow-hidden">
      {/* Subtle top border to separate from page content */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-white/10" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-12 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="md:col-span-5">
            <Link href="/" className="inline-block mb-6">
              <div className="relative h-12 w-40 md:h-14 md:w-48">
                <Image 
                  src="/novalogo.png" 
                  alt="NovaShift Auto Logo" 
                  fill
                  priority
                  className="object-contain brightness-0 invert" 
                />
              </div>
            </Link>
            <p className="text-white/80 text-base leading-relaxed max-w-sm mb-8">
              Your trusted partner in bridging the gap between exclusive dealer auctions and your driveway with total transparency.
            </p>
            <div className="flex gap-4">
              {["𝕏", "IG", "FB"].map((social) => (
                <button 
                  key={social} 
                  className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-xs font-bold text-white hover:bg-white hover:text-[#005ba3] transition-all duration-300"
                >
                  {social}
                </button>
              ))}
            </div>
          </div>

          {/* Links Column */}
          <div className="md:col-span-3">
            <h4 className="text-white text-xs font-black uppercase tracking-[0.2em] mb-8 opacity-60">
              Quick Links
            </h4>
            <ul className="space-y-4 text-sm font-semibold text-white">
              <li>
                <Link href="/cars" className="hover:opacity-70 transition-opacity">Browse Inventory</Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:opacity-70 transition-opacity">Our Process</Link>
              </li>
              <li>
                <Link href="/contact-us" className="hover:opacity-70 transition-opacity">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="md:col-span-4">
            <h4 className="text-white text-xs font-black uppercase tracking-[0.2em] mb-8 opacity-60">
              Get In Touch
            </h4>
            <div className="space-y-6">
              <div>
                <p className="text-lg font-bold text-white">1505 S 356TH ST SUITE 114-17</p>
                <p className="text-white/70 text-sm mt-1">Federal Way, WA 98003</p>
              </div>
              <div className="pt-6 border-t border-white/20 space-y-2">
                <div>
                  <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-1">Phone</p>
                  <a href="tel:+12069901808" className="text-2xl font-black text-white hover:text-white/80 transition-colors">
                    (206) 990-1808
                  </a>
                </div>
                <div>
                  <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-1">Email</p>
                  <a href="mailto:novashiftautodealersllc@gmail.com" className="text-sm font-bold text-white/80 hover:text-white transition-colors">
                    novashiftautodealersllc@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Bottom Bar */}
        <div className="pt-8 border-t border-white/20 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col md:flex-row items-center gap-x-6 gap-y-2">
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.1em]">
              © {new Date().getFullYear()} Novashift Auto Dealers LLC
            </p>
            <span className="hidden md:block w-1 h-1 bg-white/20 rounded-full" />
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.1em]">
              Licensed Washington Dealer
            </p>
          </div>
          
          <div className="flex gap-6">
            <Link href="/terms" className="text-[10px] font-bold text-white/40 uppercase tracking-[0.1em] hover:text-white transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="text-[10px] font-bold text-white/40 uppercase tracking-[0.1em] hover:text-white transition-colors">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

