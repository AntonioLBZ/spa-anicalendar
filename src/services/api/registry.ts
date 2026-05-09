import { anilistProvider } from './anilist';
import { malProvider } from './mal';

import type { ApiProvider, Provider } from './api.types';

const providers: Record<Provider, ApiProvider> = {
    anilist: anilistProvider,
    mal: malProvider,
};

const getProvider = (provider: Provider): ApiProvider => providers[provider];

export { getProvider };
