<template>
  <div
    class="clearfix"
    :class="{ visible: intersecting, hidden: !intersecting }"
    v-intersect="onIntersect"
  >
    <v-img
      :class="{ right: image.orientation === 'right', left: image.orientation === 'left' }"
      class="tw-mx-4 img"
      contain
      v-if="image"
      :src="image?.img"
    ></v-img>
    <div style="overflow: hidden;">
      <h1>{{ `${title} (${formatedDate} Uhr)` }}</h1>
      <div style="height: 1.8em;"></div>
      <p>{{ description }}</p>
      <div style="height: 1.8em;"></div>
      <p>
        {{ `${locations.join('/')}, ${year}, ${screenTime} min, ${genres.join('/')}` }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from "vue"
import dateFormat from 'dateformat'

export default defineComponent({
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
      type: Object as PropType<{ img: string, orientation: 'left' | 'right' }>,
      required: false,
      default: undefined
    }
  },
  setup(props)
  {
    const formatedDate = dateFormat(props.day, 'dd.mm.yyyy, HH')
    const intersecting = ref<boolean>(false)

    function onIntersect(entries: boolean, observer: IntersectionObserverEntry)
    {
      intersecting.value = entries
      //console.log(`entry: ${entries}; observer: ${observer}`)
    }

    return { formatedDate, onIntersect, intersecting }
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