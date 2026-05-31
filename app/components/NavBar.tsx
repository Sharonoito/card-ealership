"use client";

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { logoutAction } from '../actions/auth';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/cars', label: 'Inventory' },
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/about-us', label: 'About Us' },
  { href: '/contact-us', label: 'Contact Us' },
];

export default function NavBar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);

  return (
    <nav className="border-b border-slate-200 bg-white sticky top-0 z-50 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between">

          <Link href="/" onClick={close} className="flex items-center shrink-0">
            <div className="relative h-10 w-28 sm:h-16 sm:w-40 md:h-24 md:w-64">
              <Image
                src="/novalogo.png"
                alt="NovaShift Auto Logo"
                fill
                priority
                className="object-contain"
              />
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8 lg:gap-10">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`text-sm font-bold uppercase tracking-widest transition ${
                  pathname === href ? 'text-[#005ba3]' : 'text-slate-600 hover:text-[#005ba3]'
                }`}
              >
                {label}
              </Link>
            ))}
            {session && (
              <Link
                href="/admin"
                className="text-sm font-bold uppercase tracking-widest text-[#005ba3]"
              >
                Admin Panel
              </Link>
            )}
          </div>

          {/* Desktop Auth + Mobile Hamburger */}
          <div className="flex items-center gap-3">
            <div className="hidden md:block">
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
            </div>

            <button
              className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
            >
              {isOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={close}
                className={`block px-4 py-3 text-sm font-bold uppercase tracking-widest rounded-xl transition ${
                  pathname === href
                    ? 'bg-[#005ba3]/10 text-[#005ba3]'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-[#005ba3]'
                }`}
              >
                {label}
              </Link>
            ))}
            {session && (
              <Link
                href="/admin"
                onClick={close}
                className="block px-4 py-3 text-sm font-bold uppercase tracking-widest rounded-xl text-[#005ba3] hover:bg-[#005ba3]/10 transition"
              >
                Admin Panel
              </Link>
            )}
            <div className="pt-3 mt-2 border-t border-slate-100">
              {session ? (
                <form action={logoutAction}>
                  <button className="w-full rounded-xl bg-slate-100 px-6 py-3 text-xs font-bold uppercase tracking-tighter text-slate-700 hover:bg-slate-200 transition">
                    Sign Out
                  </button>
                </form>
              ) : (
                <Link
                  href="/login"
                  onClick={close}
                  className="block w-full text-center rounded-xl bg-slate-900 px-6 py-3 text-xs font-bold uppercase tracking-tighter text-white hover:bg-[#005ba3] transition"
                >
                  Admin Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
