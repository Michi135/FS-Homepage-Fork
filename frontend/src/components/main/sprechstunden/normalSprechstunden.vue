<template>
  <div
    class="tw-px-5"
  >
    <i18n-t
      tag="h1"
      keypath="consHours"
    />
    <table-comp
      :columns="tage"
      :rows="stunden"
      :data="sprechstunden"
      :breakpoint="760"
      :translation="translation"
    ></table-comp>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import type { Ref } from 'vue'

import tableComp from '../dynamicTable.vue'
//import table from "./dashboard/table.vue";
//https://colorlib.com/wp/css3-table-templates/
//https://colorlib.com/etc/tb/Table_Highlight_Vertical_Horizontal/index.html

export default defineComponent({
  components: {
    tableComp
  },
  setup: () =>
  {
    //https://www.npmjs.com/package/@thi.ng/sparse
    //https://adamlynch.com/flexible-data-tables-with-css-grid/
    let sprechstunden: Record<string, Record<string, Ref<string>[]>> = {}

    const tage = ['monday', 'tuesday', 'wednesday', 'thursday']
    const stunden = ['13:00', '14:00', '15:00']

    let tag = 0

    sprechstunden[tage[tag++]] = {
      [stunden[0]]: [ref<string>('Sophie')],
      [stunden[1]]: [ref<string>('Julia')],
      [stunden[2]]: [ref<string>('Lena')]
    }

    sprechstunden[tage[tag++]] = {
      [stunden[0]]: [ref<string>('Charlotte')],
      [stunden[1]]: [ref<string>('Olivia'), ref<string>('Masell')],
      [stunden[2]]: [ref<string>('Elias')]
    }

    sprechstunden[tage[tag++]] = {
      [stunden[0]]: [ref<string>('Marius'), ref<string>('Olli')],
      [stunden[1]]: [ref<string>('Michelle')],
      [stunden[2]]: [ref<string>('Lennart')]
    }

    sprechstunden[tage[tag++]] = {
      [stunden[0]]: [ref<string>('Maike')],
      [stunden[1]]: [ref<string>('Armin')],
      [stunden[2]]: [ref<string>('Dennis')]
    }

    const tGlobal = useI18n({ useScope: 'global' }).t
    const { locale } = useI18n()

    const translation: Record<string, () => string> = {
      'monday': () => tGlobal('monday'),
      'tuesday': () => tGlobal('tuesday'),
      'wednesday': () => tGlobal('wednesday'),
      'thursday': () => tGlobal('thursday')
    }

    return {
      tage,
      stunden,
      translation,
      sprechstunden
    }
  }
})
</script>

<i18n locale="de">
{
  "consHours": "Sprechstunden der FSMPI",
}
</i18n>

<i18n locale="en">
{
  "consHours": "Consultation hours of the FSMPI",
}
</i18n>