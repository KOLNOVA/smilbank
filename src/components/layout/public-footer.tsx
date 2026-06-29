import Link from "next/link";
import { Mail } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { Logo } from "@/components/ui/logo";

export function PublicFooter() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-10 md:py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        <div className="sm:col-span-2 md:col-span-1">
          <Logo size="md" className="mb-4" inverse />
          <p className="text-gray-400 text-sm mt-4">Votre partenaire de confiance pour construire et protéger votre patrimoine financier.</p>
        </div>
        <div>
          <h5 className="text-white font-semibold mb-3 text-sm">Produits</h5>
          <ul className="space-y-2 text-sm">
            <li><Link href="/services" className="hover:text-accent-400 transition">Gestion de patrimoine</Link></li>
            <li><Link href="/produits" className="hover:text-accent-400 transition">Investissements</Link></li>
            <li><Link href="/produits" className="hover:text-accent-400 transition">Assurances</Link></li>
          </ul>
        </div>
        <div>
          <h5 className="text-white font-semibold mb-3 text-sm">Société</h5>
          <ul className="space-y-2 text-sm">
            <li><Link href="/actualites" className="hover:text-accent-400 transition">Actualités</Link></li>
            <li><Link href="/mentions-legales" className="hover:text-accent-400 transition">Mentions légales</Link></li>
            <li><Link href="/contact" className="hover:text-accent-400 transition">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h5 className="text-white font-semibold mb-3 text-sm">Contact</h5>
          <ul className="space-y-3 text-sm">
            <li>
              <a href="https://wa.me/4552737892" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-green-400 transition">
                <WhatsAppIcon size={18} />
                <span>WhatsApp</span>
              </a>
            </li>
            <li>
              <a href="mailto:contact@smilbank.fr" className="flex items-center gap-2 hover:text-accent-400 transition">
                <Mail size={14} /> contact@smilbank.fr
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Smil-Bank. Tous droits réservés.
      </div>
    </footer>
  );
}
