import { defineConfig, loadEnv } from 'vite'
import { readdirSync, readFileSync } from 'fs'
import { join } from 'path'
import Vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import ViteIcons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(({ mode, command }) => {
  const parsed = loadEnv(mode, process.cwd())

  const rawData = JSON.parse(readFileSync(join(__dirname, './src/assets/json/session.json'), { encoding: 'utf8' }))

  const renderRoutes = parsed?.VITE_LANDING_ONLY === 'true'
    ? (() => {
        const routes = [
          '/',
          '/landing',
          '/sponsorship',
          '/map'
        ].flatMap(r => [r, `${r}/`])
        return Array.from(readdirSync('./locales/'))
          .flatMap((locale) => {
            return routes
              .map((route) => join('/', locale, route))
          })
      })()

    : (() => {
        const routes = [
          '/',
          '/landing',
          '/sponsorship',
          '/session',
          '/room',
          '/community',
          '/venue',
          '/map',
          '/sponsor',
          '/staff'
        ].flatMap(r => [r, `${r}/`])

        return Array.from(readdirSync('./locales/'))
          .flatMap((locale) => {
            return routes
              .map((route) => join('/', locale, route))
              .concat(rawData.sessions.map(el => join('/', locale, `/session/${el.id}`)))
          })
      })()

  const gaTemplate = readFileSync(join(__dirname, './templates/ga-template.html')).toString()

  return {
    base: parsed?.VITE_BASE_URL,
    resolve: {
      alias: {
        '@': `${join(__dirname, 'src')}`
      }
    },
    plugins: [
      Vue({
        include: [/\.vue$/, /\.md$/]
      }),
      Components({
        dts: true,
        resolvers: [
          IconsResolver({
            prefix: 'icon'
          })
        ]
      }),
      ViteIcons(),
      VitePWA({
        registerType: 'autoUpdate',
        workbox: {
          globIgnores: ['**/session/*.html'],
          navigateFallback: 'index.html',
          navigateFallbackDenylist: [/.*\.(jpg|png|svg|json|js|xml|pdf)$/],
          offlineGoogleAnalytics: true,
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/script\.google\.com\/.*/i,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'room-status-cache',
                expiration: {
                  maxEntries: 2,
                  maxAgeSeconds: 60 * 60 * 24 * 30 // <== 30 days
                },
                cacheableResponse: {
                  statuses: [0, 200, 301]
                }
              }
            },
            {
              urlPattern: /^https:\/\/coscup\.org\/2023\/json\/.*/i,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'json-data-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 5 // <== 5 days
                },
                cacheableResponse: {
                  statuses: [0, 200, 301]
                }
              }
            }
          ]
        },
        includeAssets: command === 'build' ? ['favicon.svg'] : [],
        manifest: {
          name: `COSCUP ${parsed?.VITE_YEAR}`,
          short_name: `COSCUP ${parsed?.VITE_YEAR}`,
          theme_color: '#ffffff',
          icons: command === 'build'
            ? [
                {
                  src: `${parsed?.VITE_BASE_URL}images/manifest-icon-192.maskable.png`,
                  sizes: '192x192',
                  type: 'image/png',
                  purpose: 'any'
                },
                {
                  src: `${parsed?.VITE_BASE_URL}images/manifest-icon-192.maskable.png`,
                  sizes: '192x192',
                  type: 'image/png',
                  purpose: 'maskable'
                },
                {
                  src: `${parsed?.VITE_BASE_URL}images/manifest-icon-512.maskable.png`,
                  sizes: '512x512',
                  type: 'image/png',
                  purpose: 'any'
                },
                {
                  src: `${parsed?.VITE_BASE_URL}images/manifest-icon-512.maskable.png`,
                  sizes: '512x512',
                  type: 'image/png',
                  purpose: 'maskable'
                }
              ]
            : []
        }
      })
    ],
    ssgOptions: {
      script: 'async',
      formatting: 'minify',
      includedRoutes () {
        return renderRoutes
      },
      onPageRendered: (r, html) => {
        return html
          .replace('<template>%GA_TEMPLATE%</template>', gaTemplate)
      }
    }
  }
})
