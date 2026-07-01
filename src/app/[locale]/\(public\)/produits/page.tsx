import type { Metadata } from "next";
import Link from "next/link";
import { TrendingUp, Shield, Home, PiggyBank, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Nos Produits",
  description: "Découvrez notre gamme de produits financiers : investissements, assurances, crédits et épargne.",
};

const produits = [
  { icon: TrendingUp, title: "Investissements", desc: "Actions, obligations, SCPI, private equity. Des solutions performantes pour faire fructifier votre capital." },
  { icon: Shield, title: "Assurances", desc: "Assurance vie, prévoyance, protection des proches. Sécurisez votre avenir." },
  { icon: Home, title: "Crédit Immobilier", desc: "Taux compétitifs, accompagnement personnalisé pour votre résidence ou investissement." },
  { icon: PiggyBank, title: "Épargne", desc: "Livrets, PEL, CEL, assurance-vie. Des solutions adaptées à chaque projet." },
];

export default function ProduitsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 md:py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-4 dark:text-white">Nos produits</h1>
        <p className="text-gray-500 dark:text-gray-400 text-center max-w-2xl mx-auto mb-12">Une gamme complète de produits financiers pour tous vos besoins.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {produits.map((p, i) => (
            <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-4 md:mb-6">
                <p.icon className="h-6 w-6 md:h-7 md:w-7 text-primary-700 dark:text-primary-400" />
              </div>
              <h3 className="text-lg md:text-2xl font-bold mb-2 md:mb-3 dark:text-white">{p.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base mb-4 md:mb-6">{p.desc}</p>
              <Link href="/contact" className="inline-flex items-center gap-1 text-primary-700 dark:text-primary-400 font-semibold hover:gap-2 transition-all text-sm md:text-base">
                En savoir plus <ChevronRight size={16} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
