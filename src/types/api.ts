// Types used in API Responses. Has lots of redundant data

// Generic type for api responses
export interface apiResponse<T> {
    data: T
    availableFilters: Filter[]
    paging: Paging

    errors?: Array<{
        name: string
        attribute: string
        params: {
            allowedValues: Array<string>
        }
        message: string
    }>
    errorCode?: number
    message?: string
}

export interface Paging {
    cursors: Cursors
    itemsCount: number
    totalCount: number
    limit: number
}

export interface Cursors {
    after: string | null
}

export interface Filter {
    id: string
    type: string
    count: number
    subfilters: Subfilter[]
}

export interface Subfilter {
    id: string
    type: string
    count: number
}

// Sample
export interface Sample {
    id: string
    sampleId: string
    name: string
    duration?: number
    instrumentId: string | undefined
    genres: string[]
    characters: string[]
    features: SampleFeatures
    waveform: SampleWaveform
    packId: string
    packSlug: string
    releaseDate: string
    bars?: number

    // Redundant data
    version: string | null
    isPremium: boolean
    audioUrl: string
    audioUrlWav: string
    imageUrl: string
}
export interface SampleFeatures {
    oneShot?: SampleOneShot
    loop?: SampleLoop
    looper?: SampleLooper
}
export interface SampleOneShot {
    name: string
}
export interface SampleWaveform {
    length: number
    maxValue: number
    values: number[]
}
export interface SampleLoop {
    tempo: number
    key?: string | null
}
export interface SampleLooper {
    key?: string | null
    tempo: number
    mode: string
    quantization: number
}

// Pack
export interface Pack {
    id: string
    archiveUrl: string
    features: Features
    name: string
    creator: null | Creator
    isPremium: boolean
    description: string
    imageUrl: string
    backgroundImageUrl: string
    audioUrl: string
    updatedAt: string
    releaseDate: string
    genres: string[]
    characters: string[]
    instruments: string[]
    samplesCount: number
    packId: string
    color?: null
}
export interface Features {
    loop?: Loop
    looper?: Looper
    multipadSampler?: MultipadSampler
}
export interface Loop {
    archiveUrl: string
}
export interface Creator {
    name: string
    id: string
    username?: string
    type?: string
}
export interface Looper {
    key?: string | null
    tempo: number
    archiveUrl: string
}
export interface MultipadSampler {
    type: string
    sampleIds: string[]
    samples: SampleFile[]
    key: string
    tempo: number
    kit: {
        layers: {
            attackTime: number
            maxKeyRange: number
            releaseTime: number
            color: number
            tone: number
            sampleId: string
            isLoop: boolean
            loopEndTime: number
            loopStartTime: number
            mutexGroups: number[]
            minVelRange: number
            minKeyRange: number
            volume: number
            isToneEnabled: boolean
            launchMode: number
            startTime: number
            endTime: number
            id: string
            maxVelRange: number
            pitch: number
            crossfadeDur: number
            pan: number
            pitchShift: number
        }
    }
}

export interface SampleFile {
    id: string
    file: string
    status: string
}

// Token
export interface TokenFile {
    id_token: string
    access_token: string
    expires_in: number
    token_type: string
    refresh_token: string
    scope: string
}

// Collection

export interface Collection {
    id: string
    name: string
    imageUrl: string
    audioUrl: string
    color: string
    packs: Array<Pack>
}
