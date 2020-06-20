<template>
  <main id="venue" class="page-container">
    <Map id="map-component" :options="mapOptions"></Map>
  </main>
</template>

<script lang="ts">
import Vue from 'vue'
import Map from '@/components/Venue/Map.vue'
import { MapOptions } from '@/utils/map'
import '@/assets/scss/pages/venue.scss'

export default Vue.extend({
  name: 'Venue',
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

    return {
      mapOptions
    }
  },
  mounted () {
    this.$emit('render')
  }
})
</script>
