import { camelCase } from 'lodash-es'
import { useI18n } from 'vue-i18n'
import { RouteLocationRaw, useRoute } from 'vue-router'
import { pageRouteNameList } from '@/router'
import InternalLink from '@/components/App/Navbar/Basic/InternalLink.vue'
import ExternalLink from '@/components/App/Navbar/Basic/ExternalLink.vue'
import HomeTab from '@/components/App/Navbar/Custom/HomeTab.vue'
import ThemeToggle from '@/components/App/Navbar/Custom/ThemeToggle.vue'
import LanguageSwitch from '@/components/App/Navbar/Custom/LanguageSwitch.vue'
import MenuToggle from '@/components/App/Navbar/Custom/MenuToggle.vue'
import { computed, defineAsyncComponent } from 'vue'

export type NavbarItemType = 'internal-link' | 'external-link' | 'action'
export type ActionType = 'toggle-theme' | 'toggle-menu'

interface BasicOptions {
  name: string;
  fixedInNavbar: boolean;
  hiddenInMenu: boolean;
  text?: string;
}

export interface InternalLinkOptions extends BasicOptions {
  to?: RouteLocationRaw;
  active: boolean;
}

export interface ExternalLinkOptions extends BasicOptions {
  url: string;
}

export interface ActionOptions extends BasicOptions {}

export type NavbarItemOptions = InternalLinkOptions | ExternalLinkOptions | ActionOptions

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

export type NavbarItemData = InternalLinkData | ExternalLinkData | ActionData

export function useNavbarItems () {
  const internalLinksThatFixedInNavbar: string[] = ['home']
  const internalLinksThatHiddenInMenu: string[] = []

  const { t } = useI18n()
  const currentRoute = useRoute()
  const getNavbarItemText = (itemName: string) => t(`app.navbar['${itemName}']`)
  const internalLinkDataList = computed<InternalLinkData[]>(() => pageRouteNameList
    .map((routeName): InternalLinkData => {
      const itemName = camelCase(routeName)
      return {
        type: 'internal-link',
        options: {
          name: itemName === 'home' ? 'home-tab' : itemName,
          fixedInNavbar: internalLinksThatFixedInNavbar.includes(itemName),
          hiddenInMenu: internalLinksThatHiddenInMenu.includes(itemName),
          text: getNavbarItemText(itemName),
          to: {
            name: routeName
          },
          active: currentRoute.name === routeName ?? false
        },
        component: itemName === 'home' ? HomeTab : InternalLink
      }
    })
  )

  const externalLinkDataList = computed<ExternalLinkData[]>(() => [
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
    // {
    //   type: 'external-link',
    //   options: {
    //     name: 'press-release',
    //     text: getNavbarItemText('press-release'),
    //     fixedInNavbar: false,
    //     hiddenInMenu: false,
    //     url: 'https://blog.coscup.org/p/press-release.html'
    //   },
    //   component: ExternalLink
    // },
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
  ])

  const languageSwitchData = computed<InternalLinkData>(() => ({
    type: 'internal-link',
    options: {
      name: 'languageSwitch',
      fixedInNavbar: true,
      hiddenInMenu: true,
      active: false
    },
    component: LanguageSwitch
  }))

  const themeToggleData = computed<ActionData>(() => ({
    type: 'action',
    options: {
      name: 'themeToggle',
      fixedInNavbar: true,
      hiddenInMenu: true,
      action: 'toggle-theme',
      payloads: {
        currentThemeType: 'light'
      }
    },
    component: ThemeToggle
  }))

  const menuToggleData = computed<ActionData>(() => ({
    type: 'action',
    options: {
      name: 'menuToggle',
      fixedInNavbar: true,
      hiddenInMenu: true,
      action: 'toggle-menu'
    },
    component: MenuToggle
  }))

  const navbarItems = computed<NavbarItemData[]>(() => [
    ...internalLinkDataList.value,
    ...externalLinkDataList.value,
    languageSwitchData.value,
    themeToggleData.value,
    menuToggleData.value
  ])

  return navbarItems
}
