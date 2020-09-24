<template>
  <div>
    <embed :src="pdf" width="100%" height="800px" />
  </div>
</template>
<script lang="ts">
import { factorLink, factorIcon } from "@factor/ui"
import { setting } from "@factor/api"
//import { getDocument } from "./plugins/plugin-pdf"
//import { loadPdf } from "./plugins/plugin-pdf"
import "./plugins/plugin-pdf"

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
      pdf: require("./static/panik/keine-panik.pdf"),
      //sth: success(),
      //pdf: getPage("./panik/keine-panik.pdf"),
      //document: getDocument("./panik/keine-panik.pdf").then(function (pdf) {
      // console.log("Baum")
      //}),
      //promiseme: getDocument("./panik/keine-panik.pdf"),
      //panik: require("./panik/keine-panik.pdf"),
    }
  },

  async mounted() {},
  methods: {
    //success,
    setting,
    //getDocument,
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
