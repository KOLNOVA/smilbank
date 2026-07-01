"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import { ArrowRight, Shield, TrendingUp, Coins, Star, Users, Award, ChevronRight, CheckCircle, BarChart3, PiggyBank, Landmark, Globe, Clock, Phone, Mail } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { useState, useEffect } from "react";

export default function HomePage() {
  const [counters, setCounters] = useState(false);
  useEffect(() => { const t = setTimeout(() => setCounters(true), 500); return () => clearTimeout(t); }, []);

  const fadeInUp = { initial: { opacity: 0, y: 40 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6 } };
  const stagger = (delay: number) => ({ ...fadeInUp, transition: { ...fadeInUp.transition, delay } });

  const testimonials = [
    { name: "Sophie Laurent", role: "Cliente depuis 2019", text: "Grâce à SmilBank, j'ai pu diversifier mon épargne sereinement.", rating: 5, image: "SL" },
    { name: "Marc Dubois", role: "Entrepreneur", text: "Un accompagnement sur-mesure pour mon crédit immobilier.", rating: 5, image: "MD" },
    { name: "Claire Moreau", role: "Cliente depuis 2021", text: "Mon portefeuille a progressé de 12% cette année.", rating: 5, image: "CM" },
  ];

  const stats = [
    { icon: Users, value: 125000, suffix: "+", label: "Clients satisfaits", color: "from-blue-500 to-blue-600" },
    { icon: Coins, value: 4.2, suffix: " Mrd €", label: "Sous gestion", color: "from-emerald-500 to-emerald-600" },
    { icon: Award, value: 98, suffix: "%", label: "Taux de satisfaction", color: "from-amber-500 to-amber-600" },
    { icon: Shield, value: 25, suffix: " ans", label: "D'expérience", color: "from-indigo-500 to-indigo-600" },
  ];

  const services = [
    { icon: Coins, title: "Gestion de patrimoine", desc: "Optimisation fiscale, stratégie patrimoniale et planification successorale.", features: ["Bilan gratuit", "Stratégie personnalisée", "Suivi trimestriel"] },
    { icon: TrendingUp, title: "Investissements", desc: "Actions, obligations, SCPI, private equity et produits structurés.", features: ["Fonds performants", "Gestion pilotée", "Diversification"] },
    { icon: Landmark, title: "Crédits", desc: "Solutions de financement sur-mesure aux meilleurs taux.", features: ["Taux compétitifs", "Rachat de crédit", "Réponse sous 48h"] },
  ];

  return (
    <div className="overflow-hidden">
      {/* HERO */}
      <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-slate-900 via-primary-900 to-primary-800 overflow-hidden">
        <div className="absolute inset-0"><div className="absolute top-0 left-0 w-full h-full opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 25px 25px, white 2px, transparent 0)", backgroundSize: "50px 50px" }} /><div className="absolute top-1/4 right-0 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl" /><div className="absolute bottom-0 left-1/4 w-64 h-64 bg-primary-400/20 rounded-full blur-3xl" /></div>
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-4 py-2 text-sm text-white mb-6 border border-white/20"><span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />Plus de 125 000 clients</div>
              <h1 className="text-5xl md:text-7xl font-bold text-white font-heading leading-tight mb-6">Votre avenir<br /><span className="bg-gradient-to-r from-accent-300 to-accent-500 bg-clip-text text-transparent">mérite le meilleur</span></h1>
              <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-xl leading-relaxed">SmilBank vous accompagne dans tous vos projets financiers avec des solutions personnalisées et une sécurité maximale.</p>
              <div className="flex flex-wrap gap-4">
                <Link href="/contact"><Button size="lg" className="bg-accent-500 hover:bg-accent-400 text-slate-900 font-semibold rounded-full px-8 h-14 text-lg shadow-2xl shadow-accent-500/30">Prendre rendez-vous <ArrowRight className="ml-2 h-5 w-5" /></Button></Link>
                <Link href="/services"><Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-full px-8 h-14 text-lg">Nos services</Button></Link>
              </div>
              <div className="flex items-center gap-6 mt-8 text-white/70 text-sm">
                <span className="flex items-center gap-1"><CheckCircle size={16} className="text-green-400" />Sans engagement</span>
                <span className="flex items-center gap-1"><Clock size={16} />Réponse sous 24h</span>
                <span className="flex items-center gap-1"><Shield size={16} />Données sécurisées</span>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="hidden lg:block">
              <div className="relative"><div className="bg-white/10 backdrop-blur rounded-3xl p-8 border border-white/20 shadow-2xl"><div className="text-white mb-6"><h3 className="text-2xl font-bold mb-2">Simulez votre investissement</h3><p className="text-white/70 text-sm">Projection sur 10 ans</p></div><div className="space-y-4"><div><label className="text-white/80 text-sm block mb-1">Montant initial</label><div className="bg-white/20 rounded-lg p-3 text-white font-semibold">100 000 €</div></div><div><label className="text-white/80 text-sm block mb-1">Rendement estimé</label><div className="bg-white/20 rounded-lg p-3 text-accent-400 font-semibold">+5.8% / an</div></div><div className="bg-accent-500 rounded-xl p-4 mt-4"><p className="text-slate-900 text-sm">Valeur estimée dans 10 ans</p><p className="text-slate-900 text-3xl font-bold">175 000 €</p><p className="text-slate-700 text-xs mt-1">+75 000 € de plus-value</p></div></div></div><div className="absolute -bottom-4 -right-4 w-full h-full bg-accent-500/10 rounded-3xl -z-10" /></div>
            </motion.div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* STATS */}
      <section className="py-20 bg-white relative -mt-16 z-20">
        <div className="container mx-auto px-4"><div className="grid grid-cols-2 md:grid-cols-4 gap-6">{stats.map((stat, i) => (<motion.div key={i} {...stagger(i * 0.1)} className="relative group"><div className="bg-white rounded-2xl p-8 shadow-lg shadow-gray-100 border border-gray-100 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1"><div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-4 shadow-lg`}><stat.icon className="h-7 w-7 text-white" /></div><div className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">{counters ? <CountUp end={stat.value} duration={2.5} separator=" " decimals={stat.value % 1 !== 0 ? 1 : 0} /> : "0"}{stat.suffix}</div><div className="text-gray-500 text-sm">{stat.label}</div></div></motion.div>))}</div></div>
      </section>

      {/* SERVICES */}
      <section className="py-24 bg-gray-50"><div className="container mx-auto px-4"><motion.div {...fadeInUp} className="text-center mb-16"><span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">Nos expertises</span><h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4">Des solutions sur-mesure</h2><p className="text-gray-500 max-w-2xl mx-auto text-lg">Une gamme complète de services financiers conçus pour répondre à tous vos besoins.</p></motion.div><div className="grid grid-cols-1 md:grid-cols-3 gap-8">{services.map((service, i) => (<motion.div key={i} {...stagger(i * 0.15)} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group"><div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center mb-6 group-hover:bg-primary-100 transition-colors"><service.icon className="h-8 w-8 text-primary-700" /></div><h3 className="text-2xl font-bold mb-3 text-gray-900">{service.title}</h3><p className="text-gray-500 mb-6 leading-relaxed">{service.desc}</p><ul className="space-y-2 mb-6">{service.features.map((f, j) => (<li key={j} className="flex items-center gap-2 text-sm text-gray-600"><CheckCircle size={16} className="text-green-500 flex-shrink-0" />{f}</li>))}</ul><Link href="/services" className="inline-flex items-center gap-1 text-primary-700 font-semibold hover:gap-2 transition-all">En savoir plus <ChevronRight size={18} /></Link></motion.div>))}</div></div></section>

      {/* TÉMOIGNAGES */}
      <section className="py-24 bg-white"><div className="container mx-auto px-4"><motion.div {...fadeInUp} className="text-center mb-16"><span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">Témoignages</span><h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4">Ce que disent nos clients</h2></motion.div><div className="grid grid-cols-1 md:grid-cols-3 gap-8">{testimonials.map((t, i) => (<motion.div key={i} {...stagger(i * 0.1)} className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300"><div className="flex gap-1 mb-4">{[...Array(t.rating)].map((_, j) => (<Star key={j} size={18} className="text-accent-500 fill-accent-500" />))}</div><p className="text-gray-700 leading-relaxed mb-6 italic">"{t.text}"</p><div className="flex items-center gap-3"><div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">{t.image}</div><div><p className="font-semibold text-gray-900">{t.name}</p><p className="text-sm text-gray-500">{t.role}</p></div></div></motion.div>))}</div></div></section>

      {/* CTA */}
      <section className="relative py-24 bg-gradient-to-br from-primary-900 to-slate-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10"><div className="absolute top-10 left-10 w-64 h-64 bg-accent-500 rounded-full blur-3xl" /><div className="absolute bottom-10 right-10 w-96 h-96 bg-primary-500 rounded-full blur-3xl" /></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div {...fadeInUp}>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Prêt à construire votre avenir ?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">Prenez rendez-vous avec l'un de nos experts pour une consultation personnalisée et gratuite.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact"><Button size="lg" className="bg-accent-500 hover:bg-accent-400 text-slate-900 font-semibold rounded-full px-10 h-14 text-lg shadow-xl shadow-accent-500/30">Prendre rendez-vous <ArrowRight className="ml-2 h-5 w-5" /></Button></Link>
              <Link href="/connexion"><Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-full px-10 h-14 text-lg">Espace client</Button></Link>
            </div>
            <div className="flex flex-wrap justify-center gap-6 mt-8 text-white/60 text-sm">
              <a href="https://wa.me/4552737892" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-green-400 transition">
                <WhatsAppIcon size={18} /> WhatsApp
              </a>
              <a href="mailto:contact@smilbank.fr" className="flex items-center gap-1 hover:text-accent-400 transition">
                <Mail size={14} /> contact@smilbank.fr
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
