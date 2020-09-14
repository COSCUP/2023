// Copyright (c) 2020 DevilTea
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { debounce } from 'lodash'

export type ThemeType = 'light' | 'dark'

export interface ThemeService {
  themeType: ThemeType;
  startDetect: () => void;
  stopDetect: () => void;
  savePreference: () => void;
}

class ThemeServiceConcrete implements ThemeService {
  private _themeType: ThemeType = 'light'
  private _debouncedDetectTheme = debounce(() => {
    this.themeType = this._detectColorSchema()
    document.body.setAttribute('data-theme', this.themeType)
  }, 30)

  public get themeType () {
    return this._themeType
  }

  public set themeType (value: ThemeType) {
    this._themeType = value
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
