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
          <span className="text-[#005ba3] font-black uppercase tracking-[0.3em] text-xs mb-4 block">
            Acquisition Simplified
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[0.9] mb-8">
            Ownership starts with <br />
            <span className="text-[#0071d2] italic font-serif">transparency.</span>
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
              A simple, clear process from browsing to purchase—so you always know what to expect.
            </p>
            <div className="p-8 bg-[#0071d2]/5 rounded-[2rem] border border-[#0071d2]/10">
              <p className="text-[#003366] font-bold text-sm mb-2">Our Promise</p>
              <p className="text-[#004a8c] text-sm leading-relaxed">
                Transparent communication and support at every step.
              </p>
            </div>
          </div>

          {/* Right Side: The Journey */}
          <div className="lg:col-span-8 space-y-24">
            
            {/* Step 1 */}
            <div className="flex gap-8 md:gap-12 group">
              <div className="text-6xl font-black text-slate-100 group-hover:text-[#0071d2] transition-colors duration-500">01</div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Browse Our Inventory</h3>
                <p className="text-slate-500 leading-relaxed text-lg">
                  Explore our available vehicles and see the listings that match what you want.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-8 md:gap-12 group">
              <div className="text-6xl font-black text-slate-100 group-hover:text-[#0071d2] transition-colors duration-500">02</div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Select a Vehicle That Fits</h3>
                <p className="text-slate-500 leading-relaxed text-lg">
                  Choose the vehicle that fits your needs and budget.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-8 md:gap-12 group">
              <div className="text-6xl font-black text-slate-100 group-hover:text-[#0071d2] transition-colors duration-500">03</div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Contact Us</h3>
                <p className="text-slate-500 leading-relaxed text-lg">
                  Reach out for questions or to schedule a viewing.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-8 md:gap-12 group">
              <div className="text-6xl font-black text-slate-100 group-hover:text-[#0071d2] transition-colors duration-500">04</div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Inspect the Vehicle</h3>
                <p className="text-slate-500 leading-relaxed text-lg">
                  Inspect the vehicle or request a pre-purchase inspection.
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="flex gap-8 md:gap-12 group">
              <div className="text-6xl font-black text-slate-100 group-hover:text-[#0071d2] transition-colors duration-500">05</div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Complete the Purchase</h3>
                <p className="text-slate-500 leading-relaxed text-lg">
                  Finalize the purchase process and get ready for your vehicle.
                </p>
              </div>
            </div>

            {/* Step 6 */}
            <div className="bg-slate-900 rounded-[3rem] p-8 md:p-16 text-white relative overflow-hidden">
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

      {/* --- REASSURANCE SECTION --- */}
      <section className="bg-slate-50 py-32 px-6">
        <div className="max-w-7xl mx-auto border-t border-slate-200 pt-20">
          <div className="grid md:grid-cols-2 gap-20 items-center">
             <div>
                <h3 className="text-4xl font-black text-slate-900 tracking-tight mb-8">
                  A partnership <br/> built on <span className="text-[#0071d2]">legal safety.</span>
                </h3>
                <ul className="space-y-6">
                  {[
                    "Client Trust Account protection under WA Law",
                    "Licensed, Bonded, and Insured Dealership",
                    "Clean Title Guarantee on every acquisition",
                    "Full Disclosure of known mechanical defects"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-4 text-slate-600 font-medium">
                      <span className="text-[#0071d2] mt-1">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
             </div>
             
             <div className="bg-white p-12 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
                <p className="font-black text-xs uppercase tracking-widest text-slate-400 mb-6">Novashift HQ</p>
                <p className="text-2xl font-bold text-slate-900 mb-2">Federal Way, Washington</p>
                <p className="text-slate-500 mb-10">1505 S 356th St, Federal Way, WA 98003</p>
                
                <Link href="/cars" className="block text-center bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#005ba3] transition-colors">
                  Find Your Car Today
                </Link>
             </div>
          </div>
        </div>
      </section>

    </div>
  );
}