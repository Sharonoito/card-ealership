import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import { SessionProvider } from "next-auth/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Novashift Auto Dealers",
    template: "%s | Novashift Auto Dealers",
  },
  description: "Browse Novashift Auto Dealers' handpicked collection of premium pre-owned vehicles.",
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full`}>
<body className="min-h-full bg-gray-950 antialiased">
        <SessionProvider>
          <NavBar />
{children}
        <Footer />

        </SessionProvider>
      </body>
    </html>
  );
}
