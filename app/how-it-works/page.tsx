export const metadata = {
  title: "How It Works | Novashift Auto Dealers",
};

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-[#0071d2]/10">
      {/* --- HERO SECTION --- */}
      <section className="bg-slate-950 pt-32 pb-24 px-6 text-center relative overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto">
          <span className="text-[#0071d2] font-black uppercase tracking-[0.6em] text-[11px] mb-6 block">
            Acquisition Simplified
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[0.9] mb-8">
            Ownership starts with <br />
            <span className="text-[#4a9fe6] italic font-serif">transparency.</span>
          </h1>
          <p className="text-xl text-slate-400 leading-relaxed font-medium max-w-2xl mx-auto">
            Buying from wholesale auctions shouldn&apos;t feel like a gamble. We’ve refined our process to keep you protected, informed, and ahead of the curve.
          </p>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,113,210,0.1)_0%,transparent_70%)]" />
      </section>

      {/* --- THE STEPS --- */}
      <section className="py-16 md:py-32 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">

          {/* Left Side: Sticky Info */}
          <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-6">The Novashift <br/>Standard.</h2>
            <p className="text-slate-500 mb-8 leading-relaxed">
              A simple, clear process from browsing to purchase—so you always know what to expect.
            </p>
            <div className="p-6 sm:p-8 bg-[#0071d2]/5 rounded-[2rem] border border-[#0071d2]/10">
              <p className="text-[#003366] font-bold text-sm mb-2">Our Promise</p>
              <p className="text-[#004a8c] text-sm leading-relaxed">
                Transparent communication and support at every step.
              </p>
            </div>
          </div>

          {/* Right Side: The Journey */}
          <div className="lg:col-span-8 space-y-14 sm:space-y-24">

            {/* Step 1 */}
            <div className="flex gap-6 md:gap-12 group">
              <div className="text-5xl sm:text-6xl font-black text-slate-100 group-hover:text-[#0071d2] transition-colors duration-500 shrink-0">01</div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 sm:mb-4">Browse Our Inventory</h3>
                <p className="text-slate-500 leading-relaxed text-base sm:text-lg">
                  Explore our available vehicles and see the listings that match what you want.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-6 md:gap-12 group">
              <div className="text-5xl sm:text-6xl font-black text-slate-100 group-hover:text-[#0071d2] transition-colors duration-500 shrink-0">02</div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 sm:mb-4">Select a Vehicle That Fits</h3>
                <p className="text-slate-500 leading-relaxed text-base sm:text-lg">
                  Choose the vehicle that fits your needs and budget.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-6 md:gap-12 group">
              <div className="text-5xl sm:text-6xl font-black text-slate-100 group-hover:text-[#0071d2] transition-colors duration-500 shrink-0">03</div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 sm:mb-4">Contact Us</h3>
                <p className="text-slate-500 leading-relaxed text-base sm:text-lg">
                  Reach out for questions or to schedule a viewing.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-6 md:gap-12 group">
              <div className="text-5xl sm:text-6xl font-black text-slate-100 group-hover:text-[#0071d2] transition-colors duration-500 shrink-0">04</div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 sm:mb-4">Inspect the Vehicle</h3>
                <p className="text-slate-500 leading-relaxed text-base sm:text-lg">
                  Inspect the vehicle or request a pre-purchase inspection.
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="flex gap-6 md:gap-12 group">
              <div className="text-5xl sm:text-6xl font-black text-slate-100 group-hover:text-[#0071d2] transition-colors duration-500 shrink-0">05</div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 sm:mb-4">Complete the Purchase</h3>
                <p className="text-slate-500 leading-relaxed text-base sm:text-lg">
                  Finalize the purchase process and get ready for your vehicle.
                </p>
              </div>
            </div>

            {/* Step 6 */}
            <div className="bg-slate-900 rounded-[2rem] sm:rounded-[3rem] p-8 md:p-16 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#0071d2]/10 rounded-full blur-3xl" />
              <div className="relative z-10">
                <div className="text-[#4a9fe6] font-black text-xs uppercase tracking-[0.2em] mb-4">06</div>
                <h4 className="text-2xl font-bold mb-4">Maintenance Support After Purchase</h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Need help after you buy? Get connected to our maintenance support team. Call us at{' '}
                  <a className="text-white font-bold hover:text-[#4a9fe6] transition-colors" href="tel:2069901808">(206) 990-1808</a>.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
