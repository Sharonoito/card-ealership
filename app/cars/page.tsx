import Link from "next/link";
import { prisma } from "@/lib/prisma";
import CarCard from "../components/CarCard";

export const metadata = {
  title: "Available Inventory | Novashift Auto Dealers",
  description: "View our current inventory of premium pre-owned vehicles in Federal Way, WA.",
};

export default async function CarsPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    make?: string;
    minYear?: string;
  }>;
}) {
  const params = await searchParams;
  const where: any = { status: "AVAILABLE" };

  if (params.search) {
    where.OR = [
      { make: { contains: params.search, mode: "insensitive" } },
      { model: { contains: params.search, mode: "insensitive" } },
    ];
  }
  if (params.make) {
    where.make = { contains: params.make, mode: "insensitive" };
  }
  if (params.minYear) {
    where.year = { gte: parseInt(params.minYear) };
  }

  const cars = await prisma.car.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      
      {/* --- PAGE HEADER --- */}
      <header className="bg-slate-50 border-b border-slate-100 pt-20 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/"
            className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-emerald-600 transition-colors mb-6 inline-block"
          >
            ← Back to Home
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-none mb-4">
                Current <span className="text-emerald-500 italic font-serif lowercase">inventory</span>
              </h1>
              <p className="text-slate-500 font-medium">
                Showing {cars.length} {cars.length === 1 ? "premium vehicle" : "premium vehicles"} available for acquisition.
              </p>
            </div>
            <div className="bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100 flex items-center gap-2">
               <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">Live Auction Feed 2026</span>
            </div>
          </div>
        </div>
      </header>

      {/* --- FILTER BAR (Premium & Warm) --- */}
      <section className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <form className="flex flex-wrap lg:flex-nowrap gap-3">
            <div className="flex-1 min-w-[200px] relative group">
              <input
                name="search"
                defaultValue={params.search || ""}
                placeholder="Search make or model..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all group-hover:bg-white"
              />
            </div>
            
            <input
              name="make"
              defaultValue={params.make || ""}
              placeholder="All Makes"
              className="bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-sm font-medium lg:w-48 focus:outline-none focus:border-emerald-500 transition-all"
            />
            
            <input
              name="minYear"
              type="number"
              defaultValue={params.minYear || ""}
              placeholder="Min Year"
              className="bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-sm font-medium w-28 focus:outline-none focus:border-emerald-500 transition-all"
            />

            <button className="bg-slate-900 text-white px-8 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-emerald-600 transition-colors shadow-lg shadow-slate-900/10 active:scale-95">
              Refine Search
            </button>
            
            <Link
              href="/cars"
              className="bg-white border border-slate-200 text-slate-400 hover:text-slate-900 px-6 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all flex items-center justify-center"
            >
              Reset
            </Link>
          </form>
        </div>
      </section>

      {/* --- INVENTORY GRID --- */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        {cars.length === 0 ? (
          <div className="text-center py-32 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
            <div className="text-4xl mb-4">🔍</div>
            <p className="text-xl font-black text-slate-900 mb-2">No matching vehicles found</p>
            <p className="text-slate-500 mb-8 max-w-sm mx-auto font-medium">Try broadening your search or resetting the filters to see our full auction catalog.</p>
            <Link
              href="/cars"
              className="inline-block bg-emerald-500 text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-emerald-500/20"
            >
              Show All Cars
            </Link>
          </div>
        ) : (
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {cars.map((car) => (
              <div key={car.id} className="group">
                <CarCard car={car} />
                {/* Additional human-friendly detail below the card */}
                <div className="mt-4 flex items-center gap-2 px-2">
                   <span className="h-1 w-1 rounded-full bg-slate-300" />
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Clean WA Title Available
                   </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* --- TRUST FOOTER --- */}
      <section className="bg-slate-900 py-24 px-6 text-white overflow-hidden relative">
         <div className="max-w-4xl mx-auto text-center relative z-10">
            <h3 className="text-3xl font-black tracking-tighter mb-6">Can't find what you're looking for?</h3>
            <p className="text-slate-400 font-medium mb-10 leading-relaxed">
               Our auction network updates daily with thousands of vehicles from Manheim, ADESA, and DAA Seattle. 
               Tell us your specific requirements, and we'll source it directly.
            </p>
            <Link href="/contact-us" className="bg-emerald-500 text-slate-900 px-12 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-white transition-colors">
               Request Custom Search
            </Link>
         </div>
         {/* Subtle decoration */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-emerald-500/5 rounded-[100%] blur-[120px]" />
      </section>

    </div>
  );
}