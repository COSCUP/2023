import { ViteSSGContext } from 'vite-ssg'

export type InstallContext = ViteSSGContext

export type SetupContext = Pick<ViteSSGContext, 'app' | 'router' | 'isClient'>

export type UserModuleInstall = (ctx: InstallContext) => void

export type UserModuleSetup = (ctx: SetupContext) => void
