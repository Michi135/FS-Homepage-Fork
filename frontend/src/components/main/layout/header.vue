<template>
  <header
    class="tw-justify-between md:tw-items-center fachschafts-header tw-py-1.5"
  >
    <div class="tw-flex tw-items-center tw-space-x-4">
      <div />
      <router-link to="/">
        <img
          v-if="navLogo"
          :src="navLogo"
          alt="Alberner Tross"
          class="tw-h-12"
        />
      </router-link>
      <p
        style="
          color: #fc7a00;
          letter-spacing: 0.086rem;
          font-family: Maven Pro, sans-serif;
          font-size: 1.2rem;
        "
      >
        {{ tGlobal('studentCouncil', 1) }} {{ tGlobal('MATH') }}|{{
          tGlobal('PHYSICS')
        }}|{{ tGlobal('COMPUTER SCIENCE') }}
      </p>
    </div>
    <div
      style="z-index: 9999"
      class="tw-relative tw-flex tw-flex-row md:tw-hidden"
    >
      <button
        aria-label="Header-Menü"
        type="button"
        class="tw-appearance-none tw-block tw-transition-all tw-cursor-pointer focus:tw-outline-none active:tw-bg-transparent tw-py-3 tw-px-6"
        @click="isOpen = !isOpen"
      >
        <svg
          class="tw-h-6 tw-w-6 tw-fill-current tw-text-purple-500"
          viewBox="0 0 24 24"
        >
          <path
            v-if="isOpen"
            fill-rule="evenodd"
            d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"
          />
          <path
            v-if="!isOpen"
            fill-rule="evenodd"
            d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
          />
        </svg>
      </button>
    </div>
    <div
      style="z-index: 9998;"
      class="tw-flex tw-justify-end tw-flex-col
      md:tw-flex-row popup tw-rounded-lg
       tw-bg-gray-100 tw-absolute tw-pt-6 md:tw-relative
        md:tw-h-auto md:tw-bg-transparent md:tw-pt-0 ab"
      :class="
        isOpen
          ? 'ak-visible'
          : 'ak-hidden'
      "
    >
      <h4 class="tw-px-8 custom-uppercase tw-text-gray-600 md:tw-hidden">
        Menu
      </h4>
      <nav>
        <ul
          class="tw-flex tw-flex-wrap tw-list-none tw-list-inside tw-px-6 tw-py-3 lg:tw-items-center md:tw-justify-end tw-gap-y-4"
        >
          <li
            v-for="(item, index) in routes"
            :key="index"
            class="tw-w-1/2 md:tw-w-auto"
          >
            <router-link
              :key="index"
              :to="basePaths.home + item.path"
            >
              <span
                v-if="item.meta?.title"
                v-text="tGlobal(item.meta.title as string)"
                class="tw-p-2.5"
              />
            </router-link>
          </li>
        </ul>
      </nav>
      <div
        class="tw-flex tw-flex-none tw-justify-evenly tw-items-center myImg temp"
      >
        <img
          alt="german flag"
          :src="gerFlagSvg"
          class="tw-px-3"
        />
        <v-switch
          hide-details
          inset
          v-model="language"
          true-value="en"
          false-value="de"
          style="flex: none"
        />
        <img
          alt="english flag"
          :src="engFlagSvg"
          class="tw-px-3"
        />
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'

import { routes as appRoutes } from '@client/routes'
import { useStore } from '@shared/store'
import trossSvg from '@static/img/tross.svg'

import gerFlagSvg from 'svg-country-flags/svg/de.svg'
import engFlagSvg from 'svg-country-flags/svg/gb.svg'

export default defineComponent({
  setup: () =>
  {
    const isOpen = ref<boolean>(false)
    const globalI18n = useI18n({ useScope: 'global' })
    const localI18n = useI18n()
    const { language } = storeToRefs(useStore())

    onMounted(() =>
    {
      watch(language, (val, prevval) =>
      {
        globalI18n.locale.value = language.value
      })
    })

    const routes = computed(() =>
    {
      return appRoutes.getCategoryRoutes('header', language.value)
    })

    return {
      language,
      tLocal: localI18n.t,
      tGlobal: globalI18n.t,
      isOpen,
      navLogo: trossSvg,
      gerFlagSvg,
      engFlagSvg,
      routes,
      basePaths: appRoutes.basePaths
    }
  }
})
</script>

<style lang="less">
.fachschafts-header {
  display: grid;
  grid-template-columns: 1fr minmax(750px, 1fr);
  gap: 0;

  background-color: var(--color-secondary);
  color: #cccccc;

  @media (max-width: 1024px) {
    display: flex;
  }

  .popup {
    left: 10px;
    top: 5px;
    right: 10px;
    perspective: 2000px;
    box-shadow: 0 50px 100px -20px rgba(50, 50, 93, 0.25),
      0 30px 60px -30px rgba(0, 0, 0, 0.3),
      0 -18px 60px -10px rgba(0, 0, 0, 0.025);
    transform-origin: 100% 0;
    @media (min-width: 768px) {
      left: 0;
      top: 0;
      right: 0;
      box-shadow: none;
    }
  }

  @media (max-width: 768px)
  {
    .ab {
      transition: opacity 0.5s ease;
    }
    .ak-visible {
      opacity: 1;
    }
    .ak-hidden {
      opacity: 0;
      pointer-events: none;
    }
  }
}

nav ul li:hover {
  color: var(--color-primary);
}

.myImg {
  img {
    height: 25px;
  }
}
</style>

<style lang="less">
.temp {
  .v-label {
    padding-inline-start: 0px;
  }
}
</style>

<i18n locale="de">
{
}
</i18n>

<i18n locale="en">
{
}
</i18n>
