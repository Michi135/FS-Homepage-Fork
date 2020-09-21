<template>
  <div>
    <div class="example">{{ msg }}</div>
  </div>
</template>

<script>
import { setting } from "@factor/api"

export default {
  data() {
    return {
      msg: "Hello world!",
      //url: "./panik/keine-panik.pdf",
    }
  },
  mounted: function () {
    this.loading = false
  },
  methods: {},

  components: {
    // pdf,
  },
}
</script>

<style>
.example {
  color: red;
}
</style>

<custom1>
  This could be e.g. documentation for the component.
</custom1>
