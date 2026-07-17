import { anilistProvider } from './anilist';
import { kitsuProvider } from './kitsu';
import { malProvider } from './mal';
import { mockProvider } from './mock';

import type { ApiProvider, Provider } from './api.types';

const providers: Record<Provider, ApiProvider> = {
    anilist: anilistProvider,
    myanimelist: malProvider,
    mock: mockProvider,
    kitsu: kitsuProvider,
};

const getProvider = (provider: Provider): ApiProvider => providers[provider];

export { getProvider };
