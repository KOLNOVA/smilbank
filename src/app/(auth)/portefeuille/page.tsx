"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DetailSkeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/auth-context";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight, Clock } from "lucide-react";

export default function PortefeuillePage() {
  const { accessToken, logout } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accessToken) return;
    fetch("/api/portfolios", { headers: { Authorization: `Bearer ${accessToken}` } })
      .then(r => { if (r.status === 401) { logout(); return null; } return r.json(); })
      .then(d => { if (d) setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [accessToken]);

  if (loading) return <DetailSkeleton />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">Portefeuille</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
        {data?.portfolios?.map((p: any) => (
          <Card key={p.id}><CardHeader><CardTitle>{p.name}</CardTitle></CardHeader><CardContent><p className="text-3xl md:text-4xl font-bold">{formatCurrency(p.balance)}</p><Badge variant="success" className="mt-2">+{p.performance}%</Badge></CardContent></Card>
        ))}
      </div>
      <Card><CardHeader><CardTitle>Historique des opérations</CardTitle></CardHeader><CardContent className="divide-y">
        {data?.operations?.map((op: any) => (
          <div key={op.id} className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${op.amount >= 0 ? "bg-green-100" : "bg-red-100"}`}>
                {op.amount >= 0 ? <ArrowUpRight size={18} className="text-green-600" /> : <ArrowDownRight size={18} className="text-red-600" />}
              </div>
              <div><p className="font-medium">{op.description}</p><p className="text-sm text-gray-500 flex items-center gap-1"><Clock size={12} /> {formatDate(op.createdAt)}</p></div>
            </div>
            <span className={`font-semibold ${op.amount >= 0 ? "text-green-600" : "text-red-600"}`}>{op.amount >= 0 ? "+" : ""}{formatCurrency(op.amount)}</span>
          </div>
        ))}
      </CardContent></Card>
    </div>
  );
}
