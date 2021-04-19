<!--
  Copyright (c) 2020 DevilTea

  This software is released under the MIT License.
  https://opensource.org/licenses/MIT
-->

<template>
  <main id="map" class="page-container">
    <ClientOnly>
      <OlMap id="map-component" :mapOptions="mapOptions"></OlMap>
    </ClientOnly>
    <div class="card-container">
      <div class="card address">
        <h2 class="title">{{ t('map.name') }}</h2>
        <h3 class="content">{{ t('map.address') }}</h3>
      </div>
      <div v-for="plan in plans" :key="plan.name" class="card">
        <h3 class="title">{{ plan.name }}</h3>
        <section v-html="plan.description" class="markdown content"></section>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent, reactive, watch, ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { MapOptions } from '@/utils/map'
import markdown from '@/utils/markdown'
import OlMap from '@/components/Map/OlMap.vue'
import '@/assets/scss/pages/map.scss'
import mapMarkerImage from '@/assets/images/map-marker.svg'

type Plan = typeof import('@/../locales/zh-TW/map.json')['plans'][number]

export default defineComponent({
  name: 'Map',
  components: {
    OlMap
  },
  setup () {
    const { t, tm, locale } = useI18n()
    const rawPlans = computed(() => tm('map.plans') as Plan[])
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
          imageSrc: mapMarkerImage,
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

    const plans = ref<Plan[]>([])

    watch(locale, async () => {
      plans.value = await Promise.all(
        rawPlans.value.map(async ({ name, description }) => {
          return {
            name,
            description: markdown(description)
          }
        })
      )
    }, {
      immediate: true
    })

    return {
      t,
      mapOptions,
      plans
    }
  }
})
</script>
