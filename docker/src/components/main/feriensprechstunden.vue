<template>
  <div
    class="tw-flex tw-flex-col tw-items-center tw-text-center tw-space-y-2"
  >
    <i18n-t
      keypath="t[0]"
      tag="h1"
    />
    <i18n-t
      keypath="t[1]"
      tag="h1"
    >
      <template #from>
        {{ ferien_sprechstunden.timespan[0] }}
      </template>
      <template #to>
        {{ ferien_sprechstunden.timespan[1] }}
      </template>
    </i18n-t>
    <br /><br />
    <i18n-t
      tag="h2"
      keypath="holidayConsHours"
    />
    <br />
    <div
      style="
          background: rgb(51, 49, 48);
          color: rgb(192, 192, 192);
          border-color: rgb(255, 115, 0);
          font-size: 1.1rem;
          gap: 19px;
          padding: 10px;
        "
      class="tw-flex tw-flex-wrap tw-space-x-2 tw-border-solid tw-border-2 tw-text-left tw-justify-center"
    >
      <div
        v-for="(sprechstunde, index) in ferien_sprechstunden.sprechstunden"
        :key="index"
      >
        <div v-text="sprechstunde.tag" />
        <div>
          <p
            v-for="(betreuer, index2) in sprechstunde.betreuer"
            :key="index2"
            v-text="betreuer"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { gql } from 'graphql-tag'
import dateFormat from 'dateformat'
import { useI18n } from 'vue-i18n'

import { useQuerySSR } from '@shared/vue-apollo-ssr'
import { useStore } from '@shared/store'

import type { Ref } from 'vue'

interface FerienTag {
  tag: Date
  person: Array<{ name: string }>
}

export default defineComponent({
  setup()
  {
    const t = useI18n()
    const { initialTime } = useStore().state

    const res = useQuery<{ feriensprechstundens: Array<FerienTag>, }>(gql`
      query futureConsultationHours ($var: DateTime)
      {
        feriensprechstundens(orderBy: {tag: asc}, where: {tag: {gte: $var}} ) {
          tag
          person {
            name
          }
        }
      }
    `, { var: initialTime })

    const ferien_sprechstunden: Ref<{
      timespan: Array<number>
      sprechstunden: Array<{ tag: string; betreuer: Array<string> }>
    }> = ref({
      timespan: [14, 16],
      sprechstunden: []
    })

    const process_ferien = () =>
    {
      ferien_sprechstunden.value.sprechstunden =
        res.result!.value!.feriensprechstundens.map((val) =>
        {
          return {
            tag: dateFormat(val.tag, 'dd.mm'),
            betreuer: val.person.map((per) =>
            {
              return per.name
            })
          }
        })
    }

    useQuerySSR(process_ferien, res)

    return {
      ferien_sprechstunden,
      t
    }
  }
})
</script>

<i18n locale="de">
{
  "holidayConsHours": "Feriensprechstunden der FSMPI",
  "t[0]": "Die Fachschaft wünscht schöne Ferien und ist weiterhin",
  "t[1]": "an den folgenden Tagen von {from} bis {to} Uhr für euch da"
}
</i18n>

<i18n locale="en">
{
  "holidayConsHours": "Consultation hours of the FSMPI during the holidays",
  "t[0]": "The student council wishes you nice holidays and is still",
  "t[1]": "there for you between {from} and {to}h on the following days"
}
</i18n>