<template>
  <div class="main">
    <h5 class="header">
      Willkommen auf der Homepage der Fachschaft
      <br />Mathe|Physik|Informatik
    </h5>
    <h4 class="text-center sec-header">
      Nachdem du schon mal hier bist schau dich doch gerne mal um
    </h4>
    <br />
    <br />
    <div class="flex flex-col items-center">
      <img :src="fachschaftimage" class="fachschaftsimage rounded-lg" />
    </div>
    <br />
  </div>
</template>
<script lang="ts">
import { setting } from "@factor/api"

export default {
  components: {},
  data() {
    return {
      loading: true,
      fachschaftimage: require("./static/img/plakat.jpg"),
    }
  },

  methods: {
    setting,
  },
}
</script>

<style lang="less">
.main {
  .header {
    font-size: 2rem;
    color: var(--color-primary-header);
    text-align: center;
  }
  .sec-header {
    //font-size: 1.5rem;
    color: var(--color-secondary-header);
  }
}

.fachschaftsimage {
  max-height: 65vh;
  max-width: 100vw;
  height: auto;
  width: auto;
}
</style>