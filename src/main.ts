import fs from 'node:fs'
import process from 'node:process'

import type * as api from './types/api.ts'
import type { apiResponse, Pack, Sample, TokenFile } from './types/api.ts'

import { genData } from './lib/flatten.ts'
import { GetCollections, GetPackData, GetPacks } from './lib/api.ts'
import { AccessTokenIsValid, GetNewAccessToken } from './lib/auth.ts'
import { parseJWT, printAccessTokenExpiry, readJson, timeTook, toJSONString, writeJson } from './lib/util.ts'

// Select which command to run
switch (process.argv[2]) {
    case 'renew':
        await renewCmd()
        break
    case 'packs':
        await packsCmd()
        break
    case 'samples':
        await samplesCmd()
        break
    case 'validate':
        await validateCmd()
        break
    case 'collections':
        await collectionsCmd()
        break
    case 'data':
        genData()
        break
    case 'remaining':
        remainingCmd()
        break
    case 'example-data':
        await genExampleData()
        break
    case 'renew-env':
        await renew_envCmd()
        break
    default:
        console.log('invalid command')
        break
}

function remainingCmd() {
    const T: TokenFile = readJson('data/token.json')
    const data = parseJWT(T.access_token)
    printAccessTokenExpiry(data.exp)
}

async function renew_envCmd() {
    const refresh_token = process.env.BANDLAB_REFRESH_TOKEN
    if (!refresh_token) {
        console.error('BANDLAB_REFRESH_TOKEN env variable set')
        process.exit(2)
    }
    const tokenFile = await GetNewAccessToken(refresh_token)
    fs.writeFileSync('data/token.json', toJSONString(tokenFile))
}

// Download All Loop packs
async function packsCmd() {
    console.log(`Downloading packs`)
    const t0 = performance.now()
    const packs = await GetPacks()
    const t1 = performance.now()
    const str = timeTook((t1 - t0) / 1000)
    writeJson('data/packs.json', packs)
    console.log(`Downloaded ${packs.length} packs in ${str}`)
}

// Download Samples from All Packs
async function samplesCmd() {
    const t0 = performance.now()
    console.log('downloading samples')
    const packs: api.Pack[] = readJson('data/packs.json')
    const packIds = packs.map((pack) => pack.id)
    const samples = await GetPackData(packIds)
    const t1 = performance.now()
    const str = timeTook((t1 - t0) / 1000)
    fs.writeFileSync('data/samples.json', toJSONString(samples))
    console.log(`Downloaded all sample metadata in ${str}`)
}

// Download Pack Collections
async function collectionsCmd() {
    console.log('downloading collections')
    const collections = await GetCollections()
    fs.writeFileSync('data/collections.json', toJSONString(collections))
}

// Renew Token & persist to `data/token.json`
async function renewCmd() {
    console.log('renewing token')
    const tokens: TokenFile = readJson('data/token.json')
    const tokenFile = await GetNewAccessToken(tokens.refresh_token)
    fs.writeFileSync('data/token.json', toJSONString(tokenFile))
}

// Validate Token
async function validateCmd() {
    console.log('validating tokens')
    const currentToken: TokenFile = readJson('data/token.json')
    const ok = await AccessTokenIsValid(currentToken.access_token)
    if (ok) {
        console.log('access_token Valid')
        const data = parseJWT(currentToken.access_token)
        printAccessTokenExpiry(data.exp)
        process.exit(0)
    } else {
        console.log('access_token Invalid')
        process.exit(1)
    }
}

// Generates example data for packs or samples for use in auto generating types
async function genExampleData() {
    const API = `https://www.bandlab.com/api/v3.0/sounds-public`
    const features = [
        'loop',
        'looper',
        'multipadSampler',
        'oneShot', // TODO: Why is this empty
    ]

    const packUrls = features.map((f) => `${API}/packs?&characters=&genres=&sort=recentRelease&limit=50&features=${f}`)

    const Packs: Array<Pack> = []

    packUrls.forEach(async (url) => {
        const response = await fetch(url)
        const json = await response.json() as apiResponse<Pack[]>
        json.data.forEach((j) => Packs.push(j))
    })

    const packIds = Packs.map((pack) => pack.id)
    const samples: Array<Sample> = await GetPackData(packIds)

    fs.writeFileSync('data/example-packs.json', toJSONString(Packs))
    fs.writeFileSync('data/example-samples.json', toJSONString(samples.flat()))
}
