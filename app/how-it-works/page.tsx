import Link from "next/link";

export const metadata = {
  title: "How It Works | Novashift Auto Dealers",
};

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* --- HERO SECTION --- */}
      <section className="bg-slate-50 pt-24 pb-32 px-6 border-b border-slate-100">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-emerald-600 font-black uppercase tracking-[0.3em] text-xs mb-4 block">
            Acquisition Simplified
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[0.9] mb-8">
            Ownership starts with <br />
            <span className="text-emerald-500 italic font-serif">transparency.</span>
          </h1>
          <p className="text-xl text-slate-500 leading-relaxed font-medium max-w-2xl mx-auto">
            Buying from wholesale auctions shouldn't feel like a gamble. We’ve refined our process to keep you protected, informed, and ahead of the curve.
          </p>
        </div>
      </section>

      {/* --- THE STEPS --- */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-20">
          
          {/* Left Side: Sticky Info */}
          <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit">
            <h2 className="text-3xl font-black text-slate-900 mb-6">The Novashift <br/>Standard.</h2>
            <p className="text-slate-500 mb-8 leading-relaxed">
              Every vehicle we bid on follows the same rigorous verification process. We treat your investment like our own.
            </p>
            <div className="p-8 bg-emerald-50 rounded-[2rem] border border-emerald-100">
               <p className="text-emerald-900 font-bold text-sm mb-2">Our Promise</p>
               <p className="text-emerald-700 text-sm leading-relaxed">
                 "If we don't win the bid, your deposit is back in your account within 48 hours. No fees, no excuses."
               </p>
            </div>
          </div>

          {/* Right Side: The Journey */}
          <div className="lg:col-span-8 space-y-24">
            
            {/* Step 1 */}
            <div className="flex gap-8 md:gap-12 group">
              <div className="text-6xl font-black text-slate-100 group-hover:text-emerald-500 transition-colors duration-500">01</div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Select Your Vehicle</h3>
                <p className="text-slate-500 leading-relaxed text-lg">
                  Browse our hand-picked auction listings. We don't just show you a price; we provide a <span className="text-slate-900 font-bold">Total Acquisition Cost (TAC)</span> estimate so there are no surprises at the finish line.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-8 md:gap-12 group">
              <div className="text-6xl font-black text-slate-100 group-hover:text-emerald-500 transition-colors duration-500">02</div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Secure Your Intent</h3>
                <p className="text-slate-500 leading-relaxed text-lg mb-6">
                  Per Washington law, your deposit is held in a protected <span className="text-slate-900 font-bold">Client Trust Account</span>. This confirms your bidding authority and secures our commitment to you.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-[10px] font-black uppercase text-slate-400">Under $15k</p>
                    <p className="font-bold text-slate-900">60% Deposit</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-[10px] font-black uppercase text-slate-400">$15k - $25k</p>
                    <p className="font-bold text-slate-900">75% Deposit</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-[10px] font-black uppercase text-slate-400">High-Mile</p>
                    <p className="font-bold text-slate-900">50% Deposit</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-8 md:gap-12 group">
              <div className="text-6xl font-black text-slate-100 group-hover:text-emerald-500 transition-colors duration-500">03</div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">The Auction Room</h3>
                <p className="text-slate-500 leading-relaxed text-lg">
                  Our licensed dealers attend the auction—whether it's DAA Seattle, Manheim, or ADESA. We bid strategically, never exceeding your authorized limit. We act as your eyes and ears on the floor.
                </p>
              </div>
            </div>

            {/* Step 4: Split Outcome */}
            <div className="bg-slate-900 rounded-[3rem] p-8 md:p-16 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
              <div className="relative z-10 grid md:grid-cols-2 gap-12">
                <div>
                  <div className="text-emerald-400 font-black text-xs uppercase tracking-[0.2em] mb-4">Outcome A</div>
                  <h4 className="text-2xl font-bold mb-4">If We Win</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Celebrations are in order. We notify you immediately. Once the balance is cleared, we handle the paperwork and delivery. You'll have your car, clean title, and tags within 5-7 business days.
                  </p>
                </div>
                <div className="border-t md:border-t-0 md:border-l border-white/10 pt-8 md:pt-0 md:pl-12">
                  <div className="text-slate-400 font-black text-xs uppercase tracking-[0.2em] mb-4">Outcome B</div>
                  <h4 className="text-2xl font-bold mb-4">If We Lose</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    No sweat. If we get outbid or the price exceeds your TAC, you get a 100% refund of your deposit within 2 business days. No hidden fees, no "processing" costs.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- REASSURANCE SECTION --- */}
      <section className="bg-slate-50 py-32 px-6">
        <div className="max-w-7xl mx-auto border-t border-slate-200 pt-20">
          <div className="grid md:grid-cols-2 gap-20 items-center">
             <div>
                <h3 className="text-4xl font-black text-slate-900 tracking-tight mb-8">
                  A partnership <br/> built on <span className="text-emerald-500">legal safety.</span>
                </h3>
                <ul className="space-y-6">
                  {[
                    "Client Trust Account protection under WA Law",
                    "Licensed, Bonded, and Insured Dealership",
                    "Clean Title Guarantee on every acquisition",
                    "Full Disclosure of known mechanical defects"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-4 text-slate-600 font-medium">
                      <span className="text-emerald-500 mt-1">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
             </div>
             
             <div className="bg-white p-12 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
                <p className="font-black text-xs uppercase tracking-widest text-slate-400 mb-6">Novashift HQ</p>
                <p className="text-2xl font-bold text-slate-900 mb-2">Federal Way, Washington</p>
                <p className="text-slate-500 mb-10">1505 S 356th St, Federal Way, WA 98003</p>
                
                <Link href="/cars" className="block text-center bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-emerald-600 transition-colors">
                  Find Your Car Today
                </Link>
             </div>
          </div>
        </div>
      </section>

    </div>
  );
}