"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-emerald-600 py-24 px-6 relative overflow-hidden">
      {/* Subtle Texture/Pattern Overlay to make it feel "Human" and not just a flat block */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-12 gap-16 mb-20">
          
          {/* Brand Column */}
          <div className="md:col-span-5">
            <h3 className="text-3xl font-black tracking-tighter text-white uppercase mb-6">
              Novashift<span className="text-emerald-950 font-light">Auto</span>
            </h3>
            <p className="text-emerald-50 text-lg leading-relaxed max-w-sm mb-8 font-medium">
              Bridging the gap between exclusive dealer auctions and your driveway with total transparency.
            </p>
            <div className="flex gap-3">
              {["𝕏", "IG", "FB"].map((social) => (
                <div 
                  key={social} 
                  className="w-12 h-12 rounded-full border border-emerald-500 bg-emerald-700/30 flex items-center justify-center text-xs font-black text-white hover:bg-white hover:text-emerald-600 transition-all cursor-pointer"
                >
                  {social}
                </div>
              ))}
            </div>
          </div>

          {/* Links Column */}
          <div className="md:col-span-3">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-950 mb-8">
              Quick Navigation
            </h4>
            <ul className="space-y-4 text-sm font-bold text-white">
              <li>
                <Link href="/cars" className="hover:translate-x-1 inline-block transition-transform">
                  Browse Inventory
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:translate-x-1 inline-block transition-transform">
                  Our Process
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:translate-x-1 inline-block transition-transform">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="md:col-span-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-950 mb-8">
              Visit Our Office
            </h4>
            <div className="space-y-6">
              <div>
                <p className="text-lg font-bold text-white">Federal Way, WA</p>
                <p className="text-emerald-100 font-medium">1505 S 356th St, Federal Way, WA 98003</p>
              </div>
              <div className="pt-6 border-t border-emerald-500/50">
                <p className="text-sm font-black text-emerald-950 uppercase tracking-widest mb-1">Direct Line</p>
                <p className="text-2xl font-black text-white">(555) 000-0000</p>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Bottom Bar */}
        <div className="pt-12 border-t border-emerald-500 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-wrap justify-center md:justify-start gap-x-8 gap-y-2">
            <p className="text-[10px] font-black text-emerald-900 uppercase tracking-widest">
              © {new Date().getFullYear()} Novashift Auto Dealers LLC
            </p>
            <p className="text-[10px] font-black text-emerald-900 uppercase tracking-widest">
              Licensed Washington Dealer
            </p>
          </div>
          
          <div className="flex gap-6">
            <Link href="/terms" className="text-[10px] font-black text-emerald-950 uppercase tracking-widest hover:text-white transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="text-[10px] font-black text-emerald-950 uppercase tracking-widest hover:text-white transition-colors">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}