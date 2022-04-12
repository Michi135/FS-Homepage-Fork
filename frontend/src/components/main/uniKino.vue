<template>
  <div>
    <div class="tw-m-3.5">
      <div style="max-width: 1100px; margin: 0 auto">
        <h2><b>Uni Kino</b></h2>
        <div style="height: 3em;"></div>
        <p>
          Neben der allgemeinen Fachschaftsarbeit organisiert die Fachschaft MPI bereits seit 1992 das Uni-
          Kino an der Universität Bayreuth. Dort zeigen wir euch während der klassischen Vorlesungszeit,
          jeden zweiten Dienstag einen Film im H17 und H18.
        </p>
        <p>
          Die normalerweise mit recht trockenem und mathematischem Stoff assoziierten Hörsäle verwandeln
          sich an diesen Tagen dank Beamer und großer Soundanlagen in echte Kinosäle! Dabei bieten wir
          auch diverse Snacks und Getränke an. In Kooperation mit der FS-Kuwi kann sogar für das perfekte
          Kinofeeling ab und an Popcorn angeboten werden.
        </p>
        <p>
          Die gezeigten Filme wurden stets im vergangenen Semester durch Studierende der Universität
          mitbestimmt und werden durch vorhergehende Kurzfilme abgerundet.
        </p>
        <p>
          Und das alles könnt ihr schon für den kleinen Unkostenbeitrag von 3€ erleben!
        </p>
        <p>
          Aber sogar dieser Unkostenbeitrag entfällt bei unseren Sommer- und Weihnachtsspecials! Bei diesen
          Specials bieten wir zusätzlich auch noch Glühwein (Winter) oder Cocktails (Sommer) an. Das
          Sommerspecial ist außerdem im Innenhof des NW2-Gebäudes, also OPEN AIR!
        </p>
        <template v-if="!uniNetz">
          <p>Die Termine für dieses Semester sind:</p>
          <p>
            03.05. / 17.05. / 31.05. / 14.06. / 28.06. und 12.07. (Sommerspecial) jeweils um 20 Uhr.
          </p>
          <p>
            Leider können wir auf Grund rechtlicher Rahmenbedingungen das konkrete Programm nur
            campusintern veröffentlichen.
          </p>
        </template>
        <template v-else>
          <p>Das Programm für Sommersemester 2022 ist:</p>
          <div style="height: 2em;"></div>
          <template
            v-for="(movie, i) in films"
            :key="i"
          >
            <movie
              class="tw-py-3"
              v-bind="movie"
            >
            </movie>
            <hr v-if="i !== films.length - 1">
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useQuerySSR } from "@shared/vue-apollo-ssr"
import { useQuery } from "@vue/apollo-composable"
import gql from "graphql-tag"
import { defineComponent, Ref, ref } from "vue"
import movie from './movie.vue'

interface Movie {
    title: string
    day: Date,
    description: string
    locations: string[]
    year: number,
    screenTime: number,
    genres: string[],
    image?: {
      img: string,
      orientation: 'left' | 'right'
    }
}

interface Film {
  titel: string,
  datum: string, //should be date but is string
  beschreibung: string,
  orte: Array<{ ort: string }>,
  jahr: number,
  dauer: number,
  genres: Array<{ genre: string }>
  bild?: { url: string }
}

type Films = Array<Film>

export default defineComponent({
  components: {
    movie
  },
  setup()
  {
    const res = useQuery<{ films: Films, }>(gql`
      {
        films {
          titel
          datum
          beschreibung
          orte {
            ort
          }
          jahr
          dauer
          genres {
            genre
          }
          bild {
            url
          }
        }
      }
    `)

    const films: Ref<Array<Movie>> = ref([])

    let i: 'left' | 'right' = 'left'
    const process_films = () =>
    {
      films.value = res.result!.value!.films.map((val): Movie =>
      {
        if (i === 'left')
          i = 'right'
        else
          i = 'left'

        return {
          title: val.titel,
          day: new Date(val.datum),
          description: val.beschreibung,
          locations: val.orte.map((ort) =>
          {
            return ort.ort
          }),
          year: val.jahr,
          screenTime: val.dauer,
          genres: val.genres.map((genre) =>
          {
            return genre.genre
          }),
          image: (val.bild) ? {
            img: val.bild.url,
            orientation: i
          } : undefined
        }
      })
    }

    useQuerySSR(process_films, res)

    const uniNetz = true

    return { uniNetz, films }
  }
})
</script>

<style scoped lang="less">
p, h2, :deep(p) {
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
:deep(h1) {
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
</style>