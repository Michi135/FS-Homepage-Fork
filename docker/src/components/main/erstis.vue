<template>
  <div id="erstis">
    <div class="tw-m-3.5">
      <div style="max-width: 1100px; margin: 0 auto">
        <h3>Informationen für Studieninteressierte</h3>
        <p>
          Du überlegst, ein Bachelor-, Master- oder Lehramtsstudium in Mathe,
          Physik oder Informatik an der Uni Bayreuth anzufangen, fragst dich
          aber noch, wie hier das Unileben so abläuft und ob Bayreuth die
          richtige Stadt für dich ist? Auf dieser Seite erfährst du, warum!
        </p>
        <br />
        <h2>Das Besondere an der Uni Bayreuth</h2>
        <p>
          Die Uni Bayreuth ist eine relativ kleine Uni und die Fakultät
          Mathe/Physik/Informatik eine kleine Fakultät. Doch hier liegt auch
          schon ein großer Vorteil: Man kennt sich. Anders als an anderen großen
          Massenunis ist man hier von Anfang an nicht nur eine Matrikelnummer,
          sondern hat gleich z.B. in kleinen Übungsgruppen von oft unter 15
          Leuten die Möglichkeit, Mitstudierende kennenzulernen und auch
          persönlichen Kontakt zu den Übungsleitern herzustellen.
        </p>
        <br />
        <h2>Die Rolle der Fachschaft dabei</h2>
        <p>
          Dank der Fachschaft ist es möglich, dass ein großer Austausch zwischen
          den Studierenden stattfinden kann. So kann man auch als Erstsemester
          schon ältere Studierende kennenlernen, die einem mit gutem Rat zur
          Seite stehen. Wie geht das? Einerseits steht die Tür zur Fachschaft
          natürlich für jeden immer offen, egal ob bei konkreten Fragen und
          Problemen oder um einfach nur ein bisschen zu entspannen. Andererseits
          organisiert die Fachschaft auch speziell für Erstsemester
          Veranstaltungen zum Kennenlernen. Die Erstsemester-Veranstaltungen
        </p>
        <br />
        <h1>Buddy-System</h1>
        <p>
          Dies ist ein Hilfssystem für Erstsemester, bei dem jeder Ersti der
          möchte, einen Studierenden aus einem höheren Semester (bestenfalls
          gleiche Studienrichtung) zugeteilt bekommt. Dieser hilft gerne bei
          organisatorischen Fragen des Studiums, da es gerade zum Anfang schon
          mal ganz schön verwirrend werden kann. Außerdem werden ab und zu
          Spieleabende oder Ähnliches angeboten, bei denen ihr nette Leute eurer
          Fakultät kennenlernen könnt 😃
        </p>
        <br />
        <h1>Kneipentouren</h1>
        <p>
          Zum Anfang des Semesters organisieren wir immer zwei Kneipentouren für
          alle Erstsemester. In kleineren Gruppen besucht man hier an einem
          Abend drei bis vier der Bayreuther Kneipen. Dabei kann man nicht nur
          die Stadt und ihre Angebote besser kennenlernen, sondern auch die
          anderen Erstsemester und die Fachschaft.
        </p>
        <br />
        <h1>Erstiwochenende</h1>
        <p>
          Immer am Anfang des Wintersemesters fahren alle Fachschaftler mit
          allen Erstis, die Lust haben, zusammen in eine Unterkunft in der Nähe
          von Bayreuth, um dort das Wochenende zu verbringen. Damit dort auch
          niemandem langweilig wird, gibt es natürlich immer ein umfangreiches
          Programm, um alle auf Trab zu halten. Aber auch um einfach ein
          bisschen auszuspannen und ein paar Leute aus seinem Semester und auch
          die Fachschaftler besser kennenzulernen, ist das Erstiwochenende super
          geeignet.
        </p>
        <br />
        <h1>Erstigrillen</h1>
        <p>
          Natürlich kein Grillen der Erstis, sondern mit den Erstis 😉. Bei
          Speis und Trank kann man hier mit anderen Studierenden ins Gespräch
          kommen.
        </p>
        <br />
        <h1>Erstifrühstück</h1>
        <p>
          Ein kleines, aber feines Frühstück in der Uni auf Kosten der
          Fachschaft.
        </p>
        <br />
        <h2>Termine für das Semester WS 2021/22</h2>
        <div>
          <table :style="gridStyle">
            <colgroup>
              <col />
              <col v-for="tag in tage" :key="tag" />
            </colgroup>
            <thead>
              <tr>
                <th />
                <th v-for="tag in tage" :key="tag">{{ tag }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="stunde in stunden" :key="stunde">
                <td>{{ stunde }}</td>
                <td v-for="tag in tage" :key="tag">
                  <template
                    v-for="betreuer in sprechstunden[tag][stunde].value"
                    :key="betreuer"
                  >
                    {{ betreuer }}
                    <br />
                  </template>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="tw-text-red-500">
            Es gelten die jeweils aktuellen Corona Regelungen
          </div>
        </div>
        <br /><br />
        <p>
          Ihr seht also, es gibt viele gute Gründe, nach Bayreuth zu kommen und
          wir als Fachschaft geben unser Bestes, euch den Einstieg in euer
          Studium so einfach wie möglich zu machen. Falls ihr noch offene Fragen
          habt, schaut doch einfach mal in unserem Büro (NW II, zwischen H 20
          und S 78) vorbei, dann könnt ihr euch selbst ein Bild von der schönen
          Campus-Uni Bayreuth und der dort angesiedelten Fachschaft machen.
          Oder, falls ihr von weiter herkommt oder die Pandemie gerade keinen
          persönlichen Kontakt zulässt, schreibt uns einfach eine Mail
          (fsmpi@uni-bayreuth.de).
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, Ref, ref } from "vue";

export default defineComponent({
  setup() {
    let sprechstunden: { [key: string]: { [key: string]: Ref<String[]> } } = {};

    const tage = ["Veranstaltung", "Ort"];
    const stunden = [
      "12.10 | ab 17:00",
      "13.10 | 18:30/19:00",
      "14.10 | 16:00-17:00",
      "18.10 | 16:00",
      "18.10 | 18:00",
      "21.10 | 18:30/19:00",
      "25.10 | 19:00",
      "27.10 | 17:00",
      "10.11 | 18:00",
      "19. - 21.11",
    ];

    sprechstunden[tage[0]] = {
      [stunden[0]]: ref<String[]>(["Erstsemestergrillen"]),
      [stunden[1]]: ref<String[]>(["1. Kneipentour"]),
      [stunden[2]]: ref<String[]>(["CMlife-Einführung"]),
      [stunden[3]]: ref<String[]>([
        "Vorstellung der Fachschaft",
        "Campusführung",
        "Erstitüten",
      ]),
      [stunden[4]]: ref<String[]>(["Immatrikulationsstunde", "Campusabend"]),
      [stunden[5]]: ref<String[]>(["2. Kneipentour"]),
      [stunden[6]]: ref<String[]>(["Ersti-Sitzung", "Spieleabend"]),
      [stunden[7]]: ref<String[]>(["1. Buddytreffen"]),
      [stunden[8]]: ref<String[]>(["2. Buddytreffen"]),
      [stunden[9]]: ref<String[]>(["Ersti-Wochenende (tbd)"]),
    };

    sprechstunden[tage[1]] = {
      [stunden[0]]: ref<String[]>(["städtischer Grillplatz"]),
      [stunden[1]]: ref<String[]>(["Rondell /", "markanter Platz"]),
      [stunden[2]]: ref<String[]>(["Online / Link im E-learning"]),
      [stunden[3]]: ref<String[]>(["H18"]),
      [stunden[4]]: ref<String[]>(["Audimax"]),
      [stunden[5]]: ref<String[]>(["Rondell /", "markanter Platz"]),
      [stunden[6]]: ref<String[]>(["H17 | NW2"]),
      [stunden[7]]: ref<String[]>([""]),
      [stunden[8]]: ref<String[]>([""]),
      [stunden[9]]: ref<String[]>(["Anmeldung E-Learning"]),
    };

    const gridStyle = computed(() => {
      return {
        gridTemplateColumns: `repeat(${
          tage.length + 1
        }, minmax(min-content, max-content))`,
        gridTemplateRows: `0px repeat(${
          stunden.length + 1
        }, minmax(max-content, 1fr))`,
      };
    });
    onMounted(() => {
      const setColor = (
        ev: MouseEvent,
        backgroundColor?: string,
        backgroundColorHeader?: string,
        backgroundColorActive?: string
      ) => {
        const target = <HTMLTableCellElement>ev.target;
        const index = target.cellIndex;

        const table = <HTMLTableElement>(
          target.parentNode!.parentNode!.parentNode
        );
        const tbody = table.tBodies[0];

        const col = <HTMLTableColElement>(
          table.querySelector("colgroup")!.childNodes[index]
        );

        /*if (!col.style) col.style = {};
        col.style.backgroundColor = backgroundColor ? backgroundColor : "";

        console.log(col);*/
        //maybe set style of <col> in <colgroup>
        Array.from(tbody.rows).forEach((value) => {
          value.cells[index].style.backgroundColor = backgroundColor
            ? backgroundColor
            : "";
        });

        Array.from(table.tHead!.rows).forEach((row) => {
          row.cells[index].style.backgroundColor = backgroundColorHeader
            ? backgroundColorHeader
            : "";
        });

        if (backgroundColorActive) {
          if (target.tagName === "TH") return;

          target.style.backgroundColor = backgroundColorActive;
          target.style.color =
            "#" +
            (Number(`0x1${backgroundColorActive.substring(1)}`) ^ 0xffffff)
              .toString(16)
              .substring(1)
              .toUpperCase();
        } else {
          target.style.backgroundColor = "";
          target.style.color = "";
        }
      };
      const dataCells = Array.from(document.getElementsByTagName("td")).concat(
        Array.from(document.getElementsByTagName("th"))
      );
      dataCells.forEach((element) => {
        element.onmouseenter = (ev) =>
          setColor(ev, "#e68e0b", "#909090", "#995c00");
        element.onmouseleave = (ev) => setColor(ev);
      });

      const head = document.querySelector("head")!;

      const style = document.createElement("style");
      style.innerHTML = `@media only screen and (max-width: 550px),
        (min-device-width: 558px) and (max-device-width: 1024px) {
        #erstis
        td:nth-of-type(1):before { content: "Termin"; } }`;
      head.appendChild(style);

      for (let i = 0; i < tage.length; ++i) {
        const style = document.createElement("style");
        style.innerHTML = `@media only screen and (max-width: 550px),
        (min-device-width: 558px) and (max-device-width: 1024px) {
        #erstis
        td:nth-of-type(${i + 2}):before { content: "${tage[i]}"; } }`;
        head.appendChild(style);
      }
    });
    return { gridStyle, tage, stunden, sprechstunden };
  },
});
</script>

<style lang="less" scoped>
h3 {
  font-size: 2rem;
  color: var(--color-primary-header);
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

table {
  width: 100%;
  border-collapse: collapse;
}
/* Zebra striping */
tr:nth-of-type(odd) td {
  background: #eee;
}
tr:nth-of-type(even) td {
  background: grey;
}

th {
  background: #333;
  color: white;
  font-weight: bold;
}
td,
th {
  padding: 6px;
  border: 1px solid #ccc;
  text-align: left;
}

tr:hover td {
  background: #e68e0b;
}

@media only screen and (max-width: 550px),
  (min-device-width: 558px) and (max-device-width: 1024px) {
  /* Force table to not be like tables anymore */
  table,
  thead,
  tbody,
  th,
  td,
  tr {
    display: block;
  }

  /* Hide table headers (but not display: none;, for accessibility) */
  thead tr {
    position: absolute;
    top: -9999px;
    left: -9999px;
  }

  tr {
    border: 1px solid #ccc;
  }

  td {
    /* Behave  like a "row" */
    border: none;
    border-bottom: 1px solid #eee;
    position: relative;
    padding-left: 50%;
  }

  td:before {
    /* Now like a table header */
    position: absolute;
    /* Top/left values mimic padding */
    top: 6px;
    left: 6px;
    width: 45%;
    padding-right: 10px;
    white-space: nowrap;
  }
}
</style>