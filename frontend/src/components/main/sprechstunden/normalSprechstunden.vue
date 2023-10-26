<template>
  <div
    class="tw-px-5"
  >
    <i18n-t
      tag="h1"
      keypath="consHours"
    />
    <table-comp
      v-if="sprechstunden"
      :columns="tage"
      :rows="stunden"
      :data="sprechstunden"
      :breakpoint="760"
    ></table-comp>
    <div style="height: 1.5em"></div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { useI18nGlobal } from '@shared/i18n.js'
import { useQuery } from '@vue/apollo-composable'

import tableComp from '../dynamicTable.vue'
import type { TableRow, Table } from '../dynamicTable.vue'
import gql from 'graphql-tag'
//import table from "./dashboard/table.vue";
//https://colorlib.com/wp/css3-table-templates/
//https://colorlib.com/etc/tb/Table_Highlight_Vertical_Horizontal/index.html

type Slot = [{ name: string }] | undefined
type Day = {
  slot0: Slot
  slot1: Slot
  slot2: Slot
}

type Sprechstunden = {
  sprechstunden: {
    data: {
      attributes: {
        Montag: Partial<Day>
        Dienstag: Partial<Day>
        Mittwoch: Partial<Day>
        Donnerstag: Partial<Day>
        //Freitag: Partial<Day>
      }
    }
  }
}


export default defineComponent({
  components: {
    tableComp
  },
  setup: () =>
  {
    //https://www.npmjs.com/package/@thi.ng/sparse
    //https://adamlynch.com/flexible-data-tables-with-css-grid/
    const { t } = useI18nGlobal()
    const { locale } = useI18n()

    const res = useQuery<Sprechstunden>(gql`
    {sprechstunden{data{attributes{
      Montag{slot0{name}slot1{name}slot2{name}}
      Dienstag{slot0{name}slot1{name}slot2{name}}
      Mittwoch{slot0{name}slot1{name}slot2{name}}
      Donnerstag{slot0{name}slot1{name}slot2{name}}
    }}}}
    `)

    const tage = computed(() => [t('monday'), t('tuesday'), t('wednesday'), t('thursday')/*, t('friday')*/])
    const stunden = ['13:00', '14:00', '15:00']

    const sprechstunden = computed(() =>
    {
      const value = res.result.value
      if (!value)
        return null

      let a: TableRow = {}
      let b: TableRow = {}
      let c: TableRow = {}
      let d: TableRow = {}
      //let e: TableRow = {}

      const sp = value.sprechstunden.data.attributes

      function assign(row: TableRow, day: Partial<Day> | undefined)
      {
        if (!day)
          return

        row[0] = day.slot0?.map((val) => val.name) ?? []
        row[1] = day.slot1?.map((val) => val.name) ?? []
        row[2] = day.slot2?.map((val) => val.name) ?? []
      }

      assign(a, sp.Montag)
      assign(b, sp.Dienstag)
      assign(c, sp.Mittwoch)
      assign(d, sp.Donnerstag)
      //assign(e, sp.Freitag)

      let z: Table = {}
      z[0] = a
      z[1] = b
      z[2] = c
      z[3] = d
      //z[4] = e

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