<template>
  <div>
    <br />
    <div v-if="ferien" class="flex flex-col items-center text-center space-y-2">
      <div>
        Die Fachschaft wünscht schöne Ferien und ist weiterhin
        <br />
        an den folgenden Tagen von
        {{ ferien_sprechstunden.uhrzeit }} für euch da
      </div>
      <div />
      <div />
      <div>Feriensprechstunden der FSMPI</div>
      <div
        class="flex flex-wrap space-x-2 border-solid border-2 border-gray-600 text-left justify-center"
      >
        <div
          v-for="(sprechstunde, index) in ferien_sprechstunden.sprechstunden"
          :key="index"
        >
          <div v-text="sprechstunde.tag" />
          <div v-text="sprechstunde.betreuer" />
        </div>
      </div>
    </div>
    <div v-else>
      <div>Sprechstunden der FSMPI</div>
      <div class="grid" :style="gridStyle">
        <div></div>
        <div v-for="(uhrzeit, index) in uhrzeiten" :key="index" v-text="uhrzeit"></div>
        <template v-for="i in tage.length">
          <div v-text="tage[i - 1]" :key="i" />
          <template v-for="(sprechstunde, index) in sprechstunden">
            <div v-text="sprechstunde.betreuer[i - 1]" :key="index" />
          </template>
        </template>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { setting } from "@factor/api"

export default {
  components: {},
  data() {
    return {
      loading: true,
      ferien: true,
      tage: ["Montag", "Dienstag", "Mittwoch", "Donnerstag"],
      uhrzeiten: ["13:00", "14:00", "15:00"],
      sprechstunden: [
        {
          betreuer: ["Julia", "Tobias", "Armin", "David"],
        },
        {
          betreuer: ["Marcel", "Ahmet", "David", "Ahmet"],
        },
        {
          betreuer: ["Marcel", "Armin", "Anne", "Marius"],
        },
      ],
      ferien_sprechstunden: {
        uhrzeit: "14 bis 16 Uhr",
        sprechstunden: [
          {
            tag: "19.08",
            betreuer: "Fabi",
          },
          {
            tag: "26.08",
            betreuer: "Dennis",
          },
          {
            tag: "02.09",
            betreuer: "Ruth",
          },
          {
            tag: "09.09",
            betreuer: "Julia",
          },
          {
            tag: "16.09",
            betreuer: "Masell",
          },
          {
            tag: "23.09",
            betreuer: "Olivia",
          },
          {
            tag: "30.09",
            betreuer: "David",
          },
          {
            tag: "07.10",
            betreuer: "Elias",
          },
          {
            tag: "14.10",
            betreuer: "Charlotte",
          },
          {
            tag: "21.10",
            betreuer: "Marius",
          },
          {
            tag: "28.10",
            betreuer: "Armin",
          },
        ],
      },
    }
  },
  computed: {
    gridStyle() {
      return {
        gridTemplateColumns: `repeat(${this.tage.length + 1}, minmax(max-content, 1fr))`,
        gridTemplateRows: `repeat(${
          this.uhrzeiten.length + 1
        }, minmax(max-content, 1fr))`,
        gridAutoFlow: "column",
      }
    },
  },
  methods: {
    setting,
  },
}
</script>

<style lang="less">
</style>