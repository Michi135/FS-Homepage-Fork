<template>
  <div class="main">
    <h5 class="header">
      Willkommen auf der Homepage der Fachschaft
      <br />Mathe|Physik|Informatik
    </h5>
    <h4 class="tw-text-center sec-header">
      Nachdem du schon mal hier bist schau dich doch gerne mal um
    </h4>
    <br />
    <br />
    <div class="tw-flex tw-flex-col tw-items-center">
      <img :src="fachschaftimage" class="fachschaftsimage tw-rounded-lg" />
    </div>
    <br />
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  setup: () => {
    const fachschaftimage = require("@static/img/plakat.jpg");

    return { fachschaftimage };
  },
});
</script>

<style scoped lang="less">
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
  max-height: 63vh;
  max-width: 100vw;
  height: auto;
  width: auto;
  box-shadow: 4px 4px rgb(39, 39, 39);
}
</style>