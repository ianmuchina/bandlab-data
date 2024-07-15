// Functions to fetch, renew & validate API Keys
import type { TokenFile } from '../types/api.ts'
import { readJson } from './util.ts'

// Read API tokens from `data/token.json`


export function AuthHeaders(): RequestInit {
    const TOKENS: TokenFile = readJson('data/token.json')
    return {
        headers: {
            'accept-language': 'en-US,en;q=0.9,sw;q=0.8',
            accept: 'application/json',
            authorization: `Bearer ${TOKENS.access_token}`,
            'cache-control': 'no-cache',
            pragma: 'no-cache',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Linux"',
            'sec-ch-ua': '"Google Chrome";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'x-client-id': 'BandLab-Web',
            'x-client-version': '10.1.19',
        },
        body: null,
        credentials: 'include',
        method: 'GET',
        mode: 'cors',
        referrer: 'https://www.bandlab.com/sounds/packs',
        referrerPolicy: 'origin-when-cross-origin',
    }
}

// Get New Access Token Using current Refresh Token
export async function GetNewAccessToken(refresh_token: string) {
    const params = new URLSearchParams({
        auth_type: 'bandlab_auth_code',
        client_id: 'bandlab_web',
        grant_type: 'refresh_token',
        redirect_uri: 'https://www.bandlab.com/auth/bandlab/callback',
        refresh_token: refresh_token,
    })

    const response = await fetch('https://accounts.bandlab.com/oauth/connect/token?auth_type=bandlab_auth_code', {
        headers: {
            'accept-language': 'en-US,en;q=0.9',
            accept: 'application/json',
            authorization: 'Bearer undefined',
            'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
            priority: 'u=1, i',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Linux"',
            'sec-ch-ua': '"Google Chrome";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-site',
            'x-client-id': 'BandLab-Web',
            'x-client-version': '10.1.19',
        },
        body: params.toString(),
        credentials: 'include',
        method: 'POST',
        mode: 'cors',
        referrer: 'https://www.bandlab.com/',
    })

    const json = await response.json()
    return json
}

export async function AccessTokenIsValid(access_token: string): Promise<boolean> {
    // Return If Empty access token
    if (access_token == '') return false

    // Check validity using ftue (First-time user experience) endpoint
    const response = await fetch('https://www.bandlab.com/api/v1.3/me/ftue', {
        headers: {
            'accept-language': 'en-US,en;q=0.9,sw;q=0.8',
            accept: 'application/json',
            authorization: `Bearer ${access_token}`,
            'cache-control': 'no-cache',
            pragma: 'no-cache',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Linux"',
            'sec-ch-ua': '"Google Chrome";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'x-client-id': 'BandLab-Web',
            'x-client-version': '10.1.19',
        },
        body: null,
        credentials: 'include',
        method: 'GET',
        mode: 'cors',
        referrer: 'https://www.bandlab.com/sounds/packs',
        referrerPolicy: 'origin-when-cross-origin',
    })

    return response.status === 200
}
