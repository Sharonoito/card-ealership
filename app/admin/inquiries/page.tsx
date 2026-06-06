import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { logoutAction } from "@/app/actions/auth";

export const metadata = { title: "Client Inquiries | Novashift Admin" };

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export default async function AdminInquiriesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-[#0071d2]/10">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              href="/admin"
              className="group text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-[#005ba3] transition-all flex items-center gap-2"
            >
              <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span>
              Inventory
            </Link>
            <div className="h-4 w-[1px] bg-slate-200" />
            <h1 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em]">
              Client <span className="text-[#0071d2] italic font-serif lowercase tracking-normal">Inquiries</span>
            </h1>
          </div>

          <form action={logoutAction}>
            <button
              type="submit"
              className="px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors"
            >
              Exit
            </button>
          </form>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="h-[1px] w-8 bg-[#0071d2]" />
              <p className="text-[11px] font-black uppercase tracking-[0.4em] text-[#0071d2]">
                Website Messages
              </p>
            </div>
            <h2 className="text-5xl font-black text-slate-900 tracking-tighter">
              Client <span className="italic font-serif text-[#0071d2]">Inbox.</span>
            </h2>
          </div>
          <div className="bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Total Messages: <span className="text-slate-900 ml-2">{messages.length}</span>
            </p>
          </div>
        </div>

        {messages.length === 0 ? (
          <div className="rounded-[3rem] border-2 border-dashed border-slate-100 py-32 text-center bg-slate-50/50">
            <p className="text-slate-400 font-medium">No client inquiries have been received yet.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {messages.map((message) => (
              <article
                key={message.id}
                className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/40"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#0071d2]">
                      {message.inquiryType}
                    </p>
                    <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-900">
                      {message.name}
                    </h3>
                    <div className="mt-3 flex flex-wrap gap-3 text-xs font-bold text-slate-500">
                      <a className="hover:text-[#005ba3]" href={`mailto:${message.email}`}>
                        {message.email}
                      </a>
                      {message.phone && (
                        <a className="hover:text-[#005ba3]" href={`tel:${message.phone}`}>
                          {message.phone}
                        </a>
                      )}
                    </div>
                  </div>

                  <time className="text-[10px] font-black uppercase tracking-widest text-slate-300">
                    {formatDate(message.createdAt)}
                  </time>
                </div>

                <p className="mt-6 whitespace-pre-wrap rounded-2xl bg-slate-50 p-5 text-sm font-medium leading-7 text-slate-600">
                  {message.message}
                </p>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
