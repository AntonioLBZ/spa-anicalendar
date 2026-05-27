import { anilistProvider } from './anilist';
import { malProvider } from './mal';
import { mockProvider } from './mock';

import type { ApiProvider, Provider } from './api.types';

const providers: Record<Provider, ApiProvider> = {
    anilist: anilistProvider,
    myanimelist: malProvider, // TODO: implement mal provider
    mock: mockProvider, // TODO: remove mock provider
    kitsu: anilistProvider, // TODO: implement kitsu provider
};

const getProvider = (provider: Provider): ApiProvider => providers[provider];

export { getProvider };
