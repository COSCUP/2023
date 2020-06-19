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
  'markdown-link': Color;
  'markdown-link-hover': Color;
  'markdown-hr': Color;
  'markdown-blockquote-side': Color;
  'markdown-blockquote-text': Color;
  'markdown-blockquote-background': Color;
  'markdown-code-text': Color;
  'markdown-code-background': Color;
  'markdown-code-block-text': Color;
  'markdown-code-block-background': Color;
  'markdown-code-block-lang-text': Color;
  'markdown-table-border': Color;
  'markdown-mark-background': Color;
  'home-banner-logo-wrapper-background': Color;
  'home-section-background': Color;
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
  'footer-background': '#f0f0f0',
  'markdown-link': colors['coscup-green'],
  'markdown-link-hover': colors['coscup-green-lighten-1'],
  'markdown-hr': '#cfcfcf',
  'markdown-blockquote-side': '#aaaaaa',
  'markdown-blockquote-text': '#8f8f8f',
  'markdown-blockquote-background': '#cfcfcf',
  'markdown-code-text': colors['coscup-green'],
  'markdown-code-background': '#cfcfcf',
  'markdown-code-block-text': '#ffffff',
  'markdown-code-block-background': '#333333',
  'markdown-code-block-lang-text': '#999999',
  'markdown-table-border': '#666666',
  'markdown-mark-background': colors['coscup-green-lighten-3'],
  'home-banner-logo-wrapper-background': adjustAlpha(colors['dark-blue'], 0.95),
  'home-section-background': colors['coscup-green']
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

export function createThemeManager (): ThemeManager {
  return new ThemeManagerConcrete()
}
