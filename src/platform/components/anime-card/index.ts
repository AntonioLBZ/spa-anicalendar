import { AnimeCardRoot } from './anime-card';
import { AnimeCardAiring } from './anime-card-airing';
import { AnimeCardCover } from './anime-card-cover';
import { AnimeCardImage } from './anime-card-image';
import { AnimeCardInfo } from './anime-card-info';
import { AnimeCardPending } from './anime-card-pending';
import { AnimeCardProgress } from './anime-card-progress';
import { AnimeCardStatus } from './anime-card-status';
import { AnimeCardTitle } from './anime-card-title';

const AnimeCard = {
    Root: AnimeCardRoot,
    Airing: AnimeCardAiring,
    Cover: AnimeCardCover,
    Image: AnimeCardImage,
    Info: AnimeCardInfo,
    Pending: AnimeCardPending,
    Progress: AnimeCardProgress,
    Status: AnimeCardStatus,
    Title: AnimeCardTitle,
};

export { AnimeCard };
export type {
    AnimeCardAiringProps,
    AnimeCardCoverProps,
    AnimeCardImageProps,
    AnimeCardInfoProps,
    AnimeCardPendingProps,
    AnimeCardProgressProps,
    AnimeCardRootProps,
    AnimeCardStatusProps,
    AnimeCardTitleProps,
} from './anime-card.types';
