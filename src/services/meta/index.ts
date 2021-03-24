/* eslint-disable no-unused-vars */
// Copyright (c) 2020 DevilTea
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { EventEmitter, Listener } from 'events'

export type MetaType = 'title' | 'description' | 'ogUrl' | 'ogImage' | 'ogType' | 'ogSiteName'

export type MetaDomSetterSet = Record<MetaType, (value: string) => void>

export type MetaValues = Record<MetaType, string>

export type MetaOptions = Partial<MetaValues>

export const defaultMetaValues: MetaValues = {
  title: 'COSCUP 2020 | Conference for Open Source Coders, Users, and Promoters',
  description: 'Conference for Open Source Coders, Users, and Promoters is a free annual conference providing a platform to connect FLOSS folks across Asia since 2006. It\'s a major force of free software movement advocacy in Taiwan.',
  ogUrl: 'https://coscup.org/2020',
  ogImage: 'https://coscup.org/2020/images/og.png',
  ogType: 'website',
  ogSiteName: 'COSCUP 2020'
}

const vanillaMetaDomSetterSet: MetaDomSetterSet = {
  title: (value) => {
    const title: string = (value.length === 0 || value === defaultMetaValues.title) ? (defaultMetaValues.title) : (`${value} - ${defaultMetaValues.title}`);
    (document.querySelector('title') as HTMLElement).innerHTML = title;
    (document.querySelector('meta[property="og:title"]') as HTMLElement).setAttribute('content', title)
  },
  description: (value) => {
    (document.querySelector('meta[name="description"]') as HTMLElement).setAttribute('content', value);
    (document.querySelector('meta[property="og:description"]') as HTMLElement).setAttribute('content', value)
  },
  ogUrl: (value) => { (document.querySelector('meta[property="og:url"]') as HTMLElement).setAttribute('content', value) },
  ogImage: (value) => { (document.querySelector('meta[property="og:image"]') as HTMLElement).setAttribute('content', value) },
  ogType: (value) => { (document.querySelector('meta[property="og:type"]') as HTMLElement).setAttribute('content', value) },
  ogSiteName: (value) => { (document.querySelector('meta[property="og:site_name"]') as HTMLElement).setAttribute('content', value) }
}

export interface MetaService {
  readonly currentMetaValues: MetaValues;
  setMeta: (options: MetaOptions) => void;
  resetMeta: () => void;
  onUpdated: (listener: Listener) => void;
}

class MetaServiceConcrete implements MetaService {
  private _emitter = new EventEmitter()
  private __currentMetaValues: MetaValues = defaultMetaValues
  private _metaDomSetterSet: MetaDomSetterSet

  constructor (metaDomSetterSet = vanillaMetaDomSetterSet) {
    this._metaDomSetterSet = metaDomSetterSet
  }

  // eslint-disable-next-line accessor-pairs
  private set _currentMetaValues (values: MetaValues) {
    this.__currentMetaValues = values
    Object.entries(values)
      .forEach((entry) => {
        const metaDomType: MetaType = entry[0] as MetaType
        const value = entry[1]
        const setter = this._metaDomSetterSet[metaDomType]
        setter(value)
      })
    this._emitter.emit('update')
  }

  public get currentMetaValues (): MetaValues {
    return Object.freeze(this.__currentMetaValues)
  }

  public onUpdated (listener: Listener) {
    this._emitter.on('update', listener)
  }

  public setMeta (options: MetaOptions): void {
    this._currentMetaValues = {
      ...defaultMetaValues,
      ...options
    }
  }

  public resetMeta (): void {
    this._currentMetaValues = defaultMetaValues
  }
}

export function createMetaService (metaDomSetterSet = vanillaMetaDomSetterSet): MetaService {
  return new MetaServiceConcrete(metaDomSetterSet)
}
