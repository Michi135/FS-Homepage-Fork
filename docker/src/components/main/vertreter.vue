<template>
  <div>
    <h5 class="header">
      {{ t('header') }}
    </h5>
    <br />
    <div class="tw-flex tw-flex-col tw-items-center">
      <div class="all-container">
        <SingleVertreter
          v-for="vertreter_it in vertreter"
          :key="vertreter_it.nutzer_email.name"
          :vertreter="vertreter_it"
        />
      </div>
    </div>
    <br />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useQuery } from '@vue/apollo-composable'
import { gql } from 'graphql-tag'

import SingleVertreter from '@components/main/single-vertreter.vue'

import type { IResolvedVertreter } from '@dataInterfaces/IVertreter'

import { useQuerySSR } from '@shared/vue-apollo-ssr'

export default defineComponent({
  components: {
    SingleVertreter
  },
  setup: (prop, context) =>
  {
    const { t } = useI18n({})

    let vertreter = ref(new Array<IResolvedVertreter>())

    const res = useQuery<{ vertreters: Array<IResolvedVertreter> }>(gql`
      {
        vertreters {
          nutzer_email {
            name
            email
          }
          rolle
          grad
          feld
          hauptfach
          zweitfach
          Lehramt
          semester
          portrait {
            url
          }
        }
      }
    `)

    const items: Record<string, number> =
    {
      "HEAD": 11,
      "VICE": 10,
      "FINANCES": 9,
      "NETWORKING": 8,
      "UNI-CINEMA": 7,
      "PUBLIC RELATIONS": 6,
      "BEER COORDINATION": 5,
      "PHYSICIST BAR": 4,
      "GRAPHICS": 3,
      "SCRIPTS": 2,
      "ROOT": 1
    }

    useQuerySSR(() =>
    {
      vertreter.value = [...res.result.value!.vertreters].sort((a, b) =>
      {
        return items[b.rolle] - items[a.rolle]
      })
    }, res)

    return { vertreter, t }
  }
})
</script>

<style scoped lang="less">
.header {
  font-size: 2rem;
  text-align: center;
  color: var(--color-primary-header);
}

.all-container {
  width: 98%;

  justify-content: center;
  align-items: center;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
  grid-template-rows: repeat(auto, max-content);
  column-gap: 10px;
  row-gap: 15px;
  align-items: stretch;

  @media only screen and (max-width: 460px) {
    display: flex;
    flex-direction: column;
    width: max-content;
    max-width: 100%;
  }
}
</style>

<i18n locale="de">
{
  "header": "Aktuelle Vertreter der Fachschaft FSMPI"
}
</i18n>

<i18n locale="en">
{
  "header": "Current representatives of the student council FSMPI"
}
</i18n>
