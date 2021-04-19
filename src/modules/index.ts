import { InstallContext } from './types'
import { useSetupCtx } from './utils'

function execModulesMethod (modulesOrder: string[], method: string, ...args: any[]) {
  const filtered = Object.entries(import.meta.globEager('./*/index.ts'))
    .filter(([filename, module]) => module[method])
  const OTHERS_INDEX = filtered.length

  filtered
    .map<[string, any]>(([filename, module]) => [filename.slice(2, -9), module])
    .sort(([nameA], [nameB]) => {
      const indexA = modulesOrder.includes(nameA) ? modulesOrder.indexOf(nameA) : OTHERS_INDEX
      const indexB = modulesOrder.includes(nameB) ? modulesOrder.indexOf(nameB) : OTHERS_INDEX
      return indexA - indexB
    })
    .forEach(([name, module]) => {
      // console.log(`${method} ${name}`)
      module[method](...args)
    })
}

export const installModules = (ctx: InstallContext) => {
  execModulesMethod(
    [],
    'install',
    ctx
  )
}

export const setupModules = () => {
  const ctx = useSetupCtx()
  execModulesMethod(
    ['theme', 'breakpoints', 'scroll-lock', 'progress', 'metas', 'pop-up'],
    'setup',
    ctx
  )
}
