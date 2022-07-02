import * as RNLocalize from 'react-native-localize';
import LOCALES from './locales';
import dot from 'dot-object';
import ITranslation from '../../../config/locales/ITranslation';
import enTranslation from '../../../config/locales/en';
import ruTranslation from '../../../config/locales/ru';

class LanguageProvider {
  locale: keyof typeof LOCALES;
  private translation: ITranslation = enTranslation;

  constructor() {
    this.locale =
      (RNLocalize.getLocales()?.[0].languageCode as keyof typeof LOCALES) ??
      LOCALES.en;

    this.setTranslation();
  }

  private setTranslation() {
    switch (this.locale) {
      case LOCALES.en:
        this.translation = enTranslation;
        break;
      case LOCALES.ru:
        this.translation = ruTranslation;
        break;
      default:
        this.translation = enTranslation;
    }
  }

  translate(path: string): string {
    return dot.pick(path, this.translation.translations);
  }
}

export default LanguageProvider;
