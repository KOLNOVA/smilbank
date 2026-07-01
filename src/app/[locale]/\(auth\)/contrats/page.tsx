"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ListSkeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/auth-context";
import { formatDate } from "@/lib/utils";
import { ScrollText, Calendar } from "lucide-react";

export default function ContratsPage() {
  const { accessToken, logout } = useAuth();
  const [contracts, setContracts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accessToken) return;
    fetch("/api/contracts", { headers: { Authorization: `Bearer ${accessToken}` } })
      .then(r => { if (r.status === 401) { logout(); return null; } return r.json(); })
      .then(d => { if (d) setContracts(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [accessToken]);

  if (loading) return <div className="container mx-auto px-4 py-8"><h1 className="text-2xl md:text-3xl font-bold mb-8">Contrats</h1><ListSkeleton items={3} /></div>;

  const getVariant = (s: string) => s === "ACTIVE" ? "success" : s === "PENDING" ? "warning" : "destructive";

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">Contrats</h1>
      <div className="grid gap-4">
        {contracts.map((c: any) => (
          <Card key={c.id}><CardHeader className="flex flex-row items-center justify-between"><div className="flex items-center gap-3"><div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary-100 flex items-center justify-center"><ScrollText className="h-5 w-5 md:h-6 md:w-6 text-primary-700" /></div><div><CardTitle className="text-base md:text-lg">{c.title}</CardTitle><p className="text-sm text-gray-500">Réf : {c.reference}</p></div></div><Badge variant={getVariant(c.status) as any}>{c.status === "ACTIVE" ? "Actif" : c.status}</Badge></CardHeader><CardContent><div className="flex items-center gap-4 text-sm text-gray-500"><Calendar size={14} /> {formatDate(c.startDate)}</div></CardContent></Card>
        ))}
      </div>
    </div>
  );
}
