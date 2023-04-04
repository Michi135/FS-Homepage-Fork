<template>
  <div id="home">
    <h3>
      {{ t('welcome') }} {{ tGlobal('studentCouncil', 1) }} <br />{{
        tGlobal('MATH') +
          '|' +
          tGlobal('PHYSICS') +
          '|' +
          tGlobal('COMPUTER SCIENCE')
      }}
    </h3>
    <div class="tw-text-center">
      <h1>{{ t('intermediate') }}!</h1>
      <h2 style="color: #ff9e1f">
        <router-link
          class="link"
          to="/erstis"
        >
          {{
            tGlobal('here')
          }}
        </router-link>
        {{ t('firstis') }}
      </h2>
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
        <i18n-t
          keypath="theStCo"
          tag="h2"
        />
        <i18n-t
          tag="h1"
          keypath="temp"
        >
          <template #what>
            <i18n-t
              keypath="what"
              tag="b"
            />
          </template>
        </i18n-t>
        <i18n-t
          tag="p"
          keypath="p[0]"
        />
        <br />
        <i18n-t
          tag="h1"
          keypath="whoF"
        >
          <template #who>
            <i18n-t
              keypath="who"
              tag="b"
            />
          </template>
        </i18n-t>
        <i18n-t
          tag="p"
          keypath="p[1]"
        >
          <template #here>
            <router-link
              class="link"
              to="/vertreter"
            >
              {{
                tGlobal('here')
              }}
            </router-link>
          </template>
        </i18n-t>
        <i18n-t
          tag="p"
          keypath="p[2]"
        />
        <br />
        <i18n-t
          tag="h1"
          keypath="whatF"
        >
          <template #what>
            <i18n-t
              keypath="what"
              tag="b"
            />
          </template>
        </i18n-t>
        <i18n-t
          tag="p"
          keypath="p[3]"
        >
          <template #see>
            {{ t('see') }}
          </template>
          <template #erstis>
            <router-link
              class="link"
              to="/erstis"
            >
              {{
                tGlobal('here')
              }}
            </router-link>
          </template>
        </i18n-t>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { useI18nGlobal } from '@shared/i18n.js'
import ei from '@shared/Queries/einstellungen.js'

export default defineComponent({
  setup: () =>
  {
    const res = ei()
    const fachschaftsimage = computed(() =>
    {
      const value = res.result.value
      if (!value)
        return null

      return '/v1' + (value.einstellungen.data.attributes.plakat.data.attributes.url || '/')
    })

    const tGlobal = useI18nGlobal().t
    const { t } = useI18n()

    return { t, tGlobal, fachschaftsimage }
  }
})
</script>

<style lang="less">
#home {
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
}
</style>

<i18n locale="de" lang="json5">
{
  "welcome": "Willkommen auf der Homepage der",
  "intermediate": "Nachdem du schon mal hier bist, schau dich doch gerne mal um",
  "firstis": "geht es zum Erstsemesterbereich",
  "theStCo": "Die \"Fachschaft\"",
  "what": "Was",
  "see": "siehe",
  "temp": "{what} ist die Fachschaft?",
  "whoF": "{who} ist die Fachschaft?",
  "whatF": "{what} macht die Fachschaft?",
  "der": "der",
  "die": "die",
  "das": "das",
  "is": "ist",
  "who": "Wer",
  "p[0]": "Als Fachschaft versteht man drei verschiedene Dinge: Zunächst ist die \
          Fachschaft die Gesamtheit der Studierenden an einer Fakultät. Diese \
          Studierenden wählen jedes Jahr zur Hochschulwahl eine \
          Studienvertretung mit bis zu sieben Mitgliedern. Diese gewählte \
          Studienvertretung bildet zusammen mit gleichrangigen freiwilligen \
          Helfern eine Gruppe, welche ebenfalls als \"Fachschaft\" bezeichnet \
          wird. In unserem Fall ist das die Fachschaft Mathe/Physik/Informatik. \
          Die dritte Bedeutung des Wortes ist \"Fachschaft\" als Abkürzung für \
          \"Fachschaftsbüro\", welches ihr übrigens im NW2 Gebäude neben dem H20 \
          findet.",
  "p[1]": "In erster Linie sind wir auch nur Studierende, die neben ihrem Studium \
          ein Ehrenamt bekleiden. Die aktuellen Fachschaftler*innen könnt ihr {here} sehen.",
  "p[2]": "Darüber hinaus werden wir durch unzählige ehemalige \
          Fachschaftler*innen und Freunde der Fachschaft unterstützt. Wir freuen \
          uns aber natürlich auch über jede freiwillige Hilfe!",
  "p[3]": "Gemäß unserem Auftrag (BayHSchG,Art.52Abs.4,5,6) werden wir uns um die \
          \"Vertretung der fachlichen, wirtschaftlichen und sozialen Belange der \
          Studierenden [... der Fakultät, sowie] die Förderung der geistigen, \
          musischen und sportlichen Interessen der Studierenden\" kümmern. Das \
          bedeutet, dass wir uns neben der Vertretung in Studierendenparlament \
          und Fakultätsrat auch mit diversen Events für Erstsemester und \
          Erstsemesterinnen beschäftigen ({see} siehe: {erstis}). So bieten \
          wir im Normalfall mehrere Grillabende, Kneipentouren und Cocktailkurse \
          an und fahren mit einigen mutigen Erstis sogar auf ein gemeinsames \
          Wochenende. Abseits von der Erstsemesterbetreuung organisieren wir \
          auch noch jedes Semester die NW2-Party, bei der das NW2 Foyer zum \
          Dancefloor wird und die frisch ausgebildeten Cocktailshaker*innen ihre \
          Skills beweisen können. Des Weiteren bieten wir euch alle zwei Wochen \
          im Semester das Unikino an, bei dem wir die Hörsäle H18 und H17 für \
          euch zum Kino machen, und sind allgemein bei vielen anderen Aktionen \
          am Campus irgendwie involviert. Was bieten wir euch? Abgesehen von den \
          Events, die wir organisieren, bieten wir euch eine allgemeine \
          Anlaufstelle. Egal ob ihr ein Problem im Studium habt, Kaffee oder \
          Bier trinken, einen Snack essen, oder einfach ein lockeres Gespräch \
          haben wollt, bei uns seid ihr richtig! Falls ihr euch selbst \
          engagieren wollt, können wir euch ein nahezu WG gleiches Gefühl \
          bieten, nur dass bei uns das Wohnzimmer auf dem Campus steht, es keine \
          gemeinsame Dusche gibt und außerhalb der Pandemie am Tag unzählige \
          Leute ein und aus gehen."
}
</i18n>

<i18n locale="en" lang="json5">
{
  "welcome": "Welcome to the homepage of the",
  "intermediate": "Have a look around since you're already here",
  "firstis": "you can find the first semester area",
  "theStCo": "The \"Fachschaft\" (Student council)",
  "what": "What",
  "see": "see",
  "temp": "{what} is the Fachschaft?",
  "whoF": "{who} is the Fachschaft?",
  "whatF": "{what} is the Fachschaft doing?",
  "der": "the",
  "die": "the",
  "das": "the",
  "is": "is",
  "who": "Who",
  "p[0]": "The Fachschaft is understood to be three different things: \
          First of all the Fachschaft is the entirety of the students of a faculty. \
          Every year during the university elections those students are electing a student representation of up to seven members. \
          This elected student representation froms a group together with equally ranked voluntary helpers which are called Fachschaft as well. \
          In our case it's the student council Math/Physics/Computer Science. \
          The third meaning of the word \"Fachschaft\" is as an abbrevation for the \"Fachschaftsbüro\" (student council office) which you can find in the NW2 building adjacent to the H20.",
  "p[1]": "In the first place we're also just students which have a honorary office alongside our studies. {here} you can see the current student council members.",
  "p[2]": "In addition we're getting supported by countless former student council members and friends of the student council. \
          But we would still appreciate any voluntary help we get!",
  "p[3]": "According to our Mission (BayHSchG,Art.52Abs.4,5,6) we take care of the \
          representation regarding the professional, economic and social interests of \
          students of the faculty as well as the promotion of cognitive, artistic and \
          athletic interests of students. \
          That means we're apart from our representation in the student parliament \
          and faculty council also invested in several events for freshmen \
          ({see}: {erstis}). So in a normal case we're offering \
          multiple grilling evenings, pub crawls and cocktail courses \
          and we're even driving with some brave freshman on a weekend together. \
          Apart from the care for freshman we're organizing the NW2-Party every year \
          whereby the NW2 foyer turns into a dancefloor \
          and freshly tranied cocktail shaker are able to prove their skills. \
          Furthermore we're offering you a uni-cinema every two weeks during the semester \
          whereby we're turning the lecture halls H18 and H17 into a cinema for you \
          and in general we're somewhat involved in many different actions around the campus. \
          What do we have to offer for you? Besides of the events that we're organizing \
          we're offering you a general place to go. \
          No matter if you have a problem with your studies, want to drink coffee or beer, eat a snack  \
          or just want to have a casual conversation, you're at the right place with us! \
          If you also want to get yourself involved we can offer you a almost flat share like feeling \
          just that our living room is on the campus with no common shower and there is an uncountable amount of people \
          going in and out every day out of the pandemic."
}
</i18n>
