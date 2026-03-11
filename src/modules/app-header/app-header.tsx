'use client';

import Image from 'next/image';
import { Link } from 'react-aria-components';

import { Settings } from '@/modules/settings';
import { useUserContext } from '@/modules/user-context';
import { Header } from '@/platform/components';

import './app-header.css';

const AppHeader = () => {
    const { user } = useUserContext();

    return (
        <Header.Root>
            <Header.Content>
                <Header.Brand>Anicalendar</Header.Brand>
                <Header.Nav />
                <Header.Actions>
                    {user && (
                        <Link
                            className="app-header__user-link"
                            href={user.siteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Image
                                src={user.avatar.medium}
                                alt={user.name}
                                width={28}
                                height={28}
                                className="app-header__avatar"
                            />
                            <span className="app-header__username body-1">{user.name}</span>
                        </Link>
                    )}
                    <Settings />
                </Header.Actions>
            </Header.Content>
        </Header.Root>
    );
};

export { AppHeader };
