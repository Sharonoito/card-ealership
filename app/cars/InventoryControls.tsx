"use client";

import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { ChevronDown, Search, SlidersHorizontal, X } from "lucide-react";
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
  makes: string[];
  models: string[];
  yearMin: string;
  yearMax: string;
  isNew: string;
  condition: string[];
  priceMin: string;
  priceMax: string;
  mileageMin: string;
  mileageMax: string;
  gasMileageMin: string;
  gasMileageMax: string;
  bodyType: string[];
  transmission: string[];
  fuelType: string[];
  drivetrain: string[];
  engine: string;
  trim: string;
  exteriorColor: string[];
  interiorColor: string[];
  features: string[];
  vehicleHistory: string[];
};

type ArrayFilterKey =
  | "makes"
  | "models"
  | "condition"
  | "bodyType"
  | "transmission"
  | "fuelType"
  | "drivetrain"
  | "exteriorColor"
  | "interiorColor"
  | "features"
  | "vehicleHistory";

type FiltersAction =
  | { type: "INIT_FROM_URL"; payload: Partial<FiltersState> }
  | { type: "SET"; key: keyof FiltersState; value: FiltersState[keyof FiltersState] }
  | { type: "TOGGLE_ARRAY"; key: ArrayFilterKey; value: string }
  | { type: "CLEAR_ALL" }
  | { type: "REMOVE_PILL"; key: keyof FiltersState; value?: string };

const defaultState: FiltersState = {
  search: "",
  makes: [],
  models: [],
  yearMin: "",
  yearMax: "",
  isNew: "",
  condition: [],
  priceMin: "",
  priceMax: "",
  mileageMin: "",
  mileageMax: "",
  gasMileageMin: "",
  gasMileageMax: "",
  bodyType: [],
  transmission: [],
  fuelType: [],
  drivetrain: [],
  engine: "",
  trim: "",
  exteriorColor: [],
  interiorColor: [],
  features: [],
  vehicleHistory: [],
};

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

type Option = {
  label: string;
  count: number;
};

type Pill = {
  id: string;
  label: string;
  onRemove: () => void;
};

const colorSwatches: Record<string, string> = {
  black: "#111827",
  blue: "#2563eb",
  brown: "#7c2d12",
  gold: "#d97706",
  gray: "#6b7280",
  green: "#16a34a",
  orange: "#ea580c",
  purple: "#7c3aed",
  red: "#dc2626",
  silver: "#cbd5e1",
  white: "#ffffff",
  yellow: "#eab308",
};

const vehicleHistoryOptions = [
  "Single owner",
  "No accidents",
  "Clean title",
  "Service records",
  "Personal use",
];

function parseMulti(raw: string | null | undefined) {
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function formatMoney(value: string) {
  if (!value) return "*";
  const n = Number(value);
  if (!Number.isFinite(n)) return value;
  return `$${formatNumber(n)}`;
}

function matchesNumberRange(value: number, minStr: string, maxStr: string) {
  const min = minStr ? Number(minStr) : undefined;
  const max = maxStr ? Number(maxStr) : undefined;
  if (min !== undefined && !Number.isNaN(min) && value < min) return false;
  if (max !== undefined && !Number.isNaN(max) && value > max) return false;
  return true;
}

function parseGasMileageToNumber(gasMileage: string | null): number | null {
  if (!gasMileage) return null;
  const match = gasMileage.match(/\d+(?:\.\d+)?/);
  if (!match) return null;
  const parsed = Number(match[0]);
  return Number.isFinite(parsed) ? parsed : null;
}

function toParamNumber(value: string) {
  return value.trim();
}

function normalizeOption(value: string | null) {
  return value?.trim() || "";
}

function buildQueryFromState(state: FiltersState, sort: SortKey) {
  const params = new URLSearchParams();
  const push = (key: string, value: string) => {
    const trimmed = value.trim();
    if (trimmed) params.set(key, trimmed);
  };
  const pushArray = (key: string, values: string[]) => {
    if (values.length) params.set(key, values.join(","));
  };

  push("search", state.search);
  pushArray("make", state.makes);
  pushArray("model", state.models);
  push("minYear", state.yearMin);
  push("maxYear", state.yearMax);
  push("minPrice", state.priceMin);
  push("maxPrice", state.priceMax);
  push("minMileage", state.mileageMin);
  push("maxMileage", state.mileageMax);
  pushArray("bodyType", state.bodyType);
  pushArray("transmission", state.transmission);
  pushArray("fuelType", state.fuelType);
  pushArray("condition", state.condition);
  pushArray("exteriorColor", state.exteriorColor);
  pushArray("interiorColor", state.interiorColor);
  push("trim", state.trim);
  pushArray("drivetrain", state.drivetrain);
  push("engine", state.engine);
  pushArray("features", state.features);
  pushArray("vehicleHistory", state.vehicleHistory);
  push("gasMileageMin", state.gasMileageMin);
  push("gasMileageMax", state.gasMileageMax);
  push("isNew", state.isNew);
  params.set("sort", sort);

  return params;
}

function reducer(state: FiltersState, action: FiltersAction): FiltersState {
  switch (action.type) {
    case "INIT_FROM_URL":
      return { ...state, ...action.payload };
    case "SET":
      return { ...state, [action.key]: action.value };
    case "TOGGLE_ARRAY": {
      const current = state[action.key];
      const exists = current.includes(action.value);
      const next = exists
        ? current.filter((item) => item !== action.value)
        : [...current, action.value];

      return { ...state, [action.key]: next };
    }
    case "REMOVE_PILL": {
      const current = state[action.key];
      if (Array.isArray(current)) {
        return {
          ...state,
          [action.key]: action.value
            ? current.filter((item) => item !== action.value)
            : [],
        } as FiltersState;
      }
      return { ...state, [action.key]: "" } as FiltersState;
    }
    case "CLEAR_ALL":
      return defaultState;
    default:
      return state;
  }
}

function getOptions(cars: Car[], read: (car: Car) => string | null): Option[] {
  const counts = new Map<string, number>();
  for (const car of cars) {
    const value = normalizeOption(read(car));
    if (!value) continue;
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return Array.from(counts, ([label, count]) => ({ label, count })).sort((a, b) =>
    a.label.localeCompare(b.label)
  );
}

function getFeatureOptions(cars: Car[], availableFeatures: string[]): Option[] {
  const counts = new Map<string, number>();
  for (const feature of availableFeatures) counts.set(feature, 0);
  for (const car of cars) {
    for (const feature of car.features ?? []) {
      if (!feature) continue;
      counts.set(feature, (counts.get(feature) ?? 0) + 1);
    }
  }
  return Array.from(counts, ([label, count]) => ({ label, count }))
    .filter((option) => option.count > 0)
    .sort((a, b) => a.label.localeCompare(b.label));
}

function getHistoryOptions(cars: Car[]): Option[] {
  return vehicleHistoryOptions.map((label) => ({
    label,
    count: cars.filter((car) =>
      car.vehicleHistory?.toLowerCase().includes(label.toLowerCase())
    ).length,
  }));
}

function getSwatchColor(label: string) {
  const normalized = label.toLowerCase();
  const key = Object.keys(colorSwatches).find((color) => normalized.includes(color));
  return key ? colorSwatches[key] : "#e5e7eb";
}

function CheckboxRow({
  checked,
  count,
  label,
  nested = false,
  swatch,
  onChange,
}: {
  checked: boolean;
  count: number;
  label: string;
  nested?: boolean;
  swatch?: string;
  onChange: () => void;
}) {
  return (
    <label
      className={`flex min-h-8 cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-slate-50 ${
        nested ? "ml-7 text-[13px]" : ""
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-slate-300 text-[#0071d2] focus:ring-[#0071d2]"
      />
      {swatch ? (
        <span
          className="h-4 w-4 shrink-0 rounded-full border border-slate-300"
          style={{ backgroundColor: swatch }}
          aria-hidden="true"
        />
      ) : null}
      <span className="min-w-0 flex-1 truncate font-semibold text-slate-700">
        {label}
      </span>
      <span className="text-[11px] font-bold text-slate-400">({count})</span>
    </label>
  );
}

function FilterSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="border-b border-slate-100 py-4 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-3 text-left"
        aria-expanded={open}
      >
        <span className="text-[12px] font-black uppercase tracking-widest text-slate-500">
          {title}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-slate-400 transition-transform ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>
      {open ? <div className="mt-4">{children}</div> : null}
    </section>
  );
}

function RangeFilter({
  max,
  min,
  minValue,
  maxValue,
  step,
  unit = "",
  onMinChange,
  onMaxChange,
}: {
  max: number;
  min: number;
  minValue: string;
  maxValue: string;
  step: number;
  unit?: string;
  onMinChange: (value: string) => void;
  onMaxChange: (value: string) => void;
}) {
  const currentMin = minValue || String(min);
  const currentMax = maxValue || String(max);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <input
          type="number"
          min={min}
          max={max}
          value={minValue}
          placeholder={`Min ${unit}`.trim()}
          onChange={(e) => onMinChange(toParamNumber(e.target.value))}
          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold focus:border-[#0071d2] focus:outline-none"
        />
        <input
          type="number"
          min={min}
          max={max}
          value={maxValue}
          placeholder={`Max ${unit}`.trim()}
          onChange={(e) => onMaxChange(toParamNumber(e.target.value))}
          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold focus:border-[#0071d2] focus:outline-none"
        />
      </div>
      <div className="space-y-2">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={currentMin}
          onChange={(e) => onMinChange(e.target.value)}
          className="w-full accent-[#0071d2]"
          aria-label="Minimum"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={currentMax}
          onChange={(e) => onMaxChange(e.target.value)}
          className="w-full accent-[#0071d2]"
          aria-label="Maximum"
        />
      </div>
      <div className="flex justify-between text-[11px] font-bold text-slate-400">
        <span>
          {unit === "$" ? "$" : ""}
          {formatNumber(Number(currentMin))}
        </span>
        <span>
          {unit === "$" ? "$" : ""}
          {formatNumber(Number(currentMax))}
        </span>
      </div>
    </div>
  );
}

export default function InventoryControls({
  cars,
  makes,
  modelsByMake,
  availableFeatures,
  initialSearchParams,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [featureSearch, setFeatureSearch] = useState("");
  const didInit = useRef(false);

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
    (_state: SortKey, next: SortKey) => next,
    sortFromUrl
  );
  const [state, dispatch] = useReducer(reducer, defaultState);

  const availableCars = useMemo(
    () => cars.filter((car) => car.status === "AVAILABLE"),
    [cars]
  );

  const makeOptions = useMemo(() => {
    const counts = new Map(makes.map((make) => [make, 0]));
    for (const car of availableCars) {
      counts.set(car.make, (counts.get(car.make) ?? 0) + 1);
    }
    return Array.from(counts, ([label, count]) => ({ label, count })).sort((a, b) =>
      a.label.localeCompare(b.label)
    );
  }, [availableCars, makes]);

  const modelCountsByMake = useMemo(() => {
    const result: Record<string, Record<string, number>> = {};
    for (const car of availableCars) {
      result[car.make] ??= {};
      result[car.make][car.model] = (result[car.make][car.model] ?? 0) + 1;
    }
    return result;
  }, [availableCars]);

  const options = useMemo(
    () => ({
      bodyType: getOptions(availableCars, (car) => car.bodyType),
      transmission: getOptions(availableCars, (car) => car.transmission),
      fuelType: getOptions(availableCars, (car) => car.fuelType),
      condition: getOptions(availableCars, (car) => car.condition),
      drivetrain: getOptions(availableCars, (car) => car.drivetrain),
      exteriorColor: getOptions(availableCars, (car) => car.exteriorColor),
      interiorColor: getOptions(availableCars, (car) => car.interiorColor),
      features: getFeatureOptions(availableCars, availableFeatures),
      vehicleHistory: getHistoryOptions(availableCars),
    }),
    [availableCars, availableFeatures]
  );

  const ranges = useMemo(() => {
    const prices = availableCars.map((car) => car.price);
    const mileages = availableCars.map((car) => car.mileage);
    return {
      priceMin: Math.min(...prices, 0),
      priceMax: Math.max(...prices, 100000),
      mileageMin: Math.min(...mileages, 0),
      mileageMax: Math.max(...mileages, 200000),
    };
  }, [availableCars]);

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    const p = searchParams;
    const init: Partial<FiltersState> = {
      search: p.get("search") ?? initialSearchParams?.search ?? "",
      makes: parseMulti(p.get("make") ?? initialSearchParams?.make),
      models: parseMulti(p.get("model") ?? initialSearchParams?.model),
      yearMin: p.get("minYear") ?? initialSearchParams?.minYear ?? "",
      yearMax: p.get("maxYear") ?? initialSearchParams?.maxYear ?? "",
      priceMin: p.get("minPrice") ?? initialSearchParams?.minPrice ?? "",
      priceMax: p.get("maxPrice") ?? initialSearchParams?.maxPrice ?? "",
      mileageMin: p.get("minMileage") ?? initialSearchParams?.minMileage ?? "",
      mileageMax: p.get("maxMileage") ?? initialSearchParams?.maxMileage ?? "",
      bodyType: parseMulti(p.get("bodyType") ?? initialSearchParams?.bodyType),
      transmission: parseMulti(
        p.get("transmission") ?? initialSearchParams?.transmission
      ),
      fuelType: parseMulti(p.get("fuelType") ?? initialSearchParams?.fuelType),
      condition: parseMulti(p.get("condition") ?? initialSearchParams?.condition),
      exteriorColor: parseMulti(
        p.get("exteriorColor") ?? initialSearchParams?.exteriorColor
      ),
      interiorColor: parseMulti(
        p.get("interiorColor") ?? initialSearchParams?.interiorColor
      ),
      trim: p.get("trim") ?? initialSearchParams?.trim ?? "",
      drivetrain: parseMulti(p.get("drivetrain") ?? initialSearchParams?.drivetrain),
      engine: p.get("engine") ?? initialSearchParams?.engine ?? "",
      vehicleHistory: parseMulti(
        p.get("vehicleHistory") ?? initialSearchParams?.vehicleHistory
      ),
      isNew: p.get("isNew") ?? initialSearchParams?.isNew ?? "",
      features: parseMulti(p.get("features") ?? initialSearchParams?.features),
      gasMileageMin: p.get("gasMileageMin") ?? "",
      gasMileageMax: p.get("gasMileageMax") ?? "",
    };

    dispatch({ type: "INIT_FROM_URL", payload: init });
  }, [initialSearchParams, searchParams]);

  useEffect(() => {
    const allowedModels = new Set(
      state.makes.flatMap((make) => modelsByMake[make] ?? [])
    );
    const nextModels = state.models.filter((model) => allowedModels.has(model));
    if (nextModels.length !== state.models.length) {
      dispatch({ type: "SET", key: "models", value: nextModels });
    }
  }, [modelsByMake, state.makes, state.models]);

  useEffect(() => {
    const params = buildQueryFromState(state, sort);
    router.replace(`/cars?${params.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, sort]);

  const filteredAndSortedCars = useMemo(() => {
    const q = state.search.trim().toLowerCase();

    const hasAny = (selected: string[], value: string | null) => {
      if (!selected.length) return true;
      const normalized = value?.toLowerCase() ?? "";
      return selected.some((item) => normalized.includes(item.toLowerCase()));
    };

    const matches = (car: Car) => {
      if (q) {
        const haystack = `${car.make} ${car.model} ${car.year}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (state.makes.length && !state.makes.includes(car.make)) return false;
      if (state.models.length && !state.models.includes(car.model)) return false;
      if (!matchesNumberRange(car.year, state.yearMin, state.yearMax)) return false;
      if (state.isNew && car.isNew !== (state.isNew === "true")) return false;
      if (!matchesNumberRange(car.price, state.priceMin, state.priceMax)) return false;
      if (!matchesNumberRange(car.mileage, state.mileageMin, state.mileageMax)) {
        return false;
      }
      if (state.gasMileageMin || state.gasMileageMax) {
        const mpg = parseGasMileageToNumber(car.gasMileage);
        if (mpg === null) return false;
        if (!matchesNumberRange(mpg, state.gasMileageMin, state.gasMileageMax)) {
          return false;
        }
      }
      if (!hasAny(state.condition, car.condition)) return false;
      if (!hasAny(state.bodyType, car.bodyType)) return false;
      if (!hasAny(state.transmission, car.transmission)) return false;
      if (!hasAny(state.fuelType, car.fuelType)) return false;
      if (!hasAny(state.drivetrain, car.drivetrain)) return false;
      if (state.engine && !car.engine?.toLowerCase().includes(state.engine.toLowerCase())) {
        return false;
      }
      if (state.trim && !car.trim?.toLowerCase().includes(state.trim.toLowerCase())) {
        return false;
      }
      if (!hasAny(state.exteriorColor, car.exteriorColor)) return false;
      if (!hasAny(state.interiorColor, car.interiorColor)) return false;
      if (state.features.length) {
        const carFeatures = new Set((car.features ?? []).map((item) => item.toLowerCase()));
        for (const feature of state.features) {
          if (!carFeatures.has(feature.toLowerCase())) return false;
        }
      }
      if (state.vehicleHistory.length) {
        const history = car.vehicleHistory?.toLowerCase() ?? "";
        if (!state.vehicleHistory.every((item) => history.includes(item.toLowerCase()))) {
          return false;
        }
      }
      return true;
    };

    const sorted = availableCars.filter(matches);
    const availabilityRank = (status: string) => (status === "AVAILABLE" ? 0 : 1);

    sorted.sort((a, b) => {
      switch (sort) {
        case "availability":
          return availabilityRank(a.status) - availabilityRank(b.status);
        case "price_asc":
          return a.price - b.price;
        case "price_desc":
          return b.price - a.price;
        case "mileage_asc":
          return a.mileage - b.mileage;
        case "newest":
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return sorted;
  }, [availableCars, state, sort]);

  const filteredFeatureOptions = useMemo(() => {
    const q = featureSearch.trim().toLowerCase();
    return options.features.filter((option) =>
      option.label.toLowerCase().includes(q)
    );
  }, [featureSearch, options.features]);

  const pills: Pill[] = useMemo(() => {
    const result: Pill[] = [];
    const add = (key: keyof FiltersState, label: string, value?: string) => {
      result.push({
        id: `pill:${String(key)}:${label}`,
        label,
        onRemove: () => dispatch({ type: "REMOVE_PILL", key, value }),
      });
    };
    const addArray = (key: ArrayFilterKey, prefix: string, values: string[]) => {
      for (const value of values) add(key, `${prefix}: ${value}`, value);
    };

    if (state.search) add("search", `Search: ${state.search}`);
    addArray("makes", "Make", state.makes);
    addArray("models", "Model", state.models);
    if (state.yearMin || state.yearMax) {
      add("yearMin", `Year: ${state.yearMin || "*"}-${state.yearMax || "*"}`);
    }
    if (state.isNew) add("isNew", state.isNew === "true" ? "New" : "Used");
    addArray("condition", "Condition", state.condition);
    if (state.priceMin || state.priceMax) {
      add("priceMin", `Price: ${formatMoney(state.priceMin)}-${formatMoney(state.priceMax)}`);
    }
    if (state.mileageMin || state.mileageMax) {
      add("mileageMin", `Mileage: ${state.mileageMin || "*"}-${state.mileageMax || "*"}`);
    }
    if (state.gasMileageMin || state.gasMileageMax) {
      add("gasMileageMin", `MPG: ${state.gasMileageMin || "*"}-${state.gasMileageMax || "*"}`);
    }
    addArray("bodyType", "Body", state.bodyType);
    addArray("transmission", "Transmission", state.transmission);
    addArray("fuelType", "Fuel", state.fuelType);
    addArray("drivetrain", "Drivetrain", state.drivetrain);
    if (state.engine) add("engine", `Engine: ${state.engine}`);
    if (state.trim) add("trim", `Trim: ${state.trim}`);
    addArray("exteriorColor", "Exterior", state.exteriorColor);
    addArray("interiorColor", "Interior", state.interiorColor);
    addArray("features", "Feature", state.features);
    addArray("vehicleHistory", "History", state.vehicleHistory);
    return result;
  }, [state]);

  const activeFilterCount = pills.length;
  const clearAll = () => dispatch({ type: "CLEAR_ALL" });

  const sidebar = (
    <aside className="lg:sticky lg:top-24 h-fit">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-black tracking-tight text-slate-900">Filters</h2>
            <p className="mt-1 text-[12px] font-medium text-slate-500">
              {activeFilterCount ? `${activeFilterCount} active` : "Refine results instantly."}
            </p>
          </div>
          <button
            type="button"
            onClick={clearAll}
            className="rounded-lg border border-slate-200 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-500 transition-colors hover:border-[#0071d2] hover:text-[#005ba3]"
          >
            Reset
          </button>
        </div>

        <div className="mt-3">
          <FilterSection title="Make & model">
            <div className="space-y-1">
              {makeOptions.map((make) => {
                const checked = state.makes.includes(make.label);
                const modelOptions = (modelsByMake[make.label] ?? []).map((model) => ({
                  label: model,
                  count: modelCountsByMake[make.label]?.[model] ?? 0,
                }));

                return (
                  <div key={make.label}>
                    <CheckboxRow
                      checked={checked}
                      count={make.count}
                      label={make.label}
                      onChange={() =>
                        dispatch({ type: "TOGGLE_ARRAY", key: "makes", value: make.label })
                      }
                    />
                    {checked ? (
                      <div className="pb-2">
                        {modelOptions.map((model) => (
                          <CheckboxRow
                            key={`${make.label}:${model.label}`}
                            checked={state.models.includes(model.label)}
                            count={model.count}
                            label={model.label}
                            nested
                            onChange={() =>
                              dispatch({
                                type: "TOGGLE_ARRAY",
                                key: "models",
                                value: model.label,
                              })
                            }
                          />
                        ))}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </FilterSection>

          <FilterSection title="Price & payment">
            <RangeFilter
              min={ranges.priceMin}
              max={ranges.priceMax}
              step={500}
              unit="$"
              minValue={state.priceMin}
              maxValue={state.priceMax}
              onMinChange={(value) => dispatch({ type: "SET", key: "priceMin", value })}
              onMaxChange={(value) => dispatch({ type: "SET", key: "priceMax", value })}
            />
          </FilterSection>

          <FilterSection title="Mileage">
            <RangeFilter
              min={ranges.mileageMin}
              max={ranges.mileageMax}
              step={1000}
              minValue={state.mileageMin}
              maxValue={state.mileageMax}
              onMinChange={(value) => dispatch({ type: "SET", key: "mileageMin", value })}
              onMaxChange={(value) => dispatch({ type: "SET", key: "mileageMax", value })}
            />
          </FilterSection>

          <FilterSection title="Exterior color">
            <div className="space-y-1">
              {options.exteriorColor.map((option) => (
                <CheckboxRow
                  key={option.label}
                  checked={state.exteriorColor.includes(option.label)}
                  count={option.count}
                  label={option.label}
                  swatch={getSwatchColor(option.label)}
                  onChange={() =>
                    dispatch({
                      type: "TOGGLE_ARRAY",
                      key: "exteriorColor",
                      value: option.label,
                    })
                  }
                />
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Drivetrain">
            <div className="space-y-1">
              {options.drivetrain.map((option) => (
                <CheckboxRow
                  key={option.label}
                  checked={state.drivetrain.includes(option.label)}
                  count={option.count}
                  label={option.label}
                  onChange={() =>
                    dispatch({
                      type: "TOGGLE_ARRAY",
                      key: "drivetrain",
                      value: option.label,
                    })
                  }
                />
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Transmission">
            <div className="space-y-1">
              {options.transmission.map((option) => (
                <CheckboxRow
                  key={option.label}
                  checked={state.transmission.includes(option.label)}
                  count={option.count}
                  label={option.label}
                  onChange={() =>
                    dispatch({
                      type: "TOGGLE_ARRAY",
                      key: "transmission",
                      value: option.label,
                    })
                  }
                />
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Body style">
            <div className="space-y-1">
              {options.bodyType.map((option) => (
                <CheckboxRow
                  key={option.label}
                  checked={state.bodyType.includes(option.label)}
                  count={option.count}
                  label={option.label}
                  onChange={() =>
                    dispatch({
                      type: "TOGGLE_ARRAY",
                      key: "bodyType",
                      value: option.label,
                    })
                  }
                />
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Features" defaultOpen={false}>
            <div className="relative mb-3">
              <Search
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                aria-hidden="true"
              />
              <input
                value={featureSearch}
                onChange={(e) => setFeatureSearch(e.target.value)}
                placeholder="Search features"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm font-semibold focus:border-[#0071d2] focus:outline-none"
              />
            </div>
            <div className="max-h-56 space-y-1 overflow-auto pr-1">
              {filteredFeatureOptions.map((option) => (
                <CheckboxRow
                  key={option.label}
                  checked={state.features.includes(option.label)}
                  count={option.count}
                  label={option.label}
                  onChange={() =>
                    dispatch({
                      type: "TOGGLE_ARRAY",
                      key: "features",
                      value: option.label,
                    })
                  }
                />
              ))}
              {!filteredFeatureOptions.length ? (
                <p className="px-2 py-3 text-sm font-medium text-slate-400">
                  No features match that search.
                </p>
              ) : null}
            </div>
          </FilterSection>

          <FilterSection title="Vehicle history" defaultOpen={false}>
            <div className="space-y-1">
              {options.vehicleHistory.map((option) => (
                <CheckboxRow
                  key={option.label}
                  checked={state.vehicleHistory.includes(option.label)}
                  count={option.count}
                  label={option.label}
                  onChange={() =>
                    dispatch({
                      type: "TOGGLE_ARRAY",
                      key: "vehicleHistory",
                      value: option.label,
                    })
                  }
                />
              ))}
            </div>
          </FilterSection>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      <section className="border-b border-slate-100 bg-white px-6 py-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative min-w-[240px] flex-1">
                <Search
                  className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  aria-hidden="true"
                />
                <input
                  name="search"
                  value={state.search}
                  onChange={(e) =>
                    dispatch({ type: "SET", key: "search", value: e.target.value })
                  }
                  placeholder="Search make, model, or year"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 pl-11 text-sm font-medium transition-all focus:border-[#0071d2] focus:outline-none focus:ring-2 focus:ring-[#0071d2]/20"
                />
              </div>

              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => dispatchSort(e.target.value as SortKey)}
                  className="w-48 cursor-pointer appearance-none rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 pr-10 text-sm font-medium transition-all focus:border-[#0071d2] focus:outline-none"
                >
                  <option value="newest">Newest arrivals</option>
                  <option value="availability">Availability</option>
                  <option value="price_asc">Price: Low to high</option>
                  <option value="price_desc">Price: High to low</option>
                  <option value="mileage_asc">Mileage: Low to high</option>
                </select>
                <ChevronDown
                  className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#005ba3]"
                  aria-hidden="true"
                />
              </div>

              <a
                href="#inventory-filters"
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-4 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-slate-900/10 lg:hidden"
              >
                <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
                Filters
              </a>
            </div>

            {activeFilterCount > 0 ? (
              <div className="flex flex-wrap gap-2">
                <span className="self-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Active filters
                </span>
                {pills.map((pill) => (
                  <button
                    key={pill.id}
                    type="button"
                    onClick={pill.onRemove}
                    className="inline-flex items-center gap-1 rounded-full border border-[#0071d2]/15 bg-[#0071d2]/10 px-3 py-1.5 text-[11px] font-bold text-[#005ba3] transition-colors hover:bg-[#0071d2]/15"
                    aria-label={`Remove filter: ${pill.label}`}
                  >
                    {pill.label}
                    <X className="h-3 w-3" aria-hidden="true" />
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[320px_1fr]">
          <div id="inventory-filters">{sidebar}</div>

          <section className="pb-16">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-slate-900">
                  Inventory
                </h2>
                <p className="mt-1 font-medium text-slate-500">
                  Showing {filteredAndSortedCars.length}{" "}
                  {filteredAndSortedCars.length === 1 ? "vehicle" : "vehicles"}
                </p>
              </div>
            </div>

            {filteredAndSortedCars.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 py-24 text-center">
                <p className="mb-2 text-xl font-black text-slate-900">
                  No matching vehicles found
                </p>
                <p className="mx-auto mb-8 max-w-sm font-medium text-slate-500">
                  Try clearing a few filters to see a broader selection.
                </p>
                <button
                  type="button"
                  onClick={clearAll}
                  className="inline-block rounded-xl bg-[#0071d2] px-8 py-4 text-xs font-black uppercase tracking-[0.2em] text-white shadow-xl shadow-[#0071d2]/20"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid gap-10 sm:grid-cols-2 xl:grid-cols-3">
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
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        Clean WA title available
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      <section className="relative overflow-hidden bg-slate-900 px-6 py-24 text-white">
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <h3 className="mb-6 text-3xl font-black tracking-tighter">
            Can&apos;t find what you&apos;re looking for?
          </h3>
          <p className="mb-10 font-medium leading-relaxed text-slate-400">
            Our auction network updates daily with thousands of vehicles from
            Manheim, ADESA, and DAA Seattle. Tell us your specific requirements,
            and we&apos;ll source it directly.
          </p>
          <Link
            href="/contact-us"
            className="rounded-xl bg-[#0071d2] px-10 py-5 text-xs font-black uppercase tracking-widest text-white transition-colors hover:bg-white hover:text-slate-900"
          >
            Request custom search
          </Link>
        </div>
      </section>
    </>
  );
}
