'use client';

import { useTranslations } from 'next-intl';

import { Link } from '@/lib/i18n/navigation';

import '@/components/button/button.css';
import './not-found.css';

export default function NotFound() {
    const t = useTranslations('notFound');

    return (
        <main className="not-found">
            <p className="not-found__code label-l">404</p>
            <h1 className="not-found__title title-l">{t('title')}</h1>
            <p className="not-found__subtitle body-l">{t('subtitle')}</p>
            <Link className="not-found__link button button--primary button--size-m" href="/">
                {t('backHome')}
            </Link>
        </main>
    );
}
