'use client';

import clsx from 'clsx';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { useRef } from 'react';
import { Link } from 'react-aria-components';

import { useSettingsContext } from '@/contexts/settings-context';
import { useUserContext } from '@/contexts/user-context';
import { Settings } from '@/features/settings';

import { ProviderBadge } from './provider-badge';
import { useAutoHideHeader } from './use-auto-hide-header';

import './header.css';

const Header = () => {
    const { user } = useUserContext();
    const { provider } = useSettingsContext();
    const t = useTranslations('header');
    const locale = useLocale();
    const headerRef = useRef<HTMLElement>(null);
    const isHidden = useAutoHideHeader(headerRef);

    return (
        <header ref={headerRef} className={clsx('header', isHidden && 'header--hidden')}>
            <div className="header__content">
                {user && (
                    <Link className="header__user-link" href={user.siteUrl} target="_blank" rel="noopener noreferrer">
                        <span className="header__avatar-wrapper">
                            <Image src={user.avatarUrl} alt={user.name} width={28} height={28} className="header__avatar" />
                            <ProviderBadge provider={provider} />
                        </span>
                        <span className="header__username label-l">{user.name}</span>
                    </Link>
                )}
                {/* react-aria-components' Link is not next-intl-aware; compose the locale into the href */}
                <Link className="header__nav title-m" href={`/${locale}`}>
                    {t('brand')}
                </Link>
                <div className="header__actions">
                    <Settings />
                </div>
            </div>
        </header>
    );
};

export { Header };
