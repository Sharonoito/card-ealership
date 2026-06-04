"use client";

import { useActionState } from "react";
import type { CarActionState } from "@/app/actions/cars";

type CarFormProps = {
  action: (prevState: CarActionState, formData: FormData) => Promise<CarActionState>;
  initialValues?: {
    make: string;
    model: string;
    year: number;
    mileage: number;
    price: number;
    imageUrl: string;
    status: "AVAILABLE" | "SOLD";
    bodyType?: string | null;
    transmission?: string | null;
    fuelType?: string | null;
    condition?: string | null;
    exteriorColor?: string | null;
    interiorColor?: string | null;
    trim?: string | null;
    drivetrain?: string | null;
    engine?: string | null;
    vehicleHistory?: string | null;
    gasMileage?: string | null;
    isNew?: boolean;
    titleStatus?: string | null;
    inspectionStatus?: string | null;
    biddingStatus?: string | null;
    marketStatus?: string | null;
    location?: string | null;
    features?: string[];
    interiorImageUrl?: string;
    additionalImageUrls?: string[];
  };
  submitLabel: string;
};

const currentYear = new Date().getFullYear();

// REFINED STYLES: Switched bg-white to bg-slate-100/50 for a soft grey tint
const inputStyles = "w-full bg-slate-100/50 rounded-2xl border border-slate-200/60 px-6 py-4 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-[#0071d2]/20 focus:border-[#0071d2] shadow-inner transition-all text-sm font-medium outline-none";
const labelStyles = "text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1 mb-2 block";

export default function CarForm({ action, initialValues, submitLabel }: CarFormProps) {
  const [state, formAction, isPending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="space-y-10">
      {state?.error && (
        <div className="rounded-2xl bg-red-50 border border-red-100 px-6 py-4 text-[10px] font-black text-red-600 uppercase tracking-[0.2em] animate-in fade-in slide-in-from-top-2">
          {state.error}
        </div>
      )}

      {/* SECTION: Core Specs */}
      <div className="relative group">
        <div className="absolute -left-4 top-0 bottom-0 w-1 bg-[#0071d2]/20 rounded-full group-hover:bg-[#0071d2] transition-colors" />
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          <div className="flex flex-col">
            <label htmlFor="make" className={labelStyles}>
              Manufacturer <span className="text-[#0071d2]">/ 01</span>
            </label>
            <input
              id="make"
              name="make"
              type="text"
              required
              defaultValue={initialValues?.make}
              placeholder="e.g. BMW"
              className={inputStyles}
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="model" className={labelStyles}>
              Model Designation <span className="text-[#0071d2]">/ 02</span>
            </label>
            <input
              id="model"
              name="model"
              type="text"
              required
              defaultValue={initialValues?.model}
              placeholder="e.g. M4 Competition"
              className={inputStyles}
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="year" className={labelStyles}>
              Production Year <span className="text-[#0071d2]">/ 03</span>
            </label>
            <input
              id="year"
              name="year"
              type="number"
              required
              min={1900}
              max={currentYear + 1}
              defaultValue={initialValues?.year}
              placeholder={String(currentYear)}
              className={inputStyles}
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="mileage" className={labelStyles}>
              Logged Mileage <span className="text-[#0071d2]">/ 04</span>
            </label>
            <input
              id="mileage"
              name="mileage"
              type="number"
              required
              min={0}
              defaultValue={initialValues?.mileage}
              placeholder="e.g. 12000"
              className={inputStyles}
            />
          </div>
        </div>
      </div>

      {/* SECTION: Financials & Status */}
      <div className="p-8 rounded-[2rem] bg-[#0071d2]/5/50 border border-[#0071d2]/10/50 grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div className="flex flex-col">
          <label htmlFor="price" className={labelStyles}>
            Listing Price (USD) <span className="text-[#005ba3]">/ 05</span>
          </label>
          <div className="relative">
             <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">$</span>
             <input
                id="price"
                name="price"
                type="number"
                required
                min={0}
                step="0.01"
                defaultValue={initialValues?.price}
                placeholder="0.00"
                className={`${inputStyles} pl-10 bg-white border-[#0071d2]/10`}
              />
          </div>
        </div>

        <div className="flex flex-col">
          <label htmlFor="status" className={labelStyles}>
            Market Availability <span className="text-[#005ba3]">/ 06</span>
          </label>
          <div className="relative">
            <select
              id="status"
              name="status"
              required
              defaultValue={initialValues?.status ?? "AVAILABLE"}
              className={`${inputStyles} bg-white border-[#0071d2]/10 appearance-none cursor-pointer`}
            >
              <option value="AVAILABLE">Available for Auction</option>
              <option value="SOLD">Sold / Archive</option>
            </select>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-[#005ba3] text-xs">▼</div>
          </div>
        </div>
      </div>

      {/* SECTION: Detail Page Status */}
      <div className="relative group">
        <div className="absolute -left-4 top-0 bottom-0 w-1 bg-amber-500/20 rounded-full group-hover:bg-amber-500 transition-colors" />
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { id: "titleStatus", label: "Title", placeholder: "Guaranteed Clean", val: initialValues?.titleStatus ?? "Guaranteed Clean" },
            { id: "inspectionStatus", label: "Inspection", placeholder: "Pass", val: initialValues?.inspectionStatus ?? "Pass" },
            { id: "biddingStatus", label: "Bidding", placeholder: "Active", val: initialValues?.biddingStatus ?? "Active" },
            { id: "marketStatus", label: "Market Status", placeholder: "Auction Ready", val: initialValues?.marketStatus ?? "Auction Ready" },
            { id: "location", label: "Location", placeholder: "Federal Way, WA", val: initialValues?.location ?? "Federal Way, WA" },
          ].map((field) => (
            <div key={field.id} className="flex flex-col">
              <label htmlFor={field.id} className={labelStyles}>
                {field.label}
              </label>
              <input
                id={field.id}
                name={field.id}
                type="text"
                defaultValue={field.val ?? ""}
                placeholder={field.placeholder}
                className={inputStyles}
              />
            </div>
          ))}
        </div>
      </div>

      {/* SECTION: Visual Media */}
      <div className="flex flex-col gap-6">
        {/* Primary body image */}
        <div className="flex flex-col">
          <label htmlFor="imageUrl" className={labelStyles}>
            Car Body Image URL <span className="text-[#0071d2]">/ 07</span>
          </label>
          <input
            id="imageUrl"
            name="imageUrl"
            type="text"
            inputMode="url"
            autoComplete="off"
            defaultValue={initialValues?.imageUrl}
            placeholder="https://example.com/car-exterior.jpg"
            className={inputStyles}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="flex flex-col">
            <label htmlFor="thumbnailFile" className={labelStyles}>
              Or upload car body photo
            </label>
            <input
              id="thumbnailFile"
              name="thumbnailFile"
              type="file"
              accept="image/*"
              className={inputStyles}
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="interiorImageUrl" className={labelStyles}>
              Interior Image URL
            </label>
            <input
              id="interiorImageUrl"
              name="interiorImageUrl"
              type="text"
              inputMode="url"
              autoComplete="off"
              defaultValue={initialValues?.interiorImageUrl ?? ""}
              placeholder="https://example.com/car-interior.jpg"
              className={inputStyles}
            />
          </div>
        </div>

        <div className="flex flex-col">
          <label htmlFor="interiorImageFile" className={labelStyles}>
            Or upload interior photo
          </label>
          <input
            id="interiorImageFile"
            name="interiorImageFile"
            type="file"
            accept="image/*"
            className={inputStyles}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="additionalImages" className={labelStyles}>
            More image URLs <span className="text-slate-400">(comma separated)</span>
          </label>
          <textarea
            id="additionalImages"
            name="additionalImages"
            rows={4}
            defaultValue={initialValues?.additionalImageUrls?.join(", ") ?? ""}
            placeholder="https://...jpg, https://...jpg"
            className={`${inputStyles} resize-none`}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="additionalImageFiles" className={labelStyles}>
            Or upload more photos
          </label>
          <input
            id="additionalImageFiles"
            name="additionalImageFiles"
            type="file"
            accept="image/*"
            multiple
            className={inputStyles}
          />
          <div className="flex items-center gap-2 mt-4 ml-1">
            <span className="h-1 w-1 bg-[#0071d2] rounded-full" />
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">
              Position 0 is the body image. Position 1 is the interior image. More photos append after that.
            </p>
          </div>
        </div>
      </div>


      {/* SECTION: Extended Filters */}
      <div className="relative group">
        <div className="absolute -left-4 top-0 bottom-0 w-1 bg-emerald-500/20 rounded-full group-hover:bg-emerald-500 transition-colors" />
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { id: "bodyType", label: "Body Type", placeholder: "e.g. Sedan, SUV", val: initialValues?.bodyType },
            { id: "transmission", label: "Transmission", placeholder: "e.g. Automatic", val: initialValues?.transmission },
            { id: "fuelType", label: "Fuel Type", placeholder: "e.g. Gasoline", val: initialValues?.fuelType },
            { id: "condition", label: "Condition", placeholder: "Tier 1 Certified", val: initialValues?.condition ?? "Tier 1 Certified" },
            { id: "exteriorColor", label: "Exterior Color", placeholder: "e.g. Alpine White", val: initialValues?.exteriorColor },
            { id: "interiorColor", label: "Interior Color", placeholder: "e.g. Black Leather", val: initialValues?.interiorColor },
            { id: "trim", label: "Trim", placeholder: "e.g. M Sport", val: initialValues?.trim },
            { id: "drivetrain", label: "Drivetrain", placeholder: "e.g. AWD", val: initialValues?.drivetrain },
            { id: "engine", label: "Engine", placeholder: "e.g. 3.0L I6", val: initialValues?.engine },
            { id: "vehicleHistory", label: "Vehicle History", placeholder: "e.g. Clean title", val: initialValues?.vehicleHistory },
            { id: "gasMileage", label: "Gas Mileage", placeholder: "e.g. 25/32 MPG", val: initialValues?.gasMileage },
          ].map((field) => (
            <div key={field.id} className="flex flex-col">
              <label htmlFor={field.id} className={labelStyles}>
                {field.label}
              </label>
              <input
                id={field.id}
                name={field.id}
                type="text"
                defaultValue={field.val ?? ""}
                placeholder={field.placeholder}
                className={inputStyles}
              />
            </div>
          ))}

          <div className="flex flex-col">
            <label htmlFor="isNew" className={labelStyles}>
              New / Used
            </label>
            <div className="relative">
              <select
                id="isNew"
                name="isNew"
                defaultValue={initialValues?.isNew ? "true" : "false"}
                className={`${inputStyles} appearance-none cursor-pointer`}
              >
                <option value="false">Used</option>
                <option value="true">New</option>
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-[#005ba3] text-xs">▼</div>
            </div>
          </div>

          <div className="flex flex-col sm:col-span-2 lg:col-span-3">
            <label htmlFor="features" className={labelStyles}>
              Features <span className="text-slate-400">(comma separated)</span>
            </label>
            <textarea
              id="features"
              name="features"
              rows={3}
              defaultValue={initialValues?.features?.join(", ") ?? ""}
              placeholder="Sunroof, Heated Seats, Navigation, Blind Spot Monitor..."
              className={`${inputStyles} resize-none`}
            />
          </div>
        </div>
      </div>

      <div className="pt-8 flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="group w-full sm:w-auto flex items-center justify-center gap-3 bg-slate-950 text-white font-black uppercase text-[10px] tracking-[0.3em] py-6 px-12 rounded-2xl hover:bg-[#005ba3] transition-all shadow-2xl shadow-slate-200 active:scale-95 disabled:opacity-60"
        >
          {isPending ? "Synchronizing..." : submitLabel}
          <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
        </button>
      </div>
    </form>
  );
}
