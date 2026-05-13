import Link from "next/link";
import { prisma } from "@/lib/prisma";
import InventoryControls from "./InventoryControls";
// import CarInventoryClient from "./CarInventoryClient";

export const metadata = {
  title: "Available Inventory | Novashift Auto Dealers",
  description: "View our current inventory of premium pre-owned vehicles in Federal Way, WA.",
};

export default async function CarsPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    make?: string;
    model?: string;
    minYear?: string;
    maxYear?: string;
    minPrice?: string;
    maxPrice?: string;
    minMileage?: string;
    maxMileage?: string;
    bodyType?: string;
    transmission?: string;
    fuelType?: string;
    condition?: string;
    exteriorColor?: string;
    interiorColor?: string;
    trim?: string;
    drivetrain?: string;
    engine?: string;
    features?: string;
    vehicleHistory?: string;
    gasMileage?: string;
    isNew?: string;
    sort?: string;
  }>;
}) {
  const params = await searchParams;

  // Fetch once for no-reload filtering/sorting.
  const cars = await prisma.car.findMany({
    where: { status: "AVAILABLE" },
    orderBy: { createdAt: "desc" },
  });

  // Dependent dropdown data (Make -> Models)
  const makes = Array.from(new Set(cars.map((c) => c.make))).sort();
  const modelsByMake: Record<string, string[]> = {};
  for (const m of makes) {
    modelsByMake[m] = Array.from(
      new Set(cars.filter((c) => c.make === m).map((c) => c.model))
    ).sort();
  }

  // Features universe for multi-select.
  const availableFeatures = Array.from(
    new Set(
      cars
        .flatMap((c) => c.features ?? [])
        .filter((x): x is string => typeof x === "string" && x.length > 0)
    )
  ).sort();

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <header className="bg-slate-50 border-b border-slate-100 pt-20 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/"
            className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-[#005ba3] transition-colors mb-6 inline-block"
          >
            ← Back to Home
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-none mb-4">
                Current <span className="text-[#0071d2] italic font-serif lowercase">inventory</span>
              </h1>
              <p className="text-slate-500 font-medium">
                Showing {cars.length} {cars.length === 1 ? "premium vehicle" : "premium vehicles"} available for acquisition.
              </p>
            </div>
            <div className="bg-[#0071d2]/5 px-4 py-2 rounded-full border border-[#0071d2]/10 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#0071d2] animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-[#004a8c]">Live Auction Feed 2026</span>
            </div>
          </div>
        </div>
      </header>

      <InventoryControls
        cars={cars.map((c) => ({
          id: c.id,
          make: c.make,
          model: c.model,
          year: c.year,
          price: c.price,
          mileage: c.mileage,
          imageUrl: c.imageUrl,
          status: c.status,
          createdAt: c.createdAt,
          isNew: c.isNew,
          gasMileage: c.gasMileage ?? null,
          bodyType: c.bodyType ?? null,
          transmission: c.transmission ?? null,
          fuelType: c.fuelType ?? null,
          condition: c.condition ?? null,
          drivetrain: c.drivetrain ?? null,
          engine: c.engine ?? null,
          trim: c.trim ?? null,
          exteriorColor: c.exteriorColor ?? null,
          interiorColor: c.interiorColor ?? null,
          vehicleHistory: c.vehicleHistory ?? null,
          features: (c.features ?? []) as string[],
        }))}
        makes={makes}
        modelsByMake={modelsByMake}
        availableFeatures={availableFeatures}
        initialSearchParams={{
          search: params.search,
          make: params.make,
          model: params.model,
          minYear: params.minYear,
          maxYear: params.maxYear,
          minPrice: params.minPrice,
          maxPrice: params.maxPrice,
          minMileage: params.minMileage,
          maxMileage: params.maxMileage,
          bodyType: params.bodyType,
          transmission: params.transmission,
          fuelType: params.fuelType,
          condition: params.condition,
          exteriorColor: params.exteriorColor,
          interiorColor: params.interiorColor,
          trim: params.trim,
          drivetrain: params.drivetrain,
          engine: params.engine,
          features: params.features,
          vehicleHistory: params.vehicleHistory,
          gasMileage: params.gasMileage,
          isNew: params.isNew,
          sort: (params.sort as any) ?? undefined,
        }}
      />
    </div>
  );
}