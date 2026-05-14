import Image from "next/image";
import Link from "next/link";
import { isRemoteImageUrl, normalizeImageUrl } from "@/lib/imageUrls";

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

interface CarCardProps {
  car: {
    id: string;
    make: string;
    model: string;
    year: number;
    price: number;
    imageUrl: string;
    status: string;
  };
}

export default function CarCard({ car }: CarCardProps) {
  const imageUrl = normalizeImageUrl(car.imageUrl);

  return (
    <Link
      href={`/cars/${car.id}`}
      className="group block overflow-hidden rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200 transition-all duration-500 hover:scale-[1.01]"
    >
      {/* Image Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
        <Image
          src={imageUrl}
          alt={`${car.year} ${car.make} ${car.model}`}
          fill
          unoptimized={isRemoteImageUrl(imageUrl)}
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        
        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-md transition-colors ${
            car.status === "SOLD" 
            ? "bg-slate-900/60 text-slate-300" 
            : "bg-[#0071d2]/90 text-white"
          }`}>
            {car.status}
          </span>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-6">
        <div className="flex flex-col gap-1">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#005ba3]">
            {car.year} {car.make}
          </p>
          <h3 className="text-xl font-black text-slate-900 tracking-tight group-hover:text-[#005ba3] transition-colors">
            {car.model}
          </h3>
        </div>

        <div className="mt-6 pt-5 border-t border-slate-50 flex justify-between items-end">
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Starting Bid</span>
            <p className="text-2xl font-black text-slate-950 italic font-serif">
              {formatPrice(car.price)}
            </p>
          </div>
          
          <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-[#005ba3] group-hover:text-white transition-all duration-300">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
