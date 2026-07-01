"use client";
import { useEffect, useState } from "react";
import { ListSkeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/auth-context";
import { formatDate } from "@/lib/utils";
import { Download } from "lucide-react";

export default function DocumentsPage() {
  const { accessToken, logout } = useAuth();
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accessToken) return;
    fetch("/api/documents", { headers: { Authorization: `Bearer ${accessToken}` } })
      .then(async r => {
        if (r.status === 401) { logout(); return []; }
        const data = await r.json();
        return Array.isArray(data) ? data : [];
      })
      .then(d => { setDocuments(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [accessToken]);

  if (loading) return <div className="container mx-auto px-4 py-8"><h1 className="text-2xl md:text-3xl font-bold mb-8">Documents</h1><ListSkeleton items={4} /></div>;

  const icons: Record<string, string> = { CONTRACT: "📄", INVOICE: "🧾", REPORT: "📊", STATEMENT: "📋", TAX: "🏛️" };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">Documents</h1>
      <div className="space-y-3">
        {documents.length > 0 ? (
          documents.map((doc: any) => (
            <div key={doc.id} className="flex items-center justify-between bg-white dark:bg-gray-900 p-4 rounded-xl border dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-xl">
                  {icons[doc.type] || "📁"}
                </div>
                <div>
                  <p className="font-medium text-sm md:text-base dark:text-white">{doc.title}</p>
                  <p className="text-xs text-gray-400">{doc.type} • {formatDate(doc.createdAt)}</p>
                </div>
              </div>
              <Download size={18} className="text-gray-400 hover:text-primary-700 transition-colors" />
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">Aucun document disponible</p>
        )}
      </div>
    </div>
  );
}
