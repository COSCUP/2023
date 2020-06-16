import { Color, adjustAlpha } from './utils'
import colors from './colors'
import { debounce } from 'lodash-es'
export * from './utils'

export type ThemeType = 'light' | 'dark'

export interface ThemePack {
  primary: Color;
  text: Color;
  background: Color;
  'navbar-background': Color;
  'footer-background': Color;
}

export type ThemePackSet = {
  [themeType in ThemeType]: ThemePack;
}

export const defaultThemeType: ThemeType = 'light'

const defaultThemePack: ThemePack = {
  primary: colors['coscup-green'],
  text: '#404040',
  background: '#ffffff',
  'navbar-background': 'rgba(255,255,255,.8)',
  'footer-background': '#f0f0f0'
}

const themePackSet: ThemePackSet = {
  light: {
    ...defaultThemePack
  },
  dark: {
    ...defaultThemePack,

    text: '#ffffff',
    background: '#12344c',
    'navbar-background': adjustAlpha(colors['dark-blue-lighten-1'], 0.8),
    'footer-background': colors['dark-blue-lighten-1']
  }
}

export interface ThemeManager {
  themeType: ThemeType;
  themePackSet: ThemePackSet;
  readonly themePack: ThemePack;
  startDetect: () => void;
  stopDetect: () => void;
}

class ThemeManagerConcrete implements ThemeManager {
  public themeType: ThemeType = 'light'
  public themePackSet: ThemePackSet = themePackSet
  private _debouncedDetectTheme = debounce(() => {
    const themeType: ThemeType = this._detectColorSchema()
    const variableStyleDom = (document.getElementById('variable') as HTMLElement)
    const themePack: ThemePack = this.themePackSet[themeType]
    const properties = Object.entries(themePack)
      .map((entry) => `--color-${entry[0]}: ${entry[1]};`)
      .join('')
    variableStyleDom.innerHTML = `:root {${properties}}`
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

export function createThemeManager (): ThemeManager {
  return new ThemeManagerConcrete()
}
