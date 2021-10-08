<template>
  <div>
    <h5 class="header">Aktuelle Vertreter der Fachschaft FSMPI</h5>
    <br />
    <div class="tw-flex tw-flex-col tw-items-center">
      <div class="all-container">
        <SingleVertreter
          v-for="vertreter_it in vertreter"
          :key="vertreter_it.name"
          :vertreter="vertreter_it"
        />
      </div>
    </div>
    <br />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import SingleVertreter from "@components/main/single-vertreter.vue";

import type { IResolvedVertreter } from "@dataInterfaces/IVertreter";

export default defineComponent({
  components: {
    SingleVertreter,
  },
  setup: (prop, context) => {
    let vertreter = ref(new Array<Partial<IResolvedVertreter>>());

    vertreter.value = new Array<Partial<IResolvedVertreter>>(
      {
        image: require("@static/img/portraits/julia.jpg"),
        name: "Julia",
        role: "Chef",
        studiengang: "B.Sc. Technomathe",
        semester: 7,
        email: "julia.schwarz@uni-bayreuth.de",
      },
      {
        image: require("@static/img/portraits/armin.jpg"),
        name: "Armin",
        role: "Vize",
        studiengang: "M.Sc. Physik",
        semester: 4,
        email: "armin.roediger@uni-bayreuth.de",
      },
      {
        image: require("@static/img/portraits/charlotte.jpg"),
        name: "Charlotte",
        role: "Finanzen",
        studiengang: "B.Sc. Physik",
        semester: 5,
        email: "charlotte.geiger@uni-bayreuth.de",
      },
      {
        image: require("@static/img/portraits/lennart.jpg"),
        name: "Lennart",
        role: "Finanzen",
        studiengang: "B.Sc. Informatik",
        semester: 3,
        email: "lennart.reinstorf@uni-bayreuth.de",
      },
      {
        image: require("@static/img/portraits/elias.jpg"),
        name: "Elias",
        role: "Vernetzung",
        studiengang: "LA GYM B. Info/Mathe",
        semester: 3,
        email: "dennis.streicher@uni-bayreuth.de",
      },
      {
        image: require("@static/img/portraits/dennis.jpg"),
        name: "Dennis",
        role: "Uni-Kino",
        studiengang: "B.Sc. Informatik",
        semester: 5,
        email: "dennis.streicher@uni-bayreuth.de",
      },
      {
        image: require("@static/img/portraits/masell.jpg"),
        name: "Masell",
        role: "Uni-Kino",
        studiengang: "B.Sc. Physik",
        semester: 7,
        email: "marcel.schalling@uni-bayreuth.de",
      },
      {
        image: require("@static/img/portraits/olivia.jpg"),
        name: "Olivia",
        role: "Öffentlichkeitsarbeit",
        studiengang: "B.Sc. Informatik",
        semester: 5,
        email: "olivia.kammerer@uni-bayreuth.de",
      },
      {
        image: require("@static/img/portraits/sophie.jpg"),
        name: "Sophie",
        role: "Öffentlichkeitsarbeit",
        studiengang: "B.Sc. Physik",
        semester: 7,
        email: "sophie.meissner@uni-bayreuth.de",
      },
      {
        image: require("@static/img/portraits/michelle.jpg"),
        name: "Michelle",
        role: "Bierkoordinatorin",
        studiengang: "B.Sc. Informatik",
        semester: 3,
        email: "michelle.reimann@uni-bayreuth.de",
      },
      {
        image: require("@static/img/portraits/lena.jpg"),
        name: "Lena",
        role: "Physikerbar",
        studiengang: "B.Sc. Physik",
        semester: 7,
        email: "magdalena.doerfler@uni-bayreuth.de",
      },
      {
        image: require("@static/img/portraits/marius.jpg"),
        name: "Marius",
        role: "Grafiken",
        studiengang: "B.Sc. Physik",
        semester: 9,
        email: "marius.kaiser@uni-bayreuth.de",
      },
      {
        image: require("@static/img/portraits/maike.jpg"),
        name: "Maike",
        role: "Skripten",
        studiengang: "LA GYM M. Mathe/Physik",
        semester: 4,
        email: "maike.schelhorn@uni-bayreuth.de",
      },
      {
        image: require("@static/img/portraits/olli.jpg"),
        name: "Olli",
        role: "Root",
        studiengang: "M.Sc. Informatik",
        semester: 1,
        email: "oliver.zahn@uni-bayreuth.de",
      }
    );

    return { vertreter };
  },
});
</script>

<style scoped lang="less">
.header {
  font-size: 2rem;
  text-align: center;
  color: var(--color-primary-header);
}

.all-container {
  width: 98%;

  justify-content: center;
  align-items: center;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
  grid-template-rows: repeat(auto, max-content);
  column-gap: 10px;
  row-gap: 15px;
  align-items: stretch;

  @media only screen and (max-width: 460px) {
    display: flex;
    flex-direction: column;
    width: max-content;
    max-width: 100%;
  }
}
</style>