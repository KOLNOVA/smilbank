"use client";
import { useAuth } from "@/context/auth-context";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { LayoutDashboard, Users, ScrollText, FileText, LogOut, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "@/components/ui/logo";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAdmin, isLoading, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push("/connexion");
    if (!isLoading && isAuthenticated && !isAdmin) router.push("/dashboard");
  }, [isLoading, isAuthenticated, isAdmin, router]);

  if (isLoading) return <LoadingScreen />;
  if (!isAuthenticated || !isAdmin) return null;

  const navItems = [
    { href: "/gestion-sb", label: "Vue d'ensemble", icon: LayoutDashboard },
    { href: "/gestion-sb/utilisateurs", label: "Utilisateurs", icon: Users },
    { href: "/gestion-sb/contrats", label: "Contrats", icon: ScrollText },
    { href: "/gestion-sb/documents", label: "Documents", icon: FileText },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900 text-white fixed h-full z-30">
        <div className="p-6 border-b border-slate-700">
          <Logo size="md" className="text-white" />
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-all"><item.icon size={20} /> {item.label}</Link>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-700">
          <button onClick={() => logout()} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all w-full"><LogOut size={20} /> Déconnexion</button>
        </div>
      </aside>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} className="fixed top-0 left-0 w-72 h-full bg-slate-900 text-white z-50 flex flex-col">
              <div className="p-6 border-b border-slate-700 flex items-center justify-between">
                <Logo size="sm" />
                <button onClick={() => setSidebarOpen(false)}><X size={20} /></button>
              </div>
              <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => (<Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-slate-300 hover:bg-slate-800"><item.icon size={20} /> {item.label}</Link>))}
              </nav>
              <div className="p-4 border-t border-slate-700"><button onClick={() => { setSidebarOpen(false); logout(); }} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400 w-full"><LogOut size={20} /> Déconnexion</button></div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 lg:ml-64">
        <header className="bg-white dark:bg-gray-900 border-b dark:border-gray-800 sticky top-0 z-20 flex items-center justify-between px-4 md:px-6 h-16">
          <button className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => setSidebarOpen(true)}><Menu size={24} /></button>
          <h1 className="text-lg font-semibold dark:text-white">Administration</h1>
          <div className="w-8" />
        </header>
        <div className="p-4 md:p-6">{children}</div>
      </div>
    </div>
  );
}
