import { useHead } from '@vueuse/head'
import { computed, InjectionKey, Ref, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { camelCase } from 'lodash-es'
import { createModuleHook } from '../utils'
import ogImageSrc from '@/assets/images/og.png'

type MetaType = 'lang' | 'title' | 'description' | 'ogUrl' | 'ogImage' | 'ogType' | 'ogSiteName'
type MetaValues = Record<MetaType, string>
export type MetaOptions = Partial<MetaValues>
type UseMetas = Record<MetaType, Ref<string>> & {
  setMetas: (metas: MetaOptions) => void;
  resetMetas: () => void;
}

const PROVIDE_KEY: InjectionKey<UseMetas> = Symbol('meta')

const _useMetas = (): UseMetas => {
  const { tm, locale } = useI18n()
  const route = useRoute()

  const defaultMetaValues: MetaValues = {
    lang: 'zh-TW',
    title: `COSCUP ${import.meta.env.VITE_YEAR} | Conference for Open Source Coders, Users, and Promoters`,
    description: 'Conference for Open Source Coders, Users, and Promoters is a free annual conference providing a platform to connect FLOSS folks across Asia since 2006. It\'s a major force of free software movement advocacy in Taiwan.',
    ogUrl: `https://coscup.org/${import.meta.env.VITE_BASE_URL}`,
    ogImage: ogImageSrc,
    ogType: 'website',
    ogSiteName: `COSCUP ${import.meta.env.VITE_YEAR}`
  }

  const _title = ref(defaultMetaValues.title)
  const metaRefs = {
    lang: ref('zh-TW'),
    title: computed<string>({
      get () {
        return _title.value
      },
      set (value) {
        _title.value = (value.length === 0 || value === defaultMetaValues.title) ? (defaultMetaValues.title) : (`${value} - ${defaultMetaValues.title}`)
      }
    }),
    description: ref(defaultMetaValues.description),
    ogUrl: ref(defaultMetaValues.ogUrl),
    ogImage: ref(defaultMetaValues.ogImage),
    ogType: ref(defaultMetaValues.ogType),
    ogSiteName: ref(defaultMetaValues.ogSiteName)
  }

  const setMetas = (metas: MetaOptions) => {
    (Object.entries(metaRefs) as [MetaType, Ref<string>][])
      .forEach(([key, metaRef]) => {
        const newMetaValue = metas[key]
        if (!newMetaValue) return
        metaRef.value = newMetaValue
      })
  }

  const resetMetas = () => {
    setMetas(defaultMetaValues)
  }

  const { lang, title, description, ogImage, ogSiteName, ogType, ogUrl } = metaRefs

  useHead({
    htmlAttrs: {
      lang
    },
    title,
    meta: [
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:url', content: ogUrl },
      { property: 'og:image', content: ogImage },
      { property: 'og:type', content: ogType },
      { property: 'og:site_name', content: ogSiteName }
    ]
  })

  watch([() => route.name, locale], ([routeName]) => {
    if (!routeName) return
    const metas = (tm(`${camelCase(routeName.toString())}.meta`) ?? null) as (MetaOptions | null)
    if (!metas) return
    resetMetas()
    Object.entries(metas)
      .forEach(([key, value]) => {
        metaRefs[key as MetaType].value = value!
      })
  }, {
    immediate: true
  })
  return { ...metaRefs, setMetas, resetMetas }
}

// export const setup = createModuleSetup(PROVIDE_KEY, _useMetas)
export const useMetas = createModuleHook(PROVIDE_KEY, _useMetas)
