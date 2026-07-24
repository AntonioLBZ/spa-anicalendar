'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import { useSettingsContext } from '@/contexts/settings-context';
import { SOURCE_OPTIONS } from '@/contexts/settings-context/options';
import { usePathname, useRouter } from '@/lib/i18n/navigation';

import type { Provider } from '@/services/api/api.types';

const isValidProvider = (value: string | null): value is Provider =>
    SOURCE_OPTIONS.some((option) => option.value === value);

/** Syncs the `provider` URL query param with the persisted settings provider. */
const useSyncProviderWithUrl = () => {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    const { provider, setProvider } = useSettingsContext();

    useEffect(() => {
        const urlProvider = searchParams.get('provider');

        if (isValidProvider(urlProvider)) {
            if (urlProvider !== provider) setProvider(urlProvider);
            return;
        }

        const params = new URLSearchParams(searchParams);
        params.set('provider', provider);
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }, [searchParams, provider, setProvider, router, pathname]);
};

export { useSyncProviderWithUrl };
