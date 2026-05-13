"use client";

import { useMemo, useReducer, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import CarCard from "../components/CarCard";

export type SortKey =
  | "newest"
  | "availability"
  | "price_asc"
  | "price_desc"
  | "mileage_asc";

type FiltersState = {
  search: string;
  make: string;
  model: string;
  yearMin: string;
  yearMax: string;
  isNew: string; // "" | "true" | "false"
  condition: string;

  priceMin: string;
  priceMax: string;
  mileageMin: string;
  mileageMax: string;

  gasMileageMin: string;
  gasMileageMax: string;

  bodyType: string;
  transmission: string;
  fuelType: string;
  drivetrain: string;
  engine: string;
  trim: string;

  exteriorColor: string;
  interiorColor: string;

  features: string[];
  vehicleHistory: string;
  // Availability split is inferred from car.status
};

type FiltersAction =
  | { type: "INIT_FROM_URL"; payload: Partial<FiltersState> }
  | { type: "SET"; key: keyof FiltersState; value: FiltersState[keyof FiltersState] }
  | { type: "CLEAR_ALL" }
  | { type: "SET_FEATURES"; payload: string[] }
  | { type: "REMOVE_PILL"; key: keyof FiltersState };

const defaultState: FiltersState = {
  search: "",
  make: "",
  model: "",
  yearMin: "",
  yearMax: "",
  isNew: "",
  condition: "",

  priceMin: "",
  priceMax: "",
  mileageMin: "",
  mileageMax: "",

  gasMileageMin: "",
  gasMileageMax: "",

  bodyType: "",
  transmission: "",
  fuelType: "",
  drivetrain: "",
  engine: "",
  trim: "",

  exteriorColor: "",
  interiorColor: "",

  features: [],
  vehicleHistory: "",
};

function parseInitialFeatures(raw: string | undefined) {
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function reducer(state: FiltersState, action: FiltersAction): FiltersState {
  switch (action.type) {
    case "INIT_FROM_URL":
      return { ...state, ...action.payload };
    case "SET":
      return { ...state, [action.key]: action.value };
    case "SET_FEATURES":
      return { ...state, features: action.payload };
    case "REMOVE_PILL": {
      if (action.key === "features") return { ...state, features: [] };
      if (action.key === "make") return { ...state, make: "", model: "" };
      return { ...state, [action.key]: "" } as FiltersState;
    }
    case "CLEAR_ALL":
      return { ...defaultState, features: [] };
    default:
      return state;
  }
}

type Car = {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  gasMileage: string | null;
  imageUrl: string;
  status: "AVAILABLE" | "SOLD";
  createdAt: Date;

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
  isNew: boolean;
};

type Props = {
  cars: Car[];
  makes: string[];
  modelsByMake: Record<string, string[]>;
  availableFeatures: string[];
  initialSearchParams?: {
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
    sort?: SortKey;
  };
};

function matchesNumberRange(value: number, minStr: string, maxStr: string) {
  const min = minStr ? Number(minStr) : undefined;
  const max = maxStr ? Number(maxStr) : undefined;
  if (min !== undefined && !Number.isNaN(min) && value < min) return false;
  if (max !== undefined && !Number.isNaN(max) && value > max) return false;
  return true;
}

function parseGasMileageToNumber(gasMileage: string | null): number | null {
  // Accepts strings like "25/32 MPG" or "25 MPG".
  if (!gasMileage) return null;
  const m = gasMileage.match(/\d+(?:\.\d+)?/);
  if (!m) return null;
  const n = Number(m[0]);
  return Number.isFinite(n) ? n : null;
}

function toParamNumber(value: string) {
  return value.trim();
}

function buildQueryFromState(state: FiltersState, sort: SortKey) {
  const params = new URLSearchParams();
  const push = (k: string, v: string) => {
    const s = v.trim();
    if (!s) return;
    params.set(k, s);
  };

  push("search", state.search);
  push("make", state.make);
  push("model", state.model);
  push("minYear", state.yearMin);
  push("maxYear", state.yearMax);

  push("minPrice", state.priceMin);
  push("maxPrice", state.priceMax);
  push("minMileage", state.mileageMin);
  push("maxMileage", state.mileageMax);

  push("bodyType", state.bodyType);
  push("transmission", state.transmission);
  push("fuelType", state.fuelType);
  push("condition", state.condition);
  push("exteriorColor", state.exteriorColor);
  push("interiorColor", state.interiorColor);
  push("trim", state.trim);
  push("drivetrain", state.drivetrain);
  push("engine", state.engine);

  if (state.features.length) params.set("features", state.features.join(","));
  push("vehicleHistory", state.vehicleHistory);

  push("gasMileageMin", state.gasMileageMin);
  push("gasMileageMax", state.gasMileageMax);

  push("isNew", state.isNew);

  params.set("sort", sort);
  return params;
}

function formatFeaturePill(f: string) {
  return f;
}

type Pill = {
  id: string;
  label: string;
  onRemove: () => void;
};

export default function InventoryControls({
  cars,
  makes,
  modelsByMake,
  availableFeatures,
  initialSearchParams,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const sortFromUrl = ((): SortKey => {
    const raw = searchParams.get("sort") || initialSearchParams?.sort || "newest";
    const allowed: SortKey[] = [
      "newest",
      "availability",
      "price_asc",
      "price_desc",
      "mileage_asc",
    ];
    return (allowed as string[]).includes(raw) ? (raw as SortKey) : "newest";
  })();

  const [sort, dispatchSort] = useReducer(
    (s: SortKey, next: SortKey) => next,
    sortFromUrl
  );

  const [state, dispatch] = useReducer(reducer, defaultState);
  const didInit = useRef(false);

  // Initialize filters from URL on first client render.
  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    const p = searchParams;
    const init: Partial<FiltersState> = {
      search: p.get("search") ?? initialSearchParams?.search ?? "",
      make: p.get("make") ?? initialSearchParams?.make ?? "",
      model: p.get("model") ?? initialSearchParams?.model ?? "",
      yearMin: p.get("minYear") ?? initialSearchParams?.minYear ?? "",
      yearMax: p.get("maxYear") ?? initialSearchParams?.maxYear ?? "",
      priceMin: p.get("minPrice") ?? initialSearchParams?.minPrice ?? "",
      priceMax: p.get("maxPrice") ?? initialSearchParams?.maxPrice ?? "",
      mileageMin: p.get("minMileage") ?? initialSearchParams?.minMileage ?? "",
      mileageMax: p.get("maxMileage") ?? initialSearchParams?.maxMileage ?? "",
      bodyType: p.get("bodyType") ?? initialSearchParams?.bodyType ?? "",
      transmission:
        p.get("transmission") ?? initialSearchParams?.transmission ?? "",
      fuelType: p.get("fuelType") ?? initialSearchParams?.fuelType ?? "",
      condition: p.get("condition") ?? initialSearchParams?.condition ?? "",
      exteriorColor:
        p.get("exteriorColor") ?? initialSearchParams?.exteriorColor ?? "",
      interiorColor:
        p.get("interiorColor") ?? initialSearchParams?.interiorColor ?? "",
      trim: p.get("trim") ?? initialSearchParams?.trim ?? "",
      drivetrain: p.get("drivetrain") ?? initialSearchParams?.drivetrain ?? "",
      engine: p.get("engine") ?? initialSearchParams?.engine ?? "",
      vehicleHistory:
        p.get("vehicleHistory") ?? initialSearchParams?.vehicleHistory ?? "",
      isNew: p.get("isNew") ?? initialSearchParams?.isNew ?? "",
      features: parseInitialFeatures(p.get("features") ?? initialSearchParams?.features),

      // Gas mileage: we support min/max query. If only `gasMileage` exists in DB code, we ignore.
      gasMileageMin: p.get("gasMileageMin") ?? "",
      gasMileageMax: p.get("gasMileageMax") ?? "",
    };

    dispatch({ type: "INIT_FROM_URL", payload: init });
  }, [initialSearchParams, searchParams]);

  // Dependent logic: when make changes, clear model.
  useEffect(() => {
    if (!state.make) return;
    // If model no longer belongs, clear.
    const allowedModels = modelsByMake[state.make] ?? [];
    if (state.model && !allowedModels.includes(state.model)) {
      dispatch({ type: "SET", key: "model", value: "" });
    }
  }, [modelsByMake, state.make, state.model]);

  const pills: Pill[] = useMemo(() => {
    const result: Pill[] = [];

    const add = (key: keyof FiltersState, label: string) => {
      result.push({
        id: `pill:${String(key)}:${label}`,
        label,
        onRemove: () => dispatch({ type: "REMOVE_PILL", key }),
      });
    };

    if (state.search) add("search", `Search: ${state.search}`);
    if (state.make) add("make", `Make: ${state.make}`);
    if (state.model) add("model", `Model: ${state.model}`);
    if (state.yearMin || state.yearMax) {
      add("yearMin", `Year: ${state.yearMin || "*"}–${state.yearMax || "*"}`);
    }
    if (state.isNew) add("isNew", state.isNew === "true" ? "New" : "Used");
    if (state.condition) add("condition", `Condition: ${state.condition}`);

    if (state.priceMin || state.priceMax) {
      add("priceMin", `Price: ${state.priceMin || "*"}–${state.priceMax || "*"}`);
    }
    if (state.mileageMin || state.mileageMax) {
      add("mileageMin", `Mileage: ${state.mileageMin || "*"}–${state.mileageMax || "*"}`);
    }

    if (state.gasMileageMin || state.gasMileageMax) {
      add(
        "gasMileageMin",
        `Gas MPG: ${state.gasMileageMin || "*"}–${state.gasMileageMax || "*"}`
      );
    }

    if (state.bodyType) add("bodyType", `Body: ${state.bodyType}`);
    if (state.transmission) add("transmission", `Transmission: ${state.transmission}`);
    if (state.fuelType) add("fuelType", `Fuel: ${state.fuelType}`);
    if (state.drivetrain) add("drivetrain", `Drivetrain: ${state.drivetrain}`);
    if (state.engine) add("engine", `Engine: ${state.engine}`);
    if (state.trim) add("trim", `Trim: ${state.trim}`);

    if (state.exteriorColor) add("exteriorColor", `Exterior: ${state.exteriorColor}`);
    if (state.interiorColor) add("interiorColor", `Interior: ${state.interiorColor}`);

    if (state.features.length) {
      result.push(
        ...state.features.map((f) => ({
          id: `pill:features:${f}`,
          label: formatFeaturePill(f),
          onRemove: () => dispatch({ type: "SET_FEATURES", payload: state.features.filter((x) => x !== f) }),
        }))
      );
    }

    if (state.vehicleHistory) add("vehicleHistory", `History: ${state.vehicleHistory}`);

    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const activeFilterCount = pills.length;

  // Sync URL when state changes (client-side no reload).
  useEffect(() => {
    const params = buildQueryFromState(state, sort);

    // Keep the URL aligned with filters; replace to avoid navigation stack.
    router.replace(`/cars?${params.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, sort]);

  const filteredAndSortedCars = useMemo(() => {
    const q = state.search.trim().toLowerCase();

    const matches = (car: Car) => {
      if (q) {
        const mk = car.make.toLowerCase();
        const md = car.model.toLowerCase();
        if (!mk.includes(q) && !md.includes(q)) return false;
      }

      if (state.make && car.make !== state.make) return false;
      if (state.model && car.model !== state.model) return false;

      if (state.yearMin || state.yearMax) {
        if (!matchesNumberRange(car.year, state.yearMin, state.yearMax)) return false;
      }

      if (state.isNew) {
        const wantsNew = state.isNew === "true";
        if (car.isNew !== wantsNew) return false;
      }

      if (state.condition && car.condition?.toLowerCase() !== state.condition.toLowerCase()) {
        return false;
      }

      if (state.priceMin || state.priceMax) {
        if (!matchesNumberRange(car.price, state.priceMin, state.priceMax)) return false;
      }

      if (state.mileageMin || state.mileageMax) {
        if (!matchesNumberRange(car.mileage, state.mileageMin, state.mileageMax)) return false;
      }

      // Gas mileage: parse first number in string.
      if (state.gasMileageMin || state.gasMileageMax) {
        const n = parseGasMileageToNumber(car.gasMileage);
        if (n === null) return false;
        if (!matchesNumberRange(n, state.gasMileageMin, state.gasMileageMax)) return false;
      }

      if (state.bodyType) {
        if (!car.bodyType || !car.bodyType.toLowerCase().includes(state.bodyType.toLowerCase())) {
          return false;
        }
      }
      if (state.transmission) {
        if (!car.transmission || car.transmission.toLowerCase() !== state.transmission.toLowerCase()) {
          return false;
        }
      }
      if (state.fuelType) {
        if (!car.fuelType || car.fuelType.toLowerCase() !== state.fuelType.toLowerCase()) {
          return false;
        }
      }
      if (state.drivetrain) {
        if (!car.drivetrain || car.drivetrain.toLowerCase() !== state.drivetrain.toLowerCase()) {
          return false;
        }
      }
      if (state.engine) {
        if (!car.engine || !car.engine.toLowerCase().includes(state.engine.toLowerCase())) {
          return false;
        }
      }
      if (state.trim) {
        if (!car.trim || !car.trim.toLowerCase().includes(state.trim.toLowerCase())) {
          return false;
        }
      }

      if (state.exteriorColor) {
        if (!car.exteriorColor || !car.exteriorColor.toLowerCase().includes(state.exteriorColor.toLowerCase())) {
          return false;
        }
      }
      if (state.interiorColor) {
        if (!car.interiorColor || !car.interiorColor.toLowerCase().includes(state.interiorColor.toLowerCase())) {
          return false;
        }
      }

      if (state.features.length) {
        // hasEvery semantics
        const set = new Set((car.features ?? []).map((x) => x.toLowerCase()));
        for (const f of state.features) {
          if (!set.has(f.toLowerCase())) return false;
        }
      }

      if (state.vehicleHistory) {
        if (!car.vehicleHistory || !car.vehicleHistory.toLowerCase().includes(state.vehicleHistory.toLowerCase())) {
          return false;
        }
      }

      return true;
    };

    const filtered = cars.filter((c) => c.status === "AVAILABLE").filter(matches);

    const sorted = [...filtered];
    const availabilityRank = (s: string) => (s === "AVAILABLE" ? 0 : 1);

    sorted.sort((a, b) => {
      switch (sort) {
        case "newest":
          return b.createdAt.getTime() - a.createdAt.getTime();
        case "availability":
          return availabilityRank(a.status) - availabilityRank(b.status);
        case "price_asc":
          return a.price - b.price;
        case "price_desc":
          return b.price - a.price;
        case "mileage_asc":
          return a.mileage - b.mileage;
        default:
          return b.createdAt.getTime() - a.createdAt.getTime();
      }
    });

    return sorted;
  }, [cars, state, sort]);

  const clearAll = () => dispatch({ type: "CLEAR_ALL" });


  // UX: simplified mobile drawer using a plain checkbox toggle.
  // (No external libs.)
  return (
    <>
      <section className="bg-white border-b border-slate-100 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1">
              <div className="flex flex-wrap lg:flex-nowrap gap-3">
                <div className="flex-1 min-w-[220px] relative group">
                  <input
                    name="search"
                    value={state.search}
                    onChange={(e) => dispatch({ type: "SET", key: "search", value: e.target.value })}
                    placeholder="Search make or model..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0071d2]/20 focus:border-[#0071d2] transition-all group-hover:bg-white"
                  />
                </div>

                {/* Make / Model (dependent) */}
                <div className="hidden lg:block">
                  <select
                    value={state.make}
                    onChange={(e) => {
                      const v = e.target.value;
                      dispatch({ type: "SET", key: "make", value: v });
                      // dependent: clear model
                      dispatch({ type: "SET", key: "model", value: "" });
                    }}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-sm font-medium w-44 focus:outline-none focus:border-[#0071d2] transition-all"
                  >
                    <option value="">All Makes</option>
                    {makes.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="hidden lg:block">
                  <select
                    value={state.model}
                    onChange={(e) =>
                      dispatch({ type: "SET", key: "model", value: e.target.value })
                    }
                    className="bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-sm font-medium w-48 focus:outline-none focus:border-[#0071d2] transition-all"
                    disabled={!state.make}
                  >
                    <option value="">All Models</option>
                    {(modelsByMake[state.make] ?? []).map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="relative">
                  <select
                    value={sort}
                    onChange={(e) => dispatchSort(e.target.value as SortKey)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-sm font-medium w-44 focus:outline-none focus:border-[#0071d2] transition-all appearance-none cursor-pointer pr-10"
                  >
                    <option value="newest">Newest Arrivals</option>
                    <option value="availability">Availability</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="mileage_asc">Mileage: Low to High</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#005ba3] text-xs">
                    ▾
                  </div>
                </div>

                {/* Desktop sidebar toggle placeholder on mobile */}
                <label className="lg:hidden inline-flex items-center justify-center bg-slate-900 text-white px-4 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-slate-900/10 active:scale-95 cursor-pointer">
                  Filter
                  <input type="checkbox" className="hidden" />
                </label>

                <button
                  type="button"
                  onClick={clearAll}
                  className="lg:inline-flex hidden bg-white border border-slate-200 text-slate-400 hover:text-slate-900 px-6 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all items-center justify-center"
                >
                  Reset
                </button>
              </div>

              {activeFilterCount > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 self-center">
                    Active filters
                  </span>
                  {pills.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={p.onRemove}
                      className="bg-[#0071d2]/10 text-[#005ba3] border border-[#0071d2]/15 px-3 py-1.5 rounded-full text-[11px] font-bold hover:bg-[#0071d2]/15 transition-colors"
                      aria-label={`Remove filter: ${p.label}`}
                    >
                      {p.label} <span className="ml-1">×</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="hidden xl:block w-0" />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block lg:sticky lg:top-24 h-fit">
            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
              <h2 className="text-sm font-black text-slate-900 tracking-tight">Filters</h2>
              <p className="text-[12px] text-slate-500 mt-1">Refine results instantly.</p>

              <div className="mt-6 space-y-6">
                {/* Basic Info */}
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Basic Info</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-[12px] font-semibold text-slate-700">Make</label>
                      <select
                        value={state.make}
                        onChange={(e) => {
                          const v = e.target.value;
                          dispatch({ type: "SET", key: "make", value: v });
                          dispatch({ type: "SET", key: "model", value: "" });
                        }}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0071d2] transition-all"
                      >
                        <option value="">Any Make</option>
                        {makes.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[12px] font-semibold text-slate-700">Model</label>
                      <select
                        value={state.model}
                        onChange={(e) => dispatch({ type: "SET", key: "model", value: e.target.value })}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0071d2] transition-all"
                        disabled={!state.make}
                      >
                        <option value="">Any Model</option>
                        {(modelsByMake[state.make] ?? []).map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[12px] font-semibold text-slate-700">Min Year</label>
                        <input
                          type="number"
                          value={state.yearMin}
                          onChange={(e) => dispatch({ type: "SET", key: "yearMin", value: e.target.value })}
                          className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0071d2] transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-[12px] font-semibold text-slate-700">Max Year</label>
                        <input
                          type="number"
                          value={state.yearMax}
                          onChange={(e) => dispatch({ type: "SET", key: "yearMax", value: e.target.value })}
                          className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0071d2] transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[12px] font-semibold text-slate-700">New / Used</label>
                      <select
                        value={state.isNew}
                        onChange={(e) => dispatch({ type: "SET", key: "isNew", value: e.target.value })}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0071d2] transition-all"
                      >
                        <option value="">Any</option>
                        <option value="true">New</option>
                        <option value="false">Used</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[12px] font-semibold text-slate-700">Condition</label>
                      <select
                        value={state.condition}
                        onChange={(e) => dispatch({ type: "SET", key: "condition", value: e.target.value })}
                        className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0071d2] transition-all"
                      >
                        <option value="">Any</option>
                        <option value="Excellent">Excellent</option>
                        <option value="Good">Good</option>
                        <option value="Fair">Fair</option>
                        <option value="Poor">Poor</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Pricing & Usage */}
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">
                    Pricing & Usage
                  </h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[12px] font-semibold text-slate-700">Min Price</label>
                        <input
                          type="number"
                          value={state.priceMin}
                          onChange={(e) => dispatch({ type: "SET", key: "priceMin", value: toParamNumber(e.target.value) })}
                          className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0071d2] transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-[12px] font-semibold text-slate-700">Max Price</label>
                        <input
                          type="number"
                          value={state.priceMax}
                          onChange={(e) => dispatch({ type: "SET", key: "priceMax", value: toParamNumber(e.target.value) })}
                          className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0071d2] transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[12px] font-semibold text-slate-700">Min Mileage</label>
                        <input
                          type="number"
                          value={state.mileageMin}
                          onChange={(e) => dispatch({ type: "SET", key: "mileageMin", value: toParamNumber(e.target.value) })}
                          className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0071d2] transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-[12px] font-semibold text-slate-700">Max Mileage</label>
                        <input
                          type="number"
                          value={state.mileageMax}
                          onChange={(e) => dispatch({ type: "SET", key: "mileageMax", value: toParamNumber(e.target.value) })}
                          className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0071d2] transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[12px] font-semibold text-slate-700">Min MPG</label>
                        <input
                          type="number"
                          value={state.gasMileageMin}
                          onChange={(e) => dispatch({ type: "SET", key: "gasMileageMin", value: toParamNumber(e.target.value) })}
                          className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0071d2] transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-[12px] font-semibold text-slate-700">Max MPG</label>
                        <input
                          type="number"
                          value={state.gasMileageMax}
                          onChange={(e) => dispatch({ type: "SET", key: "gasMileageMax", value: toParamNumber(e.target.value) })}
                          className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0071d2] transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Technical Specs */}
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">
                    Technical Specs
                  </h3>
                  <div className="space-y-3">
                    <input
                      value={state.bodyType}
                      onChange={(e) => dispatch({ type: "SET", key: "bodyType", value: e.target.value })}
                      placeholder="Body Type"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0071d2] transition-all"
                    />
                    <select
                      value={state.transmission}
                      onChange={(e) => dispatch({ type: "SET", key: "transmission", value: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0071d2] transition-all"
                    >
                      <option value="">Any Transmission</option>
                      <option value="Automatic">Automatic</option>
                      <option value="Manual">Manual</option>
                      <option value="CVT">CVT</option>
                      <option value="Other">Other</option>
                    </select>
                    <select
                      value={state.fuelType}
                      onChange={(e) => dispatch({ type: "SET", key: "fuelType", value: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0071d2] transition-all"
                    >
                      <option value="">Any Fuel</option>
                      <option value="Gasoline">Gasoline</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Electric">Electric</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="Plug-in Hybrid">Plug-in Hybrid</option>
                    </select>
                    <select
                      value={state.drivetrain}
                      onChange={(e) => dispatch({ type: "SET", key: "drivetrain", value: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0071d2] transition-all"
                    >
                      <option value="">Any Drivetrain</option>
                      <option value="FWD">FWD</option>
                      <option value="RWD">RWD</option>
                      <option value="AWD">AWD</option>
                      <option value="4WD">4WD</option>
                    </select>
                    <input
                      value={state.engine}
                      onChange={(e) => dispatch({ type: "SET", key: "engine", value: e.target.value })}
                      placeholder="Engine"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0071d2] transition-all"
                    />
                    <input
                      value={state.trim}
                      onChange={(e) => dispatch({ type: "SET", key: "trim", value: e.target.value })}
                      placeholder="Trim"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0071d2] transition-all"
                    />
                  </div>
                </div>

                {/* Design */}
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">
                    Design
                  </h3>
                  <div className="space-y-3">
                    <input
                      value={state.exteriorColor}
                      onChange={(e) => dispatch({ type: "SET", key: "exteriorColor", value: e.target.value })}
                      placeholder="Exterior Color"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0071d2] transition-all"
                    />
                    <input
                      value={state.interiorColor}
                      onChange={(e) => dispatch({ type: "SET", key: "interiorColor", value: e.target.value })}
                      placeholder="Interior Color"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0071d2] transition-all"
                    />
                  </div>
                </div>

                {/* Verification */}
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">
                    Verification
                  </h3>
                  <div className="space-y-3">
                    <input
                      value={state.vehicleHistory}
                      onChange={(e) => dispatch({ type: "SET", key: "vehicleHistory", value: e.target.value })}
                      placeholder="Vehicle History (e.g., Single Owner)"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0071d2] transition-all"
                    />

                    <div>
                      <p className="text-[12px] font-semibold text-slate-700 mb-2">Features</p>
                      <div className="max-h-48 overflow-auto pr-1">
                        {availableFeatures.slice(0, 30).map((f) => {
                          const checked = state.features.includes(f);
                          return (
                            <label
                              key={f}
                              className="flex items-center gap-2 py-1.5 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    dispatch({ type: "SET_FEATURES", payload: [...state.features, f] });
                                  } else {
                                    dispatch({ type: "SET_FEATURES", payload: state.features.filter((x) => x !== f) });
                                  }
                                }}
                              />
                              <span className="text-[12px] text-slate-700">{f}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={clearAll}
                      className="w-full bg-[#0071d2] text-white px-5 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-[#005ba3] transition-colors"
                    >
                      Clear All Filters
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Results */}
          <section className="pb-16">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-slate-900">Inventory</h2>
                <p className="text-slate-500 font-medium mt-1">
                  Showing {filteredAndSortedCars.length} {filteredAndSortedCars.length === 1 ? "vehicle" : "vehicles"}
                </p>
              </div>
            </div>

            {filteredAndSortedCars.length === 0 ? (
              <div className="text-center py-32 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                <div className="text-4xl mb-4">🔎</div>
                <p className="text-xl font-black text-slate-900 mb-2">No matching vehicles found</p>
                <p className="text-slate-500 mb-8 max-w-sm mx-auto font-medium">
                  Try clearing a few filters to see a broader selection.
                </p>
                <button
                  type="button"
                  onClick={clearAll}
                  className="inline-block bg-[#0071d2] text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-[#0071d2]/20"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                {filteredAndSortedCars.map((car) => (
                  <div key={car.id} className="group">
                    <CarCard
                      car={{
                        id: car.id,
                        make: car.make,
                        model: car.model,
                        year: car.year,
                        price: car.price,
                        imageUrl: car.imageUrl,
                        status: car.status,
                      }}
                    />
                    <div className="mt-4 flex items-center gap-2 px-2">
                      <span className="h-1 w-1 rounded-full bg-slate-300" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Clean WA Title Available
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Footer CTA */}
      <section className="bg-slate-900 py-24 px-6 text-white overflow-hidden relative">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h3 className="text-3xl font-black tracking-tighter mb-6">Can&apos;t find what you&apos;re looking for?</h3>
          <p className="text-slate-400 font-medium mb-10 leading-relaxed">
            Our auction network updates daily with thousands of vehicles from Manheim, ADESA, and DAA Seattle.
            Tell us your specific requirements, and we&apos;ll source it directly.
          </p>
          <Link
            href="/contact-us"
            className="bg-[#0071d2] text-slate-900 px-12 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-white transition-colors"
          >
            Request Custom Search
          </Link>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-[#0071d2]/5 rounded-[100%] blur-[120px]" />
      </section>

      <div className="h-2" />
    </>
  );
}

