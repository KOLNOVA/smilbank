import { useTranslations } from 'next-intl';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, TrendingUp, Coins, Star, Users, Award, CheckCircle } from "lucide-react";

export default function HomePage() {
  const t = useTranslations('home');
  const c = useTranslations('common');

  return (
    <div>
      <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-slate-900 via-primary-900 to-primary-800 text-white">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">{t('heroTitle')}</h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">{t('heroSubtitle')}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact">
              <Button size="lg" className="bg-accent-500 hover:bg-accent-400 text-slate-900 font-semibold rounded-full px-8 shadow-xl">
                {t('cta')} <ArrowRight className="ml-2" />
              </Button>
            </Link>
            <Link href="/services">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-full px-8">
                {t('discover')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-50 dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Coins, title: c('portfolio'), desc: "Optimisation fiscale et conseils personnalisés." },
              { icon: TrendingUp, title: c('investments'), desc: "Actions, obligations, SCPI, private equity." },
              { icon: Shield, title: c('contracts'), desc: "Assurance vie, prévoyance, protection." },
            ].map((service, i) => (
              <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-sm border">
                <div className="w-14 h-14 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-6">
                  <service.icon className="h-7 w-7 text-primary-700 dark:text-primary-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3 dark:text-white">{service.title}</h3>
                <p className="text-gray-500 dark:text-gray-400">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
