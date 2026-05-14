import Link from "next/link";
import { notFound } from "next/navigation";
import { normalizeImageUrl } from "@/lib/imageUrls";
import { prisma } from "@/lib/prisma";
import { updateCar } from "@/app/actions/cars";
import CarForm from "../../components/CarForm";

export const metadata = { title: "Edit Asset | Novashift Admin" };

export default async function EditCarPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const car = await prisma.car.findUnique({
    where: { id },
    include: {
      images: { orderBy: { position: "asc" } },
    },
  });
  if (!car) notFound();

  const updateCarWithId = updateCar.bind(null, car.id);
  const imageUrls = car.images
    .map((image) => normalizeImageUrl(image.url))
    .filter(Boolean);
  const primaryImageUrl = imageUrls[0] ?? normalizeImageUrl(car.imageUrl);
  const interiorImageUrl = imageUrls[1] ?? "";
  const additionalImageUrls = imageUrls.slice(2);

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-[#0071d2]/10">
      {/* Premium Admin Header */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 py-6 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link 
            href="/admin" 
            className="group text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-[#005ba3] transition-all flex items-center gap-2"
          >
            <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span> 
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-4">
            <div className="hidden md:block text-[10px] font-bold text-slate-300 uppercase tracking-widest border-r border-slate-200 pr-4">
              Asset Modification
            </div>
            <div className="h-2 w-2 rounded-full bg-[#0071d2] animate-pulse" />
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-16 lg:py-24">
        {/* Header Section */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="h-[1px] w-8 bg-[#0071d2]" />
            <p className="text-[11px] font-black uppercase tracking-[0.4em] text-[#0071d2]">
              Update Record
            </p>
          </div>
          
          <h1 className="text-6xl font-black text-slate-900 tracking-tighter leading-[0.85] mb-8">
            Modify <br />
            <span className="text-[#0071d2] italic font-serif lowercase">
              {car.year} {car.model}.
            </span>
          </h1>
          
          <div className="grid md:grid-cols-2 gap-8 items-end">
            <p className="text-slate-500 font-medium leading-relaxed">
              You are currently editing the master record for the <span className="text-slate-900 font-bold">{car.make} {car.model}</span>. Changes will reflect instantly across all marketplace channels.
            </p>
            <div className="flex md:justify-end">
                <div className="px-4 py-2 bg-slate-50 rounded-full border border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Reference ID: #{car.id.slice(-6).toUpperCase()}
                </div>
            </div>
          </div>
        </div>

        {/* The Form Container */}
        <div className="relative">
          {/* Subtle Decorative Background Element */}
          <div className="absolute -top-12 -left-12 h-64 w-64 bg-[#0071d2]/5 rounded-full blur-3xl opacity-50 -z-10" />
          
          <div className="bg-slate-50/50 backdrop-blur-sm rounded-[3.5rem] p-10 md:p-16 border border-slate-100 shadow-2xl shadow-slate-200/50">
            <CarForm
              action={updateCarWithId}
              initialValues={{
                make: car.make,
                model: car.model,
                year: car.year,
                mileage: car.mileage,
                price: car.price,
                imageUrl: primaryImageUrl,
                status: car.status as "AVAILABLE" | "SOLD",
                bodyType: car.bodyType,
                transmission: car.transmission,
                fuelType: car.fuelType,
                condition: car.condition,
                exteriorColor: car.exteriorColor,
                interiorColor: car.interiorColor,
                trim: car.trim,
                drivetrain: car.drivetrain,
                engine: car.engine,
                vehicleHistory: car.vehicleHistory,
                gasMileage: car.gasMileage,
                isNew: car.isNew,
                features: car.features,
                interiorImageUrl,
                additionalImageUrls,
              }}
              submitLabel="Update Listing"
            />
          </div>
        </div>

        {/* Audit Info Footer */}
        <footer className="mt-16 pt-8 border-t border-slate-50">
          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em] text-center">
            Last Modified: {new Date().toLocaleDateString('en-GB')} • Novashift Secure Data Environment
          </p>
        </footer>
      </main>
    </div>
  );
}
