<template>
  <div>
    <h3>
      Willkommen auf der Homepage der Fachschaft
      <br />Mathe|Physik|Informatik
    </h3>
    <div class="tw-text-center">
      <h1>Nachdem du schon mal hier bist schau dich doch gerne mal um</h1>
      <h2 style="color: #ff9e1f"><router-link class="link" to="/erstis">Hier</router-link> geht es zum Erstsemesterbereich</h2>
    </div>
    <br />
    <div class="tw-flex tw-flex-col tw-items-center">
      <img
        v-if="fachschaftsimage"
        :src="fachschaftsimage"
        alt="Fachschaftsplakat"
        class="fachschaftsimage tw-rounded-lg"
      />
    </div>
    <br /><br />
    <div class="tw-m-3.5">
      <div style="max-width: 1100px; margin: 0 auto">
        <h2>Die “Fachschaft”</h2>
        <h1><b>Was</b> ist die Fachschaft?</h1>
        <p>
          Als Fachschaft versteht man drei verschiedene Dinge: Zunächst ist die
          Fachschaft die Gesamtheit der Studierenden an einer Fakultät. Diese
          Studierenden wählen jedes Jahr zur Hochschulwahl eine
          Studienvertretung mit bis zu sieben Mitgliedern. Diese gewählte
          Studienvertretung bildet zusammen mit gleichrangigen freiwilligen
          Helfern eine Gruppe, welche ebenfalls als “Fachschaft” bezeichnet
          wird. In unserem Fall ist das die Fachschaft Mathe/Physik/Informatik.
          Die dritte Bedeutung des Wortes ist “Fachschaft” als Abkürzung für
          “Fachschaftsbüro”, welches ihr übrigens im NW2 Gebäude neben dem H20
          findet.
        </p>
        <br />
        <h1><b>Wer</b> ist die Fachschaft?</h1>
        <p>
          In erster Linie sind wir auch nur Studierende, die neben ihrem Studium
          ein Ehrenamt bekleiden. Die aktuellen Fachschaftler*innen könnt ihr
          <router-link class="link" to="/vertreter">hier</router-link> sehen.
        </p>
        <p>
          Darüber hinaus werden wir durch unzählige ehemalige
          Fachschaftler*innen und Freunde der Fachschaft unterstützt. Wir freuen
          uns aber natürlich auch über jede freiwillige Hilfe!
        </p>
        <br />
        <h1><b>Was</b> macht die Fachschaft?</h1>
        <p>
          Gemäß unserem Auftrag (BayHSchG,Art.52Abs.4,5,6) werden wir uns um die
          “Vertretung der fachlichen, wirtschaftlichen und sozialen Belange der
          Studierenden [... der Fakultät, sowie] die Förderung der geistigen,
          musischen und sportlichen Interessen der Studierenden” kümmern. Das
          bedeutet, dass wir uns neben der Vertretung in Studierendenparlament
          und Fakultätsrat auch mit diversen Events für Erstsemester und
          Erstsemesterinnen beschäftigen (siehe:
          <router-link class="link" to="/erstis">hier</router-link>). So bieten
          wir im Normalfall mehrere Grillabende, Kneipentouren und Cocktailkurse
          an und fahren mit einigen mutigen Erstis sogar auf ein gemeinsames
          Wochenende. Abseits von der Erstsemesterbetreuung organisieren wir
          auch noch jedes Semester die NW2-Party, bei der das NW2 Foyer zum
          Dancefloor wird und die frisch ausgebildeten Cocktailshaker*innen ihre
          Skills beweisen können. Des Weiteren bieten wir euch alle zwei Wochen
          im Semester das Unikino an, bei dem wir die Hörsäle H18 und H17 für
          euch zum Kino machen, und sind allgemein bei vielen anderen Aktionen
          am Campus irgendwie involviert. Was bieten wir euch? Abgesehen von den
          Events, die wir organisieren, bieten wir euch eine allgemeine
          Anlaufstelle. Egal ob ihr ein Problem im Studium habt, Kaffee oder
          Bier trinken, einen Snack essen, oder einfach ein lockeres Gespräch
          haben wollt, bei uns seid ihr richtig! Falls ihr euch selbst
          engagieren wollt, können wir euch ein nahezu WG gleiches Gefühl
          bieten, nur dass bei uns das Wohnzimmer auf dem Campus steht, es keine
          gemeinsame Dusche gibt und außerhalb der Pandemie am Tag unzählige
          Leute ein und aus gehen.
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  setup: () => {
    const fachschaftsimage = ref<string>("");

    import("@static/img/plakat.jpg" /* webpackPackPreload: true */).then(
      (value) => {
        fachschaftsimage.value = value.default;
      }
    );

    return { fachschaftsimage };
  },
});
</script>

<style scoped lang="less">
h3 {
  font-size: 2rem;
  color: var(--color-primary-header);
  text-align: center;
}
h2 {
  font-size: 1.5rem;
  color: var(--color-primary-header);
}
h1 {
  font-size: 1.2rem;
  color: var(--color-secondary-header);
}
.link {
  color: lightblue;
}
.link:hover {
  color: var(--color-primary);
}
ul {
  li {
    margin-left: 20px;
    color: #f1f1f1;
  }
}
p {
  text-align: justify;
  color: #f1f1f1;
}
.fachschaftsimage {
  max-height: 63vh;
  max-width: 100vw;
  height: auto;
  width: auto;
  box-shadow: 4px 4px rgb(39, 39, 39);
}
</style>