<template>
  <footer class="footer tw-p-8 lg:tw-px-4">
    <div
      class="tw-relative tw-max-w-6xl tw-mx-auto tw-flex tw-flex-col md:tw-flex-row tw-justify-between"
    >
      <div>
        <router-link v-if="footerLogo" to="/">
          <img :src="footerLogo" :alt="{}" class="h-8" />
        </router-link>
      </div>
      <nav
        v-if="routes"
        class="tw-mt-8 tw-w-full tw-flex tw-flex-wrap md:tw-block md:tw-w-auto md:tw-mt-0"
      >
        <!--<template v-for="(item, index) in routes" :key="index">-->
        <router-link
          v-for="(item, index) in routes"
          :key="index"
          :to="item.path"
          class="tw-block tw-text-xl tw-mt-3 tw-px-2 tw-w-1/2 text-sth hover:tw-text-gray-100 md:tw-text-base md:tw-inline"
        >
          <!--<factor-icon v-if="item.icon" :icon="item.icon" />-->
          <span v-if="item.meta.title" v-text="item.meta.title" />
        </router-link>
        <!--</template>-->
      </nav>
    </div>
  </footer>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { footerRoutes } from "@shared/routes";

export default defineComponent({
  setup: () => {
    const routes = footerRoutes;
    const footerLogo = null;

    return { routes, footerLogo };
  },
});
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
