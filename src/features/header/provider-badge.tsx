import type { Provider } from '@/services/api/api.types';

const PROVIDER_BADGE: Record<Provider, { label: string; color: string }> = {
    anilist: { label: 'A', color: '#3DB4F2' },
    myanimelist: { label: 'M', color: '#2E51A2' },
    kitsu: { label: 'K', color: '#FA5A69' },
};

const ProviderBadge = ({ provider }: { provider: Provider }) => {
    const { label, color } = PROVIDER_BADGE[provider];

    return (
        <span className="provider-badge" style={{ backgroundColor: color }} title={provider} aria-hidden="true">
            {label}
        </span>
    );
};

export { ProviderBadge };
