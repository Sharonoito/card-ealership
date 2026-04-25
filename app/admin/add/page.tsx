import Link from "next/link";
import { addCar } from "@/app/actions/cars";
import CarForm from "../components/CarForm";

export const metadata = { title: "Add Car | Novashift Admin" };

export default function AddCarPage() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-emerald-100">
      {/* Premium Admin Header */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 py-6 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link 
            href="/admin" 
            className="group text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-emerald-600 transition-all flex items-center gap-2"
          >
            <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span> 
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-4">
            <div className="hidden md:block text-[10px] font-bold text-slate-300 uppercase tracking-widest border-r border-slate-200 pr-4">
              Inventory Management
            </div>
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" title="System Active" />
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-16 lg:py-24">
        {/* Header Section */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="h-[1px] w-8 bg-emerald-500" />
            <p className="text-[11px] font-black uppercase tracking-[0.4em] text-emerald-500">
              New Acquisition
            </p>
          </div>
          
          <h1 className="text-6xl font-black text-slate-900 tracking-tighter leading-[0.85] mb-8">
            Register <br />
            <span className="text-emerald-500 italic font-serif lowercase">New Vehicle.</span>
          </h1>
          
          <div className="grid md:grid-cols-2 gap-8 items-end">
            <p className="text-slate-500 font-medium leading-relaxed">
              Populate the fields below to synchronize this vehicle with the global auction catalog. Double-check VIN-specific data before publishing.
            </p>
            <div className="flex md:justify-end">
                <div className="px-4 py-2 bg-slate-50 rounded-full border border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Step 1: Specification Entry
                </div>
            </div>
          </div>
        </div>

        {/* The Form Container */}
        <div className="relative">
          {/* Subtle Decorative Background Element */}
          <div className="absolute -top-12 -right-12 h-64 w-64 bg-emerald-50 rounded-full blur-3xl opacity-50 -z-10" />
          
          <div className="bg-slate-50/50 backdrop-blur-sm rounded-[3.5rem] p-10 md:p-16 border border-slate-100 shadow-2xl shadow-slate-200/50">
            <CarForm action={addCar} submitLabel="Publish to Inventory" />
          </div>
        </div>

        {/* Footer Support Info */}
        <footer className="mt-16 pt-8 border-t border-slate-50 flex flex-col md:flex-row justify-between gap-6">
          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
            Logged in as Administrator
          </p>
          <div className="flex gap-6">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-help hover:text-slate-600 transition-colors">Help Center</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-help hover:text-slate-600 transition-colors">Privacy Protocol</p>
          </div>
        </footer>
      </main>
    </div>
  );
}