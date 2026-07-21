'use client';

import { useTranslations } from 'next-intl';

import { Link } from '@/components';
import { Link as NavLink } from '@/lib/i18n/navigation';

import './not-found.css';

export default function NotFound() {
    const t = useTranslations('notFound');

    return (
        <main className="not-found">
            <p className="not-found__code label-l">404</p>
            <h1 className="not-found__title title-l">{t('title')}</h1>
            <p className="not-found__subtitle body-l">{t('subtitle')}</p>
            <Link as={NavLink} variant="primary" href="/">
                {t('backHome')}
            </Link>
        </main>
    );
}
