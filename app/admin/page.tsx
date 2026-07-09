import Link from "next/link";
import Image from "next/image";
import { Prisma } from "@/app/generated/prisma/client";
import { logoutAction } from "@/app/actions/auth";
import DeleteCarButton from "./components/DeleteCarButton";
import { isRemoteImageUrl, normalizeImageUrl } from "@/lib/imageUrls";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Inventory Control | Novashift Admin" };

const PAGE_SIZE = 24;

type AdminCarRow = {
  id: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  price: number;
  imageUrl: string;
  status: "AVAILABLE" | "SOLD";
};

type AdminSearchParams = {
  q?: string;
  page?: string;
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

function parsePage(value: string | undefined) {
  if (!value) return 1;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 1;
}

function buildAdminCarWhere(query: string) {
  const q = query.trim();
  if (!q) return {};

  const year = Number(q);
  const status = q.toUpperCase();
  const or: Prisma.CarWhereInput[] = [
    { make: { contains: q } },
    { model: { contains: q } },
  ];

  if (Number.isFinite(year)) or.push({ year });
  if (status === "AVAILABLE" || status === "SOLD") or.push({ status });

  return { OR: or };
}

function adminPageHref(page: number, query: string) {
  const params = new URLSearchParams();
  if (query.trim()) params.set("q", query.trim());
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `/admin?${qs}` : "/admin";
}

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<AdminSearchParams>;
}) {
  const params = await searchParams;
  const query = params.q ?? "";
  const requestedPage = parsePage(params.page);
  const where = buildAdminCarWhere(query);

  const [totalCars, inquiryCount, unreadInquiryCount] = await Promise.all([
    prisma.car.count({ where }),
    prisma.contactMessage.count(),
    prisma.contactMessage.count({ where: { readAt: null } }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCars / PAGE_SIZE));
  const currentPage = Math.min(requestedPage, totalPages);
  const pageStart = totalCars === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const pageEnd = Math.min(currentPage * PAGE_SIZE, totalCars);
  const paginationPages = Array.from(
    new Set([1, totalPages, currentPage - 1, currentPage, currentPage + 1])
  )
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b);

  const cars: AdminCarRow[] = await prisma.car.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip: (currentPage - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
  });

  const hasSearch = query.trim().length > 0;

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-[#0071d2]/10">
      <nav className="sticky top-0 z-50 border-b border-slate-100 bg-white/80 px-6 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 transition-all hover:text-[#005ba3]"
            >
              <span className="text-lg transition-transform group-hover:-translate-x-1">
                &lt;-
              </span>
              Portal
            </Link>
            <div className="h-4 w-px bg-slate-200" />
            <h1 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-900">
              Inventory{" "}
              <span className="font-serif italic lowercase tracking-normal text-[#0071d2]">
                Control
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/admin/inquiries"
              className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-600 shadow-sm transition-all hover:border-[#0071d2] hover:text-[#005ba3]"
            >
              Inquiries ({unreadInquiryCount}/{inquiryCount})
            </Link>
            <Link
              href="/admin/add"
              className="rounded-xl bg-[#0071d2] px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-[#0071d2]/10 transition-all hover:bg-slate-950 active:scale-95"
            >
              + Register Asset
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-400 transition-colors hover:text-red-500"
              >
                Exit
              </button>
            </form>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-8 bg-[#0071d2]" />
              <p className="text-[11px] font-black uppercase tracking-[0.4em] text-[#0071d2]">
                Current Holdings
              </p>
            </div>
            <h2 className="text-5xl font-black tracking-tighter text-slate-900">
              Active{" "}
              <span className="font-serif italic text-[#0071d2]">Inventory.</span>
            </h2>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-slate-50 px-6 py-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              {hasSearch ? "Matching Assets" : "Total Assets"}:
              <span className="ml-2 text-slate-900">{totalCars} Units</span>
            </p>
          </div>
        </div>

        <form
          action="/admin"
          className="mb-8 flex flex-col gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 sm:flex-row"
        >
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Search make, model, year, or status"
            className="min-h-12 flex-1 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 outline-none transition-colors focus:border-[#0071d2]"
          />
          <button
            type="submit"
            className="rounded-xl bg-[#0071d2] px-6 py-3 text-[10px] font-black uppercase tracking-widest text-white transition-colors hover:bg-slate-950"
          >
            Search
          </button>
          {hasSearch ? (
            <Link
              href="/admin"
              className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-center text-[10px] font-black uppercase tracking-widest text-slate-500 transition-colors hover:border-[#0071d2] hover:text-[#005ba3]"
            >
              Clear
            </Link>
          ) : null}
        </form>

        {totalCars === 0 ? (
          <div className="rounded-[3rem] border-2 border-dashed border-slate-100 bg-slate-50/50 py-32 text-center">
            <p className="mb-6 font-medium text-slate-400">
              {hasSearch
                ? "No vehicles match that search."
                : "Database is currently empty."}
            </p>
            <Link
              href={hasSearch ? "/admin" : "/admin/add"}
              className="inline-block rounded-2xl bg-slate-950 px-8 py-4 text-[10px] font-black uppercase tracking-widest text-white shadow-xl transition-all hover:bg-[#005ba3]"
            >
              {hasSearch ? "View All Inventory" : "Initialize First Entry"}
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between gap-4">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Showing {pageStart}-{pageEnd} of {totalCars}
              </p>
            </div>

            <div className="overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white shadow-2xl shadow-slate-200/50">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50">
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Asset Detail
                      </th>
                      <th className="hidden px-6 py-6 text-center text-[10px] font-black uppercase tracking-widest text-slate-400 sm:table-cell">
                        Year
                      </th>
                      <th className="hidden px-6 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 md:table-cell">
                        Usage
                      </th>
                      <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Valuation
                      </th>
                      <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Status
                      </th>
                      <th className="px-8 py-6 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Management
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {cars.map((car) => {
                      const imageUrl = normalizeImageUrl(car.imageUrl);

                      return (
                        <tr
                          key={car.id}
                          className="group transition-colors hover:bg-slate-50/80"
                        >
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-4">
                              <div className="relative h-14 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100 shadow-inner">
                                <Image
                                  src={imageUrl}
                                  alt={car.model}
                                  fill
                                  unoptimized={isRemoteImageUrl(imageUrl)}
                                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                                  sizes="80px"
                                />
                              </div>
                              <div>
                                <p className="text-sm font-bold capitalize tracking-tight text-slate-900">
                                  {car.make}
                                </p>
                                <p className="text-xs font-medium uppercase tracking-tighter text-slate-400">
                                  {car.model}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="hidden px-6 py-5 text-center font-serif italic text-slate-500 sm:table-cell">
                            {car.year}
                          </td>
                          <td className="hidden px-6 py-5 text-xs font-bold uppercase tracking-widest text-slate-500 md:table-cell">
                            {car.mileage.toLocaleString()}{" "}
                            <span className="text-[9px] text-slate-300">KM</span>
                          </td>
                          <td className="px-6 py-5">
                            <span className="text-sm font-black text-slate-900">
                              {formatPrice(car.price)}
                            </span>
                          </td>
                          <td className="px-6 py-5">
                            <span
                              className={`inline-flex items-center rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-widest ${
                                car.status === "AVAILABLE"
                                  ? "border border-[#0071d2]/10 bg-[#0071d2]/5 text-[#005ba3]"
                                  : "border border-slate-200 bg-slate-100 text-slate-400"
                              }`}
                            >
                              {car.status === "AVAILABLE" ? "In Stock" : "Sold"}
                            </span>
                          </td>
                          <td className="px-8 py-5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                href={`/admin/edit/${car.id}`}
                                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-600 shadow-sm transition-all hover:border-[#0071d2] hover:text-[#005ba3]"
                              >
                                Edit
                              </Link>
                              <DeleteCarButton carId={car.id} />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {totalPages > 1 ? (
              <nav
                className="mt-8 flex flex-wrap justify-center gap-2"
                aria-label="Admin inventory pagination"
              >
                <Link
                  href={adminPageHref(Math.max(1, currentPage - 1), query)}
                  aria-disabled={currentPage === 1}
                  className={`rounded-xl border px-4 py-3 text-[11px] font-black uppercase tracking-widest transition-colors ${
                    currentPage === 1
                      ? "pointer-events-none border-slate-100 text-slate-300"
                      : "border-slate-200 text-slate-600 hover:border-[#0071d2] hover:text-[#005ba3]"
                  }`}
                >
                  Previous
                </Link>
                {paginationPages.map((page, index) => {
                  const previous = paginationPages[index - 1];
                  const hasGap = previous !== undefined && page - previous > 1;

                  return (
                    <div key={page} className="flex items-center gap-2">
                      {hasGap ? (
                        <span className="px-1 text-sm font-black text-slate-300">
                          ...
                        </span>
                      ) : null}
                      <Link
                        href={adminPageHref(page, query)}
                        aria-current={page === currentPage ? "page" : undefined}
                        className={`flex h-11 min-w-11 items-center justify-center rounded-xl border px-3 text-sm font-black transition-colors ${
                          page === currentPage
                            ? "border-[#0071d2] bg-[#0071d2] text-white"
                            : "border-slate-200 text-slate-600 hover:border-[#0071d2] hover:text-[#005ba3]"
                        }`}
                      >
                        {page}
                      </Link>
                    </div>
                  );
                })}
                <Link
                  href={adminPageHref(Math.min(totalPages, currentPage + 1), query)}
                  aria-disabled={currentPage === totalPages}
                  className={`rounded-xl border px-4 py-3 text-[11px] font-black uppercase tracking-widest transition-colors ${
                    currentPage === totalPages
                      ? "pointer-events-none border-slate-100 text-slate-300"
                      : "border-slate-200 text-slate-600 hover:border-[#0071d2] hover:text-[#005ba3]"
                  }`}
                >
                  Next
                </Link>
              </nav>
            ) : null}
          </>
        )}
      </main>
    </div>
  );
}
