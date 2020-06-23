// Copyright (c) 2020 DevilTea
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import colors from './colors'
import { Color, adjustAlpha } from './utils'

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
  'agenda-table-room-list-background': Color;
  'agenda-session-item-background': Color;
  'venue-plan-card-title': Color;
  'venue-plan-card-background': Color;
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
  'navbar-background': '#fff',
  'footer-background': '#f0f0f0',
  'markdown-link': colors['coscup-green'],
  'markdown-link-hover': colors['coscup-green-lighten-3'],
  'markdown-hr': '#cfcfcf',
  'markdown-blockquote-side': '#aaaaaa',
  'markdown-blockquote-text': '#888',
  'markdown-blockquote-background': '#eee',
  'markdown-code-text': '#70996c',
  'markdown-code-background': '#e6e6e6',
  'markdown-code-block-text': '#ffffff',
  'markdown-code-block-background': '#333333',
  'markdown-code-block-lang-text': '#999999',
  'markdown-table-border': '#666666',
  'markdown-mark-background': colors['coscup-green-lighten-3'],
  'home-banner-logo-wrapper-background': adjustAlpha(colors['dark-blue'], 0.95),
  'home-section-background': colors['coscup-green'],
  'agenda-table-room-list-background': adjustAlpha('#fff', 0.7),
  'agenda-session-item-background': '#f0f9ef',
  'venue-plan-card-title': colors['coscup-green'],
  'venue-plan-card-background': '#fff',
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
    'navbar-background': colors['dark-blue-lighten-1'],
    'footer-background': colors['dark-blue-lighten-1'],
    'agenda-table-room-list-background': adjustAlpha(colors['dark-blue-lighten-1'], 0.8),
    'agenda-session-item-background': colors['dark-blue-lighten-2'],
    'venue-plan-card-title': '#fff',
    'venue-plan-card-background': colors['dark-blue-lighten-2'],
    'staff-group-background': colors['dark-blue-lighten-2'],
    'staff-avatar-border': colors['dark-blue-lighten-4']
  }
}
