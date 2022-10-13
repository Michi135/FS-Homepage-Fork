<template>
  <div
    class="clearfix"
    :class="{ visible: intersecting, hidden: !intersecting }"
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
      <h1>{{ `${title} (${formatedDate} Uhr)` }}</h1>
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
import { computed, defineComponent, PropType, ref } from "vue"
import dateFormat from 'dateformat'
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
      type: Date,
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
    const { t } = useI18n()
    const formatedDate = dateFormat(props.day, 'dd.mm.yyyy, HH')
    const intersecting = ref<boolean>(false)

    function onIntersect(entries: boolean, observer: IntersectionObserverEntry)
    {
      intersecting.value = entries
    }

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

    return { formatedDate, onIntersect, intersecting, youtubeId, mdiChevronUp, genreTranslated, desc }
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
  "Action": "Action"
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
  "Action": "Action"
}
</i18n>
