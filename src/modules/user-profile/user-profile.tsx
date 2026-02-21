'use client';

import Image from 'next/image';

import { UserProfileProps } from './user-profile.types';

export const UserProfile = (props: UserProfileProps) => {
    const { userData } = props;

    if (!userData) return <p>Loading user data...</p>;

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
            }}
        >
            {userData?.avatar.medium && (
                <Image
                    src={userData.avatar.medium}
                    alt={userData.name}
                    style={{
                        width: 64,
                        height: 64,
                        borderRadius: '50%',
                    }}
                />
            )}
            <div>
                <p>
                    <strong>Name:</strong> {userData.name}
                </p>
                <p>
                    <strong>ID:</strong> {userData.id}
                </p>
                <p>
                    <strong>Profile:</strong>{' '}
                    <a href={userData.siteUrl} target="_blank" rel="noopener noreferrer">
                        {userData.siteUrl}
                    </a>
                </p>
            </div>
        </div>
    );
};
