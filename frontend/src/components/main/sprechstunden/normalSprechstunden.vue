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
    ></table-comp>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'

import tableComp from '../dynamicTable.vue'
import type { TableRow, Table } from '../dynamicTable.vue'
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
    const { t } = useI18n({ useScope: 'global' })
    const { locale } = useI18n()

    const tage = computed(() => [t('monday'), t('tuesday'), t('wednesday'), t('thursday')])
    const stunden = ['13:00', '14:00', '15:00']

    const sprechstunden = computed(() =>
    {
      let a: TableRow = {}
      let b: TableRow = {}
      let c: TableRow = {}
      let d: TableRow = {}

      a[0] = ['Sophie'],
      a[1] = ['Julia'],
      a[2] = ['Lena']

      b[0] = ['Charlotte'],
      b[1] = ['Olivia', 'Masell'],
      b[2] = ['Elias']

      c[0] = ['Marius', 'Olli'],
      c[1] = ['Michelle'],
      c[2] = ['Lennart']

      d[0] = ['Maike'],
      d[1] = ['Armin'],
      d[2] = ['Dennis']

      let z: Table = {}
      z[0] = a
      z[1] = b
      z[2] = c
      z[3] = d

      return z
    })

    return {
      tage,
      stunden,
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