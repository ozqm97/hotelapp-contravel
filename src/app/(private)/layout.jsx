"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import useAuthGuard from "@/lib/auth/useAuthGuard";
import usePageTransition from "@/lib/hooks/usePageTransition";

export default function PrivateLayout({ children }) {
  usePageTransition();
  useAuthGuard();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 w-full pt-18">
        {children}
      </main>
      <Footer />
    </div>
  );
}
