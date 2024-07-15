import fs from 'node:fs'

// Parse JSON file
export function readJson(path: string) {
    return JSON.parse(fs.readFileSync(path, 'utf-8'))
}

// Write Object to JSON file
export function writeJson(path: string, obj: unknown) {
    fs.writeFileSync(path, toJSONString(obj))
    console.log(`written to ${path}`)
}

// Convert Object to JSON string
export function toJSONString(f: unknown) {
    return JSON.stringify(f)
}

// Convert Object to JSON string with indentation
export function toJsonString2(f: unknown) {
    return JSON.stringify(f, undefined, '\t')
}

// Convert Date string to Unix Timestamp. Useful to reduce file size
export function toUnixTimeStamp(s: string) {
    return parseInt((new Date(s).getTime() / 1000).toFixed(0))
}

export function parseJWT(token: string) {
    return JSON.parse(atob(token.split('.')[1]))
}

export function printAccessTokenExpiry(exp: number) {
    const now = Math.trunc(new Date().getTime() / 1000) // Now in Unix S
    const d = exp - now
    const hour = Math.trunc(d / 3600)
    const mins = Math.trunc((d % 3600) / 60)
    const secs = Math.trunc((d % 3600) % 60)
    const str = `\`access_token\` expires in ${hour} hours ${mins} minutes ${secs} secs`
    console.log(str)
}

export function timeTook(n: number) {
    const mins = Math.trunc((n % 3600) / 60)
    const secs = Math.trunc((n % 3600) % 60)
    const str = `${mins} minutes ${secs} secs`
    return str
}

/**
 * Converts the byte array to a UUID string
 * @param bytes Used to convert Byte to Hex
 */
export function bytesToUuid(bytes: number[] | Uint8Array): string {
    const bits = [...bytes].map((bit) => {
        const s = bit.toString(16)
        return bit < 0x10 ? '0' + s : s
    })
    return [
        ...bits.slice(0, 4),
        '-',
        ...bits.slice(4, 6),
        '-',
        ...bits.slice(6, 8),
        '-',
        ...bits.slice(8, 10),
        '-',
        ...bits.slice(10, 16),
    ].join('')
}

/**
 * Converts a string to a byte array by converting the hex value to a number.
 * @param uuid Value that gets converted.
 */
export function uuidToBytes(uuid: string): Uint8Array {
    const bytes = uuid
        .replaceAll('-', '')
        .match(/.{1,2}/g)!
        .map((byte) => parseInt(byte, 16))
    return new Uint8Array(bytes)
}
