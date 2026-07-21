'use client';

import { useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';

import { Link } from '@/components';
import { Link as NavLink, usePathname } from '@/lib/i18n/navigation';
import { routing } from '@/lib/i18n/routing';

import './footer.css';

const CONTACT_LINKS = [
    { key: 'github', href: 'https://github.com/AntonioLBZ' },
    { key: 'anilist', href: 'https://anilist.co/user/LanZor' },
    { key: 'linkedin', href: 'https://www.linkedin.com/in/antonio-l-b42177229/' },
    { key: 'issues', href: 'https://github.com/AntonioLBZ/spa-anicalendar/issues/new/choose' },
] as const;

const Footer = () => {
    const t = useTranslations('footer');
    const activeLocale = useLocale();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const query = Object.fromEntries(searchParams.entries());

    return (
        <footer className="footer">
            <div className="footer__content">
                <div className="footer__locales" role="group" aria-label={t('languageSwitcherLabel')}>
                    {routing.locales.map((locale) => (
                        <Link
                            key={locale}
                            as={NavLink}
                            href={{ pathname, query }}
                            locale={locale}
                            isDisabled={locale === activeLocale}
                            aria-current={locale === activeLocale ? 'true' : undefined}
                        >
                            {t(`locale.${locale}`)}
                        </Link>
                    ))}
                </div>
                <div className="footer__contact label-m" role="group" aria-label={t('contactLabel')}>
                    {CONTACT_LINKS.map(({ key, href }) => (
                        <Link key={key} className="footer__link" href={href} target="_blank" rel="noopener noreferrer">
                            {t(`contact.${key}`)}
                        </Link>
                    ))}
                </div>
            </div>
        </footer>
    );
};

export { Footer };
