<template>
  <div id="block">
    <div class="tw-m-3.5">
      <div style="max-width: 1100px; margin: 0 auto">
        <h2>NW2-Party</h2>
        <template v-if="!loading && !error">
          <i18n-t
            tag="p"
            keypath="p[0]"
            v-if="date"
          >
            <template #day>
              {{ date.getDate() }}
            </template>
            <template #month>
              {{ t(`month${date.getMonth() + 1}`) }}
            </template>
          </i18n-t>
          <div style="height: 1.5em;"></div>
          <i18n-t
            tag="p"
            keypath="p[1]"
          ></i18n-t>
          <div style="height: 1.5em;"></div>
          <i18n-t
            tag="p"
            keypath="p[2]"
            v-if="date"
          >
            <template #date>
              {{ dateFormat(date, "d.m.") }}
            </template>
            <template #hour>
              {{ hour }}
            </template>
          </i18n-t>
          <div style="height: 1.5em;"></div>
          <i18n-t
            tag="p"
            keypath="p[3]"
          ></i18n-t>
          <div style="height: 1.5em;"></div>
          <i18n-t
            tag="p"
            keypath="p[4]"
          ></i18n-t>
          <div style="height: 1.5em;"></div>
          <div class="tw-flex tw-justify-center">
            <img
              v-if="image"
              :src="'/v1' + image"
            />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useI18nGlobal } from '@shared/i18n'
import nw2Party from '@static/nw2Event.js'

import { useTags } from '@shared/tags/registration.js'
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import dateFormat from 'dateformat'

type Image =
{
  data:
  {
    attributes:
    {
      url: string
    }
  }
}

type PartyData =
{
  data: Array<{
    attributes: {
      Start: string
      Ende: string
      Preis: number
      Kuenstler: string
      Sommerzeit: boolean
      Plakat: Image
      Plakat1x1: Image
      Plakat4x3: Image
      Plakat16x9: Image
      Text: string
    }
  }>
}

export default defineComponent({
  setup()
  {
    useI18n({ useScope: "local" })
    const i18n = useI18nGlobal()
    const tagManager = useTags()

    const query = useQuery<{nw2Parties: PartyData}>(gql`query recentParty
    {
      nw2Parties (sort: ["Ende:desc"], pagination: {limit: 1}){
        data{
          attributes{
            Start Ende Preis Kuenstler
            Plakat{data{attributes{url}}}
            Plakat1x1{data{attributes{url}}}
            Plakat4x3{data{attributes{url}}}
            Plakat16x9{data{attributes{url}}}
    }}}}`)

    const potParty = computed(() =>
    {
      const data = query.result?.value?.nw2Parties.data
      if (!data)
        return
      if (data.length === 0)
        return

      return data[0].attributes
    })

    const image = computed(() =>
    {
      const party = potParty.value
      if (!party)
        return

      return party.Plakat.data.attributes.url
    })

    query.onResult(((result) =>
    {
      if (result.partial || result.error)
        return

      const data = query.result.value!.nw2Parties.data

      if (!data)
        return
      if (data.length === 0)
        return

      const party = data[0].attributes

      if (!party)
        return

      const { Start, Ende, Kuenstler, Plakat16x9, Plakat1x1, Plakat4x3, Preis, Sommerzeit } = party

      const partyData = nw2Party(
        { start: new Date(Start), end: new Date(Ende), summertime: Sommerzeit },
        { "1x1": '/v1' + Plakat1x1.data.attributes.url, "4x3": '/v1' + Plakat4x3.data.attributes.url, "16x9": '/v1' + Plakat16x9.data.attributes.url },
        Preis,
        Kuenstler
      )

      tagManager.try_emplace("nw2-party", partyData)
    }))

    const date = computed(() =>
    {
      const party = potParty.value
      if (!party)
        return

      return new Date(party.Start)
    })

    const hour = computed(() =>
    {
      if (!date.value)
        return

      const minutes = date.value.getMinutes()
      let minutesString = minutes.toString()
      if (minutes < 10)
        minutesString = '0' + minutesString

      return `${date.value.getHours()}:${minutesString}`
    })

    return { image, loading: query.loading, error: query.error, date, locale: i18n.locale, t: i18n.t, dateFormat, hour }
  }
})
</script>

<style lang="less">
#block {
  h3 {
    font-size: 2rem;
    color: var(--color-primary-header);
  }
  h2 {
    font-size: 1.5rem;
    color: var(--color-primary-header);
  }
  h1 {
    font-size: 1.2rem;
    color: var(--color-secondary-header);
  }
  .a {
    color: lightblue;
  }
  .a:hover {
    color: var(--color-primary);
  }
  li,
  ul {
    margin-left: 20px;
    color: #f1f1f1;
  }
  p {
    text-align: justify;
    color: #f1f1f1;
  }
}
</style>

<i18n locale="de">
{
  "p[0]": "Am {day}.{month} findet endlich wieder die legendäre NW2-Party statt!",
  "p[1]": "Lasst eure Ohren von satten Bässen zu Rock, Metal, Alternative und Indie massieren, \
          während ihr an der Physikerbar die Künste unserer Shaker bewundert.🤘",
  "p[2]": "Los geht's am {date} um {hour} Uhr und in der ersten Stunde kann mit Bier für 1€ \
          ordentlich angeheizt werden!",
  "p[3]": "Wir freuen uns auf euer Erscheinen und ROCK ON!",
  "p[4]": "Einlass ab 18 Jahren 🔞"
}
</i18n>

<i18n locale="en">
{
  "p[0]": "On {month} {day}, the legendary NW2 party will finally take place again!",
  "p[1]": "Let your ears be massaged by rich bass to rock, metal, alternative and indie, \
          while you admire the arts of our shakers at the physicist bar.🤘",
  "p[2]": "It starts on {date} at {hour} and in the first hour can be properly heated with beer for 1€!",
  "p[3]": "We look forward to seeing you there and ROCK ON!",
  "p[4]": "Minimum Age 18+ 🔞"
}
</i18n>