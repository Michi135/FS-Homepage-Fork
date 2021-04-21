<template>
  <component v-if="component" :is="component" />
  <router-view v-else />
</template>

<script lang="ts">
import {
  AsyncComponentLoader,
  defineAsyncComponent,
  defineComponent,
  watch,
  shallowRef,
} from "vue";
import { useRoute } from "vue-router";
import { useStore } from "../shared/store";
import { createFaviconLink } from "../favicon/favicon";
//import "mdb-vue-ui-kit/css/mdb.min.css";
import "tailwindcss/tailwind.css";

export default defineComponent({
  name: "app",
  setup() {
    const component = shallowRef<AsyncComponentLoader | null>();
    const route = useRoute();
    const store = useStore();

    const updateComponent = () => {
      if (route.meta.layout) {
        component.value = defineAsyncComponent(
          <AsyncComponentLoader>route.meta.layout
        );
      } else component.value = null;
    };
    watch(route, (route) => {
      //Set watchers on meta instead of route
      const routeTitle = <string | null>route.meta.title;
      const routeFavicon = <string | null>route.meta.favicon;

      document.title = routeTitle ? routeTitle : store.state.defaultTitle;
      const favicon = routeFavicon ? routeFavicon : store.state.defaultFavicon;

      const faviconLink = createFaviconLink(favicon);
      let exisitingLink: HTMLLinkElement | null = document.querySelector(
        "link[rel*='icon']"
      );
      if (exisitingLink) {
        if (!exisitingLink.isEqualNode(faviconLink)) {
          exisitingLink.replaceWith(faviconLink);
        }
      } else document.head.appendChild(faviconLink);

      updateComponent();
    });
    updateComponent();

    return { component };
  },
});
</script>

<style>
@import "../css/fachschaft-styles.less";
/*@import "tailwindcss/base";
@import "tailwindcss/components";
@import "tailwindcss/utilities";*/
</style>