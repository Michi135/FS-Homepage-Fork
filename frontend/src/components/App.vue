<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script lang="ts">
import { defineComponent, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useStore } from '@shared/store'
import { createFaviconLink } from '../favicon/favicon'
import 'tailwindcss/tailwind.css'

export default defineComponent({
  name: 'app',
  setup()
  {
    onMounted(() =>
    {
      const { defaultTitle, defaultFavicon } = useStore()
      const { t, locale } = useI18n({ useScope: 'global' })
      const route = useRoute()

      const tempLocale = <'de' | 'en' | undefined>localStorage.getItem('lang')
      if (tempLocale)
        locale.value = tempLocale

      document.title = t(<string | undefined>route.meta.title || defaultTitle)
      watch(locale, () =>
      {
        document.title = t(<string | undefined>route.meta.title || defaultTitle)
      })

      useRouter().afterEach(({ meta }, from, failure) =>
      {
        if (failure) return

        let routeTitle = <string | undefined>meta.title || defaultTitle
        let routeFavicon = <string | undefined>meta.favicon || defaultFavicon

        document.title = t(routeTitle)

        const faviconLink = createFaviconLink(routeFavicon)
        let exisitingLink: HTMLLinkElement | null =
          document.querySelector("link[rel*='icon']")
        if (exisitingLink)
        {
          if (!exisitingLink.isEqualNode(faviconLink))
          {
            exisitingLink.replaceWith(faviconLink)
          }
        }
        else document.head.appendChild(faviconLink)
      })
    })
  }
})
</script>

<style>
@import '../css/fachschaft-styles.less';
</style>
