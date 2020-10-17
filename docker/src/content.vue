<template>
  <div class="zeno-content flex flex-col">
    <header-primary class="flex-none" />
    <router-view class="flex-1 bgrd" />
    <footer-primary class="flex-none" />
  </div>
</template>

<script lang="ts">
import { setting } from "@factor/api/settings"
export default {
  components: {
    "header-primary": setting(`site.components.header`),
    "footer-primary": setting(`site.components.footer`),
  },
  metaInfo() {
    return {
      title: setting("metatags.defaultTitle"),
      titleTemplate: setting("metatags.titleTemplate"),
    }
  },
}
</script>

<style lang="less">
.zeno-content {
  opacity: 0;
  min-width: 100%;
  min-height: 100vh;
}

.bgrd {
  background-image: url("/img/bg-content_orange.png");
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
