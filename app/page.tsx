import { prisma } from "@/lib/prisma";
import HomeClient from "./HomeClient";

export default async function Home() {
  const cars = await prisma.car.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <HomeClient  />;
}


// import Image from "next/image";
// import Link from "next/link";
// import { prisma } from "@/lib/prisma";
// import CarCard from "./components/CarCard";

// export default async function Home() {
//   const cars = await prisma.car.findMany({ orderBy: { createdAt: "desc" } });
  
//   const available = cars.filter((c) => c.status === "AVAILABLE");
  
//   // Logical groupings for the UI
//   const newArrivals = available.slice(0, 3);
//   const clearance = available.filter((c) => c.price < 10000).slice(0, 6);
//   const topBrands = Array.from(new Set(available.map((c) => c.make))).slice(0, 6);

//   return (
//     // Changed bg-gray-950 to bg-slate-900 (Deep Forest/Slate mix)
//     <div className="min-h-screen bg-slate-900 text-slate-50 selection:bg-[#0071d2]/30">
      
//       {/* --- HERO SECTION --- */}
//       <header className="relative h-[85vh] w-full flex items-center justify-center overflow-hidden">
//         <div className="absolute inset-0 z-0">
//           <Image
//             src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=2070" 
//             alt="Luxury Car Background"
//             fill
//             className="object-cover opacity-40 scale-105 animate-slow-zoom"
//             priority
//           />
//           {/* Gradient now blends into Deep Slate/Emerald instead of black */}
//           <div className="absolute inset-0 bg-gradient-to-b from-slate-900/20 via-slate-900/60 to-slate-900" />
//         </div>

//         <div className="relative z-10 w-full max-w-5xl px-4 text-center">
//           {/* Changed bg-amber-500 to bg-[#0071d2] */}
//           <span className="inline-block px-4 py-1.5 mb-4 text-xs font-bold tracking-widest uppercase bg-[#0071d2] text-slate-900 rounded-full shadow-lg shadow-[#0071d2]/20">
//             Premium Inventory 2026
//           </span>
//           <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
//             Drive the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4a9fe6] to-teal-500">Extraordinary.</span>
//           </h1>
//           <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
//             Hand-picked, high-performance vehicles inspected for the most discerning drivers.
//           </p>

//           {/* Floating Search Bar with Glassmorphism */}
//           <div className="mx-auto max-w-4xl p-2 rounded-2xl bg-slate-800/40 backdrop-blur-xl border border-white/10 shadow-2xl">
//             <form className="flex flex-col md:flex-row gap-2">
//               <input
//                 type="text"
//                 placeholder="Search make, model, or year..."
//                 className="flex-[2] bg-slate-700/30 px-6 py-4 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0071d2]/50 transition-all border border-white/5"
//               />
//               <div className="h-10 w-[1px] bg-white/10 hidden md:block self-center" />
//               <select className="flex-1 bg-transparent px-4 py-4 text-slate-200 focus:outline-none cursor-pointer">
//                 <option className="bg-slate-800">All Brands</option>
//                 {topBrands.map(b => <option key={b} value={b} className="bg-slate-800">{b}</option>)}
//               </select>
//               {/* Button changed to Emerald */}
//               <button className="flex-1 bg-[#0071d2] hover:bg-[#4a9fe6] text-slate-900 font-bold py-4 px-8 rounded-xl transition-all active:scale-95 shadow-lg shadow-[#0071d2]/20">
//                 Find My Car
//               </button>
//             </form>
//           </div>
//         </div>
//       </header>

//       <main className="relative z-10 -mt-20 px-4 pb-20 max-w-7xl mx-auto space-y-32">
        
//         {/* --- TOP BRANDS --- */}
//         <section>
//           <div className="flex items-center justify-between mb-8">
//             <h2 className="text-2xl font-bold tracking-tight text-white">Browse by Brand</h2>
//             <Link href="/inventory" className="text-[#4a9fe6] hover:underline text-sm font-medium">View All</Link>
//           </div>
//           <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
//             {topBrands.map((brand) => (
//               <div key={brand} className="group cursor-pointer bg-slate-800/50 border border-white/5 rounded-2xl p-6 text-center hover:bg-slate-700/50 hover:border-[#0071d2]/50 transition-all shadow-md">
//                 <p className="text-lg font-semibold group-hover:text-[#4a9fe6] transition-colors">{brand}</p>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* --- NEW ARRIVALS --- */}
//         <section>
//           <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
//             <div>
//               <h2 className="text-4xl font-bold mb-2 text-white">New Arrivals</h2>
//               <p className="text-slate-400">The latest additions to our premium fleet, just landed this week.</p>
//             </div>
//             <Link href="/inventory" className="px-6 py-3 border border-[#0071d2]/30 text-[#4a9fe6] rounded-full hover:bg-[#0071d2]/10 transition-all">
//               Explore New Inventory
//             </Link>
//           </div>
//           <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
//             {newArrivals.map((car: any) => (
//               <div key={car.id} className="relative group">
//                 {/* Emerald Glow on hover */}
//                 <div className="absolute -inset-1 bg-gradient-to-r from-[#0071d2] to-teal-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
//                 <CarCard car={car} />
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* --- CLEARANCE SALE --- */}
//         <section className="bg-gradient-to-br from-slate-800 to-slate-900 border border-white/5 rounded-[3rem] p-8 md:p-16 shadow-inner">
//           <div className="flex items-center gap-4 mb-10">
//             <h2 className="text-4xl font-bold text-white">Clearance Deals</h2>
//             <span className="px-3 py-1 bg-[#0071d2]/20 text-[#4a9fe6] text-xs font-black uppercase rounded-md border border-[#0071d2]/30">Value Picks</span>
//           </div>
//           <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//             {clearance.map((car: any) => (
//               <CarCard key={car.id} car={car} />
//             ))}
//           </div>
//         </section>

//       </main>

//       {/* --- FOOTER --- */}
//       <footer className="border-t border-white/5 bg-slate-950/50 py-16 px-4">
//         <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
//           <div className="col-span-2">
//             <h3 className="text-2xl font-bold text-[#0071d2] mb-6 font-serif tracking-tight">NovaShift Auto</h3>
//             <p className="text-slate-400 max-w-sm leading-relaxed">
//               We specialize in the sourcing and sale of high-quality pre-owned vehicles. Quality, transparency, and speed are our core values.
//             </p>
//           </div>
//           <div>
//             <h4 className="font-bold mb-6 text-white">Quick Links</h4>
//             <ul className="space-y-4 text-slate-500">
//               <li><Link href="/inventory" className="hover:text-[#0071d2] transition-colors">Inventory</Link></li>
//               <li><Link href="/how-it-works" className="hover:text-[#0071d2] transition-colors">How It Works</Link></li>
//               <li><Link href="/contact" className="hover:text-[#0071d2] transition-colors">Contact</Link></li>
//             </ul>
//           </div>
//           <div>
//             <h4 className="font-bold mb-6 text-white">Support</h4>
//             <p className="text-slate-400 text-sm mb-2 font-medium">info@novashiftauto.com</p>
//             <p className="text-slate-500 text-sm">(555) 000-0000</p>
//           </div>
//         </div>
//         <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 text-center text-slate-600 text-sm">
//           © {new Date().getFullYear()} NovaShift Auto. All rights reserved.
//         </div>
//       </footer>
//     </div>
//   );
// }