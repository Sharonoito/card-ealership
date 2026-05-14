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
                <Link href="/contact" className="hover:opacity-70 transition-opacity">Contact Us</Link>
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
                <p className="text-lg font-bold text-white">Federal Way, WA</p>
                <p className="text-white/70 text-sm mt-1">1505 S 356th St, Federal Way, WA 98003</p>
              </div>
              <div className="pt-6 border-t border-white/20">
                <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-1">Direct Line</p>
                <a href="tel:5550000000" className="text-2xl font-black text-white hover:text-white/80 transition-colors">
                  (555) 000-0000
                </a>
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



// "use client";

// import Link from "next/link";

// export default function Footer() {
//   return (
//     <footer className="bg-[#005ba3] py-24 px-6 relative overflow-hidden">
//       {/* Subtle Texture/Pattern Overlay to make it feel "Human" and not just a flat block */}
//       <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />

//       <div className="max-w-7xl mx-auto relative z-10">
//         <div className="grid md:grid-cols-12 gap-16 mb-20">
          
//           {/* Brand Column */}
//           <div className="md:col-span-5">
//             <h3 className="text-3xl font-black tracking-tighter text-white uppercase mb-6">
//               Novashift<span className="text-[#00284d] font-light">Auto</span>
//             </h3>
//             <p className="text-[#0071d2]/5 text-lg leading-relaxed max-w-sm mb-8 font-medium">
//               Bridging the gap between exclusive dealer auctions and your driveway with total transparency.
//             </p>
//             <div className="flex gap-3">
//               {["𝕏", "IG", "FB"].map((social) => (
//                 <div 
//                   key={social} 
//                   className="w-12 h-12 rounded-full border border-[#0071d2] bg-[#004a8c]/30 flex items-center justify-center text-xs font-black text-white hover:bg-white hover:text-[#005ba3] transition-all cursor-pointer"
//                 >
//                   {social}
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Links Column */}
//           <div className="md:col-span-3">
//             <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#00284d] mb-8">
//               Quick Navigation
//             </h4>
//             <ul className="space-y-4 text-sm font-bold text-white">
//               <li>
//                 <Link href="/cars" className="hover:translate-x-1 inline-block transition-transform">
//                   Browse Inventory
//                 </Link>
//               </li>
//               <li>
//                 <Link href="/how-it-works" className="hover:translate-x-1 inline-block transition-transform">
//                   Our Process
//                 </Link>
//               </li>
//               <li>
//                 <Link href="/contact" className="hover:translate-x-1 inline-block transition-transform">
//                   Contact Us
//                 </Link>
//               </li>
//             </ul>
//           </div>

//           {/* Contact Column */}
//           <div className="md:col-span-4">
//             <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#00284d] mb-8">
//               Visit Our Office
//             </h4>
//             <div className="space-y-6">
//               <div>
//                 <p className="text-lg font-bold text-white">Federal Way, WA</p>
//                 <p className="text-[#0071d2]/10 font-medium">1505 S 356th St, Federal Way, WA 98003</p>
//               </div>
//               <div className="pt-6 border-t border-[#0071d2]/50">
//                 <p className="text-sm font-black text-[#00284d] uppercase tracking-widest mb-1">Direct Line</p>
//                 <p className="text-2xl font-black text-white">(555) 000-0000</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Legal Bottom Bar */}
//         <div className="pt-12 border-t border-[#0071d2] flex flex-col md:flex-row justify-between items-center gap-6">
//           <div className="flex flex-wrap justify-center md:justify-start gap-x-8 gap-y-2">
//             <p className="text-[10px] font-black text-[#003366] uppercase tracking-widest">
//               © {new Date().getFullYear()} Novashift Auto Dealers LLC
//             </p>
//             <p className="text-[10px] font-black text-[#003366] uppercase tracking-widest">
//               Licensed Washington Dealer
//             </p>
//           </div>
          
//           <div className="flex gap-6">
//             <Link href="/terms" className="text-[10px] font-black text-[#00284d] uppercase tracking-widest hover:text-white transition-colors">
//               Terms
//             </Link>
//             <Link href="/privacy" className="text-[10px] font-black text-[#00284d] uppercase tracking-widest hover:text-white transition-colors">
//               Privacy
//             </Link>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// }