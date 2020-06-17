import { Location, Route } from 'vue-router'
import { defaultLanguageType } from '@/utils/language'
import { pageRouteNameList } from '@/router'
import { camelCase } from 'lodash-es'

export enum NavbarItemType {
  Action,
  InternalLink,
  ExternalLink,
  LanguageSwitch
}

export enum NavbarAction {
  ToggleMenu
}

export type NavbarItemData = NavbarActionItem | NavbarInternalLinkItem | NavbarExternalLinkItem | NavbarLanguageSwitchItem

export interface NavbarItemBasic {
  name: string;
  fixedInNavbar: boolean;
  hiddenInMenu: boolean;
}

export interface NavbarActionItem extends NavbarItemBasic {
  type: NavbarItemType.Action;
  action: NavbarAction;
}

export interface NavbarExternalLinkItem extends NavbarItemBasic {
  type: NavbarItemType.ExternalLink;
  url: string;
}

export interface NavbarInternalLinkItem extends NavbarItemBasic {
  type: NavbarItemType.InternalLink;
  location: (currentRoute: Route) => Location;
}

export interface NavbarLanguageSwitchItem extends NavbarItemBasic {
  type: NavbarItemType.LanguageSwitch;
}

const internalLinksThatFixedInNavbar: string[] = ['home']
const internalLinksThatHiddenInMenu: string[] = []

const internalLinks: NavbarInternalLinkItem[] = pageRouteNameList.map((routeName) => {
  const itemName = camelCase(routeName)
  return {
    type: NavbarItemType.InternalLink,
    name: itemName,
    fixedInNavbar: internalLinksThatFixedInNavbar.includes(itemName),
    hiddenInMenu: internalLinksThatHiddenInMenu.includes(itemName),
    location: (currentRoute) => ({
      name: routeName,
      params: {
        languageType: currentRoute.params.languageType || defaultLanguageType
      }
    })
  }
})

export const navbarItems: NavbarItemData[] = [
  ...internalLinks,
  {
    type: NavbarItemType.ExternalLink,
    name: 'blog',
    fixedInNavbar: false,
    hiddenInMenu: false,
    url: 'https://blog.coscup.org/'
  },
  {
    type: NavbarItemType.ExternalLink,
    name: 'press-release',
    fixedInNavbar: false,
    hiddenInMenu: false,
    url: 'https://blog.coscup.org/p/press-release.html'
  },
  {
    type: NavbarItemType.ExternalLink,
    name: 'coc',
    fixedInNavbar: false,
    hiddenInMenu: false,
    url: 'https://hackmd.io/s/SyCQqip2N'
  },
  {
    type: NavbarItemType.LanguageSwitch,
    name: 'languageSwitch',
    fixedInNavbar: true,
    hiddenInMenu: true
  },
  {
    type: NavbarItemType.Action,
    name: 'menuToggle',
    fixedInNavbar: true,
    hiddenInMenu: true,
    action: NavbarAction.ToggleMenu
  }
]
