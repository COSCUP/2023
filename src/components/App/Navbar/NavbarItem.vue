<template>
  <div
    :class="{
      [kebabCase(navbarItem.name)]: true,
      active:
        navbarItem.type === NavbarItemType.InternalLink &&
        $route.name &&
        $route.name.startsWith(navbarItem.location($route).name)
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
            {{ languageManager.languagePack.app.navbar[navbarItem.name] }}
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
            {{ languageManager.languagePack.app.navbar[navbarItem.name] }}
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
              languageManager.languagePackSet[nextLanguageType].app.navbar[
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
            {{ languageManager.languagePack.app.navbar[navbarItem.name] }}
          </span>
        </slot>
      </div>
      <slot class="navbar-item__suffix" name="suffix"> </slot>
    </button>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { kebabCase } from 'lodash-es'
import { NavbarItemType, NavbarItemData } from './navbar'
import { injectedThis } from '@/utils/common'
import { LanguageManager, LanguageType, availableLanguageTypes, defaultLanguageType } from '@/utils/language'
import { Location } from 'vue-router'

function injected (thisArg: unknown) {
  return injectedThis<{ languageManager: LanguageManager }>(thisArg)
}

export default Vue.extend({
  name: 'NavbarItem',
  inject: ['languageManager'],
  props: {
    navbarItem: {
      type: Object as PropType<NavbarItemData>,
      required: true
    }
  },
  computed: {
    nextLanguageType (): LanguageType {
      const currentLanguageType = injected(this).languageManager.languageType
      const nextLanguageType = [...availableLanguageTypes, ...availableLanguageTypes]
        .find((languageType, index, array) => array.indexOf(currentLanguageType) === index - 1) || defaultLanguageType
      return nextLanguageType
    },
    nextLanguageLocation (): Location {
      return {
        name: this.$route.name || 'Home',
        params: {
          languageType: this.nextLanguageType
        }
      }
    }
  },
  data () {
    return {
      NavbarItemType
    }
  },
  methods: {
    kebabCase
  }
})
</script>
