"use client";

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { logoutAction } from '../actions/auth';

export default function NavBar() {
  const { data: session } = useSession();

  return (
    <nav className="border-b border-slate-200 bg-white backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          
          {/* Brand Logo - Professional Navy & Emerald */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-black tracking-tighter text-slate-900 group-hover:text-emerald-600 transition-colors">
              NOVASHIFT<span className="text-emerald-500 font-light">AUTO</span>
            </span>
          </Link>

          {/* Navigation Links - Clearer contrast */}
          <div className="hidden md:flex items-center gap-10">
            <Link
              href="/"
              className="text-sm font-bold uppercase tracking-widest text-slate-600 hover:text-emerald-600 transition"
            >
              Home
            </Link>
            <Link
              href="/cars"
              className="text-sm font-bold uppercase tracking-widest text-slate-600 hover:text-emerald-600 transition"
            >
              Inventory
            </Link>
            <Link
              href="/how-it-works"
              className="text-sm font-bold uppercase tracking-widest text-slate-600 hover:text-emerald-600 transition"
            >
              How It Works
            </Link>
            <Link
              href="/contact-us"
              className="text-sm font-bold uppercase tracking-widest text-slate-600 hover:text-emerald-600 transition"
            >
              Contact Us
            </Link>
            {session && (
              <Link
                href="/admin"
                className="text-sm font-bold uppercase tracking-widest text-emerald-600"
              >
                Admin Panel
              </Link>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            {session ? (
              <form action={logoutAction}>
                <button className="rounded-full bg-slate-100 px-6 py-2.5 text-xs font-bold uppercase tracking-tighter text-slate-700 hover:bg-slate-200 transition">
                  Sign Out
                </button>
              </form>
            ) : (
              <Link
                href="/login"
                className="rounded-full bg-slate-900 px-6 py-2.5 text-xs font-bold uppercase tracking-tighter text-white hover:bg-emerald-600 transition shadow-lg shadow-slate-900/10"
              >
                Admin Login
              </Link>
            )}
            
            {/* Mobile Menu */}
            <button className="md:hidden p-2 text-slate-900">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
}

// "use client";

// import Link from 'next/link';
// import { useSession } from 'next-auth/react';
// import { logoutAction } from '../actions/auth';

// export default function NavBar() {
//   const { data: session } = useSession();

//   return (
//     <nav className="border-b border-gray-800 bg-gray-900/95 backdrop-blur supports-[backdrop-filter:blur(20px)]:bg-gray-900/50 sticky top-0 z-50">
//       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//         <div className="flex h-16 items-center justify-between">
//           <Link href="/" className="flex items-center gap-2 text-xl font-bold text-white">
//             🚗 AutoHub
//           </Link>

//           <div className="hidden md:flex items-center gap-8">
//             <Link
//               href="/"
//               className="text-lg font-medium text-gray-300 hover:text-amber-400 transition"
//             >
//               Home
//             </Link>
//             <Link
//               href="/cars"
//               className="text-lg font-medium text-gray-300 hover:text-amber-400 transition"
//             >
//               Browse
//             </Link>
//             <Link
//               href="/how-it-works"
//               className="text-lg font-medium text-gray-300 hover:text-amber-400 transition"
//             >
//               How It Works
//             </Link>
//             {session && (
//               <Link
//                 href="/admin"
//                 className="text-lg font-medium text-gray-300 hover:text-amber-400 transition"
//               >
//                 Admin
//               </Link>
//             )}
//           </div>

//           <div className="flex items-center gap-4">
//             {session ? (
//               <form action={logoutAction} className="hidden md:block">
//                 <button className="rounded-lg px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition">
//                   Sign Out
//                 </button>
//               </form>
//             ) : (
//               <Link
//                 href="/login"
//                 className="hidden md:block rounded-lg px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition"
//               >
//                 Admin Login
//               </Link>
//             )}
//             {/* Mobile menu button */}
//             <button className="md:hidden text-gray-300 hover:text-white">
//               <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//               </svg>
//             </button>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// }

