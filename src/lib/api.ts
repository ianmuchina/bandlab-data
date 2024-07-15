// Functions for getting data from the bandlab api
import type { apiResponse, Collection, Pack, Sample } from '../types/api.ts'
import { AuthHeaders } from './auth.ts'
const API_URL = `https://www.bandlab.com/api/v3.0/sounds`

// Get All Packs
export async function GetPacks() {
    const baseUrl = `${API_URL}/packs?&characters=&genres=&sort=recentRelease&limit=50`
    const results = await AllPages<Pack>(baseUrl)
    return results
}

// Get All Samples in Pack
export async function GetSamplesByPackId(packId: string) {
    const baseUrl = `${API_URL}/samples?characters=&genres=&instruments=&limit=50&packId=${packId}&sort=recentRelease`
    const results = await AllPages<Sample>(baseUrl)
    return results
}

// Runs GetSamplesByPackId() in batches
export async function GetPackData(ids: Array<string>) {
    const BATCH_SIZE = 90
    const SamplesArray: Array<Sample> = []

    for (let i = 0; i < ids.length; i = i + BATCH_SIZE) {
        // Pack Ids in current batch
        const batchPackIds = i + BATCH_SIZE > ids.length ? ids.slice(i) : ids.slice(i, i + BATCH_SIZE)
        // Fetch Sample Data
        const batchResult = await Promise.all<Array<Sample>>(batchPackIds.map((id) => GetSamplesByPackId(id)))
        // Append Sample Data
        for (let i = 0; i < batchResult.length; i++) {
            SamplesArray.push(...batchResult[i])
        }
    }

    return SamplesArray
}

// Generic Function to get API Data
async function AllPages<T>(baseUrl: string | null): Promise<Array<T>> {
    // Get Single Page
    async function getSinglePage(after: string | null): Promise<apiResponse<T[]>> {
        const url = !after ? `${baseUrl}` : `${baseUrl}&after=${after}`
        const response = await fetch(url, AuthHeaders())
        const json = await response.json() as (apiResponse<T[]>)

        // TODO: Suggest actions to based on response code
        if (response.status != 200) {
            console.error(baseUrl)
            console.error(`err ${response.status}:${response.statusText}`)
        }
        // Error with Details
        // TODO: Types for API json.errors
        if (json.errors != undefined) {
            console.error('API Error')
            console.error(JSON.stringify(json, null, ' '))
        }

        return json
    }

    async function getAllPages(): Promise<Array<T>> {
        const results: Array<T> = []
        // Get First Page
        let tmp = await getSinglePage(null)
        // Get rest of pages
        while (true) {
            // Append Page
            results.push(...tmp.data)
            // Break if no more pages
            if (!tmp.paging || !tmp.paging.cursors || !tmp.paging.cursors.after) break
            // Fetch Next Page
            tmp = await getSinglePage(escape(tmp.paging.cursors.after))
        }
        // If empty results
        // TODO: Test this
        if (results.length == 0) {
            console.debug('empty results:', baseUrl)
        }

        return results
    }

    const results = await getAllPages()

    return results
}

// Fetch Sample Collections
export async function GetCollections() {
    // Types
    type Collection2 = { description: string; id: string; name: string }
    type CollectionsList = Record<string, Collection2>

    // Fetch Collection List
    async function getCollectionsList(): Promise<CollectionsList> {
        const url = 'https://bandlab-sounds.firebaseio.com/browse/collections.json'
        const response = await fetch(url)
        const json = await response.json() as CollectionsList
        return json
    }

    // Fetch Collection Data
    async function getCollectionData(uuid: string) {
        const url = `${API_URL}/collections/${uuid}`
        const response = await fetch(url, AuthHeaders())
        const json = await response.json() as apiResponse<Collection>
        return json
    }

    const collectionsList = await getCollectionsList()
    const collectionsMap: Record<string, Collection> = {}
    for (const id in collectionsList) {
        const tmp = await getCollectionData(id)
        collectionsMap[id] = tmp.data
    }
    return collectionsMap
}
