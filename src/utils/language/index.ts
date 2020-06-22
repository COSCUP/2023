// Copyright (c) 2020 DevilTea
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { LanguageType, defaultLanguageType, languagePackSet, LanguagePackSet, LanguagePack } from '@/utils/language/languages'
export * from '@/utils/language/languages'

export interface LanguageManager {
  languageType: LanguageType;
  languagePackSet: LanguagePackSet;
  readonly languagePack: LanguagePack;
}

class LanguageManagerConcrete implements LanguageManager {
  public languageType: LanguageType = defaultLanguageType
  public languagePackSet: LanguagePackSet = languagePackSet

  public get languagePack (): LanguagePack {
    return this.languagePackSet[this.languageType]
  }
}

export function createLanguageManager (): LanguageManager {
  return new LanguageManagerConcrete()
}
