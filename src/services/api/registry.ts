import { anilistProvider } from './anilist';
import { kitsuProvider } from './kitsu';
import { malProvider } from './mal';

import type { ApiProvider, Provider } from './api.types';

const providers: Record<Provider, ApiProvider> = {
    anilist: anilistProvider,
    myanimelist: malProvider,
    kitsu: kitsuProvider,
};

const getProvider = (provider: Provider): ApiProvider => providers[provider];

export { getProvider };
