import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/app/generated/prisma/client";
import InventoryControls, { type SortKey } from "./InventoryControls";
// import CarInventoryClient from "./CarInventoryClient";

export const metadata = {
  title: "Available Inventory | Novashift Auto Dealers",
  description: "View our current inventory of premium pre-owned vehicles in Federal Way, WA.",
};

type InventoryCarRow = {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  imageUrl: string;
  status: "AVAILABLE" | "SOLD";
  createdAt: Date;
  isNew: boolean;
  gasMileage: string | null;
  bodyType: string | null;
  transmission: string | null;
  fuelType: string | null;
  condition: string | null;
  drivetrain: string | null;
  engine: string | null;
  trim: string | null;
  exteriorColor: string | null;
  interiorColor: string | null;
  vehicleHistory: string | null;
  features: string[];
  images?: Array<{ url: string }>;
};

type CarsSearchParams = {
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
  page?: string;
};

const PAGE_SIZE = 24;

function toSortKey(value: string | undefined): SortKey | undefined {
  const allowed: SortKey[] = [
    "newest",
    "availability",
    "price_asc",
    "price_desc",
    "mileage_asc",
  ];
  return value && allowed.includes(value as SortKey) ? (value as SortKey) : undefined;
}

function parseMulti(value: string | undefined) {
  return value
    ? value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    : [];
}

function parseNumber(value: string | undefined) {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function buildCarWhere(params: CarsSearchParams) {
  const where: Prisma.CarWhereInput = {};
  const and: Prisma.CarWhereInput[] = [];
  const search = params.search?.trim();

  if (search) {
    const searchYear = parseNumber(search);
    and.push({
      OR: [
        { make: { contains: search } },
        { model: { contains: search } },
        ...(searchYear ? [{ year: searchYear }] : []),
      ],
    });
  }

  const addInFilter = (key: keyof Prisma.CarWhereInput, raw: string | undefined) => {
    const values = parseMulti(raw);
    if (values.length) and.push({ [key]: { in: values } } as Prisma.CarWhereInput);
  };

  addInFilter("make", params.make);
  addInFilter("model", params.model);
  addInFilter("bodyType", params.bodyType);
  addInFilter("transmission", params.transmission);
  addInFilter("fuelType", params.fuelType);
  addInFilter("condition", params.condition);
  addInFilter("exteriorColor", params.exteriorColor);
  addInFilter("interiorColor", params.interiorColor);
  addInFilter("drivetrain", params.drivetrain);

  const minYear = parseNumber(params.minYear);
  const maxYear = parseNumber(params.maxYear);
  if (minYear !== undefined || maxYear !== undefined) {
    and.push({ year: { gte: minYear, lte: maxYear } });
  }

  const minPrice = parseNumber(params.minPrice);
  const maxPrice = parseNumber(params.maxPrice);
  if (minPrice !== undefined || maxPrice !== undefined) {
    and.push({ price: { gte: minPrice, lte: maxPrice } });
  }

  const minMileage = parseNumber(params.minMileage);
  const maxMileage = parseNumber(params.maxMileage);
  if (minMileage !== undefined || maxMileage !== undefined) {
    and.push({ mileage: { gte: minMileage, lte: maxMileage } });
  }

  if (params.isNew === "true" || params.isNew === "false") {
    and.push({ isNew: params.isNew === "true" });
  }

  if (params.engine?.trim()) and.push({ engine: { contains: params.engine.trim() } });
  if (params.trim?.trim()) and.push({ trim: { contains: params.trim.trim() } });

  const features = parseMulti(params.features);
  if (features.length) and.push({ features: { hasEvery: features } });

  const history = parseMulti(params.vehicleHistory);
  if (history.length) {
    and.push({
      AND: history.map((item) => ({ vehicleHistory: { contains: item } })),
    });
  }

  return and.length ? { ...where, AND: and } : where;
}

function buildOrderBy(sort: SortKey | undefined): Prisma.CarOrderByWithRelationInput {
  switch (sort) {
    case "price_asc":
      return { price: "asc" };
    case "price_desc":
      return { price: "desc" };
    case "mileage_asc":
      return { mileage: "asc" };
    case "availability":
    case "newest":
    default:
      return { createdAt: "desc" };
  }
}

export default async function CarsPage({
  searchParams,
}: {
  searchParams: Promise<CarsSearchParams>;
}) {
  const params = await searchParams;
  const sort = toSortKey(params.sort);
  const requestedPage = Math.max(1, parseNumber(params.page) ?? 1);
  const where = buildCarWhere(params);

  const [totalCars, optionCars] = await Promise.all([
    prisma.car.count({ where }),
    prisma.car.findMany({
      orderBy: { make: "asc" },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCars / PAGE_SIZE));
  const currentPage = Math.min(requestedPage, totalPages);

  const cars: InventoryCarRow[] = await prisma.car.findMany({
    where,
    orderBy: buildOrderBy(sort),
    include: {
      images: { orderBy: { position: "asc" }, take: 1 },
    },
    skip: (currentPage - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
  });

  // Dependent dropdown data (Make -> Models)
  const makes = Array.from(new Set(optionCars.map((c) => c.make))).sort();
  const modelsByMake: Record<string, string[]> = {};
  for (const m of makes) {
    modelsByMake[m] = Array.from(
      new Set(optionCars.filter((c) => c.make === m).map((c) => c.model))
    ).sort();
  }

  // Features universe for multi-select.
  const availableFeatures = Array.from(
    new Set(
      optionCars
        .flatMap((c) => c.features ?? [])
        .filter((x): x is string => typeof x === "string" && x.length > 0)
    )
  ).sort();

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-[#0071d2]/10">
      <header className="bg-slate-950 pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto">
          <Link
            href="/"
            className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-[#4a9fe6] transition-colors mb-6 inline-block"
          >
            ← Back to Home
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-5xl font-black text-white tracking-tighter leading-none mb-4">
                Current <span className="text-[#0071d2] italic font-serif lowercase">inventory</span>
              </h1>
              <p className="text-slate-400 font-medium">
                Showing {totalCars} {totalCars === 1 ? "premium vehicle" : "premium vehicles"} available for acquisition.
              </p>
            </div>
            <div className="bg-[#0071d2]/10 px-4 py-2 rounded-full border border-[#0071d2]/20 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#0071d2] animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-[#4a9fe6]">Live Auction Feed 2026</span>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,113,210,0.1)_0%,transparent_70%)]" />
      </header>

      <InventoryControls
        cars={cars.map((c) => ({
          id: c.id,
          make: c.make,
          model: c.model,
          year: c.year,
          price: c.price,
          mileage: c.mileage,
          imageUrl: c.images?.[0]?.url ?? c.imageUrl,
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
        filterCars={optionCars.map((c) => ({
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
          sort: toSortKey(params.sort),
        }}
        currentPage={currentPage}
        pageSize={PAGE_SIZE}
        totalCars={totalCars}
        totalPages={totalPages}
      />
    </div>
  );
}
