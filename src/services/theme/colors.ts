// Copyright (c) 2020 DevilTea
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { Color, calcLightenDarkenColor } from './utils'

export interface ColorPack {
  [name: string]: Color;
}

export function extendLightenDarkenColorPack (colorPack: ColorPack): ColorPack {
  const entries: [string, Color][] = Object.entries(colorPack)
  const extendedEntries: [string, Color][] = []
  const step = 8
  entries.forEach((entry) => {
    for (let i = 0; i < 10; i++) {
      if (i < 4) {
        extendedEntries.push([`${entry[0]}-darken-${4 - i}`, calcLightenDarkenColor(entry[1], (4 - i) * -step)])
      } else if (i === 4) {
        extendedEntries.push(entry)
      } else {
        extendedEntries.push([`${entry[0]}-lighten-${i - 4}`, calcLightenDarkenColor(entry[1], (i - 4) * step)])
      }
    }
  })
  return Object.fromEntries(extendedEntries)
}

let colors: ColorPack = {
  'coscup-green': '#3b9838',
  'coscup-secondary': 'rgb(177, 215, 191)',
  'dark-blue': '#12344c'
}

colors = extendLightenDarkenColorPack(colors)

export default colors
