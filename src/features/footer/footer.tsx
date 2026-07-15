'use client';

import { useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';

import { usePathname, useRouter } from '@/lib/i18n/navigation';
import { routing } from '@/lib/i18n/routing';

import './footer.css';

const Footer = () => {
    const t = useTranslations('footer');
    const activeLocale = useLocale();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();

    const query = Object.fromEntries(searchParams.entries());

    return (
        <footer className="footer">
            <div className="footer__content">
                <div className="footer__locales" role="group" aria-label={t('languageSwitcherLabel')}>
                    {routing.locales.map((locale) => (
                        <button
                            key={locale}
                            type="button"
                            className="footer__locale-button"
                            aria-current={locale === activeLocale ? 'true' : undefined}
                            disabled={locale === activeLocale}
                            onClick={() => router.replace({ pathname, query }, { locale })}
                        >
                            {t(`locale.${locale}`)}
                        </button>
                    ))}
                </div>
            </div>
        </footer>
    );
};

export { Footer };
