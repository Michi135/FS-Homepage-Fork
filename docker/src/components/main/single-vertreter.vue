<template>
  <div class="vertreter-container">
    <div class="image-container">
      <img class="image" :src="vertreter.image" :alt="vertreter.name" />
    </div>
    <p class="property">{{ tGlobal("name") }}:</p>
    <p class="value" v-text="vertreter.name" />

    <p class="property">{{ tGlobal("role") }}:</p>
    <p class="value" v-text="t(vertreter.role)" />

    <v-icon
      large
      color="orange darken-2"
      :icon="mdiSchool"
    />
    <studiengang class="value" :studiengang="vertreter.studiengang"/>

    <p class="property">{{ t("semester") }}:</p>
    <p class="value" v-text="vertreter.semester" />

    <v-icon
      large
      color="orange darken-2"
      :icon="mdiEmail"
    />
    <p class="value" v-text="vertreter.email" />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { useI18n } from "vue-i18n";
import { IVertreter } from "@dataInterfaces/IVertreter";
import studiengang from './studiengang.vue'
import { mdiEmail, mdiSchool } from '@mdi/js'

export default defineComponent({
  components: {
    studiengang
  },
  name: "SingleVertreter",
  props: {
    vertreter: {
      type: Object as PropType<Partial<IVertreter>>,
      required: true,
    },
    distPath: String,
  },
  setup: () => {
    const { t } = useI18n({});
    const tGlobal = useI18n({useScope: 'global'}).t;

    return { 
      t, 
      tGlobal,
      mdiEmail,
      mdiSchool
    };
  },
});
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
  "head": "Chef",
  "vice": "Vize",
  "finances": "Finanzen",
  "networking": "Vernetzung",
  "uniCinema": "Uni-Kino",
  "publicRelations": "Öffentlichkeitsarbeit",
  "beerCoordination": "Bierkoordination",
  "physicistBar": "Physikerbar",
  "graphics": "Grafiken",
  "scripts": "Skripten",
  "root": "Root"
}
</i18n>

<i18n locale="en">
{
  "degreeCourse": "Degree course",
  "semester": "Semester",
  "head": "Head",
  "vice": "Vice",
  "finances": "Finances",
  "networking": "Networking",
  "uniCinema": "Uni-Cinema",
  "publicRelations": "Public relations",
  "beerCoordination": "Beer coordination",
  "physicistBar": "Physicist bar",
  "graphics": "Graphics",
  "scripts": "Scripts",
  "root": "Root"
}
</i18n>