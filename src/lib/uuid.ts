// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
// This module is browser compatible.

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
