"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DashboardSkeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/auth-context";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  PiggyBank, TrendingUp, ScrollText, DollarSign, ArrowUpRight,
  ArrowDownRight, Clock, Calendar, ChevronRight, Bell, Menu, X, LogOut
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Logo } from "@/components/ui/logo";

export default function DashboardPage() {
  const { user, accessToken, logout } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!accessToken) return;
    fetch("/api/dashboard", { headers: { Authorization: `Bearer ${accessToken}` } })
      .then(r => { if (r.status === 401) { logout(); return null; } return r.json(); })
      .then(d => { if (d) setData(d); setLoading(false); })
      .catch(() => { toast.error("Erreur de chargement"); setLoading(false); });
  }, [accessToken]);

  const navItems = [
    { href: "/dashboard", label: "Tableau de bord", icon: PiggyBank },
    { href: "/portefeuille", label: "Portefeuille", icon: DollarSign },
    { href: "/contrats", label: "Contrats", icon: ScrollText },
    { href: "/investissements", label: "Investissements", icon: TrendingUp },
    { href: "/documents", label: "Documents", icon: ScrollText },
    { href: "/profil", label: "Profil", icon: Bell },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <div className="hidden lg:block w-72 bg-white border-r fixed h-full" />
        <div className="flex-1 lg:ml-72 w-full">
          <DashboardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-gray-200 fixed h-full z-30">
        <div className="p-6 border-b">
          <Logo size="md" />
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all">
              <item.icon size={20} /> {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t">
          <button onClick={() => logout()} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all w-full">
            <LogOut size={20} /> Déconnexion
          </button>
        </div>
      </aside>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            <motion.aside initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }} className="fixed top-0 left-0 w-72 h-full bg-white z-50 lg:hidden flex flex-col shadow-xl">
              <div className="p-6 border-b flex items-center justify-between">
                <Logo size="sm" />
                <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-lg hover:bg-gray-100"><X size={20} /></button>
              </div>
              <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all">
                    <item.icon size={20} /> {item.label}
                  </Link>
                ))}
              </nav>
              <div className="p-4 border-t">
                <button onClick={() => { setSidebarOpen(false); logout(); }} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all w-full">
                  <LogOut size={20} /> Déconnexion
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 lg:ml-72">
        <header className="bg-white border-b sticky top-0 z-20">
          <div className="flex items-center justify-between px-4 md:px-6 h-16">
            <button className="lg:hidden p-2 rounded-lg hover:bg-gray-100" onClick={() => setSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <h1 className="text-lg md:text-xl font-semibold text-gray-900 truncate">Bonjour, {user?.firstName} 👋</h1>
            <div className="flex items-center gap-2 md:gap-3">
              <button className="relative p-2 rounded-xl hover:bg-gray-100"><Bell size={20} /><span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" /></button>
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm">{user?.firstName?.[0]}{user?.lastName?.[0]}</div>
            </div>
          </div>
        </header>

        <div className="p-4 md:p-6">
          {/* widgets... */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
            {[
              { icon: PiggyBank, title: "Solde", value: data?.portfolio ? formatCurrency(data.portfolio.balance) : "N/A", change: `+${data?.portfolio?.performance || 0}%`, color: "from-primary-500 to-primary-600" },
              { icon: TrendingUp, title: "Investi", value: formatCurrency(data?.stats?.totalInvested || 0), change: `${data?.stats?.investmentsCount || 0} inv.`, color: "from-emerald-500 to-emerald-600" },
              { icon: ScrollText, title: "Contrats", value: data?.stats?.activeContracts || 0, change: "Actifs", color: "from-amber-500 to-amber-600" },
              { icon: DollarSign, title: "Rendement", value: `${data?.stats?.overallReturn || 0}%`, change: "Global", color: "from-purple-500 to-purple-600" },
            ].map((w, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center justify-between mb-3 md:mb-4">
                      <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br ${w.color} flex items-center justify-center shadow-lg`}><w.icon className="h-5 w-5 md:h-6 md:w-6 text-white" /></div>
                      <Badge variant="success" className="text-xs">{w.change}</Badge>
                    </div>
                    <p className="text-xs md:text-sm text-gray-500">{w.title}</p>
                    <p className="text-lg md:text-2xl font-bold text-gray-900">{w.value}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          {/* ... reste du dashboard ... */}
        </div>
      </div>
    </div>
  );
}
