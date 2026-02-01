import { Header } from '@/components';
import { AlcThemeButton } from '@/modules/alc-theme-button';
import { useUserContext } from '@/modules/alc-body';
import { IUserData } from '@/services/api';
import React from 'react';

const AlcHeader = () => {
    const { user } = useUserContext();

    const userModule = React.useMemo(() => {
        if (user) {
            return <UserModule {...user} />;
        }
        return null;
    }, [user]);

    return (
        <Header>
            {userModule}
            <div>Welcome to Anicalendar!</div>
            <AlcThemeButton />
        </Header>
    );
};

const UserModule = (props: IUserData) => {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div
                className="alc-header__user-image"
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

export { AlcHeader };
