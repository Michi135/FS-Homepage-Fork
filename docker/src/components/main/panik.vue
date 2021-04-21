<template>
  <object :data="pdf" type="application/pdf" width="100%" height="100%">
    <a :href="pdf" download
      ><p>
        Dein Browser kann keine PDF Anzeigen.<br />Klicke
        <span class="tw-text-blue-500">hier</span> um sie herunterzuladen
      </p></a
    >
  </object>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  setup: () => {
    const pdf = require("@static/panik/keinePanik.pdf");

    return { pdf };
  },
});
</script>