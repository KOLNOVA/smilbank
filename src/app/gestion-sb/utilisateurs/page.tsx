"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Edit, CheckCircle, XCircle, Shield, UserPlus, X, Loader2, Save, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { useAuth } from "@/context/auth-context";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

const CURRENCIES = [
  { code: "EUR", label: "Euro (€)" },
  { code: "USD", label: "Dollar ($)" },
  { code: "DKK", label: "Couronne danoise (kr)" },
  { code: "GBP", label: "Livre sterling (£)" },
  { code: "CHF", label: "Franc suisse (CHF)" },
  { code: "XOF", label: "Franc CFA (XOF)" },
];

export default function AdminUsersPage() {
  const { accessToken, logout } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => { if (!accessToken) return; fetchUsers(); }, [accessToken]);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/gestion-sb/users", { headers: { Authorization: `Bearer ${accessToken}` } });
      if (res.status === 401) { logout(); return; }
      setUsers(await res.json());
    } catch { toast.error("Erreur"); }
    finally { setLoading(false); }
  };

  const handleEdit = async (userId: string) => {
    try {
      const res = await fetch(`/api/gestion-sb/users/${userId}`, { headers: { Authorization: `Bearer ${accessToken}` } });
      if (res.ok) { setSelectedUser(await res.json()); setShowEditModal(true); }
    } catch { toast.error("Erreur"); }
  };

  const handleDelete = async (userId: string, userName: string) => {
    if (!confirm(`Supprimer ${userName} ?`)) return;
    const res = await fetch(`/api/gestion-sb/users/${userId}`, { method: "DELETE", headers: { Authorization: `Bearer ${accessToken}` } });
    if (res.ok) { toast.success("Supprimé"); fetchUsers(); }
    else toast.error("Erreur");
  };

  if (loading) return <LoadingScreen />;

  const filteredUsers = users.filter(u =>
    u.firstName?.toLowerCase().includes(search.toLowerCase()) ||
    u.lastName?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div><h1 className="text-2xl font-bold dark:text-white">Utilisateurs</h1><p className="text-gray-500 dark:text-gray-400 mt-1">{users.length} utilisateurs</p></div>
        <Button onClick={() => setShowCreateModal(true)}><UserPlus size={16} className="mr-1" /> Nouveau client</Button>
      </div>

      <Card className="mb-6"><CardContent className="p-4"><div className="relative"><Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><Input placeholder="Rechercher..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} /></div></CardContent></Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-gray-50 dark:bg-gray-900 text-left text-gray-500 dark:text-gray-400"><th className="p-4">Utilisateur</th><th className="p-4">Rôle</th><th className="p-4">Statut</th><th className="p-4">Portefeuille</th><th className="p-4 text-right">Actions</th></tr></thead>
            <tbody className="divide-y dark:divide-gray-800">
              {filteredUsers.map((user: any) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="p-4"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-700 dark:text-primary-400 font-bold">{user.firstName?.[0]}{user.lastName?.[0]}</div><div><p className="font-medium dark:text-white">{user.firstName} {user.lastName}</p><p className="text-gray-400 text-xs">{user.email}</p></div></div></td>
                  <td className="p-4">{user.role === "SUPER_ADMIN" ? <Badge className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300"><Shield size={12} className="mr-1" /> Admin</Badge> : <Badge variant="outline">Client</Badge>}</td>
                  <td className="p-4">{user.status === "ACTIVE" ? <Badge variant="success"><CheckCircle size={12} className="mr-1" /> Actif</Badge> : <Badge variant="outline">{user.status}</Badge>}</td>
                  <td className="p-4 font-medium dark:text-white">
                    {formatCurrency(user.portfolio)} {user.currency && user.currency !== "EUR" ? user.currency : ""}
                  </td>
                  <td className="p-4"><div className="flex justify-end gap-1"><button onClick={() => handleEdit(user.id)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-primary-700"><Edit size={16} /></button><button onClick={() => handleDelete(user.id, user.firstName)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-red-600"><Trash2 size={16} /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {showCreateModal && <CreateUserModal onClose={() => setShowCreateModal(false)} onSuccess={() => { setShowCreateModal(false); fetchUsers(); }} accessToken={accessToken!} />}
      {showEditModal && selectedUser && <EditUserModal user={selectedUser} onClose={() => { setShowEditModal(false); setSelectedUser(null); }} onSuccess={() => { setShowEditModal(false); setSelectedUser(null); fetchUsers(); }} accessToken={accessToken!} />}
    </div>
  );
}

function CreateUserModal({ onClose, onSuccess, accessToken }: { onClose: () => void; onSuccess: () => void; accessToken: string }) {
  const [form, setForm] = useState({ email: "", password: "", firstName: "", lastName: "", currency: "EUR", initialBalance: "0" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSubmitting(true);
    try {
      const res = await fetch("/api/gestion-sb/users", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify(form),
      });
      if (res.ok) { toast.success("Client créé !"); onSuccess(); }
      else { const d = await res.json(); toast.error(d.error || "Erreur"); }
    } catch { toast.error("Erreur"); }
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between mb-4"><h2 className="text-xl font-bold dark:text-white">Nouveau client</h2><button onClick={onClose}><X size={20} /></button></div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input placeholder="Prénom" value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} required />
            <Input placeholder="Nom" value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} required />
          </div>
          <Input type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
          <Input type="password" placeholder="Mot de passe (min 8 car.)" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
          <div>
            <label className="text-sm text-gray-500 dark:text-gray-400 mb-1 block">Devise du portefeuille</label>
            <select
              value={form.currency}
              onChange={e => setForm({...form, currency: e.target.value})}
              className="w-full h-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 text-sm dark:text-white"
            >
              {CURRENCIES.map(c => (
                <option key={c.code} value={c.code}>{c.label}</option>
              ))}
            </select>
          </div>
          <Input type="number" placeholder="Solde initial" value={form.initialBalance} onChange={e => setForm({...form, initialBalance: e.target.value})} />
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>Annuler</Button>
            <Button type="submit" disabled={submitting}>{submitting ? <Loader2 size={16} className="animate-spin mr-1" /> : "Créer"}</Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

function EditUserModal({ user, onClose, onSuccess, accessToken }: { user: any; onClose: () => void; onSuccess: () => void; accessToken: string }) {
  const [form, setForm] = useState({ firstName: user.firstName || "", lastName: user.lastName || "", email: user.email || "", phone: user.phone || "", status: user.status || "ACTIVE", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [portfolios, setPortfolios] = useState<any[]>(user.portfolios || []);
  const [showNewPortfolio, setShowNewPortfolio] = useState(false);
  const [newPortfolio, setNewPortfolio] = useState({ name: "", balance: 0, currency: "EUR" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSubmitting(true);
    const body: any = { firstName: form.firstName, lastName: form.lastName, email: form.email, phone: form.phone, status: form.status };
    if (form.password) body.password = form.password;
    const res = await fetch(`/api/gestion-sb/users/${user.id}`, { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` }, body: JSON.stringify(body) });
    if (res.ok) { toast.success("Modifié !"); onSuccess(); }
    else { const d = await res.json(); toast.error(d.error || "Erreur"); }
    setSubmitting(false);
  };

  const handleUpdatePortfolio = async (portfolioId: string) => {
    setSavingId(portfolioId);
    const p = portfolios.find(p => p.id === portfolioId);
    if (!p) return;
    const res = await fetch(`/api/gestion-sb/portfolios/${portfolioId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify({ balance: Number(p.balance), name: p.name, currency: p.currency }),
    });
    if (res.ok) toast.success("Solde mis à jour !");
    else toast.error("Erreur");
    setSavingId(null);
  };

  const handleCreatePortfolio = async () => {
    if (!newPortfolio.name) return;
    setSavingId("new");
    const res = await fetch("/api/gestion-sb/portfolios", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify({ userId: user.id, name: newPortfolio.name, balance: Number(newPortfolio.balance), currency: newPortfolio.currency }),
    });
    if (res.ok) {
      toast.success("Portefeuille créé !");
      const created = await res.json();
      setPortfolios([...portfolios, created]);
      setShowNewPortfolio(false);
      setNewPortfolio({ name: "", balance: 0, currency: "EUR" });
    } else toast.error("Erreur");
    setSavingId(null);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4"><h2 className="text-xl font-bold dark:text-white">{user.firstName} {user.lastName}</h2><button onClick={onClose}><X size={20} /></button></div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3"><div><label className="text-xs text-gray-500">Prénom</label><Input value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} /></div><div><label className="text-xs text-gray-500">Nom</label><Input value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} /></div></div>
          <div><label className="text-xs text-gray-500">Email</label><Input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
          <div><label className="text-xs text-gray-500">Téléphone</label><Input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div>
          <div><label className="text-xs text-gray-500">Statut</label><select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full h-10 rounded-lg border px-3 text-sm dark:bg-gray-900 dark:text-white"><option value="ACTIVE">Actif</option><option value="INACTIVE">Inactif</option><option value="SUSPENDED">Suspendu</option><option value="LOCKED">Verrouillé</option></select></div>
          <div><label className="text-xs text-gray-500">Nouveau mot de passe</label><Input type="password" placeholder="Laisser vide = inchangé" value={form.password} onChange={e => setForm({...form, password: e.target.value})} /></div>

          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
            <div className="flex items-center justify-between mb-3"><p className="text-sm font-semibold dark:text-white">💰 Portefeuilles</p><Button type="button" size="sm" variant="outline" onClick={() => setShowNewPortfolio(true)}><Plus size={14} className="mr-1" /> Ajouter</Button></div>
            {portfolios.map((p: any, i: number) => (
              <div key={p.id} className="flex items-center gap-2 mb-2">
                <Input value={p.name} onChange={e => { const u = [...portfolios]; u[i].name = e.target.value; setPortfolios(u); }} className="text-sm w-36" />
                <Input type="number" value={p.balance} onChange={e => { const u = [...portfolios]; u[i].balance = e.target.value; setPortfolios(u); }} className="text-sm w-28" />
                <select
                  value={p.currency || "EUR"}
                  onChange={e => { const u = [...portfolios]; u[i].currency = e.target.value; setPortfolios(u); }}
                  className="text-sm w-20 h-9 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-900"
                >
                  {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
                </select>
                <Button type="button" size="sm" onClick={() => handleUpdatePortfolio(p.id)} disabled={savingId === p.id}>{savingId === p.id ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}</Button>
              </div>
            ))}
            {showNewPortfolio && (
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <Input placeholder="Nom" value={newPortfolio.name} onChange={e => setNewPortfolio({...newPortfolio, name: e.target.value})} className="text-sm w-36" />
                <Input type="number" placeholder="Solde" value={newPortfolio.balance} onChange={e => setNewPortfolio({...newPortfolio, balance: Number(e.target.value)})} className="text-sm w-28" />
                <select
                  value={newPortfolio.currency}
                  onChange={e => setNewPortfolio({...newPortfolio, currency: e.target.value})}
                  className="text-sm w-20 h-9 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-900"
                >
                  {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
                </select>
                <Button type="button" size="sm" onClick={handleCreatePortfolio} disabled={savingId === "new"}>{savingId === "new" ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}</Button>
                <button onClick={() => setShowNewPortfolio(false)}><X size={14} /></button>
              </div>
            )}
          </div>

          <div className="flex gap-2 justify-end"><Button type="button" variant="outline" onClick={onClose}>Annuler</Button><Button type="submit" disabled={submitting}>{submitting ? <Loader2 size={16} className="animate-spin mr-1" /> : "Enregistrer"}</Button></div>
        </form>
      </motion.div>
    </div>
  );
}
