<template>
  <div>
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
import { defineComponent } from "vue";

export default defineComponent({
  setup() {},
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
</style>