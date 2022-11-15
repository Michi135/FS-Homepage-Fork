import { useI18n as vueUseI18n, createI18n as vueCreateI18n } from "vue-i18n"

import { de, en } from 'vuetify/locale'

import { merge } from 'lodash-es'
import Globali18n from './Translations/i18nGlobal.json'

function createMessages<T>(messages: Record<SupportedLanguages, T>)
{
  return merge(messages, Globali18n, { de: { "$vuetify": de }, en: { "$vuetify": en } })
}

export function createI18n<T>(locale: SupportedLanguages = 'de', messages: Record<SupportedLanguages, T>)
{
  return vueCreateI18n<false> (
    {
      availableLocales: ['en', 'de'],
      legacy: false,
      locale: locale,
      fallbackLocale: ['en', 'de'],
      messages: createMessages(messages)
    })
}

function createValueMerge<T>(messages: Record<SupportedLanguages, T>)
{
  const temp = createMessages<T>(messages)
  return Object.values(temp)
}

type MessageSchema = ReturnType<typeof createValueMerge>

export function useI18nGlobal<T>()
{
  return vueUseI18n<{ message: MessageSchema }, SupportedLanguages>({ useScope: 'global' })
}