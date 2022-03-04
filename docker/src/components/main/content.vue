<template>
  <div class="content tw-flex tw-flex-col">
    <primeheader class="tw-flex-none" />
    <router-view class="tw-flex-1 bgrd" />
    <primefooter class="tw-flex-none" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import primeheader from './header.vue'
import primefooter from './footer.vue'

export default defineComponent({
  name: 'content',
  components: {
    primeheader,
    primefooter
  }
})
</script>

<style scoped lang="less">
.content {
  min-width: 100%;
  min-height: 100vh;
}

.bgrd {
  background-image: url('@static/img/bg.jpg');
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
