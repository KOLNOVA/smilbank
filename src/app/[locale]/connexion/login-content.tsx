"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ArrowLeft, Eye, EyeOff, Shield, Lock, Mail, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/context/auth-context";
import { Logo } from "@/components/ui/logo";

const loginSchema = z.object({ email: z.string().email("Email invalide"), password: z.string().min(8, "Minimum 8 caractères") });

export default function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/dashboard";
  const { isAuthenticated, isLoading: authLoading, login } = useAuth();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm({ resolver: zodResolver(loginSchema), defaultValues: { email: "", password: "" } });

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push(redirectTo);
    }
  }, [authLoading, isAuthenticated, redirectTo, router]);

  if (authLoading || isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-700" />
      </div>
    );
  }

  const onSubmit = async (data: { email: string; password: string }) => {
    setError(""); setIsLoading(true);
    const result = await login(data.email, data.password);
    if (!result.success) { setError(result.error || "Erreur de connexion"); setIsLoading(false); return; }
    router.push(redirectTo);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div className="flex-1 flex items-center justify-center p-4 md:p-8 bg-white dark:bg-gray-950 order-2 lg:order-1">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-md">
          <Link href="/" className="inline-flex items-center gap-1 text-gray-500 hover:text-primary-700 dark:hover:text-primary-400 text-sm mb-6 md:mb-8"><ArrowLeft size={16} />Retour</Link>
          <div className="mb-6 md:mb-8">
            <Logo size="lg" />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mt-4 mb-2">Bienvenue</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base">Connectez-vous à votre espace client sécurisé.</p>
          </div>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Email</label>
              <div className="relative"><Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><Input type="email" placeholder="votre@email.com" className="pl-10" {...form.register("email")} disabled={isLoading} /></div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Mot de passe</label>
              <div className="relative"><Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><Input type={showPassword ? "text" : "password"} placeholder="••••••••" className="pl-10 pr-10" {...form.register("password")} disabled={isLoading} /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"><EyeOff size={18} /></button></div>
            </div>
            {error && <div className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-3 rounded-lg text-sm flex items-center gap-2"><Shield size={16} />{error}</div>}
            <Button type="submit" className="w-full h-12 text-base font-semibold" disabled={isLoading}>{isLoading ? <><Loader2 size={18} className="animate-spin mr-2" />Connexion...</> : "Se connecter"}</Button>
          </form>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">Pas encore de compte ? <Link href="/contact" className="text-primary-700 dark:text-primary-400 font-semibold hover:underline">Contactez-nous</Link></p>
        </motion.div>
      </div>
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary-900 to-slate-900 items-center justify-center p-12 relative overflow-hidden order-1 lg:order-2">
        <div className="relative z-10 text-white max-w-lg"><Shield size={48} className="mb-6 text-accent-400" /><h2 className="text-4xl font-bold mb-4">Votre espace sécurisé</h2><p className="text-blue-100 text-lg leading-relaxed mb-8">Accédez à vos comptes, investissements et documents en toute sécurité.</p><ul className="space-y-4">{[ "Connexion 100% sécurisée", "Données chiffrées de bout en bout", "Protection RGPD conforme", "Disponible 24h/24 et 7j/7" ].map((item, i) => (<li key={i} className="flex items-center gap-3"><div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-accent-400 text-xs">✓</div>{item}</li>))}</ul></div>
      </div>
    </div>
  );
}
