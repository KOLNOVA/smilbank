"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { useAuth } from "@/context/auth-context";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import { Plus, X, Loader2 } from "lucide-react";

export default function AdminDocumentsPage() {
  const { accessToken, logout } = useAuth();
  const [documents, setDocuments] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!accessToken) return;
    Promise.all([
      fetch("/api/gestion-sb/documents", { headers: { Authorization: `Bearer ${accessToken}` } }),
      fetch("/api/gestion-sb/users", { headers: { Authorization: `Bearer ${accessToken}` } }),
    ]).then(async ([r1, r2]) => {
      if (r1.status === 401 || r2.status === 401) { logout(); return; }
      setDocuments(await r1.json());
      setUsers(await r2.json());
      setLoading(false);
    });
  }, [accessToken]);

  if (loading) return <LoadingScreen />;

  return (
    <div>
      <div className="flex justify-between mb-8">
        <h1 className="text-2xl font-bold dark:text-white">Documents</h1>
        <Button onClick={() => setShowModal(true)}><Plus size={16} className="mr-1" /> Nouveau document</Button>
      </div>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b text-left text-gray-500"><th className="p-4">Titre</th><th className="p-4">Type</th><th className="p-4">Client</th><th className="p-4">Date</th></tr></thead>
            <tbody className="divide-y">
              {documents.map((d: any) => (
                <tr key={d.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="p-4 font-medium">{d.title}</td>
                  <td className="p-4">{d.type}</td>
                  <td className="p-4">{d.user?.firstName} {d.user?.lastName}</td>
                  <td className="p-4">{formatDate(d.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      {showModal && <CreateDocumentModal users={users} accessToken={accessToken!} onClose={() => setShowModal(false)} onSuccess={() => { setShowModal(false); window.location.reload(); }} />}
    </div>
  );
}

function CreateDocumentModal({ users, accessToken, onClose, onSuccess }: any) {
  const [form, setForm] = useState({ userId: "", title: "", type: "CONTRACT", fileName: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSubmitting(true);
    const res = await fetch("/api/gestion-sb/documents", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` }, body: JSON.stringify(form) });
    if (res.ok) { toast.success("Document créé !"); onSuccess(); }
    else { const d = await res.json(); toast.error(d.error); }
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-md shadow-xl">
        <div className="flex justify-between mb-4"><h2 className="text-xl font-bold dark:text-white">Nouveau document</h2><button onClick={onClose}><X size={20} /></button></div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <select value={form.userId} onChange={e => setForm({...form, userId: e.target.value})} className="w-full h-10 rounded-lg border px-3 text-sm dark:bg-gray-900 dark:text-white" required>
            <option value="">Choisir un client</option>
            {users.filter((u: any) => u.role === "CLIENT").map((u: any) => <option key={u.id} value={u.id}>{u.firstName} {u.lastName}</option>)}
          </select>
          <Input placeholder="Titre" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
          <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full h-10 rounded-lg border px-3 text-sm dark:bg-gray-900 dark:text-white">
            <option value="CONTRACT">Contrat</option><option value="INVOICE">Facture</option><option value="REPORT">Rapport</option><option value="STATEMENT">Relevé</option><option value="TAX">Fiscal</option>
          </select>
          <Input placeholder="Nom du fichier (ex: contrat.pdf)" value={form.fileName} onChange={e => setForm({...form, fileName: e.target.value})} required />
          <div className="flex gap-2 justify-end"><Button type="button" variant="outline" onClick={onClose}>Annuler</Button><Button type="submit" disabled={submitting}>{submitting ? <Loader2 size={16} className="animate-spin mr-1" /> : "Créer"}</Button></div>
        </form>
      </div>
    </div>
  );
}
