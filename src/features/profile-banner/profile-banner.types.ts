import type { Provider, User } from '@/services';

type ProfileBannerProps = {
    /** The viewed user; absent while it loads, which keeps the banner's space without its identity. */
    user?: User;
    /** Where the user's list comes from, named in the profile link. */
    provider: Provider;
};

export type { ProfileBannerProps };
