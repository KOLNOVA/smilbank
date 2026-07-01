'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/routing';
import { useState } from 'react';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('common');
  const [open, setOpen] = useState(false);

  const languages = [
    { code: 'fr', label: 'Français' },
    { code: 'en', label: 'English' },
    { code: 'da', label: 'Dansk' },
  ];

  const switchLanguage = (code: string) => {
    router.replace(pathname, { locale: code });
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <Globe size={16} />
        <span className="hidden md:inline">{locale.toUpperCase()}</span>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50 py-1">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => switchLanguage(lang.code)}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                locale === lang.code ? 'font-semibold text-primary-700 dark:text-primary-400' : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              {lang.label}
              {locale === lang.code && ' ✓'}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
