"use client";

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { logoutAction } from '../actions/auth';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function NavBar() {
  const { data: session } = useSession();
  const pathname = usePathname();


  return (
    <nav className="border-b border-slate-200 bg-white backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">

      <Link href="/" className="flex items-center gap-3 group">
        <div className="relative h-16 w-40 md:h-24 md:w-64"> 
          <Image 
            src="/novalogo.png" 
            alt="NovaShift Auto Logo" 
            fill
            priority
            className="object-contain"
          />
        </div>
      </Link>

          {/* Navigation Links - Clearer contrast */}
          <div className="hidden md:flex items-center gap-10">
            <Link
              href="/"
              className={`text-sm font-bold uppercase tracking-widest transition ${pathname === '/' ? 'text-[#005ba3]' : 'text-slate-600 hover:text-[#005ba3]'}`}
            >
              Home
            </Link>
            <Link
              href="/cars"
              className={`text-sm font-bold uppercase tracking-widest transition ${pathname === '/cars' ? 'text-[#005ba3]' : 'text-slate-600 hover:text-[#005ba3]'}`}
            >
              Inventory
            </Link>
            <Link
              href="/how-it-works"
              className={`text-sm font-bold uppercase tracking-widest transition ${pathname === '/how-it-works' ? 'text-[#005ba3]' : 'text-slate-600 hover:text-[#005ba3]'}`}
            >
              How It Works
            </Link>
            <Link
              href="/about-us"
              className={`text-sm font-bold uppercase tracking-widest transition ${pathname === '/about-us' ? 'text-[#005ba3]' : 'text-slate-600 hover:text-[#005ba3]'}`}
            >
              About Us
            </Link>
            <Link
              href="/contact-us"
              className={`text-sm font-bold uppercase tracking-widest transition ${pathname === '/contact-us' ? 'text-[#005ba3]' : 'text-slate-600 hover:text-[#005ba3]'}`}
            >
              Contact Us
            </Link>
            {session && (
              <Link
                href="/admin"
                className="text-sm font-bold uppercase tracking-widest text-[#005ba3]"
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
                className="rounded-full bg-slate-900 px-6 py-2.5 text-xs font-bold uppercase tracking-tighter text-white hover:bg-[#005ba3] transition shadow-lg shadow-slate-900/10"
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
