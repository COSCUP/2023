import { defineAsyncComponent } from 'vue'

export type AsyncPageComponent = Promise<ReturnType<typeof defineAsyncComponent>>
export type InjectLoadingPromiseFunction = (asyncPageComponent: () => AsyncPageComponent) => AsyncPageComponent

export type Pages = 'home' | 'agenda' | 'room' | 'map' | 'venue' | 'sponsor' | 'staff'
export type PageRoutes = 'Home' | 'Agenda' | 'Room' | 'Map' | 'Venue' | 'Sponsor' | 'Staff'
export type PageComponents = {
  [name in Pages]: () => ReturnType<typeof defineAsyncComponent>
}

export const pageRoutesNameList: Array<PageRoutes> = ['Home', 'Agenda', 'Room', 'Map', 'Venue', 'Sponsor', 'Staff']

export function createAsyncPages (injectLoadingPromise: InjectLoadingPromiseFunction) {
  const pages: PageComponents = {
    home: () => injectLoadingPromise(() => import(
    /* webpackChunkName: "home" */
    /* webpackPrefetch: true */
      '@/pages/Home.vue')),
    agenda: () => injectLoadingPromise(() => import(
    /* webpackChunkName: "agenda" */
    /* webpackPrefetch: true */
      '@/pages/Agenda.vue')),
    room: () => injectLoadingPromise(() => import(
    /* webpackChunkName: "room" */
    /* webpackPrefetch: true */
      '@/pages/Room.vue')),
    map: () => injectLoadingPromise(() => import(
    /* webpackChunkName: "map" */
    /* webpackPrefetch: true */
      '@/pages/Map.vue')),
    venue: () => injectLoadingPromise(() => import(
    /* webpackChunkName: "venue" */
    /* webpackPrefetch: true */
      '@/pages/Venue.vue')),
    sponsor: () => injectLoadingPromise(() => import(
    /* webpackChunkName: "sponsor" */
    /* webpackPrefetch: true */
      '@/pages/Sponsor.vue')),
    staff: () => injectLoadingPromise(() => import(
    /* webpackChunkName: "staff" */
    /* webpackPrefetch: true */
      '@/pages/Staff.vue'))
  }
  return pages
}
