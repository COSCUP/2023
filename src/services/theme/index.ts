// Copyright (c) 2020 DevilTea
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { debounce } from 'lodash'
import colors from './colors'
import { ThemePack, ThemePackSet, ThemeType, themePackSet } from './themes'
import { useService } from '@/utils/common'
export * from './themes'
export * from './utils'

export interface ThemeService {
  themeType: ThemeType;
  themePackSet: ThemePackSet;
  readonly themePack: ThemePack;
  startDetect: () => void;
  stopDetect: () => void;
  savePreference: () => void;
}

class ThemeServiceConcrete implements ThemeService {
  private _themeType: ThemeType = 'light'
  public themePackSet: ThemePackSet = themePackSet
  private _debouncedDetectTheme = debounce(() => {
    this.themeType = this._detectColorSchema()
    const variableStyleDom = (document.getElementById('variable') as HTMLElement)
    const themePack: ThemePack = this.themePack
    const themePackProperties = Object.entries(themePack)
      .map((entry) => `--color-${entry[0]}: ${entry[1]};`)
      .join('')
    const colorPackProperties = Object.entries(colors)
      .map((entry) => `--color-${entry[0]}: ${entry[1]};`)
      .join('')
    variableStyleDom.innerHTML = `:root {${themePackProperties + colorPackProperties}}`
    const themeClassNameList = Array.from(document.body.classList).filter((className) => className.startsWith('theme-'))
    document.body.classList.remove(...themeClassNameList)
    document.body.classList.add(`theme-${this.themeType}`)
  }, 30)

  public get themeType () {
    return this._themeType
  }

  public set themeType (value: ThemeType) {
    this._themeType = value
  }

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

  public savePreference () {
    localStorage.setItem('colorSchema', this.themeType)
    this._debouncedDetectTheme()
  }
}

export function createThemeService (): ThemeService {
  return new ThemeServiceConcrete()
}

export function useThemeService (): ThemeService {
  return useService<ThemeService>('themeService')
}
