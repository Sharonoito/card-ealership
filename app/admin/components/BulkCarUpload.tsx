"use client";

import { useActionState, useMemo } from "react";
import { Upload } from "lucide-react";
import type { BulkCarUploadState } from "@/app/actions/cars";

type BulkCarUploadProps = {
  action: (
    prevState: BulkCarUploadState,
    formData: FormData
  ) => Promise<BulkCarUploadState>;
};

const requiredColumns = [
  "make",
  "model",
  "year",
  "mileage",
  "price",
  "imageUrl",
];

const optionalColumns = [
  "status",
  "bodyType",
  "transmission",
  "fuelType",
  "condition",
  "exteriorColor",
  "interiorColor",
  "trim",
  "drivetrain",
  "engine",
  "vehicleHistory",
  "gasMileage",
  "isNew",
  "features",
  "interiorImageUrl",
  "additionalImages",
];

const exampleRows = [
  {
    make: "Audi",
    model: "Q5",
    year: "2022",
    mileage: "18450",
    price: "36500",
    imageUrl: "https://example.com/audi-q5.jpg",
    status: "AVAILABLE",
    bodyType: "SUV",
    transmission: "Automatic",
    fuelType: "Gasoline",
    condition: "Excellent",
    exteriorColor: "White",
    interiorColor: "Black",
    trim: "Premium Plus",
    drivetrain: "AWD",
    engine: "2.0L I4",
    vehicleHistory: "Single owner; No accidents",
    gasMileage: "23/28 MPG",
    isNew: "false",
    features: "Bluetooth; Android Auto; Heated Seats",
    interiorImageUrl: "https://example.com/audi-q5-interior.jpg",
    additionalImages: "https://example.com/audi-q5-side.jpg; https://example.com/audi-q5-rear.jpg",
  },
  {
    make: "Geo",
    model: "Tracker",
    year: "1997",
    mileage: "82300",
    price: "6900",
    imageUrl: "/cars/sample-tracker.jpg",
    status: "AVAILABLE",
    bodyType: "SUV",
    transmission: "Manual",
    fuelType: "Gasoline",
    condition: "Good",
    exteriorColor: "Green",
    interiorColor: "Gray",
    trim: "",
    drivetrain: "4WD",
    engine: "1.6L I4",
    vehicleHistory: "Clean title",
    gasMileage: "22 MPG",
    isNew: "false",
    features: "Soft Top; Alloy Wheels",
    interiorImageUrl: "",
    additionalImages: "",
  },
];

function csvEscape(value: string) {
  if (!/[",\n]/.test(value)) return value;
  return `"${value.replace(/"/g, '""')}"`;
}

export default function BulkCarUpload({ action }: BulkCarUploadProps) {
  const [state, formAction, isPending] = useActionState(action, undefined);

  const templateHref = useMemo(() => {
    const headers = [...requiredColumns, ...optionalColumns];
    const rows = [
      headers.join(","),
      ...exampleRows.map((row) =>
        headers
          .map((header) => csvEscape(row[header as keyof typeof row] ?? ""))
          .join(",")
      ),
    ];
    const csv = rows.join("\r\n");
    return `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`;
  }, []);

  return (
    <section className="mt-10 rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-xl shadow-slate-200/40 md:p-10">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.3em] text-[#0071d2]">
            Bulk Inventory Upload
          </p>
          <h2 className="text-3xl font-black tracking-tight text-slate-900">
            Import multiple cars from Excel
          </h2>
          <p className="mt-3 max-w-2xl text-sm font-medium leading-relaxed text-slate-500">
            Download the template, open it in Excel, and fill one row per car.
            You can upload the completed workbook as .xlsx, .xls, or .csv.
            Optional columns can be removed or left blank.
          </p>
        </div>
        <a
          href={templateHref}
          download="novashift-car-bulk-upload-template.csv"
          className="inline-flex items-center justify-center rounded-xl border border-[#0071d2]/20 bg-[#0071d2]/5 px-5 py-3 text-[10px] font-black uppercase tracking-widest text-[#005ba3] transition-colors hover:bg-[#0071d2]/10"
        >
          Download template
        </a>
      </div>

      <div className="mb-8 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
          <h3 className="mb-3 text-[11px] font-black uppercase tracking-widest text-slate-500">
            Required columns
          </h3>
          <div className="flex flex-wrap gap-2">
            {requiredColumns.map((column) => (
              <span
                key={column}
                className="rounded-full bg-slate-950 px-3 py-1.5 text-[11px] font-bold text-white"
              >
                {column}
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
          <h3 className="mb-3 text-[11px] font-black uppercase tracking-widest text-slate-500">
            Optional columns
          </h3>
          <div className="flex flex-wrap gap-2">
            {optionalColumns.map((column) => (
              <span
                key={column}
                className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-bold text-slate-600"
              >
                {column}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-8 overflow-x-auto rounded-2xl border border-slate-100">
        <table className="w-full min-w-[1000px] text-left text-xs">
          <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <tr>
              {[...requiredColumns, ...optionalColumns.slice(0, 8)].map((column) => (
                <th key={column} className="px-4 py-3">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {exampleRows.map((row) => (
              <tr key={`${row.make}-${row.model}`}>
                {[...requiredColumns, ...optionalColumns.slice(0, 8)].map((column) => (
                  <td key={column} className="max-w-48 truncate px-4 py-3 font-medium text-slate-600">
                    {row[column as keyof typeof row] || "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <form action={formAction} className="space-y-5">
        {state?.error ? (
          <div className="rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-bold text-red-600">
            {state.error}
          </div>
        ) : null}

        {state?.success ? (
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-5 py-4 text-sm font-bold text-emerald-700">
            {state.success}
          </div>
        ) : null}

        {state?.rowErrors?.length ? (
          <div className="rounded-2xl border border-amber-100 bg-amber-50 px-5 py-4">
            <p className="mb-2 text-[11px] font-black uppercase tracking-widest text-amber-700">
              Rows needing attention
            </p>
            <ul className="space-y-1 text-sm font-medium text-amber-800">
              {state.rowErrors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
          <input
            name="bulkFile"
            type="file"
            accept=".xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv"
            required
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm font-semibold text-slate-600 file:mr-4 file:rounded-xl file:border-0 file:bg-slate-950 file:px-4 file:py-2 file:text-[10px] file:font-black file:uppercase file:tracking-widest file:text-white"
          />
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center justify-center gap-3 rounded-2xl bg-[#0071d2] px-8 py-4 text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-[#0071d2]/20 transition-colors hover:bg-slate-950 disabled:opacity-60"
          >
            <Upload className="h-4 w-4" aria-hidden="true" />
            {isPending ? "Importing..." : "Import file"}
          </button>
        </div>
      </form>
    </section>
  );
}
