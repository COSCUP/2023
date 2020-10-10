// Copyright (c) 2020 DevilTea
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { LanguageType, defaultLanguageType, languagePackSet, LanguagePackSet, LanguagePack } from './languages'
import { EventEmitter, Listener } from 'events'
export * from './languages'

export interface LanguageService {
  languageType: LanguageType;
  languagePack: LanguagePack;
  languagePackSet: LanguagePackSet;
  onUpdated: (listener: Listener) => void;
}

class LanguageServiceConcrete implements LanguageService {
  private _emitter = new EventEmitter()
  private _languageType: LanguageType = defaultLanguageType
  private _languagePackSet: LanguagePackSet = languagePackSet

  public get languageType () {
    return this._languageType
  }

  public set languageType (value) {
    this._languageType = value
    this._emitter.emit('update')
  }

  public get languagePackSet () {
    return this._languagePackSet
  }

  public get languagePack (): LanguagePack {
    return this._languagePackSet[this.languageType]
  }

  public onUpdated (listener: Listener) {
    this._emitter.on('update', listener)
  }
}

export function createLanguageService (): LanguageService {
  return new LanguageServiceConcrete()
}
