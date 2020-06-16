import { Location, Route } from 'vue-router'
import { defaultLanguageType } from '@/utils/language'

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

export const navbarItems: NavbarItemData[] = [
  {
    type: NavbarItemType.InternalLink,
    name: 'home',
    fixedInNavbar: true,
    hiddenInMenu: false,
    location: (currentRoute) => ({
      name: 'Home',
      params: {
        languageType: currentRoute.params.languageType || defaultLanguageType
      }
    })
  },
  {
    type: NavbarItemType.InternalLink,
    name: 'agenda',
    fixedInNavbar: false,
    hiddenInMenu: false,
    location: (currentRoute) => ({
      name: 'Agenda',
      params: {
        languageType: currentRoute.params.languageType || defaultLanguageType
      }
    })
  },
  {
    type: NavbarItemType.InternalLink,
    name: 'map',
    fixedInNavbar: false,
    hiddenInMenu: false,
    location: (currentRoute) => ({
      name: 'Map',
      params: {
        languageType: currentRoute.params.languageType || defaultLanguageType
      }
    })
  },
  {
    type: NavbarItemType.InternalLink,
    name: 'venue',
    fixedInNavbar: false,
    hiddenInMenu: false,
    location: (currentRoute) => ({
      name: 'Venue',
      params: {
        languageType: currentRoute.params.languageType || defaultLanguageType
      }
    })
  },
  {
    type: NavbarItemType.InternalLink,
    name: 'sponsor',
    fixedInNavbar: false,
    hiddenInMenu: false,
    location: (currentRoute) => ({
      name: 'Sponsor',
      params: {
        languageType: currentRoute.params.languageType || defaultLanguageType
      }
    })
  },
  {
    type: NavbarItemType.InternalLink,
    name: 'staff',
    fixedInNavbar: false,
    hiddenInMenu: false,
    location: (currentRoute) => ({
      name: 'Staff',
      params: {
        languageType: currentRoute.params.languageType || defaultLanguageType
      }
    })
  },
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
