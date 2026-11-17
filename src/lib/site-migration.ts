/** Where the app lives now */
const CANONICAL_ORIGIN = 'https://anicalendar.albz.app';
const CANONICAL_HOST = new URL(CANONICAL_ORIGIN).host;

/** Old addresses that still serve the app until they're turned into redirects */
const LEGACY_HOSTS = ['anicalendar-lbz.vercel.app'];

// Every persisted store key starts with this (see CLAUDE.md, "Storage keys")
const STORAGE_PREFIX = 'anicalendar-';
const MIGRATE_PARAM = 'migrate';

const isLegacyHost = (host: string) => LEGACY_HOSTS.includes(host.toLowerCase());

const toBase64Url = (text: string) => {
    const bytes = new TextEncoder().encode(text);
    let binary = '';
    bytes.forEach((byte) => (binary += String.fromCharCode(byte)));
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const fromBase64Url = (encoded: string) => {
    const binary = atob(encoded.replace(/-/g, '+').replace(/_/g, '/'));
    return new TextDecoder().decode(Uint8Array.from(binary, (char) => char.charCodeAt(0)));
};

const exportStorage = (storage: Storage): Record<string, string> => {
    const entries: Record<string, string> = {};
    for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i);
        const value = key === null ? null : storage.getItem(key);
        if (key?.startsWith(STORAGE_PREFIX) && value !== null) entries[key] = value;
    }
    return entries;
};

/**
 * Same path on the canonical origin, carrying this origin's saved data in the fragment
 * (never sent to a server) so the new origin can import it.
 */
const buildMigrationUrl = (location: Pick<Location, 'pathname' | 'search'>, storage: Storage | null) => {
    const url = new URL(`${location.pathname}${location.search}`, CANONICAL_ORIGIN);
    try {
        const entries = storage ? exportStorage(storage) : {};
        if (Object.keys(entries).length > 0) url.hash = `${MIGRATE_PARAM}=${toBase64Url(JSON.stringify(entries))}`;
    } catch {}
    return url.toString();
};

/**
 * Imports data carried by `buildMigrationUrl` and strips it from the address bar. Keys already
 * saved on this origin win, so an old link can't overwrite newer data. Returns the imported count.
 */
const importMigratedStorage = (location: Location, storage: Storage, history: History) => {
    const params = new URLSearchParams(location.hash.slice(1));
    const encoded = params.get(MIGRATE_PARAM);
    if (encoded === null) return 0;

    let imported = 0;
    try {
        const entries: unknown = JSON.parse(fromBase64Url(encoded));
        if (entries && typeof entries === 'object' && !Array.isArray(entries)) {
            Object.entries(entries).forEach(([key, value]) => {
                if (!key.startsWith(STORAGE_PREFIX) || typeof value !== 'string') return;
                if (storage.getItem(key) !== null) return;
                storage.setItem(key, value);
                imported++;
            });
        }
    } catch {}

    history.replaceState(history.state, '', `${location.pathname}${location.search}`);
    return imported;
};

export { buildMigrationUrl, CANONICAL_HOST, CANONICAL_ORIGIN, importMigratedStorage, isLegacyHost, LEGACY_HOSTS };
