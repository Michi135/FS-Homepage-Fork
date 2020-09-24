<template>
  <div>
    <br />
    <div v-if="ferien" class="flex flex-col items-center space-y-2">
      <h6 class="text">
        Die Fachschaft wünscht schöne Ferien und ist weiterhin
        <br />
        an den folgenden Tagen von
        {{ ferien_sprechstunden.uhrzeit }} für euch da
      </h6>
      <div class />
      <table class="table">
        <thead>
          <tr>
            <td
              class="text"
              :colspan="ferien_sprechstunden.sprechstunden.length"
            >Feriensprechstunden der FSMPI</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td
              class="text"
              v-for="sprechstunde in ferien_sprechstunden.sprechstunden"
              :key="sprechstunde.tag"
              v-text="sprechstunde.tag"
            />
          </tr>
          <tr>
            <td
              class="text"
              v-for="sprechstunde in ferien_sprechstunden.sprechstunden"
              :key="sprechstunde.tag"
              v-text="sprechstunde.betreuer"
            />
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else>
      <table class="table">
        <thead>
          <tr>
            <td class="text" colspan="5">Sprechstunden der FSMPI</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="sprechstunde in sprechstunden" :key="sprechstunde.uhrzeit">
            <td class="text" v-text="sprechstunde.uhrzeit" />
            <td
              class="text"
              v-for="(betreuend, index) in sprechstunde.betreuer"
              :key="index"
              v-text="betreuend"
            />
          </tr>
        </tbody>
      </table>
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
      sprechstunden: [
        {
          uhrzeit: "13:00",
          betreuer: ["Julia", "Tobias", "Armin", "David"],
        },
        {
          uhrzeit: "14:00",
          betreuer: ["Marcel", "Ahmet", "David", "Ahmet"],
        },
        {
          uhrzeit: "15:00",
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

  methods: {
    setting,
  },
}
</script>

<style lang="less">
.table {
  table,
  th,
  td {
    border: 3px solid black;
  }
  table {
    border-collapse: collapse;
  }
}

.text {
  color: greenyellow;
}
</style>