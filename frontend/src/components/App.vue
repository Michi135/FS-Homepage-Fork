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
import 'vuetify/lib/styles/main.css'
import { storeToRefs } from 'pinia'
import { getKeyPath } from '@shared/routes'

export default defineComponent({
  name: 'app',
  setup()
  {
    onMounted(() =>
    {
      const { defaultTitle, defaultFavicon, language } = storeToRefs(useStore())
      const { t, locale } = useI18n({ useScope: 'global' })
      const route = useRoute()
      const router = useRouter()

      document.title = t(<string | undefined>route.meta.title ?? defaultTitle.value)
      watch(locale, () =>
      {
        document.title = t(<string | undefined>route.meta.title ?? defaultTitle.value)
        //adjust path if language changed!!! route.meta.title
        router.replace('/' + getKeyPath(<string>route.meta.title, language.value))
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

        let routeTitle = <string | undefined>meta.title ?? defaultTitle.value
        let routeFavicon = <string | undefined>meta.favicon ?? defaultFavicon.value

        document.title = t(routeTitle)

        const faviconLink = createFaviconLink(routeFavicon)
        let exisitingLink: HTMLLinkElement | null =
          document.querySelector("link[rel*='icon']")
        if (exisitingLink)
        {
          if (!exisitingLink.isEqualNode(faviconLink))
            exisitingLink.replaceWith(faviconLink)
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
