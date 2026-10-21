'use client';

import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useRef } from 'react';

import { Link } from '@/components';
import { Settings } from '@/features/settings';
import { Link as NavLink } from '@/lib/i18n/navigation';

import { BrandLogo } from './brand-logo';
import { useAutoHideHeader } from './use-auto-hide-header';

import './header.css';

const Header = () => {
    const t = useTranslations('header');
    const headerRef = useRef<HTMLElement>(null);
    const { isHidden, isScrolled } = useAutoHideHeader(headerRef);

    const headerClsx = clsx('header', isHidden && 'header--hidden', isScrolled && 'header--scrolled');

    return (
        <header ref={headerRef} className={headerClsx}>
            <div className="header__content">
                <Link as={NavLink} className="header__nav title-m" href="/">
                    <BrandLogo />
                    <span className="header__brand">{t('brand')}</span>
                </Link>
                <div className="header__actions">
                    <Settings />
                </div>
            </div>
        </header>
    );
};

export { Header };
