import { anilistProvider } from './anilist';
import { malProvider } from './mal';
import { mockProvider } from './mock';

import type { ApiProvider, Provider } from './api.types';

const providers: Record<Provider, ApiProvider> = {
    anilist: anilistProvider,
    mal: malProvider,
    mock: mockProvider,
};

const getProvider = (provider: Provider): ApiProvider => providers[provider];

export { getProvider };
