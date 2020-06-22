// Copyright (c) 2020 DevilTea
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { LanguageType, defaultLanguageType, languagePackSet } from '@/utils/language/languages'
export * from '@/utils/language/languages'

export interface LanguagePack {
  app: {
    navbar: {
      home: string;
      agenda: string;
      map: string;
      venue: string;
      sponsor: string;
      staff: string;
      blog: string;
      'press-release': string;
      coc: string;
      languageSwitch: string;
    };

    footer: {
      websites: string;
      social: string;
    };
  };

  home: {
    meta: {
      title: string;
    };
    info: {
      venue: string;
      tabs: {
        announcement: string;
      };
    };
    notice: {
      title: string;
      content: string;
    };
    about: {
      title: string;
      content: string;
    };
  };

  agenda: {
    meta: {
      title: string;
    };
  };

  venue: {
    meta: {
      title: string;
    };
    title: string;
    name: string;
    address: string;
    plans: {
      [name: string]: string;
    };
  };

  map: {
    meta: {
      title: string;
    };
  };

  sponsor: {
    meta: {
      title: string;
    };
    callForSponsorship: {
      title: string;
      content: string;
    };
    level: {
      titanium: string;
      diamond: string;
      gold: string;
      silver: string;
      bronze: string;
      'co-organizer': string;
      'special-thanks': string;
    };
  };

  staff: {
    meta: {
      title: string;
    };
    groups: {
      secretary: string;
      coordinator: string;
      program: string;
      field: string;
      streaming: string;
      finance: string;
      marketing: string;
      it: string;
      photo: string;
      sponsor: string;
    };
  };
}

export type LanguagePackSet = {
  [languageType in LanguageType]: LanguagePack
}

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
