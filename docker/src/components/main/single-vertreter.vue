<template>
  <div class="vertreter-container">
    <div class="image-container">
      <img
        class="image"
        crossorigin="anonymous"
        :src="'http://localhost:4000' + vertreter.portrait.url"
        :alt="vertreter.nutzer_email.name"
      />
    </div>
    <p class="property">
      {{ tGlobal('name') }}
    </p>
    <p
      class="value"
      v-text="vertreter.nutzer_email.name"
    />

    <p class="property">
      {{ tGlobal('role') }}
    </p>
    <p
      class="value"
      v-text="t(vertreter.rolle)"
    />

    <v-icon
      large
      color="orange darken-2"
      :icon="mdiSchool"
    />
    <studiengang
      class="value"
      :feld="vertreter.feld"
      :grad="vertreter.grad"
      :hauptfach="vertreter.hauptfach"
      :zweitfach="vertreter.zweitfach"
      :lehramt="vertreter.Lehramt"
    />

    <p class="property">
      {{ t('semester') }}
    </p>
    <p
      class="value"
      v-text="vertreter.semester"
    />

    <v-icon
      large
      color="orange darken-2"
      :icon="mdiEmail"
    />
    <p
      class="value"
      v-text="vertreter.nutzer_email.email"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { useI18n } from 'vue-i18n'
//import { IVertreter } from "@dataInterfaces/IVertreter";
import studiengang from './studiengang.vue'
import { mdiEmail, mdiSchool } from '@mdi/js'

import type { IResolvedVertreter } from '@dataInterfaces/IVertreter'

export default defineComponent({
  components: {
    studiengang
  },
  name: 'SingleVertreter',
  props: {
    vertreter: {
      type: Object as PropType<IResolvedVertreter>,
      required: true
    }
  },
  setup: () =>
  {
    const { t } = useI18n({})
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
  "HEAD": "Chef",
  "VICE": "Vize",
  "FINANCES": "Finanzen",
  "NETWORKING": "Vernetzung",
  "UNI-CINEMA": "Uni-Kino",
  "PUBLIC RELATIONS": "Öffentlichkeitsarbeit",
  "BEER COORDINATION": "Bierkoordination",
  "PHYSICIST BAR": "Physikerbar",
  "GRAPHICS": "Grafiken",
  "SCRIPTS": "Skripten",
  "ROOT": "Root"
}
</i18n>

<i18n locale="en">
{
  "degreeCourse": "Degree course",
  "semester": "Semester",
  "HEAD": "Head",
  "VICE": "Vice",
  "FINANCES": "Finances",
  "NETWORKING": "Networking",
  "UNI-CINEMA": "Uni-Cinema",
  "PUBLIC RELATIONS": "Public relations",
  "BEER COORDINATION": "Beer coordination",
  "PHYSICIST BAR": "Physicist bar",
  "GRAPHICS": "Graphics",
  "SCRIPTS": "Scripts",
  "ROOT": "Root"
}
</i18n>
