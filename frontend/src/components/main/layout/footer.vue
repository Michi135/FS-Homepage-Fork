<template>
  <footer class="footer tw-p-8 lg:tw-px-4">
    <div
      class="tw-relative tw-max-w-6xl tw-mx-auto tw-flex tw-flex-col md:tw-flex-row tw-justify-between"
    >
      <div>
        <!--router-link
          v-if="footerLogo"
          to="/"
        >
          <img
            :src="footerLogo"
            :alt="{}"
            class="h-8"
          />
        </router-link-->
      </div>
      <nav
        v-if="routes"
        class="tw-mt-8 tw-w-full tw-flex tw-flex-wrap md:tw-block md:tw-w-auto md:tw-mt-0"
      >
        <router-link
          v-for="(item, index) in routes"
          :key="index"
          :to="basePaths.home + item.path"
          class="tw-block tw-text-xl tw-mt-3 tw-px-2 tw-w-1/2 text-sth hover:tw-text-gray-100 md:tw-text-base md:tw-inline"
        >
          <span
            v-if="item.meta?.title"
            v-text="tGlobal(item.meta.title as string)"
          />
        </router-link>
      </nav>
      <i18n-t
        tag="button"
        @click="toTop"
        keypath="top"
      >
      </i18n-t>
    </div>
  </footer>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { routes as appRoutes } from '@client/routes'
import { useI18n } from 'vue-i18n'
import { useI18nGlobal } from '@shared/i18n'
import { useStore } from '@shared/store'

export default defineComponent({
  setup: () =>
  {
    const globalI18n = useI18nGlobal()
    const localI18n = useI18n()

    const store = useStore()

    const routes = computed(() =>
    {
      return appRoutes.getCategoryRoutes('footer', globalI18n.locale.value)
    })

    const toTop = () =>
    {
      window.scrollTo(0, 0)
    }

    return {
      routes,
      footerLogo: null,
      basePaths: appRoutes.basePaths,
      tLocal: localI18n.t,
      tGlobal: globalI18n.t,
      toTop
    }
  }
})
</script>

<style scoped lang="less">
.footer {
  background-color: #404040;
  color: #dddddd;
}
.text-sth {
  color: rgba(160, 174, 192, 1);
}
</style>

<i18n locale="de">
{
  "updated": "Zuletzt aktualisiert",
  "top": "Nach oben"
}
</i18n>

<i18n locale="en">
{
  "updated": "Last updated",
  "top": "To the top"
}
</i18n>
