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
          navigateFallback: '/index.html',
          offlineGoogleAnalytics: true
        },
        manifest: {
          name: 'COSCUP 2022',
          short_name: 'COSCUP 2022',
          theme_color: '#ffffff',
          icons: command === 'build' ? [
            {
              src: `${parsed?.VITE_BASE_URL}/images/manifest-icon-192.maskable.png`,
              sizes: "192x192",
              type: "image/png",
              purpose: "any"
            },
            {
              src: `${parsed?.VITE_BASE_URL}/images/manifest-icon-192.maskable.png`,
              sizes: "192x192",
              type: "image/png",
              purpose: "maskable"
            },
            {
              src: `${parsed?.VITE_BASE_URL}/images/manifest-icon-512.maskable.png`,
              sizes: "512x512",
              type: "image/png",
              purpose: "any"
            },
            {
              src: `${parsed?.VITE_BASE_URL}/images/manifest-icon-512.maskable.png`,
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
