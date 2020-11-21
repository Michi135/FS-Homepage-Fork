<template>
  <div>
    <h5 class="header">Aktuelle Vertreter der Fachschaft FSMPI</h5>
    <br />
    <div class="flex flex-col items-center">
      <div class="all-container">
        <div
          class="vertreter-container"
          v-for="vertreter_it in vertreter"
          :key="vertreter_it.name"
        >
          <div class="image-container">
            <img class="image" :src="vertreter_it.image" />
          </div>
          <p class="property">Name:</p>
          <p class="value" v-text="vertreter_it.name" />

          <p class="property">Rolle:</p>
          <p class="value" v-text="vertreter_it.role" />

          <p class="property">Studiengang:</p>
          <div class="value" v-text="vertreter_it.studiengang" />

          <p class="property">Semester:</p>
          <p class="value" v-text="vertreter_it.semester" />

          <p class="property">Email:</p>
          <p class="value" v-text="vertreter_it.email" />
        </div>
      </div>
    </div>
    <br />
  </div>
</template>
<script lang="ts">
import { setting } from "@factor/api"

export default {
  components: {},
  data() {
    return {
      loading: true,
      vertreter: [
        {
          image: require("../static/img/portraits/masell.jpg"),
          name: "Marcel",
          role: "Chef",
          studiengang: "B.Sc. Physik",
          semester: 5,
          email: "marcel.schalling@uni-bayreuth.de",
        },
        {
          image: require("../static/img/portraits/julia.png"),
          name: "Julia",
          role: "Vize",
          studiengang: "B.Sc. Technomathe",
          semester: 5,
          email: "julia.schwarz@uni-bayreuth.de",
        },
        {
          image: require("../static/img/portraits/charlotte.png"),
          name: "Charlotte",
          role: "Finanzen",
          studiengang: "B.Sc. Physik",
          semester: 3,
          email: "charlotte.geiger@uni-bayreuth.de",
        },
        {
          image: require("../static/img/portraits/dennis.png"),
          name: "Dennis",
          role: "Uni-Kino",
          studiengang: "B.Sc. Informatik",
          semester: 3,
          email: "dennis.streicher@uni-bayreuth.de",
        },
        {
          image: require("../static/img/portraits/olivia.png"),
          name: "Olivia",
          role: "Öffentlichkeitsarbeit",
          studiengang: "B.Sc. Informatik",
          semester: 3,
          email: "olivia.kammerer@uni-bayreuth.de",
        },
        {
          image: require("../static/img/portraits/ahmet.png"),
          name: "Ahmet",
          role: "Öffentlichkeitsarbeit",
          studiengang: "LA Gym Sport/Mathe",
          semester: 5,
          email: "ahmet.oezilban@uni-bayreuth.de",
        },
        {
          image: require("../static/img/portraits/fabi.jpg"),
          name: "Fabian",
          role: "Bierkoordinator",
          studiengang: "LA Mathe/Physik",
          semester: 3,
          email: "fabian.herrmann@uni-bayreuth.de",
        },
        {
          image: require("../static/img/portraits/ruth.png"),
          name: "Ruth",
          role: "Grafiken",
          studiengang: "B.Sc. Informatik",
          semester: 5,
          email: "ruth.nikol@uni-bayreuth.de",
        },
        {
          image: require("../static/img/portraits/anne.jpg"),
          name: "Anne",
          role: "Grafiken",
          studiengang: "B.Sc. Informatik",
          semester: 7,
          email: "anne.schobert@uni-bayreuth.de",
        },
        {
          image: require("../static/img/portraits/elias.jpg"),
          name: "Elias",
          role: "Skripten",
          studiengang: "B.Sc. Physik",
          semester: 3,
          email: "elias.millitzer@uni-bayreuth.de",
        },
        {
          image: require("../static/img/portraits/olli.jpg"),
          name: "Olli",
          role: "Root",
          studiengang: "B.Sc. Informatik",
          semester: 5,
          email: "oliver.zahn@uni-bayreuth.de",
        },
      ],
    }
  },
  methods: {
    setting,
  },
}
</script>

<style lang="less">
.header {
  font-size: 2rem;
  text-align: center;
  color: rgb(255, 255, 255);
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
    grid-template-rows: [row-image-start] max-content [row-image-end] repeat(5, auto);
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