import type { ResolvedAccentColor } from './settings-context.types';

/** AniList's preset profile colors, by the scheme derived from each */
const PRESET_SCHEMES: Record<string, ResolvedAccentColor> = {
    blue: 'anilist',
    purple: 'purple',
    pink: 'pink',
    orange: 'orange',
    red: 'red',
    green: 'green',
    gray: 'gray',
};

/** Hue bands (upper bound in degrees, exclusive) a supporter's custom color snaps to */
const HUE_SCHEMES: [number, ResolvedAccentColor][] = [
    [15, 'red'],
    [60, 'orange'],
    [165, 'green'],
    [255, 'anilist'],
    [300, 'purple'],
    [340, 'pink'],
    [360, 'red'],
];

/** Below this chroma (0–1) a custom color reads as gray rather than as its hue */
const MIN_CHROMA = 0.15;

const hexToRgb = (hex: string) => {
    const match = /^#?([0-9a-f]{6})$/i.exec(hex);
    if (!match) return null;
    const value = parseInt(match[1], 16);
    return [(value >> 16) & 255, (value >> 8) & 255, value & 255].map((channel) => channel / 255);
};

/** The color scheme for an AniList profile color: presets map one to one, custom hex colors snap to the nearest. */
const accentFromProfileColor = (profileColor: string | undefined): ResolvedAccentColor | undefined => {
    if (!profileColor) return undefined;
    if (PRESET_SCHEMES[profileColor]) return PRESET_SCHEMES[profileColor];

    const rgb = hexToRgb(profileColor);
    if (!rgb) return undefined;

    const [r, g, b] = rgb;
    const max = Math.max(r, g, b);
    const chroma = max - Math.min(r, g, b);
    if (chroma < MIN_CHROMA) return 'gray';

    let sector: number;
    if (max === r) sector = ((g - b) / chroma + 6) % 6;
    else if (max === g) sector = (b - r) / chroma + 2;
    else sector = (r - g) / chroma + 4;

    const hue = sector * 60;
    return HUE_SCHEMES.find(([limit]) => hue < limit)?.[1] ?? 'red';
};

export { accentFromProfileColor };
