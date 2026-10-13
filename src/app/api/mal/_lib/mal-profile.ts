const MAL_PROFILE_URL = 'https://myanimelist.net/profile';

// MAL's API only exposes the signed-in user's picture, so other users' avatars come from their public
// profile page: the sidebar's `user-image` block, lazy-loaded through `data-src`
const AVATAR_REGEX =
    /<div class="user-image[^"]*">\s*<img[^>]*\bdata-src="(https:\/\/cdn\.myanimelist\.net\/[^"]*\/userimages\/[^"]+)"/;

const PROFILE_TIMEOUT_MS = 3000;

// Avatars rarely change, so a day of caching keeps requests to MAL's site to a minimum
const PROFILE_REVALIDATE_SECONDS = 86400;

/** The user's MAL avatar, or `undefined` when they have none or the profile page can't be read. */
async function fetchMalAvatarUrl(username: string): Promise<string | undefined> {
    try {
        const response = await fetch(`${MAL_PROFILE_URL}/${encodeURIComponent(username)}`, {
            signal: AbortSignal.timeout(PROFILE_TIMEOUT_MS),
            next: { revalidate: PROFILE_REVALIDATE_SECONDS },
        });

        if (!response.ok) {
            return undefined;
        }

        const match = AVATAR_REGEX.exec(await response.text());
        return match?.[1].replaceAll('&amp;', '&');
    } catch {
        return undefined;
    }
}

export { fetchMalAvatarUrl };
