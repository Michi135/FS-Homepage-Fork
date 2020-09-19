<template>
  <div class="main">
    <h5 class="header">Aktuelle Vertreter der Fachschaft FSMPI</h5>
    <br />
    <div class="grid">
      <table class="box" v-for="vertreter_it in vertreter" :key="vertreter_it.name">
        <tbody>
          <tr>
            <td rowspan="5">
              <div class="image-container">
                <img :src="vertreter_it.image" />
              </div>
            </td>
            <td class="text">Name:</td>
            <td class="text" v-text="vertreter_it.name" />
          </tr>
          <tr>
            <td class="text">Rolle:</td>
            <td class="text" v-text="vertreter_it.role" />
          </tr>
          <tr>
            <td class="text">Studiengang:</td>
            <td class="text" v-text="vertreter_it.studiengang" />
          </tr>
          <tr>
            <td class="text">Semester:</td>
            <td class="text" v-text="vertreter_it.semester" />
          </tr>
          <tr>
            <td class="text">Email:</td>
            <td class="text" v-text="vertreter_it.email" />
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
      vertreter: [
        {
          image: require("./static/img/portraits/masell.jpg"),
          name: "Masell",
          role: "Chef",
          studiengang: "B.Sc. Physik",
          semester: 4,
          email: "maxmustermann@gmail.com",
        },
        {
          image: require("./static/img/portraits/julia.png"),
          name: "Julia",
          role: "Vize",
          studiengang: "B.Sc. Technomathe",
          semester: 4,
          email: "jumusterfrau@gmail.com",
        },
        {
          image: require("./static/img/portraits/charlotte.png"),
          name: "Charlotte",
          role: "Finanzen",
          studiengang: "B.Sc. Physik",
          semester: 2,
          email: "chmusterfrau@gmail.com",
        },
        {
          image: require("./static/img/portraits/dennis.png"),
          name: "Dennis",
          role: "Uni-Kino",
          studiengang: "B.Sc. Informatik",
          semester: 2,
          email: "demustermann@gmail.com",
        },
        {
          image: require("./static/img/portraits/olivia.png"),
          name: "Olivia",
          role: "Öffentlichkeitsarbeit",
          studiengang: "B.Sc. Informatik",
          semester: 2,
          email: "olmusterfrau@gmail.com",
        },
        {
          image: require("./static/img/portraits/ahmet.png"),
          name: "Ahmet",
          role: "Öffentlichkeitsarbeit",
          studiengang: "LA Gym Sport/Mathe",
          semester: 4,
          email: "ahmustermann@gmail.com",
        },
        {
          image: require("./static/img/portraits/fabi.jpg"),
          name: "Fabian",
          role: "Bierkoordinator",
          studiengang: "LA Mathe/Physik",
          semester: 2,
          email: "famustermann@gmail.com",
        },
        {
          image: require("./static/img/portraits/ruth.png"),
          name: "Ruth",
          role: "Grafiken",
          studiengang: "B.Sc. Informatik",
          semester: 4,
          email: "rumusterfrau@gmail.com",
        },
        {
          image: require("./static/img/portraits/anne.jpg"),
          name: "Anne",
          role: "Grafiken",
          studiengang: "B.Sc. Informatik",
          semester: 6,
          email: "anmusterfrau@gmail.com",
        },
        {
          image: require("./static/img/portraits/elias.jpg"),
          name: "Elias",
          role: "Skripten",
          studiengang: "B.Sc. Physik",
          semester: 2,
          email: "elmustermann@gmail.com",
        },
        {
          image: require("./static/img/portraits/olli.jpg"),
          name: "Olli",
          role: "Root",
          studiengang: "B.Sc. Informatik",
          semester: 4,
          email: "olmustermann@gmail.com",
        },
      ],
    }
  },

  /*constructor(vertreter) {
    let imgUrl = vertreter.image
      ? { uri: vertreter.image }
      : require("../assets/images/image.jpg")
    this.state = { image: imgUrl }
  },*/

  methods: {
    setting,
  },
}
</script>

<style lang="less">
.image-container {
  max-height: 200px;
  max-width: 120px;
  height: auto;
  width: auto;
}

.main {
  background-image: url("./static/img/bg-content_orange.png");
  background-repeat: no-repeat;
  background-size: 100%;
  .header {
    font-size: 2rem;
    color: cyan;
    text-align: center;
  }
}

.text {
  color: greenyellow;
}

.details {
  justify-content: space-between;
}

.container {
  display: flex;
  flex-direction: column;
  .item {
    flex: auto;
  }
}

.image {
  max-height: 200px;
  max-width: 120px;
  height: auto;
  width: auto;
}

.grid {
  justify-content: center;
  align-items: center;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(auto, 25%));
  column-gap: 3rem;
  row-gap: 2rem;
}

.box {
  border: 5px solid;
  border-radius: 6px;
  border-color: aquamarine;
  border-style: outset;
  width: 100%;
  height: 100%;
}

/*.content-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding-top: 45px;
  .nav-show-mobile {
    display: none;
    @media (max-width: 1100px) {
      display: block;
    }
  }
  @media (max-width: 1100px) {
    padding-top: 0;
  }

  .nav-show-desktop {
    display: block;
    @media (max-width: 1100px) {
      display: none;
    }
  }

  .content-content {
    display: flex;
    flex-grow: 1;
    .content-nav,
    .content-main {
      overflow-y: scroll;
    }
    .content-nav {
      flex: 0 0 250px;
      padding: 1em 1.5em;
      background: rgba(38, 67, 89, 0.08);
    }
    .content-main {
      min-height: 100vh;
      flex: 1 1 100%;
      display: flex;
      flex-direction: column;
      .content-main-content {
        padding: 1.5em;
        flex-grow: 1;
      }
      .content-footer {
        padding: 1em 1.5em;
        font-size: 0.85em;
        color: rgba(38, 67, 89, 0.2);
        text-align: center;
      }
    }
  }
}*/
</style>