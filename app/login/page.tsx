import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import LoginForm from "./LoginForm";

export const metadata = { title: "Secure Authentication | Novashift Admin" };

export default async function LoginPage() {
  const session = await auth();
  if (session) redirect("/admin");

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 font-sans selection:bg-[#0071d2]/10">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -right-[5%] h-[500px] w-[500px] bg-[#0071d2]/5 rounded-full blur-3xl opacity-60" />
        <div className="absolute -bottom-[10%] -left-[5%] h-[500px] w-[500px] bg-slate-100 rounded-full blur-3xl opacity-60" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo / Brand */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-[2rem] bg-slate-950 shadow-2xl shadow-[#0071d2]/20/50 rotate-3 group">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-8 w-8 text-[#4a9fe6] group-hover:scale-110 transition-transform"
            >
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
          </div>
          
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="h-[1px] w-4 bg-[#0071d2]" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#0071d2]">
              Administrative
            </p>
            <span className="h-[1px] w-4 bg-[#0071d2]" />
          </div>
          
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">
            Portal <span className="text-[#0071d2] italic font-serif lowercase tracking-normal">Login.</span>
          </h1>
          <p className="mt-4 text-slate-400 text-xs font-bold uppercase tracking-widest">
            Identity verification required for inventory access
          </p>
        </div>

        {/* Card */}
        <div className="rounded-[3.5rem] bg-white p-10 md:p-12 shadow-[0_32px_64px_-15px_rgba(0,0,0,0.08)] border border-slate-100">
          <LoginForm />
        </div>

        {/* Footer Link */}
        <div className="mt-8 text-center">
          <a 
            href="/" 
            className="text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-[#0071d2] transition-colors"
          >
            Return to Public Catalog
          </a>
        </div>
      </div>
    </div>
  );
}