import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import CarCard from "./components/CarCard";

export default async function Home() {
  const cars = await prisma.car.findMany({ orderBy: { createdAt: "desc" } });
  const available = cars.filter((c) => c.status === "AVAILABLE");
  const featured = available.slice(0, 3);

  const brands = ["TOYOTA", "BMW", "AUDI", "MERCEDES", "NISSAN", "MAZDA", "LEXUS", "PORSCHE", "HONDA", "LAND ROVER"];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-emerald-100 overflow-x-hidden">
      
      {/* --- TOP BAR --- */}
      <div className="bg-slate-950 text-white py-3 text-[10px] font-black tracking-[0.4em] uppercase text-center border-b border-white/5">
        <span className="flex items-center justify-center gap-3">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Direct Wholesale Auction Access • Federal Way, WA
        </span>
      </div>

      {/* --- HERO --- */}
      <header className="relative h-[90vh] flex items-center bg-slate-900 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=90&w=2070"
          alt="Premium Vehicle"
          fill
          className="object-cover opacity-50 scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-3xl">
            <h1 className="text-7xl md:text-[110px] font-black text-white leading-[0.85] tracking-tighter mb-8 italic">
              Bid. Win.<br />
              <span className="text-emerald-500 not-italic">Drive.</span>
            </h1>
            <p className="text-xl text-slate-300 font-medium mb-10 max-w-lg">
              The modern way to acquire premium vehicles at wholesale dealer pricing.
            </p>
            <Link
              href="/cars"
              className="inline-block px-12 py-5 bg-emerald-600 text-white font-black uppercase text-xs tracking-widest rounded-full hover:bg-emerald-500 transition-all shadow-xl active:scale-95"
            >
              Explore Inventory
            </Link>
          </div>
        </div>
      </header>

      {/* --- STATS --- */}
      <section className="relative z-20 -mt-16 max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
          {[
            { label: "Listings", val: "150+" },
            { label: "Partners", val: "12" },
            { label: "Delivery", val: "5 Days" },
            { label: "Safety", val: "100%" },
          ].map((item, i) => (
            <div key={i} className="p-10 text-center border-r last:border-0 border-slate-50">
              <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{item.label}</span>
              <span className="text-2xl font-black text-slate-900">{item.val}</span>
            </div>
          ))}
        </div>
      </section>

      {/* --- PROCESS --- */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-24 text-center">
            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-emerald-600 mb-4">A Smarter Acquisition</h2>
            <p className="text-5xl font-black tracking-tighter text-slate-900">How we get you on the road.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-12">
            {[
              { step: "Browse", desc: "Access live auction data updated daily.", num: "01" },
              { step: "Deposit", desc: "Secure your bidding power instantly.", num: "02" },
              { step: "Bid", desc: "We win it at dealer price on your behalf.", num: "03" },
              { step: "Delivery", desc: "Professional detailing and home delivery.", num: "04" },
            ].map((item, i) => (
              <div key={i} className="group relative">
                <span className="text-3xl font-black text-emerald-600/20 mb-4 block">{item.num}</span>
                <h4 className="text-xl font-black text-slate-900 mb-2">{item.step}</h4>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- GREEN BRAND MARQUEE --- */}
      <section className="py-24 bg-emerald-600 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-12">
          <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-emerald-100 text-center">
            Preferred Manufacturers
          </h3>
        </div>
        <div className="relative flex overflow-x-hidden">
          <div className="animate-marquee flex whitespace-nowrap gap-20 items-center">
            {[...brands, ...brands].map((brand, i) => (
              <span key={i} className="text-3xl md:text-5xl font-black text-white/90 tracking-tighter hover:text-white transition-colors cursor-default">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* --- FEATURED INVENTORY (Cards Updated) --- */}
      <section className="py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h3 className="text-4xl font-black tracking-tighter text-slate-900">
                Featured <span className="text-emerald-500 italic font-serif lowercase">curations</span>
              </h3>
            </div>
            <Link href="/cars" className="text-xs font-black uppercase tracking-widest text-emerald-600 border-b-2 border-emerald-200 hover:border-emerald-500 pb-1 transition-all">
              View All
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {featured.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <div className="px-6 pb-24 bg-slate-50">
        <section className="max-w-7xl mx-auto rounded-[3rem] bg-slate-950 py-32 px-6 text-center relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-[1.1] mb-8">
              Ready for your <br />
              <span className="text-emerald-400">next vehicle?</span>
            </h2>
            <p className="text-slate-400 text-lg mb-12 font-medium">
              Join the hundreds of owners who skipped the dealership markup. 
              Our specialists are ready to guide you.
            </p>
            <Link href="/contact-us" className="inline-block bg-white text-slate-950 px-12 py-5 rounded-full font-black uppercase text-xs tracking-widest hover:bg-emerald-500 hover:text-white transition-all transform hover:scale-105 shadow-2xl">
              Start Consultation
            </Link>
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.08)_0%,transparent_70%)]" />
        </section>
      </div>
    </div>
  );
}

