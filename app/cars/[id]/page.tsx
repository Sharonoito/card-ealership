import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ImageCarousel from "../../components/ImageCarousel";
import InterestForm from "../../components/InterestForm";

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const car = await prisma.car.findUnique({ where: { id } });
  if (!car) return { title: "Car Not Found" };
  return {
    title: `${car.year} ${car.make} ${car.model} | Novashift Auto`,
    description: `${car.year} ${car.make} ${car.model} — ${formatPrice(car.price)}`,
  };
}

export default async function CarDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const car = await prisma.car.findUnique({ where: { id } });
  if (!car) notFound();

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
  const contactPhone = process.env.NEXT_PUBLIC_CONTACT_PHONE ?? "";
  const priceFormatted = formatPrice(car.price);
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hi, I'm interested in the ${car.year} ${car.model} for ${priceFormatted}.`)}`;

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-emerald-100">
      {/* Sub-Header Nav */}
      <nav className="bg-slate-50 border-b border-slate-100 py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/cars" className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-emerald-600 transition-colors flex items-center gap-2">
            <span className="text-lg">←</span> Back to Inventory
          </Link>
          <div className="hidden md:block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
            Novashift Acquisition ID: #{car.id.slice(-6).toUpperCase()}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
        <div className="grid lg:grid-cols-12 gap-16 items-start">
          
          {/* LEFT: Visuals */}
          <div className="lg:col-span-7 space-y-8">
            <div className="rounded-[2.5rem] overflow-hidden bg-slate-100 shadow-2xl shadow-slate-200">
              <ImageCarousel 
                images={[car.imageUrl]} 
                alt={`${car.year} ${car.make} ${car.model}`} 
              />
            </div>
            
            {/* Condition Badges */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Title", val: "Guaranteed Clean" },
                { label: "Inspection", val: "Pass" },
                { label: "Bidding", val: "Active" }
              ].map((badge, i) => (
                <div key={i} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 text-center">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{badge.label}</p>
                  <p className="font-bold text-slate-900 text-sm">{badge.val}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Purchase Logic */}
          <div className="lg:col-span-5 lg:sticky lg:top-32">
            <div className="space-y-10">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 mb-6">
                  <span className={`h-2 w-2 rounded-full ${car.status === "AVAILABLE" ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`} />
                  <span className="text-emerald-700 text-[10px] font-black uppercase tracking-widest">
                    {car.status === "AVAILABLE" ? "Ready for Bid" : "Vehicle Sold"}
                  </span>
                </div>
                <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[0.9] mb-4">
                  {car.year} {car.make} <br />
                  <span className="text-emerald-500 italic font-serif lowercase">{car.model}</span>
                </h1>
                <p className="text-4xl font-black text-slate-950 tracking-tighter italic font-serif">
                  {priceFormatted}
                </p>
              </div>

              {/* Specs Grid */}
              <div className="py-10 border-y border-slate-100 grid grid-cols-2 gap-y-8 gap-x-12">
                {[
                  { label: "Mileage", val: `${car.mileage.toLocaleString()} mi` },
                  { label: "Market Status", val: "Auction Ready" },
                  { label: "Location", val: "Federal Way, WA" },
                  { label: "Condition", val: "Tier 1 Certified", highlight: true }
                ].map((spec, i) => (
                  <div key={i}>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{spec.label}</p>
                    <p className={`text-lg font-bold ${spec.highlight ? 'text-emerald-600' : 'text-slate-900'}`}>{spec.val}</p>
                  </div>
                ))}
              </div>

              {/* CTA Logic */}
              {car.status === "AVAILABLE" ? (
                <div className="space-y-6">
                  <div className="flex flex-col gap-3">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-emerald-600/20 active:scale-95"
                    >
                      Enquire via WhatsApp
                    </a>
                    
                    <a
                      href={`tel:${contactPhone}`}
                      className="flex items-center justify-center bg-slate-950 hover:bg-slate-800 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl active:scale-95"
                    >
                      Call Advisor
                    </a>
                  </div>
                  
                  <InterestForm carId={car.id} carModel={`${car.year} ${car.make} ${car.model}`} />
                </div>
              ) : (
                <div className="p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100 text-center">
                  <p className="text-slate-400 font-black uppercase text-xs tracking-widest mb-4">Acquisition Completed</p>
                  <Link href="/cars" className="inline-block text-emerald-600 font-black uppercase text-xs tracking-widest border-b-2 border-emerald-100 hover:border-emerald-600 transition-all pb-1">
                    See Current Inventory
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-6 py-24 border-t border-slate-100">
        <div className="grid md:grid-cols-3 gap-16">
          {[
            { title: "Auction Access.", desc: "We bid on your behalf at wholesale auctions." },
            { title: "Secure Funds.", desc: "Deposits are held in a separate Client Trust Account." },
            { title: "Full Transparency.", desc: "We disclose all auction fees and transport costs." }
          ].map((item, i) => (
            <div key={i} className="flex gap-6">
              <span className="text-emerald-500 font-black text-2xl italic font-serif">0{i+1}</span>
              <p className="text-sm text-slate-500 leading-relaxed">
                <span className="text-slate-900 font-black uppercase text-[10px] tracking-widest block mb-2">{item.title}</span> 
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
}

// import Image from "next/image";
// import Link from "next/link";
// import { notFound } from "next/navigation";
// import { prisma } from "@/lib/prisma";
// import ImageCarousel from "../../components/ImageCarousel";
// import InterestForm from "../../components/InterestForm";

// function formatPrice(price: number) {
//   return new Intl.NumberFormat("en-US", {
//     style: "currency",
//     currency: "USD",
//     maximumFractionDigits: 0,
//   }).format(price);
// }

// export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
//   const { id } = await params;
//   const car = await prisma.car.findUnique({ where: { id } });
//   if (!car) return { title: "Car Not Found" };
//   return {
//     title: `${car.year} ${car.make} ${car.model} | Novashift Auto`,
//     description: `${car.year} ${car.make} ${car.model} — ${formatPrice(car.price)}`,
//   };
// }

// export default async function CarDetailPage({ params }: { params: Promise<{ id: string }> }) {
//   const { id } = await params;
//   const car = await prisma.car.findUnique({ where: { id } });
//   if (!car) notFound();

//   const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
//   const contactPhone = process.env.NEXT_PUBLIC_CONTACT_PHONE ?? "";
//   const priceFormatted = formatPrice(car.price);
//   const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hi, I'm interested in the ${car.year} ${car.model} for ${priceFormatted}.`)}`;

//   return (
//     <div className="min-h-screen bg-white text-slate-900 font-sans">
//       {/* Sub-Header Nav */}
//       <nav className="bg-slate-50 border-b border-slate-100 py-4 px-6">
//         <div className="max-w-7xl mx-auto flex items-center justify-between">
//           <Link href="/cars" className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-emerald-600 transition-colors flex items-center gap-2">
//             <span className="text-lg">←</span> Back to Inventory
//           </Link>
//           <div className="hidden md:block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
//             Novashift Acquisition ID: #{car.id.slice(-6).toUpperCase()}
//           </div>
//         </div>
//       </nav>

//       <main className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
//         <div className="grid lg:grid-cols-12 gap-16 items-start">
          
//           {/* LEFT: The Visuals (7 Cols) */}
//           <div className="lg:col-span-7 space-y-8">
//             <div className="rounded-[2rem] overflow-hidden bg-slate-100 shadow-2xl shadow-slate-200">
//               <ImageCarousel 
//                 images={[car.imageUrl]} 
//                 alt={`${car.year} ${car.make} ${car.model}`} 
//               />
//             </div>
            
//             {/* Condition & Trust Badges */}
//             <div className="grid grid-cols-3 gap-4">
//               <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center">
//                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Title</p>
//                 <p className="font-bold text-slate-900">Guaranteed Clean</p>
//               </div>
//               <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center">
//                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Inspection</p>
//                 <p className="font-bold text-slate-900">Pass</p>
//               </div>
//               <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center">
//                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Bidding</p>
//                 <p className="font-bold text-slate-900">Active</p>
//               </div>
//             </div>
//           </div>

//           {/* RIGHT: The Purchase Logic (5 Cols) */}
//           <div className="lg:col-span-5 lg:sticky lg:top-32">
//             <div className="space-y-8">
//               {/* Header Info */}
//               <div>
//                 <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 mb-6">
//                   <span className={`h-2 w-2 rounded-full ${car.status === "AVAILABLE" ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`} />
//                   <span className="text-emerald-700 text-[10px] font-black uppercase tracking-widest">
//                     {car.status === "AVAILABLE" ? "Ready for Bid" : "Vehicle Sold"}
//                   </span>
//                 </div>
//                 <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-[0.9] mb-4">
//                   {car.year} {car.make} <br />
//                   <span className="text-emerald-500 italic font-serif lowercase">{car.model}</span>
//                 </h1>
//                 <p className="text-4xl font-black text-slate-900 tracking-tighter">
//                   {priceFormatted}
//                 </p>
//               </div>

//               {/* Specs List - Clean Grid */}
//               <div className="py-8 border-y border-slate-100 grid grid-cols-2 gap-y-6 gap-x-12">
//                 <div>
//                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mileage</p>
//                   <p className="text-lg font-bold text-slate-900">{car.mileage.toLocaleString()} miles</p>
//                 </div>
//                 <div>
//                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Market Status</p>
//                   <p className="text-lg font-bold text-slate-900">Auction Ready</p>
//                 </div>
//                 <div>
//                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</p>
//                   <p className="text-lg font-bold text-slate-900">Federal Way, WA</p>
//                 </div>
//                 <div>
//                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Required Deposit</p>
//                   <p className="text-lg font-bold text-emerald-600">Tier Applied</p>
//                 </div>
//               </div>

//               {/* CTA Area */}
//               {car.status === "AVAILABLE" ? (
//                 <div className="space-y-4">
//                   <p className="text-sm text-slate-500 leading-relaxed italic">
//                     Interested in this vehicle? Start the acquisition process by messaging our lead manager directly.
//                   </p>
                  
//                   <div className="flex flex-col gap-3">
//                     <a
//                       href={whatsappUrl}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-emerald-600/20"
//                     >
//                       Enquire via WhatsApp
//                     </a>
                    
//                     <a
//                       href={`tel:${contactPhone}`}
//                       className="flex items-center justify-center gap-3 bg-slate-900 hover:bg-slate-800 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-slate-900/10"
//                     >
//                       Call Advisor
//                     </a>
//                   </div>
                  
//                   <div className="pt-6">
//                     <InterestForm carId={car.id} carModel={`${car.year} ${car.make} ${car.model}`} />
//                   </div>
//                 </div>
//               ) : (
//                 <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 text-center">
//                   <p className="text-lg font-bold text-slate-400 mb-4">Acquisition Completed</p>
//                   <Link href="/cars" className="inline-block text-emerald-600 font-black uppercase text-xs tracking-widest border-b-2 border-emerald-100 hover:border-emerald-600 transition-all pb-1">
//                     See Current Inventory
//                   </Link>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </main>

//       {/* Trust Footer for Car Page */}
//       <footer className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-100">
//         <div className="grid md:grid-cols-3 gap-12">
//           <div className="flex gap-4">
//             <span className="text-emerald-500 font-bold text-xl">01</span>
//             <p className="text-sm text-slate-500"><span className="text-slate-900 font-bold">Auction Access.</span> We bid on your behalf at wholesale auctions.</p>
//           </div>
//           <div className="flex gap-4">
//             <span className="text-emerald-500 font-bold text-xl">02</span>
//             <p className="text-sm text-slate-500"><span className="text-slate-900 font-bold">Secure Funds.</span> Deposits are held in a separate Client Trust Account.</p>
//           </div>
//           <div className="flex gap-4">
//             <span className="text-emerald-500 font-bold text-xl">03</span>
//             <p className="text-sm text-slate-500"><span className="text-slate-900 font-bold">Full Transparency.</span> We disclose all auction fees and transport costs.</p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }