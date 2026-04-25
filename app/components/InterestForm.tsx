"use client";

import React, { useState } from "react";

export default function InterestForm({ carId, carModel }: { carId: string; carModel: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setTimeout(() => setStatus("success"), 1500);
  };

  if (status === "success") {
    return (
      <div className="bg-emerald-50 border border-emerald-100 rounded-[2rem] p-8 text-center animate-in fade-in zoom-in duration-500">
        <div className="h-10 w-10 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h3 className="text-emerald-950 font-black uppercase text-[10px] tracking-widest mb-1">Request Logged</h3>
        <p className="text-emerald-700 text-xs font-medium">We'll reach out about the {carModel}.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100 shadow-sm mt-8">
      <div className="mb-6">
        <h3 className="text-lg font-black text-slate-900 tracking-tight">Request Call-Back</h3>
        <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest">Market analysis & bidding strategy</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Your Name</label>
          <input
            required
            type="text"
            placeholder="John Doe"
            className="w-full bg-white rounded-xl border-none px-5 py-3.5 text-slate-900 placeholder:text-slate-300 focus:ring-2 focus:ring-emerald-500 shadow-sm transition-all text-sm font-medium"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Contact Method</label>
          <input
            required
            type="text"
            placeholder="Email or Phone number"
            className="w-full bg-white rounded-xl border-none px-5 py-3.5 text-slate-900 placeholder:text-slate-300 focus:ring-2 focus:ring-emerald-500 shadow-sm transition-all text-sm font-medium"
          />
        </div>

        <button
          disabled={status === "loading"}
          type="submit"
          className="w-full bg-white border border-slate-200 text-slate-900 font-black uppercase text-[10px] tracking-[0.2em] py-4 rounded-xl hover:bg-slate-950 hover:text-white hover:border-slate-950 transition-all duration-300 active:scale-[0.98] disabled:opacity-50"
        >
          {status === "loading" ? "Logging..." : "Submit Inquiry"}
        </button>
      </form>
    </div>
  );
}