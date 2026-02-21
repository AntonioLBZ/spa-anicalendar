'use client';

import { Header } from '@/platform/components';
import { ThemeButton } from '@/modules/theme-button';
import { useUserContext } from '@/modules/user-context';
import { UserData } from '@/platform/services/api';

const AppHeader = () => {
    const { user } = useUserContext();

    return (
        <Header>
            {user && <UserModule {...user} />}
            <div>Welcome to Anicalendar!</div>
            <ThemeButton />
        </Header>
    );
};

const UserModule = (props: UserData) => {
    const userImageClsx = 'app-header__user-image';
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div
                className={userImageClsx}
                style={{ aspectRatio: '1', height: '80%', overflow: 'hidden', borderRadius: '3px' }}
            >
                <a href={props.siteUrl} target="_blank" rel="noopener noreferrer">
                    <img
                        src={props.avatar.medium}
                        alt={props.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                </a>
            </div>
            {props.name}
        </div>
    );
};

export { AppHeader };
