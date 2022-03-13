// Copyright (c) 2020 DevilTea
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import dotenv from 'dotenv'
const { parsed } = globalThis.process ? dotenv.config() : { parsed: undefined }
const ORIGIN = parsed?.VITE_ORIGIN ?? ''
const BASE_URL = parsed?.VITE_BASE_URL ?? ''

export function delay (ms: number) {
  return new Promise((resolve) => { setTimeout(resolve, ms) })
}

export function getRootUrl (): string {
  if (globalThis.window) return window.rootUrl
  return `${ORIGIN}${BASE_URL}`
}

export function generateAssetsMap (result: Record<string, Record<string, any>>, pattern: string) {
  const base = pattern.replace(/\*.*/, '')
  return Object.fromEntries(
    Object.entries(result)
      .map(([key, value]) => [key.replace(base, ''), value.default])
  )
}

export function chunk <T> (arr: Array<T>, chunkSize = 1, cache: Array<Array<T>> = []): Array<Array<T>> {
  const tmp = [...arr]
  if (chunkSize <= 0) return cache
  while (tmp.length) cache.push(tmp.splice(0, chunkSize))
  return cache
}
