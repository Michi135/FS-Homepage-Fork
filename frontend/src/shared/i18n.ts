import { useI18n as vueUseI18n, createI18n as vueCreateI18n } from "vue-i18n"
import type { DefaultLocaleMessageSchema } from 'vue-i18n'

import { de, en } from 'vuetify/locale'

import { merge } from 'lodash-es'
import Globali18n from './Translations/i18nGlobal.json'

export function createI18n(locale: SupportedLanguages = 'de', messages: Record<SupportedLanguages, any>)
{
  return vueCreateI18n<Record<SupportedLanguages, any>, SupportedLanguages> (
    {
      availableLocales: ['en', 'de'],
      legacy: false,
      locale: locale,
      fallbackLocale: ['en', 'de'],
      messages: merge(messages, Globali18n, { de: { "$vuetify": de }, en: { "$vuetify": en } })
    })
}
/*
export function useI18n()
{
  return vueUseI18n<>()
}
*/
