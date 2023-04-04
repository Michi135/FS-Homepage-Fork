<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script lang="ts">
import { defineComponent, onMounted, onServerPrefetch, watch, computed } from 'vue'
import { useSSRContext } from '@shared/ssrContext.js'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from '@shared/store.js'
import { createFaviconLink } from '@shared/favicon.js'
import { storeToRefs } from 'pinia'
import { VueRoutes } from '@client/routes.js'
import { determineLanguage } from '@shared/util.js'

import { useI18nGlobal } from '@shared/i18n.js'

import 'tailwindcss/tailwind.css'
import 'vuetify/lib/styles/main.css'

export default defineComponent({
  name: 'app',
  setup()
  {
    const { defaultTitle, defaultFavicon } = storeToRefs(useStore())
    const { t, locale } = useI18nGlobal()

    const route = useRoute()
    const router = useRouter()

    const title = computed(() =>
    {
      return t(route.meta.title ?? defaultTitle.value)
    })
    const favicon = computed(() =>
    {
      return route.meta.favicon ?? defaultFavicon.value
    })
    watch(() => route.path, (newValue) =>
    {
      locale.value = determineLanguage(newValue)
    }, { immediate: true })

    onServerPrefetch(() =>
    {
      const ctx = useSSRContext()
      ctx.title = title.value
      ctx.favicon = favicon.value
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
        router.replace('/' + VueRoutes.getKeyPath(route.meta.title!, locale.value))
        document.children[0].setAttribute('lang', locale.value)
      })
    })
  }
})
</script>

<style>
@import '../css/fachschaft-styles.less';
</style>
