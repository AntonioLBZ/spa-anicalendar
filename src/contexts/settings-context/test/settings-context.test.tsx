import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { MemoryStorage } from '@/lib/test/memory-storage';

import { SettingsProvider, useSettingsContext } from '../settings-context';

const memoryStorage = new MemoryStorage();

beforeEach(() => {
    vi.stubGlobal('localStorage', memoryStorage);
    memoryStorage.setItem('anicalendar-settings', JSON.stringify({ accentColor: 'profile', profileAccentColor: null }));
});

afterEach(() => {
    vi.unstubAllGlobals();
    memoryStorage.clear();
});

const renderSettings = () => renderHook(() => useSettingsContext(), { wrapper: SettingsProvider });

describe('SettingsProvider color scheme', () => {
    it('follows the original blue until an AniList profile color is known', () => {
        const { result } = renderSettings();

        expect(result.current.accentColor).toBe('profile');
        expect(result.current.resolvedAccentColor).toBe('default');
    });

    it("applies the last viewed profile's scheme while following the profile", () => {
        const { result } = renderSettings();

        act(() => result.current.setProfileAccentColor('green'));

        expect(result.current.resolvedAccentColor).toBe('green');
        expect(JSON.parse(memoryStorage.getItem('anicalendar-settings') ?? '{}').profileAccentColor).toBe('green');
    });

    it('keeps an explicitly chosen scheme when a profile color arrives', () => {
        const { result } = renderSettings();

        act(() => result.current.setAccentColor('red'));
        act(() => result.current.setProfileAccentColor('purple'));

        expect(result.current.resolvedAccentColor).toBe('red');
        expect(result.current.profileAccentColor).toBe('purple');
    });
});
