"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, ScrollText, DollarSign, TrendingUp, Search, Plus, Eye, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { useAuth } from "@/context/auth-context";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";

export default function AdminDashboard() {
  const { accessToken, logout } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accessToken) return;
    fetch("/api/gestion-sb/stats", { headers: { Authorization: `Bearer ${accessToken}` } })
      .then(r => { if (r.status === 401) { logout(); return null; } return r.json(); })
      .then(d => { if (d) setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [accessToken]);

  if (loading) return <LoadingScreen />;

  const getBadge = (s: string) => {
    switch(s) {
      case "ACTIVE": return <Badge variant="success"><CheckCircle size={12} className="mr-1" /> Actif</Badge>;
      case "LOCKED": return <Badge variant="destructive"><XCircle size={12} className="mr-1" /> Verrouillé</Badge>;
      default: return <Badge variant="outline">{s}</Badge>;
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">Vue d'ensemble</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Bienvenue sur votre espace d'administration</p>
        </div>
        <div className="flex gap-2">
          <Link href="/gestion-sb/utilisateurs"><Button size="sm"><Plus size={16} className="mr-1" /> Nouveau client</Button></Link>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {[
          { icon: Users, title: "Clients", value: data?.totalUsers || 0, color: "from-blue-500 to-blue-600" },
          { icon: ScrollText, title: "Contrats", value: data?.totalContracts || 0, color: "from-emerald-500 to-emerald-600" },
          { icon: DollarSign, title: "Sous gestion", value: formatCurrency(data?.totalUnderManagement || 0), color: "from-amber-500 to-amber-600" },
          { icon: TrendingUp, title: "Performance", value: "+5.8%", color: "from-purple-500 to-purple-600" },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card><CardContent className="p-4 md:p-6"><div className="flex items-center justify-between mb-3 md:mb-4"><div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-lg`}><s.icon className="h-5 w-5 md:h-6 md:w-6 text-white" /></div></div><p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">{s.title}</p><p className="text-lg md:text-2xl font-bold dark:text-white">{s.value}</p></CardContent></Card>
          </motion.div>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle>Clients récents</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b text-left text-gray-500 dark:text-gray-400"><th className="pb-3 font-medium">Client</th><th className="pb-3 font-medium">Statut</th><th className="pb-3 font-medium text-right">Portefeuille</th></tr></thead>
              <tbody className="divide-y dark:divide-gray-800">
                {data?.recentUsers?.map((u: any) => (
                  <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="py-3"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-700 dark:text-primary-400 font-bold text-xs">{u.firstName[0]}{u.lastName[0]}</div><div><p className="font-medium dark:text-white">{u.firstName} {u.lastName}</p><p className="text-gray-400 text-xs">{u.email}</p></div></div></td>
                    <td className="py-3">{getBadge(u.status)}</td>
                    <td className="py-3 text-right font-medium dark:text-white">{formatCurrency(u.portfolio || 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
