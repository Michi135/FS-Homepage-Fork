<template>
  <div class="vertreter-container">
    <div class="image-container">
      <img
        class="image"
        :src="portraitUrl"
        :alt="name"
      />
    </div>
    <i18n-t
      keypath="name"
      tag="p"
      scope="global"
      class="property"
    />
    <p
      class="value"
      v-text="name"
    />

    <i18n-t
      keypath="role"
      tag="p"
      scope="global"
      class="property"
    />
    <p
      class="value"
      v-text="t(rolle)"
    />

    <v-icon
      large
      :icon="mdiSchool"
    />
    <studiengang
      class="value"
      :feld="feld"
      :grad="grad"
      :hauptfach="hauptfach"
      :zweitfach="lehramt?.zweitfach"
      :lehramt="lehramt?.schultyp"
    />

    <i18n-t
      keypath="semester"
      tag="p"
      class="property"
    />
    <p
      class="value"
      v-text="semester"
    />

    <v-icon
      large
      :icon="mdiEmail"
    />
    <a :href="'mailto:' + email">
      <p
        class="value"
        v-text="email"
      />
    </a>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import studiengang from './studiengang.vue'
import { mdiEmail, mdiSchool } from '@mdi/js'

import type { PropType } from 'vue'
import type { Faecher, Lehramt, Grad, Feld, Rolle } from '@dataInterfaces/IVertreter'

export default defineComponent({
  props: {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    rolle: {
      type: String as Rolle,
      required: true
    },
    feld: {
      type: String as Feld,
      required: true
    },
    grad: {
      type: String as Grad,
      required: true
    },
    hauptfach: {
      type: String as Faecher,
      required: true
    },
    lehramt: {
      type: Object as PropType<{ zweitfach: Faecher, schultyp: Lehramt }>,
      required: false,
      default: undefined
    },
    semester: {
      type: Number,
      required: true
    },
    portraitUrl: {
      type: String,
      required: true
    }
  },
  components: {
    studiengang
  },
  name: 'SingleVertreter',
  setup: () =>
  {
    const { t } = useI18n()
    const tGlobal = useI18n({ useScope: 'global' }).t

    return {
      t,
      tGlobal,
      mdiEmail,
      mdiSchool
    }
  }
})
</script>

<style lang="less" scoped>
.vertreter-container {
  background: rgb(51, 49, 48);
  display: grid;
  align-items: flex-start;
  grid-template-columns: [col-image-start] max-content [col-image-end col-properties-start] auto [col-properties-end col-value-start] auto [col-value-end];
  grid-template-rows: repeat(5, auto);
  column-gap: 0.3vw;
  row-gap: 0.3vh;

  border: 5px solid;
  border-radius: 6px;
  border-color: rgb(255, 115, 0);
  border-style: outset;

  overflow: auto;
  align-content: space-between;

  @media only screen and (max-width: 460px) {
    grid-template-columns: [col-properties-start] auto [col-properties-end col-value-start] auto [col-value-end];
    grid-template-rows: [row-image-start] max-content [row-image-end] repeat(
        5,
        auto
      );
  }

  .image-container {
    background: white;
    grid-row-start: 1;
    grid-row-end: -1;
    grid-column: col-image-start / col-image-end;
    max-width: 120px;
    height: 100%;
    display: flex;

    @media only screen and (max-width: 460px) {
      grid-row-start: row-image-start;
      grid-row-end: row-image-end;
      grid-column-start: col-properties-start;
      grid-column-end: col-value-end;

      width: 100%;
      max-width: 100%;
      max-height: auto;
    }

    .image {
      max-height: 100%;
      margin: auto;
      height: auto;
      width: auto;

      @media only screen and (max-width: 460px) {
        max-height: 30vh;
      }
    }
  }
  color: rgb(192, 192, 192);
  .property {
    grid-column: col-properties-start / col-properties-end;
  }

  .value {
    grid-column: col-value-start / col-value-end;
  }
}
</style>

<i18n locale="de">
{
  "degreeCourse": "Studiengang",
  "semester": "Semester",
  "Chef": "Chef",
  "Vize": "Vize",
  "Finanzen": "Finanzen",
  "Vernetzung": "Vernetzung",
  "Uni_Kino": "Uni-Kino",
  "Oeffentlichkeitsarbeit": "Öffentlichkeitsarbeit",
  "Bierkoordination": "Bierkoordination",
  "Physikerbar": "Physikerbar",
  "Grafiken": "Grafiken",
  "Skripten": "Skripten",
  "Root": "Root"
}
</i18n>

<i18n locale="en">
{
  "degreeCourse": "Degree course",
  "semester": "Semester",
  "Chef": "Head",
  "Vize": "Vice",
  "Finanzen": "Finances",
  "Vernetzung": "Networking",
  "Uni_Kino": "Uni-Cinema",
  "Oeffentlichkeitsarbeit": "Public relations",
  "Bierkoordination": "Beer coordination",
  "Physikerbar": "Physicist bar",
  "Grafiken": "Graphics",
  "Skripten": "Scripts",
  "Root": "Root"
}
</i18n>
