import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { logoutAction } from "@/app/actions/auth";
import {
  deleteInquiry,
  markInquiryRead,
  markInquiryUnread,
} from "@/app/actions/inquiries";

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

function getPreview(message: string) {
  const singleLine = message.replace(/\s+/g, " ").trim();
  return singleLine.length > 140 ? `${singleLine.slice(0, 140)}...` : singleLine;
}

function buildMailto(input: { email: string; inquiryType: string }) {
  const subject = encodeURIComponent(`Re: ${input.inquiryType}`);
  return `mailto:${input.email}?subject=${subject}`;
}

export default async function AdminInquiriesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: [{ readAt: "asc" }, { createdAt: "desc" }],
  });
  const unreadCount = messages.filter((message) => !message.readAt).length;

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-[#0071d2]/10">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link
              href="/admin"
              className="group text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-[#005ba3] transition-all flex items-center gap-2"
            >
              <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span>
              Inventory
            </Link>
            <div className="hidden h-4 w-[1px] bg-slate-200 sm:block" />
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

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-[10px] font-black uppercase tracking-[0.35em] text-[#0071d2]">
              Website Messages
            </p>
            <h2 className="text-3xl font-black tracking-tighter text-slate-900 sm:text-4xl">
              Client <span className="italic font-serif text-[#0071d2]">Inbox.</span>
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Total <span className="ml-2 text-slate-900">{messages.length}</span>
              </p>
            </div>
            <div className="rounded-xl border border-[#0071d2]/10 bg-[#0071d2]/5 px-4 py-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-[#005ba3]">
                Unread <span className="ml-2">{unreadCount}</span>
              </p>
            </div>
          </div>
        </div>

        {messages.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-slate-100 bg-slate-50/50 py-20 text-center">
            <p className="text-slate-400 font-medium">No client inquiries have been received yet.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl shadow-slate-200/40">
            <div className="hidden grid-cols-[140px_1.1fr_1fr_210px] gap-4 border-b border-slate-100 bg-slate-50 px-5 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 lg:grid">
              <div>Status</div>
              <div>Client</div>
              <div>Message</div>
              <div className="text-right">Actions</div>
            </div>

            <div className="divide-y divide-slate-100">
              {messages.map((message) => {
                const isUnread = !message.readAt;

                return (
                  <details
                    key={message.id}
                    className={`group border-l-4 ${
                      isUnread ? "border-[#0071d2] bg-[#0071d2]/[0.025]" : "border-transparent bg-white"
                    }`}
                    open={isUnread}
                  >
                    <summary className="grid cursor-pointer list-none gap-4 px-5 py-4 hover:bg-slate-50 lg:grid-cols-[140px_1.1fr_1fr_210px] lg:items-center">
                      <div className="flex items-center gap-3">
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${
                            isUnread ? "bg-[#0071d2]" : "bg-slate-300"
                          }`}
                        />
                        <div>
                          <p
                            className={`text-[10px] font-black uppercase tracking-widest ${
                              isUnread ? "text-[#005ba3]" : "text-slate-400"
                            }`}
                          >
                            {isUnread ? "Unread" : "Read"}
                          </p>
                          <time className="mt-1 block text-[10px] font-bold uppercase tracking-widest text-slate-300">
                            {formatDate(message.createdAt)}
                          </time>
                        </div>
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-black text-slate-900">{message.name}</p>
                        <p className="mt-1 truncate text-xs font-bold text-slate-400">{message.inquiryType}</p>
                      </div>

                      <p className="min-w-0 text-sm font-medium leading-6 text-slate-500 lg:truncate">
                        {getPreview(message.message)}
                      </p>

                      <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                        <a
                          href={buildMailto(message)}
                          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:border-[#0071d2] hover:text-[#005ba3]"
                        >
                          Email
                        </a>
                        {message.phone && (
                          <a
                            href={`tel:${message.phone}`}
                            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:border-[#0071d2] hover:text-[#005ba3]"
                          >
                            Call
                          </a>
                        )}
                      </div>
                    </summary>

                    <div className="grid gap-4 px-5 pb-5 lg:grid-cols-[140px_1fr_210px]">
                      <div className="hidden lg:block" />
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-3 text-xs font-bold text-slate-500">
                          <a className="hover:text-[#005ba3]" href={buildMailto(message)}>
                            {message.email}
                          </a>
                          {message.phone && (
                            <a className="hover:text-[#005ba3]" href={`tel:${message.phone}`}>
                              {message.phone}
                            </a>
                          )}
                        </div>
                        <p className="whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-sm font-medium leading-7 text-slate-600">
                          {message.message}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-start gap-2 lg:justify-end">
                        <form action={isUnread ? markInquiryRead : markInquiryUnread}>
                          <input type="hidden" name="id" value={message.id} />
                          <button
                            type="submit"
                            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:border-[#0071d2] hover:text-[#005ba3]"
                          >
                            {isUnread ? "Mark Read" : "Mark Unread"}
                          </button>
                        </form>
                        <form action={deleteInquiry}>
                          <input type="hidden" name="id" value={message.id} />
                          <button
                            type="submit"
                            className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-red-600 hover:bg-red-100"
                          >
                            Delete
                          </button>
                        </form>
                      </div>
                    </div>
                  </details>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
