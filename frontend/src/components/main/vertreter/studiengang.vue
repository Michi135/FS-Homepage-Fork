<template>
  <p>{{ studiengang }}</p>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'

import type { PropType } from 'vue'
import type { Faecher, Lehramt, Grad, Feld } from "@dataInterfaces/IVertreter.js"

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
    zweitfach_de: {
      type: String,
      required: false,
      default: undefined
    },
    zweitfach_en: {
      type: String,
      required: false,
      default: undefined
    },
    drittfach_de: {
      type: String,
      required: false,
      default: undefined
    },
    drittfach_en: {
      type: String,
      required: false,
      default: undefined
    }
  },
  setup(props)
  {
    const { t, locale } = useI18n()

    const studiengang = computed(() =>
    {
      let val: string = ''
      if (props.lehramt) val = t('lectureship') + ' ' + t(props.lehramt) + ' '

      val += t(props.grad)

      if (!props.lehramt /*props.feld*/) val += t(<Feld>props.feld)

      val += ' ' + t(props.hauptfach)
      
      if (locale.value ==='de'){
        if(!!props.zweitfach_de){
          val += '/' + t(props.zweitfach_de)
        }
        if(!!props.drittfach_de){
          val += '/' + t(props.drittfach_de)
        }
      }else{
        if(!!props.zweitfach_en){
          val += '/' + t(props.zweitfach_en)
        }
        if(!!props.drittfach_en){
          val += '/' + t(props.drittfach_en)
        }
      }
      return val
    })
    return { studiengang }
  }
})
</script>

<i18n locale="de">
{
  "Mathe": "Mathe",
  "Physik": "Physik",
  "Informatik": "Informatik",
  "Gymnasium": "GYM",
  "Bachelor": "B.",
  "Master": "M.",
  "Science": "Sc.",
  "lectureship": "LA",
  "AngewandteInformatik" : "Angewandte Informatik"
}
</i18n>

<i18n locale="en">
{
  "Mathe": "Math",
  "Physik": "Physics",
  "Informatik": "Computer science",
  "Gymnasium": "GYM",
  "Bachelor": "B.",
  "Master": "M.",
  "Science": "Sc.",
  "lectureship": "LS",
  "AngewandteInformatik" : "Applied computer science"
}
</i18n>
