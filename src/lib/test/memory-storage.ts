// This repo's jsdom test environment does not provide a `localStorage`
// global (neither bare `localStorage` nor `window.localStorage` exist), so
// `SettingsProvider`'s module-level store — which reads/writes real
// `localStorage` to persist settings — silently no-ops under test. Stub in
// this minimal in-memory Storage implementation via `vi.stubGlobal` so
// hydration/persistence actually works in render tests.
class MemoryStorage implements Storage {
    private store = new Map<string, string>();

    get length() {
        return this.store.size;
    }

    clear = () => this.store.clear();
    getItem = (key: string) => this.store.get(key) ?? null;
    key = (index: number) => Array.from(this.store.keys())[index] ?? null;
    removeItem = (key: string) => {
        this.store.delete(key);
    };
    setItem = (key: string, value: string) => {
        this.store.set(key, String(value));
    };
}

export { MemoryStorage };
