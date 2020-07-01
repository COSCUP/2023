<!--
  Copyright (c) 2020 DevilTea

  This software is released under the MIT License.
  https://opensource.org/licenses/MIT
-->

<template>
  <main id="venue" class="page-container">
    <VenueMap id="map-component" :options="mapOptions"></VenueMap>
    <div class="plan-container">
      <div class="plan address">
        <h2>{{ languageService.languagePack.venue.name }}</h2>
        <h3>{{ languageService.languagePack.venue.address }}</h3>
      </div>
      <div
        v-for="plan in languageService.languagePack.venue.plans"
        :key="plan.name"
        class="plan"
      >
        <h3>{{ plan.name }}</h3>
        <section v-html="plansHtml[plan.name]" class="markdown"></section>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted, watch, ref } from '@vue/composition-api'
import VenueMap from '@/components/Venue/VenueMap.vue'
import { useLanguageService } from '@/services/hooks'
import { useRenderedEventDispatcher } from '../plugins/renderedEventDispatcher'
import { MapOptions } from '@/utils/map'
import markdown from '@/utils/markdown'

import '@/assets/scss/pages/venue.scss'

export default defineComponent({
  name: 'Venue',
  components: {
    VenueMap
  },
  setup () {
    const dispatchRenderedEvent = useRenderedEventDispatcher()
    const languageService = useLanguageService()
    const mapOptions: MapOptions = reactive({
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
    })
    const plansHtml = ref(
      Object.fromEntries(languageService.languagePack.venue.plans.map((plan) => [plan.name, plan.description]))
    )

    const renderMarkdownContent = async () => {
      const _plansHtml = {}
      for (const plan of languageService.languagePack.venue.plans) {
        _plansHtml[plan.name] = await markdown(plan.description)
      }
      plansHtml.value = _plansHtml
    }

    watch(() => languageService.languageType, async () => {
      await renderMarkdownContent()
    })

    onMounted(async () => {
      await renderMarkdownContent()
      dispatchRenderedEvent()
    })

    return {
      languageService,
      mapOptions,
      plansHtml
    }
  }
})
</script>
