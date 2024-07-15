import fs from 'node:fs'
import type * as db from './../types/db.ts'
import type * as api from './../types/api.ts'

import { DB } from 'https://deno.land/x/sqlite@v3.8/mod.ts'
import { readJson, toUnixTimeStamp } from './util.ts'

let conn: DB
export function genData() {
    console.log('initializing db')
    initDB()
    console.log('importing packs & creators')

    conn.query('begin;')
    importPacksAndCreators()
    conn.query('commit;')

    console.log('importing samples & tags')
    conn.query('begin;')
    importSamplesAndTags()
    conn.query('commit;')

    console.log('downloading collections')
    conn.query('begin;')
    importCollections()
    conn.query('commit;')
}

// Create Tables
function initDB() {
    conn = new DB('data/bandlab-sounds.db')
    conn.execute(fs.readFileSync(`src/db/migrations/0-pragma.sql`, 'utf-8'))
    conn.execute(fs.readFileSync(`src/db/migrations/1-schema.sql`, 'utf-8'))
}

function importPacksAndCreators() {
    const CreatorStmt = conn.prepareQuery(
        `INSERT INTO creators (id, name, username) values(:id, :name, :username);`,
    )
    const PackStmt = conn.prepareQuery(
        `INSERT INTO packs(id, name, slug, description, pack_type, release_date, update_date, creator_id)
VALUES(:id, :name, :slug, :description, :pack_type, :release_date, :update_date, :creator_id);`,
    )

    const apiPacks: Array<api.Pack> = readJson('data/packs.json')

    // Existing Creators to skip
    const creator_ids = conn.query('select id from creators')
    const existingCreators: Record<string, boolean> = {}
    for (let i = 0; i < creator_ids.length; i++) {
        existingCreators[creator_ids[i].toString()] = true
    }
    // Existing Packs to skip
    const packids = conn.query('select id from packs')
    const existingPacks: Record<string, boolean> = {}
    for (let i = 0; i < packids.length; i++) {
        existingPacks[packids[i].toString()] = true
    }

    // New Creators & Packs
    for (let i = 0; i < apiPacks.length; i++) {
        const pack = apiPacks[i]
        // Append Creators if exists
        let CreatorParams: db.Creator = { id: '1000', name: 'unknown', username: 'unknown' }
        if (pack.creator) {
            CreatorParams = {
                id: pack.creator.id,
                name: pack.creator.id,
                username: pack.creator.id,
            }
        }

        // Figure out pack type
        // TODO: More details in schema. maybe separate dbs
        let packType: db.Pack['pack_type'] = null
        if (pack.features.loop) {
            packType = 'loop'
        } else if (pack.features.looper) {
            packType = 'looper'
        } else if (pack.features.multipadSampler) {
            packType = 'multipadSampler'
        } else {
            // Does not happen
            console.error('unkown type')
        }

        const PackParams: db.Pack = {
            id: pack.packId,
            name: pack.name,
            slug: pack.id,
            description: pack.description,
            pack_type: packType,
            // Unix timestamp. Saves space
            release_date: toUnixTimeStamp(pack.releaseDate),
            update_date: toUnixTimeStamp(pack.updatedAt),
            // Explicitly set an empty Creator If none exists
            creator_id: CreatorParams.id,
        }

        // // Add Creator
        if (!existingCreators[CreatorParams.id]) {
            CreatorStmt.execute(CreatorParams)
            existingCreators[CreatorParams.id] = true
        }
        // Add Pack
        if (!existingPacks[PackParams.id]) {
            PackStmt.execute(PackParams)
        }
    }
}

function importSamplesAndTags() {
    const samples: Array<api.Sample> = readJson('data/samples.json')
    const SampleStmt = conn.prepareQuery(
        `INSERT INTO samples (id, name, duration,  bars, instrument_id, pack_id, release_date, loop_tempo, loop_key, version) VALUES(:id, :name, :duration, :bars, :instrument_id, :pack_id, :release_date, :loop_tempo, :loop_key, :version);`,
    )
    const GenreStmt = conn.prepareQuery(
        `INSERT INTO samples_genres (sample_id, genre_name) values(:sample_id, :genre_name);`,
    )
    const CharacterStmt = conn.prepareQuery(
        `INSERT INTO samples_characters (sample_id, character_name) values(:sample_id, :character_name);`,
    )

    // Existing Sample ids to skip
    const sampleids = conn.query('select id from samples')
    const existingSamples: Record<string, boolean> = {}
    for (let i = 0; i < sampleids.length; i++) {
        existingSamples[sampleids[i].toString()] = true
    }

    // Insert all samples
    for (let i = 0; i < samples.length; i++) {
        const s = samples[i]
        const SampleParams: db.Sample = {
            id: s.id,
            version: s.version,
            name: s.name,
            duration: s.duration ? s.duration : 0,
            bars: s.bars ? s.bars : 0,
            instrument_id: s.instrumentId,
            pack_id: s.packId,
            release_date: toUnixTimeStamp(s.releaseDate),
            loop_tempo: s.features.loop != undefined &&
                    s.features.loop.tempo != undefined
                ? s.features.loop.tempo
                : 0,
            loop_key: s.features.loop != undefined && s.features.loop.key != undefined ? s.features.loop.key : '',
        }

        // if (i % 1_000 == 0) console.log(i)
        if (!existingSamples[s.id]) {
            try {
                SampleStmt.execute(SampleParams)
                s.genres.forEach((genre_name) => {
                    GenreStmt.execute({
                        genre_name: genre_name,
                        sample_id: s.id,
                    })
                })

                s.characters.forEach((character_name) => {
                    CharacterStmt.execute({
                        character_name: character_name,
                        sample_id: s.id,
                    })
                })
                // existingSamples[s.id] = true
            } catch (e) {
                console.error(e)
            }
        }
    }
}

function importCollections() {
    // Existing Sample ids to skip
    const webCollectionIds = conn.query('select id from web_collections')
    const existingWebCollections: Record<string, boolean> = {}
    for (let i = 0; i < webCollectionIds.length; i++) {
        existingWebCollections[webCollectionIds[i].toString()] = true
    }

    // Prepared SQL
    const webCollections = conn.prepareQuery(
        `INSERT into web_collections (id, name, slug) VALUES (:id,:name,:slug)`,
    )
    const webCollectionsPacks = conn.prepareQuery(
        `INSERT into web_collections_packs (collection_id, pack_id) VALUES (:collection_id, :pack_id);`,
    )

    const collections: Record<string, api.Collection> = readJson(
        'data/collections.json',
    )
    Object.keys(collections).forEach((c) => {
        const C = collections[c]
        if (!existingWebCollections[c]) {
            const collection = collections[c]
            webCollections.execute({
                'id': c,
                'name': collection.name,
                'slug': collection.id,
            })
            // Packs in collection
            C.packs.forEach((pack) => {
                //console.log(C)
                webCollectionsPacks.execute({
                    'collection_id': c,
                    'pack_id': pack.packId,
                })
            })
        }
    })
}
