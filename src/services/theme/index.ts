// Copyright (c) 2020 DevilTea
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { debounce } from 'lodash-es'
import colors from './colors'
import { ThemePack, ThemePackSet, ThemeType, themePackSet } from './themes'
export * from './themes'
export * from './utils'

export interface ThemeService {
  themeType: ThemeType;
  themePackSet: ThemePackSet;
  readonly themePack: ThemePack;
  startDetect: () => void;
  stopDetect: () => void;
}

class ThemeServiceConcrete implements ThemeService {
  public themeType: ThemeType = 'light'
  public themePackSet: ThemePackSet = themePackSet
  private _debouncedDetectTheme = debounce(() => {
    const themeType: ThemeType = this._detectColorSchema()
    const variableStyleDom = (document.getElementById('variable') as HTMLElement)
    const themePack: ThemePack = this.themePackSet[themeType]
    const themePackProperties = Object.entries(themePack)
      .map((entry) => `--color-${entry[0]}: ${entry[1]};`)
      .join('')
    const colorPackProperties = Object.entries(colors)
      .map((entry) => `--color-${entry[0]}: ${entry[1]};`)
      .join('')
    variableStyleDom.innerHTML = `:root {${themePackProperties + colorPackProperties}}`
    const themeClassNameList = Array.from(document.body.classList).filter((className) => className.startsWith('theme-'))
    document.body.classList.remove(...themeClassNameList)
    document.body.classList.add(`theme-${themeType}`)
  }, 30)

  public get themePack (): ThemePack {
    return this.themePackSet[this.themeType]
  }

  private _detectSystemPrefersColorSchema (): ThemeType {
    if (!window.matchMedia) return 'light'
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
    return isDarkMode ? 'dark' : 'light'
  }

  private _detectLocalStorageColorSchema (): ThemeType | 'auto' {
    const availableValues = ['auto', 'light', 'dark']
    let colorSchema = localStorage.getItem('colorSchema') as ThemeType | 'auto'
    if (!availableValues.includes(colorSchema)) colorSchema = 'auto'
    return colorSchema
  }

  private _detectColorSchema (): ThemeType {
    let colorSchema: ThemeType = 'light'
    const localStorageColorSchema = this._detectLocalStorageColorSchema()
    if (localStorageColorSchema === 'auto') {
      colorSchema = this._detectSystemPrefersColorSchema()
    } else {
      colorSchema = localStorageColorSchema
    }
    return colorSchema
  }

  public startDetect () {
    this._debouncedDetectTheme()
    window.matchMedia('(prefers-color-scheme: dark)').addListener(this._debouncedDetectTheme)
  }

  public stopDetect () {
    window.matchMedia('(prefers-color-scheme: dark)').removeListener(this._debouncedDetectTheme)
  }
}

export function createThemeService (): ThemeService {
  return new ThemeServiceConcrete()
}
