<template>
  <div
    class="clearfix"
    :class="{ visible: intersecting && clientLoaded, hidden: !intersecting || !clientLoaded }"
    v-intersect="onIntersect"
  >
    <v-img
      style="margin-bottom: 6px;"
      :class="{
        right: orientation === 'right', left: orientation === 'left',
        'tw-ml-4': orientation === 'right', 'tw-mr-4': orientation === 'left',
      }"
      class="img"
      contain
      :src="'/v1' + image"
    ></v-img>
    <div style="overflow: hidden;">
      <h1>{{ `${title} (${formatedDate})` }}</h1>
      <div style="height: 1.8em;"></div>
      <template
        v-for="(line, i) in desc"
        :key="i"
      >
        <div
          v-if="line.length === 0"
          style="height: 1.1em;"
        ></div>
        <p v-else>
          {{ line }}
        </p>
      </template>
      <div style="height: 1.8em;"></div>
      <p>
        {{ `${locations.join('/')}, ${year}, ${screenTime} min, ${genreTranslated}` }}
      </p>
    </div>
    <v-expansion-panels accordion>
      <v-expansion-panel
        style="border-radius: 10px !important;"
      >
        <v-expansion-panel-title :collapseIcon="mdiChevronUp">
          Trailer
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <youtube
            v-if="youtubeId"
            :id="youtubeId"
            kind="link"
            :description="title"
          ></youtube>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, PropType, ref } from "vue"
import dayjs from "dayjs"
import youtube from './youtube.vue'

import { mdiChevronUp } from '@mdi/js'
import { useI18n } from "vue-i18n"

export default defineComponent({
  components: {
    youtube
  },
  props: {
    title: {
      type: String,
      required: true
    },
    day: {
      type: dayjs.Dayjs,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    locations: {
      type: Object as PropType<string[]>,
      required: true
    },
    year: {
      type: Number,
      required: true,
      validator: (value: number) =>
      {
        return value >= 1900 && value <= 2100
      }
    },
    screenTime: {
      type: Number,
      required: true,
      validator: (value: number) =>
      {
        return value > 0
      }
    },
    genres: {
      type: Object as PropType<string[]>,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    orientation: {
      type: String as PropType<'left' | 'right'>,
      required: false,
      default: () =>
      {
        'right'
      }
    },
    link: {
      type: String,
      required: true
    },
    opened: {
      type: Object as PropType<string[]>,
      default: () =>
      {
        ['Users']
      }
    }
  },
  setup(props/*, { emit }*/)
  {
    const { t, locale } = useI18n()
    const formatedDate = computed(() =>
    {
      if (locale.value === 'de')
        return props.day.format('DD.MM.YYYY, H [Uhr]')

      return props.day.format('DD.MM.YYYY, h A')
    })
    const intersecting = ref<boolean>(false)

    const clientLoaded = ref<boolean>(false)

    function onIntersect(entries: boolean, observer: IntersectionObserverEntry)
    {
      intersecting.value = entries
    }

    onMounted(() =>
    {
      clientLoaded.value = true
    })

    const youtubeId = computed(() =>
    {
      const res = props.link.match(/^https:\/\/(?:youtu.be\/(.*)|www.youtube.com\/watch\?v=(.*))/)
      if (res)
        return res[1] ?? res[2]
      return null
    })
    const genreTranslated = computed(() =>
    {
      return props.genres.map((genre) =>
      {
        return t(genre)
      }).join('/')
    })

    const desc = computed(() =>
    {
      return props.description.split(/\r?\n/)
    })

    /*const open = computed({
      get: () => props.opened,
      set: (value: any) => emit('update:opened', value)
    })*/

    return { formatedDate, onIntersect, intersecting, youtubeId, mdiChevronUp, genreTranslated, desc, clientLoaded }
  }
})
</script>

<style lang="less">
.clearfix::after {
   content: " ";
   display: block;
   height: 0;
   clear: both;
}
.right {
  @media (min-width: 930px) {
    float: right
  }
}
.left {
  @media (min-width: 930px) {
    float: left
  }
}
.img {
  @media (min-width: 930px) {
    width: 33%;
  }
  max-width: 100%;
  max-height: 50vh;
}

.visible {
  opacity: 1;
  transition: opacity 0.7s linear;
}
.hidden {
  opacity: 0;
  transition: opacity 0.7s linear;
}
</style>

<i18n locale="de">
{
  "Krimi": "Krimi",
  "Thriller": "Thriller",
  "Tragikomoedie": "Tragikomödie",
  "Kriegssatire": "Kriegssatire",
  "Bibliographie": "Bibliographie",
  "Komoedie": "Komödie",
  "Gesellschaftssatire": "Gesellschaftssatire",
  "Musikfilm": "Musikfilm",
  "Animationsfilm": "Animationsfilm",
  "Action": "Action",
  "Abenteuer": "Abenteuer",
  "Actionkomoedie": "Actionkomödie",
  "Actiondrama": "Actiondrama",
  "Drama": "Drama",
  "Comicverfilmung": "Comicverfilmung",
  "Historiendrama" : "Historiendrama",
  "ScienceFiction" : "Science Fiction",
  "Mystery" : "Mystery"
}
</i18n>

<i18n locale="en">
{
  "Krimi": "Crime",
  "Thriller": "Thriller",
  "Tragikomoedie": "Tragicomedy",
  "Kriegssatire": "War satire",
  "Bibliographie": "Bibliography",
  "Komoedie": "Comedy",
  "Gesellschaftssatire": "Society satire",
  "Musikfilm": "Music film",
  "Animationsfilm": "Animation film",
  "Action": "Action",
  "Abenteuer": "Adventure",
  "Actionkomoedie": "Action-comedy",
  "Actiondrama": "Action-drama",
  "Drama": "Drama",
  "Comicverfilmung": "Comic adaptation",
  "Historiendrama" : "Historical drama",
  "ScienceFiction" : "Science fiction",
  "Mystery" : "Mystery"
}
</i18n>
