import { Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
const articles = [
  { title: "SmilBank lance son nouveau service d'investissement durable", date: "15/06/2026", excerpt: "Découvrez notre nouvelle gamme de fonds ESG pour investir dans un avenir plus responsable.", category: "Innovation" },
  { title: "Résultats annuels : une croissance record de 15%", date: "01/06/2026", excerpt: "SmilBank affiche des résultats exceptionnels pour l'année 2025, portés par la confiance de nos clients.", category: "Entreprise" },
  { title: "Guide fiscal 2026 : tout ce qu'il faut savoir", date: "20/05/2026", excerpt: "Retrouvez notre guide complet pour optimiser votre déclaration fiscale et vos investissements.", category: "Conseils" },
];
export default function Actualites() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-4">Actualités</h1>
        <p className="text-gray-500 text-center max-w-2xl mx-auto mb-12">Restez informé des dernières nouvelles de SmilBank.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((a, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all">
              <div className="p-6">
                <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-3 py-1 rounded-full">{a.category}</span>
                <h3 className="text-xl font-bold mt-3 mb-2">{a.title}</h3>
                <p className="text-gray-500 text-sm mb-4">{a.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400 flex items-center gap-1"><Calendar size={12} /> {a.date}</span>
                  <Link href="#" className="text-primary-700 text-sm font-medium inline-flex items-center gap-1 hover:gap-2 transition-all">Lire <ArrowRight size={14} /></Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
