import type { ApiProvider } from '../api.types';

const malProvider: ApiProvider = {
    getUserByName: async (name) => ({
        id: 1,
        name,
        avatarUrl: 'https://via.placeholder.com/50',
        siteUrl: `https://myanimelist.net/profile/${name}`,
    }),
    getMediaList: async () => [
        {
            id: 1,
            mediaId: 101,
            title: 'One Piece',
            coverImageUrl: 'https://via.placeholder.com/100',
            episodes: 1100,
            status: 'RELEASING',
            nextAiringEpisode: { airingAt: Math.floor(Date.now() / 1000) + 86400, episode: 1101 },
            siteUrl: 'https://myanimelist.net/anime/21/One_Piece',
            endDate: {},
            isAdult: false,
            season: 'FALL',
            genres: ['Action', 'Adventure'],
            progress: 1090,
            repeat: 0,
        },
    ],
};

export { malProvider };
