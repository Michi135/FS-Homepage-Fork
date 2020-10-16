<template>
  <span class="flex justify-center items-center">
    <div class="text-center">
      <h5>Hier gibt's noch nichts zu sehen</h5>
      <h3>Schau später nochmal vorbei</h3>
    </div>
  </span>
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
    //success,
    setting,
  },
}
</script>
<style lang="less">
.footer {
  background-color: var(--color-secondary);
  color: var(--color-text);
}
</style>
