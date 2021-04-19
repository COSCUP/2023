import { defineConfig } from 'vite'
import { readdirSync, readFileSync } from 'fs'
import path from 'path'
import Vue from '@vitejs/plugin-vue'
import Components from 'vite-plugin-components'
import ViteIcons, { ViteIconsResolver } from 'vite-plugin-icons'
import dotenv from 'dotenv'
import generateSessionPages from './scripts/after-build/generateSessionPages'

const { parsed } = dotenv.config()

const renderRoutes = (() => {
  const routes = [
    '/',
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
        .map((route) => path.join('/', locale, route))
        .concat(path.join('/', locale, '/session/template'))
    })
})()

const GA_TEMPLATE = readFileSync(path.join(__dirname, './template/ga.html')).toString()

export default defineConfig({
  base: parsed?.VITE_BASE_URL,
  resolve: {
    alias: {
      '@': `${path.resolve(__dirname, 'src')}`
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
    includedRoutes () {
      return renderRoutes
    },
    onPageRendered: (r, html) => {
      return html.replace('{{{ %GA_TEMPLATE% }}}', GA_TEMPLATE)
    }
  }
})
