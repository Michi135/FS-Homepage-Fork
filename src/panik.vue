<template>
  <div>
    <pdfsth></pdfsth>
  </div>
</template>
<script lang="ts">
import { factorLink, factorIcon } from "@factor/ui"
import { setting } from "@factor/api"
import { getDocument } from "./plugins/plugin-pdf"

export default {
  components: {
    factorLink,
    factorIcon,
    pdfsth: setting(`app.components.pdfsth`),
  },
  data() {
    return {
      footerLogo: setting("site.logo"),
      footerNav: setting("footer.nav"),
      footerLeft: setting("footer.left"),
      footerRight: setting("footer.right"),
      document: getDocument("./panik/keine-panik.pdf").then(function (pdf) {
        console.log("Baum")
      }),
      //promiseme: getDocument("./panik/keine-panik.pdf"),
      //panik: require("./panik/keine-panik.pdf"),
    }
  },
  methods: {
    getDocument,
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
