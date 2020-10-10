// Copyright (c) 2020 DevilTea
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { debounce } from 'lodash'
import { EventEmitter, Listener } from 'events'

export type ThemeType = 'light' | 'dark'

export interface ThemeService {
  themeType: ThemeType;
  startDetect: () => void;
  stopDetect: () => void;
  onUpdated: (listener: Listener) => void;
}

class ThemeServiceConcrete implements ThemeService {
  private _emitter = new EventEmitter()
  private _themeType: ThemeType = 'light'
  private _onThemeChanged = debounce(() => {
    const newThemeType = this._getColorSchema()
    this._themeType = newThemeType
    document.body.setAttribute('data-theme', this.themeType)
    this._emitter.emit('update')
  }, 30)

  public get themeType () {
    return this._themeType
  }

  public set themeType (value: ThemeType) {
    localStorage.setItem('colorSchema', value)
    this._onThemeChanged()
  }

  private _getSystemPrefersColorSchema (): ThemeType {
    if (!window.matchMedia) return 'light'
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
    return isDarkMode ? 'dark' : 'light'
  }

  private _getLocalStorageColorSchema (): ThemeType | 'auto' {
    const availableValues = ['auto', 'light', 'dark']
    let colorSchema = localStorage.getItem('colorSchema') as ThemeType | 'auto'
    if (!availableValues.includes(colorSchema)) colorSchema = 'auto'
    return colorSchema
  }

  private _getColorSchema (): ThemeType {
    let colorSchema: ThemeType = 'light'
    const localStorageColorSchema = this._getLocalStorageColorSchema()
    if (localStorageColorSchema === 'auto') {
      colorSchema = this._getSystemPrefersColorSchema()
    } else {
      colorSchema = localStorageColorSchema
    }
    return colorSchema
  }

  public onUpdated (listener: Listener) {
    this._emitter.on('update', listener)
  }

  public startDetect () {
    this._onThemeChanged()
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', this._onThemeChanged)
  }

  public stopDetect () {
    window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', this._onThemeChanged)
  }
}

export function createThemeService (): ThemeService {
  return new ThemeServiceConcrete()
}
