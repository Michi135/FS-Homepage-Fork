<template>
  <footer class="footer p-8 lg:px-4">
    <div class="relative max-w-6xl mx-auto flex flex-col md:flex-row justify-between">
      <div>
        <factor-link v-if="footerLogo" path="/">
          <img :src="footerLogo" :alt="setting('home.meta.title')" class="h-8" />
        </factor-link>
      </div>
      <nav v-if="footerNav" class="mt-8 w-full flex flex-wrap md:block md:w-auto md:mt-0">
        <template v-for="(item, index) in footerNav">
          <component :is="item.component()" v-if="item.component" :key="index" />
          <factor-link
            v-else
            :key="index"
            :path="item.path"
            :event="item.event"
            :target="item.target"
            class="block text-xl mt-3 px-2 w-1/2 text-gray-500 hover:text-gray-100 md:text-base md:inline"
          >
            <factor-icon v-if="item.icon" :icon="item.icon" />
            <span v-if="item.name" v-formatted-text="item.name" />
          </factor-link>
        </template>
      </nav>
    </div>
  </footer>
</template>
<script lang="ts">
import { factorLink, factorIcon } from "@factor/ui"
import { setting } from "@factor/api"

export default {
  components: {
    factorLink,
    factorIcon,
  },
  data() {
    return {
      footerLogo: setting("site.logo"),
      footerNav: setting("footer.nav"),
      footerLeft: setting("footer.left"),
      footerRight: setting("footer.right"),
    }
  },
  methods: {
    setting,
    currentyear(this: any) {
      return new Date().getFullYear()
    },
  },
}
</script>
<style lang="less">
.footer {
  background-color: var(--color-secondary);
  color: var(--color-text);
}
</style>
