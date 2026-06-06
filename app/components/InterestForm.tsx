"use client";

import { useActionState, useEffect, useRef } from "react";
import { sendVehicleInquiry } from "@/app/actions/contact";

export default function InterestForm({ carId, carModel }: { carId: string; carModel: string }) {
  const [state, formAction, isPending] = useActionState(sendVehicleInquiry, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    }
  }, [state]);

  if (state?.success) {
    return (
      <div className="bg-[#0071d2]/5 border border-[#0071d2]/10 rounded-[2rem] p-8 text-center animate-in fade-in zoom-in duration-500">
        <div className="h-10 w-10 bg-[#0071d2] rounded-full flex items-center justify-center mx-auto mb-4 text-white">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h3 className="text-[#00284d] font-black uppercase text-[10px] tracking-widest mb-1">Request Logged</h3>
        <p className="text-[#004a8c] text-xs font-medium">We will reach out about the {carModel}.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100 shadow-sm mt-8">
      <div className="mb-6">
        <h3 className="text-lg font-black text-slate-900 tracking-tight">Request Call-Back</h3>
        <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest">Market analysis & bidding strategy</p>
      </div>

      <form ref={formRef} action={formAction} className="space-y-4">
        <input type="hidden" name="carId" value={carId} />
        <input type="hidden" name="carModel" value={carModel} />

        {state?.error && (
          <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-xs font-bold text-red-700">
            {state.error}
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Your Name</label>
          <input
            name="name"
            required
            type="text"
            placeholder="John Doe"
            className="w-full bg-white rounded-xl border-none px-5 py-3.5 text-slate-900 placeholder:text-slate-300 focus:ring-2 focus:ring-[#0071d2] shadow-sm transition-all text-sm font-medium"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Email Address</label>
          <input
            name="email"
            required
            type="email"
            placeholder="john@example.com"
            className="w-full bg-white rounded-xl border-none px-5 py-3.5 text-slate-900 placeholder:text-slate-300 focus:ring-2 focus:ring-[#0071d2] shadow-sm transition-all text-sm font-medium"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Phone Number</label>
          <input
            name="phone"
            type="tel"
            placeholder="2069901808"
            className="w-full bg-white rounded-xl border-none px-5 py-3.5 text-slate-900 placeholder:text-slate-300 focus:ring-2 focus:ring-[#0071d2] shadow-sm transition-all text-sm font-medium"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Note</label>
          <textarea
            name="message"
            rows={3}
            placeholder="Preferred call time or questions"
            className="w-full bg-white rounded-xl border-none px-5 py-3.5 text-slate-900 placeholder:text-slate-300 focus:ring-2 focus:ring-[#0071d2] shadow-sm transition-all text-sm font-medium"
          />
        </div>

        <button
          disabled={isPending}
          type="submit"
          className="w-full bg-white border border-slate-200 text-slate-900 font-black uppercase text-[10px] tracking-[0.2em] py-4 rounded-xl hover:bg-slate-950 hover:text-white hover:border-slate-950 transition-all duration-300 active:scale-[0.98] disabled:opacity-50"
        >
          {isPending ? "Logging..." : "Submit Inquiry"}
        </button>
      </form>
    </div>
  );
}
