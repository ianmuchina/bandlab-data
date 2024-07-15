// Types used in sqlite database
// Manually created
type uuid = string

export type Creator = {
    id: uuid
    name: string
    username: string
}

export type Pack = {
    id: uuid
    name: string
    slug: string
    description: string
    pack_type: 'loop' | 'looper' | 'multipadSampler' | 'oneShot' | null
    release_date: number
    update_date: number
    creator_id: uuid
}

export type Sample = {
    id: uuid
    version: uuid | null

    name: string
    duration: number
    bars: number
    instrument_id?: string
    pack_id: uuid
    release_date: number
    // waveform?: string
    loop_tempo: number
    loop_key: string
    // size_wav?: number // TODO: Code
    // size_mp3?: number // TODO: Code
}

export type SampleGenre = {
    sample_id: uuid
    genre_name: string
}

export type SampleCharacter = {
    sample_id: uuid
    character_name: string
}

export type User = {
    id: uuid
    username: string
    name: string
    bio: string
}

export type UserCollection = {
    id: uuid
    title: string
    description: string
    user_id: string
}

export type UserCollectionSample = {
    collection_id: uuid
    sample_id: uuid
    date_added: number
    sort_order: number
}

export type UserCollectionPack = {
    collection_id: uuid
    pack_id: uuid
    date_added: number
    sort_order: number
}
