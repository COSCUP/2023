// Copyright (c) 2020 DevilTea
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { LanguageType, defaultLanguageType, languagePackSet, LanguagePackSet, LanguagePack } from './languages'
import { useService } from '@/utils/common'
export * from './languages'

export interface LanguageService {
  languageType: LanguageType;
  languagePackSet: LanguagePackSet;
  readonly languagePack: LanguagePack;
}

class LanguageServiceConcrete implements LanguageService {
  public languageType: LanguageType = defaultLanguageType
  public languagePackSet: LanguagePackSet = languagePackSet

  public get languagePack (): LanguagePack {
    return this.languagePackSet[this.languageType]
  }
}

export function createLanguageService (): LanguageService {
  return new LanguageServiceConcrete()
}

export function useLanguageService (): LanguageService {
  return useService<LanguageService>('languageService')
}
