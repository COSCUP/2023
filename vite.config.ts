import { defineConfig, loadEnv } from 'vite'
import { readdirSync, readFileSync } from 'fs'
import { join } from 'path'
import Vue from '@vitejs/plugin-vue'
import Components from 'vite-plugin-components'
import ViteIcons, { ViteIconsResolver } from 'vite-plugin-icons'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(({ mode, command }) => {
  const parsed = loadEnv(mode, process.cwd())

  const renderRoutes = parsed?.VITE_LANDING_ONLY === 'yes'
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
            .concat(join('/', locale, '/session/template'))
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
        customComponentResolvers: ViteIconsResolver({
          componentPrefix: 'icon'
        })
      }),
      ViteIcons(),
      VitePWA({
        registerType: 'autoUpdate',
        workbox: {
          navigateFallback: 'index.html',
          navigateFallbackDenylist: [/.*\.jpg$/, /.*\.png$/, /.*\.svg$/, /.*\.json$/, /.*\.js$/],
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
                  statuses: [0, 200, 301],
                }
              }
            },
            {
              urlPattern: /^https:\/\/coscup\.org\/2022\/json\/.*/i,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'json-data-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 5 // <== 5 days
                },
                cacheableResponse: {
                  statuses: [0, 200, 301],
                }
              }
            }
          ]
        },
        includeAssets: command === 'build' ? [
          // favicon
          'favicon.svg',
          // error
          // pwa
          // 'images/apple-icon-180.png',
          // 'images/apple-splash-1125-2436.jpg',
          // 'images/apple-splash-1136-640.jpg',
          // 'images/apple-splash-1170-2532.jpg',
          // 'images/apple-splash-1242-2208.jpg',
          // 'images/apple-splash-1242-2688.jpg',
          // 'images/apple-splash-1284-2778.jpg',
          // 'images/apple-splash-1334-750.jpg',
          // 'images/apple-splash-1536-2048.jpg',
          // 'images/apple-splash-1620-2160.jpg',
          // 'images/apple-splash-1668-2224.jpg',
          // 'images/apple-splash-1668-2388.jpg',
          // 'images/apple-splash-1792-828.jpg',
          // 'images/apple-splash-2048-1536.jpg',
          // 'images/apple-splash-2048-2732.jpg',
          // 'images/apple-splash-2160-1620.jpg',
          // 'images/apple-splash-2208-1242.jpg',
          // 'images/apple-splash-2224-1668.jpg',
          // 'images/apple-splash-2388-1668.jpg',
          // 'images/apple-splash-2436-1125.jpg',
          // 'images/apple-splash-2532-1170.jpg',
          // 'images/apple-splash-2688-1242.jpg',
          // 'images/apple-splash-2732-2048.jpg',
          // 'images/apple-splash-2778-1284.jpg',
          // 'images/apple-splash-640-1136.jpg',
          // 'images/apple-splash-750-1334.jpg',
          // 'images/apple-splash-828-1792.jpg',
          // 'images/manifest-icon-192.maskable.png',
          // 'images/manifest-icon-512.maskable.png'
        ] : [],
        manifest: {
          name: 'COSCUP 2022',
          short_name: 'COSCUP 2022',
          theme_color: '#ffffff',
          icons: command === 'build' ? [
            {
              src: `${parsed?.VITE_BASE_URL}images/manifest-icon-192.maskable.png`,
              sizes: "192x192",
              type: "image/png",
              purpose: "any"
            },
            {
              src: `${parsed?.VITE_BASE_URL}images/manifest-icon-192.maskable.png`,
              sizes: "192x192",
              type: "image/png",
              purpose: "maskable"
            },
            {
              src: `${parsed?.VITE_BASE_URL}images/manifest-icon-512.maskable.png`,
              sizes: "512x512",
              type: "image/png",
              purpose: "any"
            },
            {
              src: `${parsed?.VITE_BASE_URL}images/manifest-icon-512.maskable.png`,
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable"
            }
          ] : []
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
