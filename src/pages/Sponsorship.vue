<template>
  <main id="sponsorship" class="page-container">
    <!-- <img
      class="banner"
      :src="getImageFromAddOns('banner')"
      :alt="t('sponsorship.plan.title')"
    > -->
    <h2>{{ t('sponsorship.plan.title') }}</h2>
    <section class="markdown overview avoid-page-break">
      <h3>{{ t('sponsorship.overview.title') }}</h3>
      <!-- <p>{{ t('sponsorship.overview.announcement.title') }}</p>
      <ul>
        <li
          v-for="text in tm('sponsorship.overview.announcement.list')"
          :key="`${text}`"
        >
          {{ text }}
        </li>
      </ul> -->
      <p>{{ t('sponsorship.overview.description') }}</p>
      <p>{{ t('sponsorship.overview.feedback.title') }}</p>
      <ul>
        <li
          v-for="text in tm('sponsorship.overview.feedback.list')"
          :key="`${text}`"
        >
          {{ text }}
        </li>
      </ul>
    </section>
    <section class="markdown">
      <h3>{{ t('sponsorship.level.title') }}<span class="subtitle">{{ t('sponsorship.level.subtitle') }}</span></h3>
      <div class="level-table">
        <table
          v-for="(groupKeys, index) in groupLevelKeys"
          :key="`group-${index}`"
        >
          <thead>
            <tr>
              <th></th>
              <th
                v-for="key in groupKeys"
                :key="`name-${key}`"
              >
                <img :src="getImageFromLevel(key)" :alt="t(`sponsorship.level.list.${key}.name`)" >
                {{ t(`sponsorship.level.list.${key}.name`) }}{{ t(`sponsorship.level.list.${key}.subtitle`) }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{ t('sponsorship.level.columns.cost') }}</td>
              <td
                v-for="key in groupKeys"
                :key="`cost-${key}`"
                class="cost"
              >
                {{ t(`sponsorship.level.list.${key}.cost`) }}
              </td>
            </tr>
            <tr>
              <td>{{ t('sponsorship.level.columns.benefit') }}</td>
              <td
                v-for="key in groupKeys"
                :key="`benefits-${key}`"
              >
                <ul>
                  <li
                    v-for="benefit in tm(`sponsorship.level.list.${key}.benefits`)"
                    :key="`${benefit}`"
                  >
                    {{ benefit }}
                  </li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <ul class="level-list">
        <li
          v-for="key in levelKeys"
          :key="key"
        >
          <img :src="getImageFromLevel(key)" :alt="t(`sponsorship.level.list.${key}.name`)" >
          <h4>{{ t(`sponsorship.level.list.${key}.name`) }}{{ t(`sponsorship.level.list.${key}.subtitle`) }}</h4>
          <p>{{ t(`sponsorship.level.list.${key}.cost`) }}</p>
          <ul>
            <li
              v-for="benefit in tm(`sponsorship.level.list.${key}.benefits`)"
              :key="`${benefit}`"
            >
              {{ benefit }}
            </li>
          </ul>
        </li>
      </ul>
    </section>
    <section class="markdown">
      <h3>{{ t('sponsorship.add-ons.title') }}<span class="subtitle">{{ t('sponsorship.add-ons.subtitle') }}</span></h3>
      <div class="add-ons-table">
        <table>
          <thead>
            <tr>
              <th>{{ t('sponsorship.add-ons.item') }}</th>
              <th
                v-for="level in levelKeys"
                :key="`${level}`"
              >
                <img :src="getImageFromLevel(level)" :alt="t(`sponsorship.level.list.${level}.name`)" >
                {{ t(`sponsorship.level.list.${level}.name`) }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(column, key) in tm('sponsorship.add-ons.columns')"
              :key="`${column}`"
            >
              <td>
                {{ column }}
                <ul v-if="te(`sponsorship.add-ons.details.${key}`)">
                  <li
                    v-for="(d,i) in tm(`sponsorship.add-ons.details.${key}`)"
                    :key="i"
                  >
                    {{ d }}
                  </li>
                </ul>
              </td>
              <td
                v-if="te(`sponsorship.add-ons.list.${key}.all`)"
                :colspan="levelKeys.length"
                style="text-align: center;"
              >
                {{ t(`sponsorship.add-ons.list.${key}.all`) }}
              </td>
              <template v-else>
                <td
                  v-for="level in levelKeys"
                  :key="`${level}`"
                >
                  {{ t(`sponsorship.add-ons.list.${key}.${level}`) }}
                </td>
              </template>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="add-ons-thin-table">
        <table>
          <thead>
            <tr>
              <th>{{ t('sponsorship.add-ons.item') }}</th>
              <th>{{ t('sponsorship.add-ons.level-limit') }}</th>
              <th>{{ t('sponsorship.add-ons.cost') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="row in addOnsThinTable"
              :key="`${row.key}`"
            >
              <td
                v-if="row.rowspan"
                :rowspan="row.rowspan"
                class="name"
              >
                {{ row.column }}
                <ul v-if="te(`sponsorship.add-ons.details.${row.key}`)">
                  <li
                    v-for="(d,i) in tm(`sponsorship.add-ons.details.${row.key}`)"
                    :key="i"
                  >
                    {{ d }}
                  </li>
                </ul>
              </td>
              <td class="level">
                <img v-if="row.image" :src="row.image" :alt="row.name">
                <p>{{ row.name }}</p>
              </td>
              <td class="cost">{{ row.cost }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p
        v-for="(explain, index) in tm('sponsorship.add-ons.explains')"
        :key="index"
      >
        {{ explain }}
      </p>
      <div class="images">
        <div
          v-for="key in addOnsImageKeys"
          :key="key"
          class="item"
        >
          <img :src="getImageFromAddOns(key)" :alt="t(`sponsorship.add-ons.columns.${key}`)">
          <p>{{ t(`sponsorship.add-ons.columns.${key}`) }}</p>
        </div>
        <img>
      </div>
      <i18n-t keypath="sponsorship.add-ons.end.content" tag="p">
        <template #date>
          <span class="highlight">{{ t('sponsorship.add-ons.end.date') }}</span>
        </template>
      </i18n-t>
      <i18n-t keypath="sponsorship.contact" tag="p">
        <template #email>
          <a href="mailto:sponsorship@coscup.org">sponsorship@coscup.org</a>
        </template>
      </i18n-t>
    </section>
    <section class="markdown">
      <h3>{{ t('sponsorship.faq.title') }}</h3>
      <ul class="faq">
        <li
          v-for="item in tm('sponsorship.faq.list')"
          :key="item.q"
        >
          <h4>{{ item.q }}</h4>
          <p v-html="markdown(item.a)" />
        </li>
      </ul>
    </section>
    <section class="markdown">
      <h3>{{ t('sponsorship.about-coscup.title') }}</h3>
      <p>{{ t('sponsorship.about-coscup.description') }}</p>
      <ul>
        <li
          v-for="message in tm('sponsorship.about-coscup.messages')"
          :key="`${message}`"
        >
          {{ message }}
        </li>
      </ul>
      <p>{{ t('sponsorship.about-coscup.ps1') }}<a href="https://www.flickr.com/photos/coscup/albums">COSCUP flickr album</a></p>
      <div class="about-image">
        <img src="@/assets/images/sponsorships/about.jpg">
        <p>{{ t('sponsorship.about-coscup.ps2') }}</p>
      </div>
    </section>
    <!--
    <section class="markdown avoid-page-break">
      <h3>{{ t('sponsorship.about-kcd.title') }}</h3>
      <p>{{ t('sponsorship.about-kcd.description') }}</p>
      <p>{{ t('sponsorship.about-kcd.message') }}</p>
    </section>
    --->
    <section class="markdown avoid-page-break">
      <h3>{{ t('sponsorship.wish.title') }}</h3>
      <ul>
        <li
          v-for="message in tm('sponsorship.wish.list')"
          :key="`${message}`"
        >
          {{ message }}
        </li>
      </ul>
      <i18n-t keypath="sponsorship.contact" tag="p">
        <template #email>
          <a href="mailto:sponsorship@coscup.org">sponsorship@coscup.org</a>
        </template>
      </i18n-t>
    </section>
  </main>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import '@/assets/scss/pages/sponsorship.scss'
import { useI18n } from 'vue-i18n'
import { chunk } from '@/utils/common'
import markdown from '@/utils/markdown'
import { useTheme } from '@/modules/theme'

const levelImageModules = import.meta.globEager('../assets/images/sponsorships/levels/*.svg')
const getLevelImage = (file: string) => levelImageModules[`../assets/images/sponsorships/levels/${file}.svg`].default

const addOnsImageModules = import.meta.globEager('../assets/images/sponsorships/*.png')
const getAddOnsImage = (file: string) => addOnsImageModules[`../assets/images/sponsorships/${file}.png`].default

export default defineComponent({
  name: 'Sponsorship',
  setup () {
    const { t, tm, te } = useI18n()

    const levelKeys = computed(() => Object.keys(tm('sponsorship.level.list')))

    const groupLevelKeys = computed(() => chunk(levelKeys.value, 3))

    const addOnsImageKeys = ['flag', 'lanyards', 'promotion', 'website-agenda-ads']

    const addOnsThinTable = computed(() => {
      const getAvailableLevels = (column: string) => Object.keys(tm(`sponsorship.add-ons.list.${column}`)).filter((l) => !['X', ''].includes((tm(`sponsorship.add-ons.list.${column}`) as Record<string, string>)[l]))

      return Object.keys(tm('sponsorship.add-ons.columns'))
        .map((column) => {
          const levels = getAvailableLevels(column)
          return levels.map((level, index) => ({
            key: column,
            column: t(`sponsorship.add-ons.columns.${column}`),
            rowspan: index === 0 ? levels.length : undefined,
            image: level !== 'all' ? getImageFromLevel(level) : undefined,
            name: level !== 'all' ? t(`sponsorship.level.list.${level}.name`) : t('sponsorship.add-ons.all'),
            cost: t(`sponsorship.add-ons.list.${column}.${level}`)
          }))
        })
        .reduce((result, list) => result.concat(list), [])
    })

    const { isDark } = useTheme()

    const getImageFromLevel = (level: string) => getLevelImage(`${level}_${isDark.value ? 'dark' : 'light'}`)

    const getImageFromAddOns = (key: string) => getAddOnsImage(`${key}_${isDark.value ? 'dark' : 'light'}`)

    return {
      t,
      tm,
      te,
      levelKeys,
      groupLevelKeys,
      markdown,
      addOnsImageKeys,
      getImageFromAddOns,
      addOnsThinTable,
      getImageFromLevel
    }
  }
})
</script>
