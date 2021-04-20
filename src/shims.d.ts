// eslint-disable-next-line no-unused-vars
declare interface Window {
  rootUrl: string
}

declare module 'markdown-it-*' {
  import MarkdownIt from 'markdown-it'
  const plugin: MarkdownIt.PluginSimple | MarkdownIt.PluginWithOptions | MarkdownIt.PluginWithParams
  export default plugin
}

declare module '*.vue' {
  import { defineComponent } from 'vue'
  const component: ReturnType<typeof defineComponent>
  export default component
}
