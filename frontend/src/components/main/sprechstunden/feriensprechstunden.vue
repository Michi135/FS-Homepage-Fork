<template>
  <div
    class="tw-flex tw-flex-col tw-items-center tw-text-center tw-space-y-2"
  >
    <i18n-t
      keypath="t[0]"
      tag="h1"
    />
    <h1 v-if="ferien_sprechstunden">
      {{ t('t[1]', { from: ferien_sprechstunden.timespan.von, to: ferien_sprechstunden.timespan.bis }) }}
    </h1>
    <br /><br />
    <i18n-t
      tag="h2"
      keypath="holidayConsHours"
    />
    <br />
    <div
      v-if="ferien_sprechstunden"
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
        <div v-text="sprechstunde.tag"></div>
        <div>
          <p
            v-for="(betreuer, index2) in sprechstunde.betreuer"
            :key="index2"
            v-text="betreuer"
          ></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { gql } from 'graphql-tag'
import dayjs from 'dayjs'
import { useI18n } from 'vue-i18n'

//import { useStore } from '@shared/store'

type Feriensprechstunde = {
  tag: Date
  Personen: Array<{ Name: string }>
}

type Feriensprechstunden = {
  feriensprechstunden: {
    data: {
      attributes: {
        Feriensprechstunde: Feriensprechstunde[]
        von: string,
        bis: string
      }
    }
  }
}

const timeRegex = /(\d{2}):(\d{2}):\d{2}\.\d{3}/

export default defineComponent({
  setup()
  {
    const { locale, t } = useI18n()
    //const { initialTime } = useStore()
    const res = useQuery<Feriensprechstunden>(gql`
      query nextFSS($date: Date!)
      {
        feriensprechstunden
        {
          data
          {
            attributes
            {
              Feriensprechstunde(sort: "tag", filters: {tag: {gte: $date}})
              {
                tag
                Personen
                {
                  Name
                }
              }
              von
              bis
            }
          }
        }
      }
    `, { date: dayjs(new Date()).utc().format("YYYY-MM-DD") })
    //TODO:: set initialTime's hours inside db to 16:xx to avoid filtering on same day

    const ferien_sprechstunden = computed(() =>
    {
      const attributes = res.result?.value?.feriensprechstunden.data.attributes
      if (!attributes)
        return null

      const sprechstunden = attributes.Feriensprechstunde.map((val) =>
      {
        return {
          tag: dayjs(val.tag).tz().format('DD.MM'),
          betreuer: val.Personen.map((per) =>
          {
            return per.Name
          })
        }
      })

      const vonMatch = timeRegex.exec(attributes.von)!
      const bisMatch = timeRegex.exec(attributes.bis)!

      let von: string | undefined
      let bis: string | undefined

      if (locale.value === 'de')
      {
        von = `${vonMatch[1]}:${vonMatch[2]}`
        bis = `${bisMatch[1]}:${bisMatch[2]}`
      }
      else
      {
        let hourVon = parseInt(vonMatch[1])
        let hourBis = parseInt(bisMatch[1])

        if (hourVon > 12)
          von = `${hourVon - 12}:${vonMatch[2]} PM`
        else
          von = `${hourVon}:${vonMatch[2]} AM`

        if (hourBis > 12)
          bis = `${hourBis - 12}:${vonMatch[2]} PM`
        else
          bis = `${hourBis}:${vonMatch[2]} AM`
      }

      return {
        timespan: { von, bis },
        sprechstunden: sprechstunden
      }
    })

    return {
      ferien_sprechstunden, t
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
  "t[1]": "there for you between {from} and {to} on the following days"
}
</i18n>