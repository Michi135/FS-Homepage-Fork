<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script lang="ts">
import { defineComponent, onMounted, onServerPrefetch, useSSRContext, watch, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useStore } from '@shared/store'
import { createFaviconLink } from '../favicon/favicon'
import { storeToRefs } from 'pinia'
import { getKeyPath } from '@shared/routes'

import 'tailwindcss/tailwind.css'
import 'vuetify/lib/styles/main.css'

export default defineComponent({
  name: 'app',
  setup()
  {
    const { defaultTitle, defaultFavicon, language } = storeToRefs(useStore())
    const { t, locale } = useI18n({ useScope: 'global' })

    const route = useRoute()
    const router = useRouter()

    const title = computed(() =>
    {
      return t(<string | undefined>route.meta.title ?? defaultTitle.value)
    })
    const favicon = computed(() =>
    {
      return <string | undefined>route.meta.favicon ?? defaultFavicon.value
    })

    onServerPrefetch(() =>
    {
      const ctx = useSSRContext()
      Object.assign(ctx, { title: title.value, favicon: favicon.value })
    })

    onMounted(() =>
    {
      document.title = title.value
      watch(title, (newTitle) =>
      {
        document.title = newTitle
      })
      watch(favicon, (fav) =>
      {
        const faviconLink = createFaviconLink(fav)
        let exisitingLink: HTMLLinkElement | null =
          document.querySelector("link[rel*='icon']")
        if (exisitingLink)
        {
          if (!exisitingLink.isEqualNode(faviconLink))
            exisitingLink.replaceWith(faviconLink)
        }
        else document.head.appendChild(faviconLink)
      })

      watch(locale, () =>
      {
        router.replace('/' + getKeyPath(<string>route.meta.title, language.value))
        document.children[0].setAttribute('lang', <'de' | 'en'>locale.value)
      })

      router.afterEach(({ meta, path }, from, failure) =>
      {
        if (failure) return
        {
          const testLang = path.match(/^\/([^\/]*)/)
          if (testLang?.length === 2 && ['en'].includes(testLang.at(1)!))
            language.value = <'en'>testLang.at(1)!
          else
            language.value = 'de'
        }
      })
    })
  }
})
</script>

<style>
@import '../css/fachschaft-styles.less';
</style>
