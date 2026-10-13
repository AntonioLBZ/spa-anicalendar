'use client';

import clsx from 'clsx';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Link } from '@/components';
import { PROVIDER_LABELS } from '@/contexts/settings-context/options';

import './profile-banner.css';

import type { ProfileBannerProps } from './profile-banner.types';

const ProfileBanner = (props: ProfileBannerProps) => {
    const { user, provider } = props;
    const t = useTranslations('profileBanner');
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    const bannerClsx = clsx('profile-banner', isImageLoaded && 'profile-banner--image-loaded');

    return (
        <section className={bannerClsx} aria-busy={!user}>
            <div className="profile-banner__cover">
                {user?.bannerUrl && (
                    <Image
                        className="profile-banner__image"
                        src={user.bannerUrl}
                        alt=""
                        fill
                        onLoad={() => setIsImageLoaded(true)}
                    />
                )}
            </div>
            <div className="profile-banner__identity">
                {user && (
                    <>
                        <Image className="profile-banner__avatar" src={user.avatarUrl} alt="" width={96} height={96} />
                        <h1 className="profile-banner__name title-l">{user.name}</h1>
                        <Link
                            className="profile-banner__link label-s"
                            href={user.siteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {t('viewProfile', { provider: PROVIDER_LABELS[provider] })}
                        </Link>
                    </>
                )}
            </div>
        </section>
    );
};

export { ProfileBanner };
