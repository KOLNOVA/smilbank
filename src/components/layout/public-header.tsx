"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "@/components/ui/logo";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export function PublicHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const links = [
    { n: "Services", h: "/services" },
    { n: "Produits", h: "/produits" },
    { n: "Actualités", h: "/actualites" },
    { n: "Contact", h: "/contact" },
  ];

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 border-b ${scrolled ? "bg-white/95 dark:bg-gray-950/95 backdrop-blur shadow-sm border-gray-200 dark:border-gray-800" : "bg-white dark:bg-gray-950 border-transparent"}`}>
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Logo size="md" />

        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          {links.map(l => (
            <Link key={l.n} href={l.h} className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-700 dark:hover:text-primary-400 transition-colors">{l.n}</Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          <Link href="/connexion">
            <Button variant="outline" size="sm">Espace Client</Button>
          </Link>
        </div>

        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-lg">
          <div className="p-4 flex flex-col gap-2">
            {links.map(l => (
              <Link key={l.n} href={l.h} onClick={() => setMobileOpen(false)} className="py-3 px-4 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 text-base font-medium">
                {l.n}
              </Link>
            ))}
            <Link href="/connexion" onClick={() => setMobileOpen(false)} className="mt-2">
              <Button variant="outline" className="w-full">Espace Client</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
