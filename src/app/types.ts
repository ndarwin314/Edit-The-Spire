export interface SaveInfo {
    steam_id: string;
    profile: string;
    path: string;
    ascension: number
    floor: number
    character: string
    deck_size: number
}

export interface Potion {
    id: string;
    slot_index: number;
}

export interface Relic {
    id: string;
    floor_added_to_deck: number;
}