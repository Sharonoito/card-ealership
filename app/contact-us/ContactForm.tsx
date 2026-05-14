"use client";

import { useActionState, useEffect, useRef } from "react";
import { sendContactMessage } from "@/app/actions/contact";

const inputClass =
  "w-full bg-white rounded-2xl border-none px-6 py-4 text-slate-900 placeholder:text-slate-300 focus:ring-2 focus:ring-[#0071d2] shadow-sm transition-all outline-none";
const labelClass =
  "text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1";

export default function ContactForm() {
  const [state, formAction, isPending] = useActionState(sendContactMessage, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-8">
      {state?.error && (
        <div className="rounded-2xl bg-red-50 border border-red-100 px-5 py-4 text-sm font-bold text-red-700">
          {state.error}
        </div>
      )}

      {state?.success && (
        <div className="rounded-2xl bg-emerald-50 border border-emerald-100 px-5 py-4 text-sm font-bold text-emerald-700">
          Message sent. We will get back to you shortly.
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label htmlFor="name" className={labelClass}>
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="John Doe"
            className={inputClass}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className={labelClass}>
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="john@example.com"
            className={inputClass}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="phone" className={labelClass}>
          Phone Number
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          placeholder="2069901808"
          className={inputClass}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="inquiryType" className={labelClass}>
          Inquiry Type
        </label>
        <select
          id="inquiryType"
          name="inquiryType"
          required
          defaultValue="New Vehicle Acquisition"
          className={`${inputClass} appearance-none`}
        >
          <option>New Vehicle Acquisition</option>
          <option>Auction Deposit Help</option>
          <option>Selling a Vehicle</option>
          <option>General Inquiry</option>
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className={labelClass}>
          Your Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          placeholder="Tell us about the vehicle you're looking for..."
          className={inputClass}
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-slate-950 text-white font-black uppercase text-xs tracking-[0.2em] py-5 rounded-2xl hover:bg-[#005ba3] transition-all shadow-xl active:scale-95 disabled:opacity-60"
      >
        {isPending ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
