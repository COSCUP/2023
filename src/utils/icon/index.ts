import { fontAwesomeIcons, FontAwesomeSource, FontAwesomeIconData } from './icons/fontAwesome'
export * from './icons/fontAwesome'
export type IconSource = FontAwesomeSource
export const icons: (FontAwesomeIconData)[] = [
  ...fontAwesomeIcons
]
