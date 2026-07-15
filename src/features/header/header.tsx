'use client';

import Image from 'next/image';
import { Link } from 'react-aria-components';

import { useSettingsContext } from '@/contexts/settings-context';
import { useUserContext } from '@/contexts/user-context';
import { Settings } from '@/features/settings';

import { ProviderBadge } from './provider-badge';

import './header.css';

const Header = () => {
    const { user } = useUserContext();
    const { provider } = useSettingsContext();

    return (
        <header className="header">
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
                <Link className="header__nav title-m" href="/">
                    Anicalendar
                </Link>
                <div className="header__actions">
                    <Settings />
                </div>
            </div>
        </header>
    );
};

export { Header };
