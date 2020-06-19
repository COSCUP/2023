import { Color, adjustAlpha } from './utils'
import colors from './colors'

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
  'staff-group-background': Color;
  'staff-avatar-border': Color;
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
  'home-section-background': colors['coscup-green'],
  'staff-group-background': adjustAlpha(colors['coscup-secondary'], 0.2),
  'staff-avatar-border': adjustAlpha(colors['coscup-green'], 0.3)
}

export const themePackSet: ThemePackSet = {
  light: {
    ...defaultThemePack
  },
  dark: {
    ...defaultThemePack,

    text: '#ffffff',
    background: '#12344c',
    'navbar-background': adjustAlpha(colors['dark-blue-lighten-1'], 0.8),
    'footer-background': colors['dark-blue-lighten-1'],
    'staff-group-background': colors['dark-blue-lighten-2'],
    'staff-avatar-border': colors['dark-blue-lighten-4']
  }
}
