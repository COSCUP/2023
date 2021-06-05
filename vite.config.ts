import { defineConfig } from 'vite'
import { readdirSync, readFileSync } from 'fs'
import { join } from 'path'
import Vue from '@vitejs/plugin-vue'
import Components from 'vite-plugin-components'
import ViteIcons, { ViteIconsResolver } from 'vite-plugin-icons'
import dotenv from 'dotenv'

const { parsed } = dotenv.config()

const renderRoutes = parsed?.VITE_LANDING_ONLY === 'yes'
  ? (() => {
      const routes = [
        '/',
        '/landing',
        '/session'
      ].flatMap(r => [r, `${r}/`])
      return Array.from(readdirSync('./locales/'))
        .flatMap((locale) => {
          return routes
            .map((route) => join('/', locale, route))
            .concat(join('/', locale, '/session/template'))
        })
    })()

  : (() => {
      const routes = [
        '/',
        '/landing',
        '/session',
        '/room',
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

export default defineConfig({
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
    ViteIcons()
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
})
