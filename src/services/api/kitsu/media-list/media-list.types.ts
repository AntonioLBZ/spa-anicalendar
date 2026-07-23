interface KitsuMapping {
    type: 'mappings';
    id: string;
    attributes: {
        externalSite: string;
        externalId: string;
    };
}

interface KitsuCategory {
    type: 'categories';
    id: string;
    attributes: {
        title: string;
    };
}

interface KitsuAnimeResource {
    type: 'anime';
    id: string;
    attributes: {
        canonicalTitle: string;
        slug: string;
        posterImage?: { medium?: string; large?: string } | null;
        episodeCount?: number | null;
        episodeLength?: number | null;
        status: 'current' | 'finished' | 'upcoming' | 'tba';
        endDate: string | null;
        ageRating?: string | null;
        subtype?: string | null;
    };
    relationships?: {
        mappings?: { data: Array<{ type: 'mappings'; id: string }> };
        categories?: { data: Array<{ type: 'categories'; id: string }> };
    };
}

interface KitsuLibraryEntry {
    type: 'libraryEntries';
    id: string;
    attributes: {
        status: 'current' | 'planned' | 'completed' | 'on_hold' | 'dropped';
        progress: number;
        reconsumeCount: number;
    };
    relationships: {
        anime: { data: { type: 'anime'; id: string } };
    };
}

type KitsuIncludedResource = KitsuAnimeResource | KitsuMapping | KitsuCategory;

interface KitsuLibraryEntriesResponse {
    data: KitsuLibraryEntry[];
    included?: KitsuIncludedResource[];
}

export type { KitsuMapping, KitsuCategory, KitsuAnimeResource, KitsuLibraryEntry, KitsuIncludedResource, KitsuLibraryEntriesResponse };
