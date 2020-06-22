<!--
  Copyright (c) 2020 DevilTea

  This software is released under the MIT License.
  https://opensource.org/licenses/MIT
-->

<template>
  <main id="venue" class="page-container">
    <Map id="map-component" :options="mapOptions"></Map>
    <div class="plan-container">
      <div
        v-for="key in Object.keys(languageService.languagePack.venue.plans)"
        :key="key"
        class="plan"
      >
        <h3>{{ key }}</h3>
        <section v-html="plansHtml[key]" class="markdown"></section>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import Vue from 'vue'
import Map from '@/components/Venue/Map.vue'
import { MapOptions } from '@/utils/map'
import markdown from '@/utils/markdown'
import '@/assets/scss/pages/venue.scss'
import { LanguageService } from '@/utils/language'
import { injectedThis } from '../utils/common'

function injected (thisArg: unknown) {
  return injectedThis<{
    languageService: LanguageService;
  }>(thisArg)
}

export default Vue.extend({
  name: 'Venue',
  inject: ['languageService'],
  components: {
    Map
  },
  data () {
    const mapOptions: MapOptions = {
      target: 'map-component',
      center: {
        lng: 121.540551,
        lat: 25.01374
      },
      zoom: 17,
      mapMarkers: [
        {
          name: 'main',
          imageSrc: '/2020/images/map-marker.svg',
          position: {
            lng: 121.540551,
            lat: 25.01374
          },
          scale: 3,
          anchor: {
            x: 0.5,
            y: 1
          }
        }
      ]
    }

    const plansHtml: { [name: string]: string } = {}

    return {
      mapOptions,
      plansHtml
    }
  },
  methods: {
    async parseMarkdownContent () {
      const plansHtml = {}
      for (const plan of injected(this).languageService.languagePack.venue.plans) {
        plansHtml[plan.name] = await markdown(plan.description)
      }

      this.plansHtml = plansHtml
    }
  },
  watch: {
    'languageService.languageType' () {
      this.parseMarkdownContent()
    }
  },
  async mounted () {
    await this.parseMarkdownContent()
    this.$emit('render')
  }
})
</script>
