"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ListSkeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/auth-context";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp } from "lucide-react";

export default function InvestissementsPage() {
  const { accessToken, logout } = useAuth();
  const [investments, setInvestments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accessToken) return;
    fetch("/api/investments", { headers: { Authorization: `Bearer ${accessToken}` } })
      .then(r => { if (r.status === 401) { logout(); return null; } return r.json(); })
      .then(d => { if (d) setInvestments(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [accessToken]);

  if (loading) return <div className="container mx-auto px-4 py-8"><h1 className="text-2xl md:text-3xl font-bold mb-8">Investissements</h1><ListSkeleton items={3} /></div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">Investissements</h1>
      <div className="grid gap-4">
        {investments.map((inv: any) => (
          <Card key={inv.id}><CardHeader className="flex flex-row items-center justify-between"><div className="flex items-center gap-3"><div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-green-100 flex items-center justify-center"><TrendingUp className="h-5 w-5 md:h-6 md:w-6 text-green-600" /></div><div><CardTitle className="text-base md:text-lg">{inv.name}</CardTitle><p className="text-sm text-gray-500">Investi : {formatCurrency(inv.amount)}</p></div></div><Badge variant="success">+{inv.returnRate}%</Badge></CardHeader><CardContent><p className="text-sm">Valeur actuelle : <span className="font-semibold">{formatCurrency(inv.currentValue)}</span></p></CardContent></Card>
        ))}
      </div>
    </div>
  );
}
