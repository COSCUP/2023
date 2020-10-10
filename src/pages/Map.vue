<!--
  Copyright (c) 2020 DevilTea

  This software is released under the MIT License.
  https://opensource.org/licenses/MIT
-->

<template>
  <main id="map" class="page-container">
    <OlMap id="map-component" :mapOptions="mapOptions"></OlMap>
    <div class="card-container">
      <div class="card address">
        <h2 class="title">{{ languagePack.map.name }}</h2>
        <h3 class="content">{{ languagePack.map.address }}</h3>
      </div>
      <div v-for="plan in languagePack.map.plans" :key="plan.name" class="card">
        <h3 class="title">{{ plan.name }}</h3>
        <section
          v-html="plansHtml[plan.name]"
          class="markdown content"
        ></section>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted, watch, ref } from 'vue'
import OlMap from '@/components/Map/OlMap.vue'
import { useRenderedEventDispatcher } from '../plugins/renderedEventDispatcher'
import { MapOptions } from '@/utils/map'
import markdown from '@/utils/markdown'

import '@/assets/scss/pages/map.scss'
import { useStore } from '@/store'

export default defineComponent({
  name: 'Map',
  components: {
    OlMap
  },
  setup () {
    const { languageType, languagePack } = useStore()
    const dispatchRenderedEvent = useRenderedEventDispatcher()
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
      Object.fromEntries(languagePack.value.map.plans.map((plan) => [plan.name, plan.description]))
    )

    const renderMarkdownContent = async () => {
      const _plansHtml = {}
      for (const plan of languagePack.value.map.plans) {
        _plansHtml[plan.name] = await markdown(plan.description)
      }
      plansHtml.value = _plansHtml
    }

    watch(() => languageType.value, async () => {
      await renderMarkdownContent()
    })

    onMounted(async () => {
      await renderMarkdownContent()
      dispatchRenderedEvent()
    })

    return {
      languagePack,
      mapOptions,
      plansHtml
    }
  }
})
</script>
