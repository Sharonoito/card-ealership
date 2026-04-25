import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { logoutAction } from "@/app/actions/auth";
import DeleteCarButton from "./components/DeleteCarButton";

export const metadata = { title: "Inventory Control | Novashift Admin" };

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

export default async function AdminDashboard() {
  const cars = await prisma.car.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-emerald-100">
      {/* Premium Sticky Header */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link 
              href="/" 
              className="group text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-emerald-600 transition-all flex items-center gap-2"
            >
              <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span> 
              Portal
            </Link>
            <div className="h-4 w-[1px] bg-slate-200" />
            <h1 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em]">
              Inventory <span className="text-emerald-500 italic font-serif lowercase tracking-normal">Control</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <Link
              href="/admin/add"
              className="bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-950 transition-all shadow-lg shadow-emerald-100 active:scale-95"
            >
              + Register Asset
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors"
              >
                Exit
              </button>
            </form>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Statistics Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="h-[1px] w-8 bg-emerald-500" />
              <p className="text-[11px] font-black uppercase tracking-[0.4em] text-emerald-500">
                Current Holdings
              </p>
            </div>
            <h2 className="text-5xl font-black text-slate-900 tracking-tighter">
              Active <span className="italic font-serif text-emerald-500">Inventory.</span>
            </h2>
          </div>
          <div className="bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Total Assets: <span className="text-slate-900 ml-2">{cars.length} Units</span>
            </p>
          </div>
        </div>

        {cars.length === 0 ? (
          <div className="rounded-[3rem] border-2 border-dashed border-slate-100 py-32 text-center bg-slate-50/50">
            <p className="text-slate-400 font-medium mb-6">Database is currently empty.</p>
            <Link
              href="/admin/add"
              className="inline-block bg-slate-950 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl"
            >
              Initialize First Entry
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Asset Detail</th>
                    <th className="hidden px-6 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 sm:table-cell text-center">Year</th>
                    <th className="hidden px-6 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 md:table-cell">Usage</th>
                    <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Valuation</th>
                    <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Management</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {cars.map((car) => (
                    <tr key={car.id} className="group hover:bg-slate-50/80 transition-colors">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="relative h-14 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100 shadow-inner">
                            <Image
                              src={car.imageUrl}
                              alt={car.model}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                              sizes="80px"
                            />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-sm tracking-tight capitalize">
                              {car.make}
                            </p>
                            <p className="text-xs font-medium text-slate-400 uppercase tracking-tighter">
                              {car.model}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="hidden px-6 py-5 sm:table-cell text-center font-serif italic text-slate-500">
                        {car.year}
                      </td>
                      <td className="hidden px-6 py-5 md:table-cell text-xs font-bold text-slate-500 uppercase tracking-widest">
                        {car.mileage.toLocaleString()} <span className="text-[9px] text-slate-300">KM</span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-sm font-black text-slate-900">
                          {formatPrice(car.price)}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-widest ${
                          car.status === "AVAILABLE"
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                            : "bg-slate-100 text-slate-400 border border-slate-200"
                        }`}>
                          {car.status === "AVAILABLE" ? "• In Stock" : "Sold"}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/edit/${car.id}`}
                            className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:border-emerald-500 hover:text-emerald-600 transition-all shadow-sm"
                          >
                            Edit
                          </Link>
                          <DeleteCarButton carId={car.id} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}