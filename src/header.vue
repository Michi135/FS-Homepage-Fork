<template>
  <header class="justify-between md:items-center fachschafts-header">
    <div class="flex items-center space-x-4">
      <div />
      <img v-if="navLogo" :src="navLogo" class="h-12" />
      <p class="text-xl">Fachschaft Mathe|Physik|Informatik</p>
    </div>
    <div
      v-if="navConfig"
      class="popup transition-all rounded-lg bg-gray-100 absolute pt-6 md:relative md:opacity-100 md:h-auto md:bg-transparent md:pt-0"
      :class="isOpen ? 'z-40 opacity-100 h-auto' : 'z-0 overflow-hidden h-0 opacity-0'"
    >
      <h4 class="px-8 custom-uppercase text-gray-600 md:hidden">Menu</h4>
      <nav>
        <ul
          class="flex flex-wrap list-none list-inside px-6 py-3 lg:items-center"
          :class="navClass()"
        >
          <li v-for="(item, index) in siteNav" :key="index" class="w-1/2 md:w-auto">
            <component :is="item.component()" v-if="item.component" />
            <factor-link
              v-else
              :key="index"
              :path="item.path"
              :event="item.event"
              :target="item.target"
              class="mt-0 py-1 px-2 font-normal leading-loose text-xl transition-all text-purple-900 hover:bg-gray-100 hover:text-purple-900 md:hover:bg-transparent md:inline md:px-3 md:text-base md:hover:text-purple-500"
              @click="isOpen = !isOpen"
            >
              <factor-icon v-if="item.icon" :icon="item.icon" />
              <span v-if="item.name" v-formatted-text="item.name" />
            </factor-link>
          </li>
        </ul>
      </nav>
    </div>
  </header>
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
      loading: true,
      navLogo: setting("site.logo"),
      navConfig: setting("site.nav"),
      isOpen: false,
    }
  },
  computed: {
    siteNav(this: any) {
      return this.navConfig.filter((item: any) => !item.condition || item.condition())
    },
  },
  mounted: function () {
    this.loading = false
  },
  methods: {
    navClass(this: any) {
      if (this.$route.path != "/") {
        return "md:justify-end"
      } else {
        return "md:justify-center"
      }
    },
  },
}
</script>

<style lang="less">
.fachschafts-header {
  display: grid;
  grid-template-columns: 1fr minmax(750px, 1fr);
  gap: 0;

  background-color: var(--color-secondary);
  color: var(--color-text);

  @media (max-width: 1024px) {
    display: flex;
  }

  .popup {
    left: 10px;
    top: 5px;
    right: 10px;
    perspective: 2000px;
    box-shadow: 0 50px 100px -20px rgba(50, 50, 93, 0.25),
      0 30px 60px -30px rgba(0, 0, 0, 0.3), 0 -18px 60px -10px rgba(0, 0, 0, 0.025);
    transform-origin: 100% 0;
    @media (min-width: 768px) {
      left: 0;
      top: 0;
      right: 0;
      box-shadow: none;
    }
  }
}
</style>
