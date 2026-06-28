"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/auth-context";
import { formatDate } from "@/lib/utils";
import { User, Mail, Shield, Clock } from "lucide-react";
import { useEffect, useState } from "react";

export default function ProfilPage() {
  const { user, accessToken, logout } = useAuth();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (!accessToken) return;
    fetch("/api/auth/me", { headers: { Authorization: `Bearer ${accessToken}` } })
      .then(r => { if (r.status === 401) { logout(); return null; } return r.json(); })
      .then(d => { if (d) setProfile(d); });
  }, [accessToken]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Profil</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card><CardHeader><CardTitle className="flex items-center gap-2"><User size={20} /> Informations</CardTitle></CardHeader><CardContent className="space-y-3">
          <p><span className="font-medium">Nom :</span> {profile?.firstName} {profile?.lastName}</p>
          <p className="flex items-center gap-2"><Mail size={16} className="text-gray-400" /> {profile?.email}</p>
          <p><span className="font-medium">Rôle :</span> <Badge variant="outline">{profile?.role}</Badge></p>
        </CardContent></Card>
        <Card><CardHeader><CardTitle className="flex items-center gap-2"><Shield size={20} /> Sécurité</CardTitle></CardHeader><CardContent className="space-y-3">
          <p className="flex items-center gap-2"><Badge variant={profile?.status === "ACTIVE" ? "success" : "warning"}>{profile?.status === "ACTIVE" ? "Actif" : profile?.status}</Badge></p>
          {profile?.lastLoginAt && <p className="flex items-center gap-2"><Clock size={16} className="text-gray-400" /> Dernière connexion : {formatDate(profile.lastLoginAt)}</p>}
        </CardContent></Card>
      </div>
    </div>
  );
}
