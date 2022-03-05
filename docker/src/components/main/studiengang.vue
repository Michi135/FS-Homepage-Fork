<template>
  <p>{{ studiengang }}</p>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'

import type { PropType } from 'vue'
import type { Faecher, Lehramt, Grad, Feld } from "@dataInterfaces/IVertreter"

export default defineComponent({
  props: {
    lehramt: {
      type: String as PropType<Lehramt>,
      required: false,
      default: undefined
    },
    grad: {
      type: String as PropType<Grad>,
      required: true
    },
    feld: {
      type: String as PropType<Feld>,
      required: false,
      default: undefined
    },
    hauptfach: {
      type: String as PropType<Faecher>,
      required: true
    },
    zweitfach: {
      type: String as PropType<Faecher>,
      required: false,
      default: undefined
    }
  },
  setup(props)
  {
    const { t } = useI18n()

    const studiengang = computed(() =>
    {
      let val: string = ''
      if (props.lehramt) val = t('lectureship') + ' ' + t(props.lehramt) + ' '

      val += t(props.grad)

      if (!props.lehramt /*props.feld*/) val += t(<Feld>props.feld)

      val += ' ' + t(props.hauptfach)

      if (props.zweitfach) val += '/' + t(props.zweitfach)

      return val
    })
    return { studiengang }
  }
})
</script>

<i18n locale="de">
{
  "MATH": "Mathe",
  "PHYSICS": "Physik",
  "COMPUTER SCIENCE": "Informatik",
  "GYMNASIUM": "GYM",
  "BACHELOR": "B.",
  "MASTER": "M.",
  "SCIENCE": "Sc.",
  "lectureship": "LA",
  "TECHNO MATH": "Technomathe"
}
</i18n>

<i18n locale="en">
{
  "MATH": "Math",
  "PHYSICS": "Physics",
  "COMPUTER SCIENCE": "Computer science",
  "GYMNASIUM": "GYM",
  "BACHELOR": "B.",
  "MASTER": "M.",
  "SCIENCE": "Sc.",
  "lectureship": "LS",
  "TECHNO MATH": "Techno math"
}
</i18n>
