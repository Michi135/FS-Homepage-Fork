<template>
  <object :data="pdf" type="application/pdf" width="100%" height="100%">
    <embed :src="pdf" width="100%" height="100%" type="application/pdf" />
  </object>
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
      pdf: require("./static/panik/keinePanik.pdf"),
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
