<template>
  <div id="uniKino">
    <div class="tw-m-3.5">
      <div style="max-width: 1100px; margin: 0 auto">
        <h2>
          <i18n-t
            keypath="cinema"
            tag="b"
          ></i18n-t>
        </h2>
        <div style="height: 3em;"></div>
        <i18n-t
          keypath="p[0]"
          tag="p"
        >
        </i18n-t>
        <i18n-t
          keypath="p[1]"
          tag="p"
        ></i18n-t>
        <i18n-t
          keypath="p[2]"
          tag="p"
        >
        </i18n-t>
        <i18n-t
          keypath="p[3]"
          tag="p"
        >
        </i18n-t>
        <i18n-t
          keypath="p[4]"
          tag="p"
        >
        </i18n-t>
        <template v-if="!store.isUniNetwork">
          <i18n-t
            keypath="p[5.1]"
            tag="p"
          ></i18n-t>
          <p>
            <template v-for="(date) in formatedDate">
              {{ date + '/ ' }}
            </template>
          </p>
          <i18n-t
            keypath="p[5.2]"
            tag="p"
          >
            <template #hier>
              <a
                :href="t('inet')"
                :hreflang="locale"
                target="_blank"
                rel="noopener noreferrer"
              >{{ t('here') }}</a>
            </template>
          </i18n-t>
        </template>
        <template v-else>
          <i18n-t
            keypath="p[6]"
            tag="p"
          ></i18n-t>
          <div style="height: 2em;"></div>
          <template
            v-for="(movie, i) in filmtranslation"
            :key="i"
          >
            <movie
              class="tw-py-3"
              v-bind="movie"
              :orientation="( i % 2) ? 'left' : 'right'"
            >
            </movie>
            <hr v-if="i !== filmtranslation.length - 1">
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useQuery } from "@vue/apollo-composable"
import gql from "graphql-tag"
import { computed, defineComponent, ref } from "vue"
import { useI18n } from 'vue-i18n'
import { useStore } from '@shared/store'
import dateFormat from "dateformat"

import movie from './movie.vue'

interface Movie {
  title: string
  description: string
  day: Date,
  locations: string[]
  year: number,
  screenTime: number,
  genres: string[],
  image: string,
  link: string
}

type Genre =
  'Krimi' | 'Thriller' | 'Tragikomödie' |
  'Kriegssatire' | 'Drama' | 'Kriegsfilm' |
  'Bibliographie' | 'Komödie' | 'Gesellschaftssatire' |
  'Musikfilm' | 'Animationsfilm' | 'Action'

type GraphqlFilmeData = {
  attributes: {
    titel: string
    datum: string
    beschreibung: string
    filmort: [
      {
        laender: string
      }
    ]
    jahr: number
    dauer: number
    genre: [
      {
        genre: Genre
      }
    ]
    bild: {data: {attributes: {url: string}}}
    trailerlink: string
    localizations: {
      data: [{
        attributes: {
          titel: string
          locale: 'en'
          beschreibung: string
          trailerlink: string
        }
      }]
    }
  }
}

type GraphqlFilmePayload = {
  data: GraphqlFilmeData[]
}

type GraphqlFilme = {
  uniKinoFilmes: GraphqlFilmePayload
}

type KinoDates = {
  uniKinoDates: string[]
}

type GraphqlQuery = KinoDates & GraphqlFilme

export default defineComponent({
  components: {
    movie
  },
  setup()
  {
    const store = useStore()
    const { locale } = useI18n()
    const { t } = useI18n({ useScope: "local" })

    const res = useQuery<GraphqlQuery>(gql`
    {
      uniKinoDates
      uniKinoFilmes (sort: "datum")
      {
        data
        {
          attributes
          {
            localizations{data{attributes{titel locale beschreibung trailerlink}}}
            beschreibung
            titel
            datum
            filmort { laender }
            jahr
            dauer
            genre { genre }
            bild {data{attributes{url}}}
            trailerlink
          }
        }
      }
    }`, null, { errorPolicy: 'all' })

    function copyStdLocale(data: GraphqlFilmeData): Movie
    {
      const { titel, beschreibung, datum, filmort,
        jahr, dauer, genre, bild, trailerlink } = data.attributes

      return {
        title: titel,
        day: new Date(datum),
        locations: filmort.map((ort) =>
        {
          return ort.laender
        }),
        year: jahr,
        screenTime: dauer,
        genres: genre.map(({ genre }) =>
        {
          return genre
        }),
        image: bild.data.attributes.url,
        description: beschreibung,
        link: trailerlink
      }
    }

    function copyLocale(data: GraphqlFilmeData, lang?: SupportedLanguages)
    {
      if (!lang || lang === 'de')
        return copyStdLocale(data)

      const localized = data.attributes.localizations.data.find((val) =>
      {
        return val.attributes.locale === lang
      })

      if (!localized) return copyStdLocale(data)

      const { datum, filmort,
        jahr, dauer, genre, bild } = data.attributes

      const { titel, beschreibung, trailerlink } = localized.attributes

      return {
        title: titel,
        day: new Date(datum),
        locations: filmort.map((ort) =>
        {
          return ort.laender
        }),
        year: jahr,
        screenTime: dauer,
        genres: genre.map(({ genre }) =>
        {
          return genre
        }),
        image: bild.data.attributes.url,
        description: beschreibung,
        link: trailerlink
      }
    }

    const filmtranslation = computed<Movie[]>(() =>
    {
      const films = res.result.value?.uniKinoFilmes.data
      if (!films || films.length === 0)
        return []

      return films.map((val) =>
      {
        return copyLocale(val, locale.value as SupportedLanguages)
      })
    })

    //TODO Grenzfall im template oben, falls nur ein Termin steht
    //TODO Integration von Sommerspecial in weiteren iterationen
    const formatedDate = computed(() =>
    {
      const value = res.result.value
      if (!value)
        return null

      const filmDates = [...value.uniKinoDates].sort((a, b) =>
      {
        return new Date(a).getTime() - new Date(b).getTime()
      })

      return filmDates.map((val) =>
      {
        return dateFormat(new Date(val), 'dd.mm.')
      })
    })

    return { store, filmtranslation, formatedDate, locale, t }
  }
})
</script>

<style lang="less">
#uniKino {
  p, h2 {
    color: #ffffff;
  }
  .comment {
    color: var(--color-secondary-header);
  }
  .link {
    color: lightblue;
  }
  .link:hover {
    color: var(--color-primary);
  }
  ol {
    counter-reset: section;

    li {
      margin-left: 20px;
    }
    li::before {
      counter-increment: section;
      content: counter(section) '. ';
      width: 2em;
      display: inline-block;
    }
  }
  ul {
    li {
      margin-left: 20px;
    }
  }
  .important {
    color: var(--color-primary);
    font-weight: bold;
  }
  p {
    text-align: justify;
  }
  h1 {
    font-size: 1.5rem;
    line-height: 2rem;
    color: var(--color-primary);
  }
  h2 {
    font-size: 1.875rem;
    line-height: 2.25rem;
  }
  hr {
      //background-color: red;
      /*background: rgb(7,19,237);
      background: linear-gradient(90deg, rgba(7,19,237,1) 0%, rgba(237,146,7,1) 18%, rgba(237,146,7,1) 86%, rgba(7,19,237,1) 100%);*/

      background: rgb(7,19,237);
      background: linear-gradient(90deg, rgba(7,19,237,1) 0%, rgba(194,107,0,1) 18%, rgba(194,107,0,1) 86%, rgba(7,19,237,1) 100%);
      height: 1px;
      border: 0;
  }

  a {
    color: lightblue;
  }
  a:hover {
    color: var(--color-primary);
  }
}
</style>

<i18n locale="de">
{
  "cinema": "Uni Kino",
  "p[0]": "Neben der allgemeinen Fachschaftsarbeit organisiert die Fachschaft MPI bereits seit 1992 das Uni-Kino \
          an der Universität Bayreuth. Dort zeigen wir euch während der klassischen Vorlesungszeit, \
          jeden zweiten Dienstag einen Film im H17 und H18.",
  "p[1]": "Die normalerweise mit recht trockenem und mathematischem Stoff assoziierten Hörsäle verwandeln \
          sich an diesen Tagen dank Beamer und großer Soundanlagen in echte Kinosäle! Dabei bieten wir \
          auch diverse Snacks und Getränke an. In Kooperation mit der FS-Kuwi kann sogar für das perfekte \
          Kinofeeling ab und an Popcorn angeboten werden.",
  "p[2]": "Die gezeigten Filme wurden in den vergangenen Semester stets durch Studierende der Universität \
          mitbestimmt und werden durch vorhergehende Kurzfilme abgerundet.",
  "p[3]": "Und das alles könnt ihr schon für den kleinen Unkostenbeitrag von 3€ erleben!",
  "p[4]": "Aber sogar dieser Unkostenbeitrag entfällt bei unseren Sommer- und Weihnachtsspecials! Bei diesen \
          Specials bieten wir zusätzlich auch noch Glühwein (Winter) oder Cocktails (Sommer) an. Das \
          Sommerspecial ist außerdem im Innenhof des NW2-Gebäudes, also OPEN AIR!",
  "p[5.1]": "Die Termine für dieses Semester sind:",
  "p[5.2]": "Leider können wir auf Grund rechtlicher Rahmenbedingungen das konkrete Programm nur \
            campusintern veröffentlichen. Dafür müsst ihr euch im Netz der Uni-Bayreuth befinden. \
            D.h. entweder in Eduroam oder über den Proxy der Uni Bayreuth. \
            Eine Anleitung hierzu findet ihr {hier}.",
  "p[6]": "Das Programm für dieses Semester ist:",
  "inet": "https://www.its.uni-bayreuth.de/de/internet-und-email/index.html",
  "here": "hier",
}
</i18n>

<i18n locale="en">
{
  "cinema": "Uni cinema",
  "p[0]": "In addition to the general student council work, the student council MPI has been organizing the Uni-Cinema \
          at the University of Bayreuth since 1992. There we show you during the classical lecture period, \
          every second tuesday a film in the H17 and H18.",
  "p[1]": "The lecture halls normally associated with quite dry and mathematical material are transformed into real movie \
          theaters thanks to beamers and large sound systems! At the same time we \
          also offer various snacks and drinks. In cooperation with the FS-Kuwi we can even offer popcorn for the perfect \
          cinema feeling from time to time.",
  "p[2]": "In past semesters, the films shown have always been co-directed by students at the university and are rounded \
          out by preceding short films.",
  "p[3]": "And you can experience all this for the small fee of 3€!",
  "p[4]": "But even this expense contribution is waived for our summer and christmas specials! During these specials we \
          also offer mulled wine (winter) or cocktails (summer). The \
          Summer Special is also in the courtyard of the NW2 building, therefore OPEN AIR!",
  "p[5.1]": "The dates for this semester are:",
  "p[5.2]": "Unfortunately, due to legal constraints, we can only publish the specific program internally within the campus. \
            For this you have to be in the network of the Uni-Bayreuth. \
            I.e. either in Eduroam or via the proxy of the University of Bayreuth. \
            You can find instructions regarding this {hier}.",
  "p[6]": "The program for this semester is:",
  "inet": "https://www.its.uni-bayreuth.de/en/internet-und-email/index.html",
  "here": "here",
}
</i18n>