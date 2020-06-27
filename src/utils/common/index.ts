// Copyright (c) 2020 DevilTea
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { join } from 'path-browserify'

/**
 * A workaround method to let typescript type checking for Vue inject not throw error
 *
 * @export
 * @template Injected A interface or type that contains the injected properties
 * @param {unknown} thisArg Assume a "this" in Vue.extend({...}) to thisArg
 * @returns {Injected} this
 */
export function injectedThis <Injected> (thisArg: unknown) {
  return thisArg as Injected
}

export const isProduction = process.env.NODE_ENV === 'production'

export function delay (ms: number) {
  return new Promise((resolve) => { setTimeout(resolve, ms) })
}

export function getFullUrl (relativeUrl = ''): string {
  if (process.env.VUE_APP_PRODUCTION_ORIGIN === undefined) throw new Error()
  const productionOrigin: string = process.env.VUE_APP_PRODUCTION_ORIGIN
  // this condition is for running scripts in node environment without 'window'
  if (typeof window === 'undefined') return productionOrigin
  return `${isProduction ? productionOrigin : window.location.origin}${join(process.env.BASE_URL, relativeUrl).toString()}`
}

export { default as createRootInjections } from './createRootInjections'
