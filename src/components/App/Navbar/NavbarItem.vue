<!--
  Copyright (c) 2020 DevilTea

  This software is released under the MIT License.
  https://opensource.org/licenses/MIT
-->

<template>
  <div
    :class="{
      [kebabCase(navbarItem.name)]: true,
      active: isActiveInternalLink
    }"
    class="navbar-item-container"
    @click="$emit('click', $event)"
  >
    <a
      v-if="navbarItem.type === NavbarItemType.ExternalLink"
      :href="navbarItem.url"
      class="navbar-item"
      target="_blank"
      rel="noopener noreferrer"
    >
      <div class="navbar-item__prefix">
        <slot name="prefix"></slot>
      </div>
      <div class="navbar-item__content">
        <slot name="default">
          <span>
            {{ languageService.languagePack.app.navbar[navbarItem.name] }}
          </span>
        </slot>
      </div>
      <div class="navbar-item__suffix">
        <slot name="suffix">
          <Icon :name="'external-link-alt'" class="external-link-icon"> </Icon>
        </slot>
      </div>
    </a>
    <router-link
      v-else-if="navbarItem.type === NavbarItemType.InternalLink"
      :to="navbarItem.location($route)"
      class="navbar-item"
    >
      <slot class="navbar-item__prefix" name="prefix"> </slot>
      <div class="navbar-item__content">
        <slot name="default">
          <span>
            {{ languageService.languagePack.app.navbar[navbarItem.name] }}
          </span>
        </slot>
      </div>
      <slot class="navbar-item__suffix" name="suffix"> </slot>
    </router-link>
    <router-link
      v-else-if="navbarItem.type === NavbarItemType.LanguageSwitch"
      :to="nextLanguageLocation"
      class="navbar-item"
    >
      <slot class="navbar-item__prefix" name="prefix"> </slot>
      <div class="navbar-item__content">
        <slot name="default">
          <span>
            {{
              languageService.languagePackSet[nextLanguageType].app.navbar[
                navbarItem.name
              ]
            }}
          </span>
        </slot>
      </div>
      <slot class="navbar-item__suffix" name="suffix"> </slot>
    </router-link>
    <button
      v-else-if="navbarItem.type === NavbarItemType.Action"
      class="navbar-item"
      @click="$emit('action', navbarItem.action)"
    >
      <slot class="navbar-item__prefix" name="prefix"> </slot>
      <div class="navbar-item__content">
        <slot name="default">
          <span>
            {{ languageService.languagePack.app.navbar[navbarItem.name] }}
          </span>
        </slot>
      </div>
      <slot class="navbar-item__suffix" name="suffix"> </slot>
    </button>
  </div>
</template>

<script lang="ts">
import { kebabCase } from 'lodash'
import { NavbarItemType } from './navbar'
import { useLanguageService, availableLanguageTypes, defaultLanguageType } from '@/services/language'
import { useRouter } from '@/router'
import { computed, defineComponent } from '@vue/composition-api'
export default defineComponent({
  name: 'NavbarItem',
  props: {
    navbarItem: {
      type: Object,
      required: true
    }
  },
  setup (props) {
    const router = useRouter()
    const languageService = useLanguageService()
    const nextLanguageType = computed(() => {
      const currentLanguageType = languageService.languageType
      const nextLanguageType = [...availableLanguageTypes, ...availableLanguageTypes]
        .find((languageType, index, array) => array.indexOf(currentLanguageType) === index - 1) || defaultLanguageType
      return nextLanguageType
    })
    const nextLanguageLocation = computed(() => {
      return {
        name: router.currentRoute.name || 'Home',
        params: {
          languageType: nextLanguageType.value
        }
      }
    })
    const isActiveInternalLink = computed(() => {
      return props.navbarItem.type === NavbarItemType.InternalLink &&
        router.currentRoute.name &&
        router.currentRoute.name.startsWith(props.navbarItem.location(router.currentRoute).name)
    })

    return {
      NavbarItemType,
      languageService,
      kebabCase,
      nextLanguageType,
      nextLanguageLocation,
      isActiveInternalLink
    }
  }
})
</script>
