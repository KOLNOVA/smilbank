import type { Metadata } from "next";
import { ContactForm } from "./contact-form";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contactez Smil-Bank pour toute demande d'information sur nos services financiers.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 md:py-16">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white">Contactez-nous</h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Nos experts sont à votre écoute pour répondre à toutes vos questions.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-12">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 md:p-8 text-center shadow-sm border border-gray-100 dark:border-gray-800">
            <WhatsAppIcon size={40} />
            <h3 className="font-semibold text-lg mt-3 mb-2 dark:text-white">WhatsApp</h3>
            <a
              href="https://wa.me/4552737892"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-700 dark:text-primary-400 font-medium hover:underline"
            >
              Discuter sur WhatsApp
            </a>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Réponse rapide</p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 md:p-8 text-center shadow-sm border border-gray-100 dark:border-gray-800">
            <Mail size={40} className="mx-auto text-primary-600 dark:text-primary-400" />
            <h3 className="font-semibold text-lg mt-3 mb-2 dark:text-white">Email</h3>
            <a href="mailto:contact@smilbank.fr" className="text-gray-900 dark:text-gray-200 font-medium hover:underline">
              contact@smilbank.fr
            </a>
            <p className="text-gray-400 dark:text-gray-500 text-sm">Réponse sous 24h</p>
          </div>
        </div>
        <ContactForm />
      </div>
    </div>
  );
}
