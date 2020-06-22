export type Color = string
/**
 * Validate if a string is available format.
 * Available formats:
 *   #000 (RGB hex), #000f (RGBA hex), rgb(0, 0, 0), rgba(0, 0, 0, 1)
 *
 * @export
 * @param {Color} color
 * @returns {boolean} isValid
 */
export function isValidColorString (color: Color) {
  const rules = [
    /^#[a-fA-F0-9]{3,4}$/,
    /^#[a-fA-F0-9]{6}$/,
    /^#[a-fA-F0-9]{8}$/,
    /^rgb\((\d|(\d\d)|(1\d\d)|(2[0-4]\d)|(25[0-5])), *(\d|(\d\d)|(1\d\d)|(2[0-4]\d)|(25[0-5])), *(\d|(\d\d)|(1\d\d)|(2[0-4]\d)|(25[0-5]))\)$/,
    /^rgba\((\d|(\d\d)|(1\d\d)|(2[0-4]\d)|(25[0-5])), *(\d|(\d\d)|(1\d\d)|(2[0-4]\d)|(25[0-5])), *(\d|(\d\d)|(1\d\d)|(2[0-4]\d)|(25[0-5])), *((0?\.\d*)|1)\)$/
  ]
  return rules.some((regex) => regex.test(color))
}
/**
 * Unify the input color string to RGBA hex format.
 *
 * @export
 * @param {Color} color
 * @returns {Color} color
 */
export function unifyColorString (color: Color): Color {
  if (color[0] === '#') {
    color = color.slice(1)
    if (color.length === 3) {
      color = color.concat('f')
    }
    if (color.length === 4) {
      color = color.split('').map((c) => c.concat(c)).join('')
    }
    if (color.length === 6) {
      color = color.concat('ff')
    }
  } else {
    color = color
      .replace(/ |\)/g, '')
      .replace(/rgba?\(/, '')
      .split(',')
      .map((s, index) => index === 3 ? Math.round((+s) * 255) : +s)
      .map((n) => n.toString(16).padStart(2, '0'))
      .join('')
      .padEnd(8, 'f')
  }
  return color
}
/**
 * Get R, G, B, A integer values from a valid color string
 *
 * @export
 * @param {Color} color
 * @returns {[number, number, number, number]} [r, g, b, a]
 */
export function getRGBA (color: Color): [number, number, number, number] {
  if (!isValidColorString(color)) throw new Error(`Invalid Color: ${color}`)

  color = unifyColorString(color)
  const r = parseInt(color.slice(0, 2), 16)
  const g = parseInt(color.slice(2, 4), 16)
  const b = parseInt(color.slice(4, 6), 16)
  const a = parseInt(color.slice(6, 8), 16)
  return [r, g, b, a]
}
/**
 * Get RGBA hex string from values
 *
 * @export
 * @param {number} r
 * @param {number} g
 * @param {number} b
 * @param {number} a
 * @returns {Color} color RGBA hex
 */
export function formRGBAHex (r: number, g: number, b: number, a: number) {
  return `#${[r, g, b, a].map((s) => s.toString(16).padStart(2, '0')).join('')}`
}
/**
 * Adjust a color's alpha
 *
 * @export
 * @param {Color} color
 * @param {number} alpha
 * @returns {Color} color
 */
export function adjustAlpha (color: Color, alpha: number) {
  let [r, g, b, a] = getRGBA(color)
  a = Math.round(255 * alpha)

  if (a > 255) a = 255
  else if (a < 0) a = 0

  return formRGBAHex(r, g, b, a)
}

/**
 * Calculate Lighten or Darken Color
 *
 * @export
 * @param {Color} color
 * Only accept hex or rgb(r, g, b) format
 * @param {number} percentage
 * @returns {Color} color
 */
export function calcLightenDarkenColor (color: Color, offset: number) {
  let [r, g, b, a] = getRGBA(color)

  r = Math.round(r + offset)
  if (r > 255) r = 255
  else if (r < 0) r = 0

  g = Math.round(g + offset)
  if (g > 255) g = 255
  else if (g < 0) g = 0

  b = Math.round(b + offset)
  if (b > 255) b = 255
  else if (b < 0) b = 0

  if (a > 255) a = 255
  else if (a < 0) a = 0

  return formRGBAHex(r, g, b, a)
}
