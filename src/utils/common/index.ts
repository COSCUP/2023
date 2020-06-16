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
