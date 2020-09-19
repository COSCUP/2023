import { camelCase } from 'lodash'
import { RouteLocationRaw, RouteLocationNormalized } from 'vue-router'
import { pageRouteNameList } from '@/router'
import { defaultLanguageType, availableLanguageTypes, LanguageType } from '@/services/language'
import InternalLink from '@/components/App/Navbar/Basic/InternalLink.vue'
import ExternalLink from '@/components/App/Navbar/Basic/ExternalLink.vue'
import HomeTab from '@/components/App/Navbar/Custom/HomeTab.vue'
import ThemeToggle from '@/components/App/Navbar/Custom/ThemeToggle.vue'
import MenuToggle from '@/components/App/Navbar/Custom/MenuToggle.vue'
import { ThemeType } from '@/services/theme'
import { defineAsyncComponent } from 'vue'

export type NavbarItemType = 'internal-link' | 'external-link' | 'action'
export type NavbarItemOptions = InternalLinkOptions | ExternalLinkOptions | ActionOptions
export type NavbarItemData = InternalLinkData | ExternalLinkData | ActionData
export type ActionType = 'toggle-theme' | 'toggle-menu'

interface BasicOptions {
  name: string;
  fixedInNavbar: boolean;
  hiddenInMenu: boolean;
  text?: string;
}

export interface InternalLinkOptions extends BasicOptions {
  to: RouteLocationRaw;
  active: boolean;
}

export interface ExternalLinkOptions extends BasicOptions {
  url: string;
}

export interface ActionOptions extends BasicOptions {
  action: ActionType;
  payloads?: { [key: string]: unknown };
}

interface BasicNavbarItemData {
  type: NavbarItemType;
  options: NavbarItemOptions;
  component: ReturnType<typeof defineAsyncComponent>;
}

export interface InternalLinkData extends BasicNavbarItemData {
  type: 'internal-link';
  options: InternalLinkOptions;
}

export interface ExternalLinkData extends BasicNavbarItemData {
  type: 'external-link';
  options: ExternalLinkOptions;
}

export interface ActionData extends BasicNavbarItemData {
  type: 'action';
  options: ActionOptions;
}

const internalLinksThatFixedInNavbar: string[] = ['home']
const internalLinksThatHiddenInMenu: string[] = []

export function getInternalLinkDataList ({
  currentRoute,
  getNavbarItemText
}: {
  currentRoute: RouteLocationNormalized;
  getNavbarItemText: (itemName: string) => string;
}) {
  const internalLinkDataList = pageRouteNameList.map((routeName): InternalLinkData => {
    const itemName = camelCase(routeName)
    return {
      type: 'internal-link',
      options: {
        name: itemName,
        fixedInNavbar: internalLinksThatFixedInNavbar.includes(itemName),
        hiddenInMenu: internalLinksThatHiddenInMenu.includes(itemName),
        text: getNavbarItemText(itemName),
        to: {
          name: routeName,
          params: {
            languageType: currentRoute.params.languageType || defaultLanguageType
          }
        },
        active: currentRoute.name?.toString().startsWith(routeName) ?? false
      },
      component: InternalLink
    }
  })

  const home = internalLinkDataList.find((data) => data.options.name === 'home')
  if (home) home.component = HomeTab

  return internalLinkDataList
}

export function getExternalLinkDataList ({
  getNavbarItemText
}: {
  getNavbarItemText: (itemName: string) => string;
}) {
  const externalLinkDataList: ExternalLinkData[] = [
    {
      type: 'external-link',
      options: {
        name: 'blog',
        text: getNavbarItemText('blog'),
        fixedInNavbar: false,
        hiddenInMenu: false,
        url: 'https://blog.coscup.org/'
      },
      component: ExternalLink
    },
    {
      type: 'external-link',
      options: {
        name: 'press-release',
        text: getNavbarItemText('press-release'),
        fixedInNavbar: false,
        hiddenInMenu: false,
        url: 'https://blog.coscup.org/p/press-release.html'
      },
      component: ExternalLink
    },
    {
      type: 'external-link',
      options: {
        name: 'coc',
        text: getNavbarItemText('coc'),
        fixedInNavbar: false,
        hiddenInMenu: false,
        url: 'https://hackmd.io/s/SyCQqip2N'
      },
      component: ExternalLink
    }
  ]

  return externalLinkDataList
}

export function getLanguageSwitchData ({
  currentLanguageType,
  currentRoute,
  getNextLanguageTypeText
}: {
  currentLanguageType: LanguageType;
  currentRoute: RouteLocationNormalized;
  getNextLanguageTypeText: (nextLanguageType: LanguageType) => string;
}) {
  const nextLanguageType = [...availableLanguageTypes, ...availableLanguageTypes]
    .find((languageType, index, array) => array.indexOf(currentLanguageType) === index - 1) || defaultLanguageType

  const languageSwitchData: InternalLinkData = {
    type: 'internal-link',
    options: {
      name: 'languageSwitch',
      fixedInNavbar: true,
      hiddenInMenu: true,
      text: getNextLanguageTypeText(nextLanguageType),
      to: (() => {
        return {
          name: currentRoute.name || 'Home',
          params: {
            ...currentRoute.params,
            languageType: nextLanguageType
          },
          query: {
            ...currentRoute.query
          }
        }
      })(),
      active: false
    },
    component: InternalLink
  }

  return languageSwitchData
}

export function getThemeToggleData ({
  currentThemeType
}: {
  currentThemeType: ThemeType;
}) {
  const themeToggleData: ActionData = {
    type: 'action',
    options: {
      name: 'themeToggle',
      fixedInNavbar: true,
      hiddenInMenu: true,
      action: 'toggle-theme',
      payloads: {
        currentThemeType
      }
    },
    component: ThemeToggle
  }

  return themeToggleData
}

export function getMenuToggleData () {
  const menuToggleData: ActionData = {
    type: 'action',
    options: {
      name: 'menuToggle',
      fixedInNavbar: true,
      hiddenInMenu: true,
      action: 'toggle-menu'
    },
    component: MenuToggle
  }

  return menuToggleData
}
