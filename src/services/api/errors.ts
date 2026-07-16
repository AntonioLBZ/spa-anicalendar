import { AnilistUserNotFoundError } from './anilist/client';
import { KitsuUserNotFoundError } from './kitsu/client';
import { MalUserNotFoundError } from './mal/client';

const isUserNotFoundError = (error: unknown): boolean =>
    error instanceof AnilistUserNotFoundError ||
    error instanceof KitsuUserNotFoundError ||
    error instanceof MalUserNotFoundError;

export { isUserNotFoundError };
