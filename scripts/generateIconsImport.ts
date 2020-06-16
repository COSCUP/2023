import { camelCase, groupBy, upperFirst } from 'lodash'
import path from 'path'
import fs from 'fs'

const iconPacksDir = path.join(__dirname, '../icons/')

const iconPackHandlerMap: { [iconPackName: string]: (iconPackName: string) => void } = {
  'font-awesome' (iconPackName) {
    const iconPackData: { [iconName: string]: [string, string] } =
      JSON.parse(fs.readFileSync(path.join(__dirname, `../icons/${iconPackName}.json`)).toString())

    const targetFilename =
      path.join(__dirname, `../src/utils/icon/icons/${camelCase(iconPackName)}.ts`)

    const groupedByFontAwesomeType = groupBy(Object.values(iconPackData)
      .map((value) => ({
        type: value[0],
        name: value[1]
      })), (a) => a.type)

    const importTemplateMap: { [type: string]: (iconNameListString: string) => string } = {
      fab: (iconNameListString) => `import { ${iconNameListString} } from '@fortawesome/free-brands-svg-icons'`,
      fas: (iconNameListString) => `import { ${iconNameListString} } from '@fortawesome/free-solid-svg-icons'`,
      far: (iconNameListString) => `import { ${iconNameListString} } from '@fortawesome/free-regular-svg-icons'`,
      ext: (iconNameListString) => `import { ${iconNameListString} } from '../fontAwesome/ext'`
    }
    const importSection =
      'import { library } from \'@fortawesome/fontawesome-svg-core\'\n' +
      Object.entries(groupedByFontAwesomeType)
        .map((entry) => {
          const errorHandler = () => { throw new Error(`Invalid fontAwesome type: ${entry[0]}`) }
          const importTemplate = importTemplateMap[entry[0]] || errorHandler
          return `${importTemplate(entry[1].map((icon) => camelCase(`fa-${icon.name}`)).join(', '))}`
        })
        .join('\n')

    const libraryAddSection = `library.add(${
      Object.values(groupedByFontAwesomeType)
        .map((icons) => icons.map((icon) => camelCase(`fa-${icon.name}`)).join(', ')).join(', ')
    })`

    const typesSection = [
      `export type ${upperFirst(camelCase(iconPackName))}Source = '${camelCase(iconPackName)}'`,
      `export interface ${upperFirst(camelCase(iconPackName))}IconData {`,
      `  source: ${upperFirst(camelCase(iconPackName))}Source;`,
      '  name: string;',
      '  value: [string, string];',
      '}'
    ].join('\n')

    const iconsSection = [
      `export const ${camelCase(iconPackName)}Icons: ${upperFirst(camelCase(iconPackName))}IconData[] = [`,
      Object.entries(iconPackData).map((entry) => {
        return [
          '  {',
          `    source: '${camelCase(iconPackName)}',`,
          `    name: '${entry[0]}',`,
          `    value: [${entry[1].map((a) => `'${a}'`).join(', ')}]`,
          '  }'
        ].join('\n')
      }).join(',\n'),
      ']'
    ].join('\n')

    const fullContent = [importSection, typesSection, libraryAddSection, iconsSection].join('\n\n').concat('\n')
    fs.writeFileSync(targetFilename, fullContent)
  }
}

const iconPackNames = fs.readdirSync(iconPacksDir)
  .map((filename) => filename.split('.'))
  .map((splitted) => splitted.slice(0, splitted.length - 1).join(''))

const indexContent = `
${
  iconPackNames.map((name) => `import { ${camelCase(name)}Icons, ${upperFirst(camelCase(name))}Source, ${upperFirst(camelCase(name))}IconData } from './icons/${camelCase(name)}'`).join('\n')
}
${
  iconPackNames.map((name) => `export * from './icons/${camelCase(name)}'`).join('\n')
}
export type IconSource = ${iconPackNames.map((name) => `${upperFirst(camelCase(name))}Source`).join(' | ')}
export const icons: (${iconPackNames.map((name) => `${upperFirst(camelCase(name))}IconData`).join(' | ')})[] = [
${
  iconPackNames.map((name) => `  ...${camelCase(name)}Icons`).join(',\n')
}
]
`.trim().concat('\n')

fs.writeFileSync(path.join(__dirname, '../src/utils/icon/index.ts'), indexContent)

iconPackNames
  .forEach((iconPackName) => {
    const handler = iconPackHandlerMap[iconPackName] || ((iconPackName) => {
      throw new Error(`Invalid icon pack name for handlers: ${iconPackName}.`)
    })
    handler(iconPackName)
  })
