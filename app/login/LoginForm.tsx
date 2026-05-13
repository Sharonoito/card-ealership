"use client";

import { useActionState } from "react";
import { loginAction } from "../actions/auth";

// Consistent styling constants
const inputStyles = "w-full bg-slate-100/50 rounded-2xl border border-slate-200/60 px-6 py-4 text-slate-900 placeholder:text-slate-300 focus:bg-white focus:ring-2 focus:ring-[#0071d2]/20 focus:border-[#0071d2] shadow-inner transition-all text-sm font-medium outline-none";
const labelStyles = "text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1 mb-2 block";

export default function LoginForm() {
  const [error, formAction, isPending] = useActionState(loginAction, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {error && (
        <div className="rounded-2xl bg-red-50 border border-red-100 px-6 py-4 text-[10px] font-black text-red-600 uppercase tracking-[0.2em] animate-in fade-in slide-in-from-top-2">
          {error}
        </div>
      )}

      <div className="flex flex-col">
        <label htmlFor="username" className={labelStyles}>
          Identity <span className="text-[#0071d2]">/ User</span>
        </label>
        <input
          id="username"
          name="username"
          type="text"
          required
          autoComplete="username"
          className={inputStyles}
          placeholder="admin"
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="password" className={labelStyles}>
          Access Key <span className="text-[#0071d2]">/ Password</span>
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className={inputStyles}
          placeholder="••••••••"
        />
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="group w-full flex items-center justify-center gap-3 bg-slate-950 text-white font-black uppercase text-[10px] tracking-[0.3em] py-6 px-12 rounded-2xl hover:bg-[#005ba3] transition-all shadow-2xl shadow-slate-200 active:scale-95 disabled:opacity-60"
        >
          {isPending ? "Authenticating..." : "Authorize Access"}
          <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
        </button>
      </div>
      
      <p className="text-[9px] text-slate-300 font-bold uppercase tracking-[0.2em] text-center mt-4">
        Secure Encryption Active
      </p>
    </form>
  );
}