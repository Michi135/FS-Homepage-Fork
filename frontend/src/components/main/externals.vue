<template>
  <div
    id="externals"
    class="tw-px-5 tw-py-2"
  >
    <i18n-t
      keypath="mainMessage"
      tag="p"
      class="tw-text-2xl"
    />
    <br />
    <i18n-t
      keypath="studentCouncil"
      tag="h5"
      class="tw-text-2xl"
      scope="global"
      plural="2"
    />
    <ul>
      <li
        class="tw-ml-5 tw-py-1"
        v-for="fachschaft in fachschaften"
        :key="fachschaft.name"
      >
        <a
          class="link tw-text-xl"
          :href="fachschaft.link"
          target="_blank"
          rel="noopener noreferrer"
        >{{ fachschaft.name }}</a>
      </li>
    </ul>
    <br />
    <i18n-t
      tag="h5"
      class="tw-text-2xl"
      keypath="studentGroups"
    />
    <ul>
      <li
        class="tw-ml-5 tw-py-1"
        v-for="hochschulgruppe in hochschulgruppen"
        :key="hochschulgruppe.name"
      >
        <a
          class="link tw-text-xl"
          :href="hochschulgruppe.link"
          target="_blank"
          rel="noopener noreferrer"
        >{{ hochschulgruppe.name }}</a>
      </li>
    </ul>
    <br />
    <i18n-t
      tag="h5"
      class="tw-text-2xl"
      keypath="furtherLinks"
    />
    <ul>
      <li class="tw-ml-5 tw-py-1">
        <a
          class="link tw-text-xl"
          href="https://alumpi.de/"
          target="_blank"
          rel="noopener noreferrer"
        >Alumpi</a>
      </li>
      <li class="tw-ml-5 tw-py-1">
        <a
          class="link tw-text-xl"
          href="https://www.max-academy.de/"
          target="_blank"
          rel="noopener noreferrer"
        >Max Academy</a>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { useI18nGlobal } from '@shared/i18n.js'

export default defineComponent({
  setup: () =>
  {
    const tGlobal = useI18nGlobal().t
    const { t } = useI18n()

    return {
      t,
      tGlobal,
      fachschaften: [
        {
          name: 'RW',
          link: 'https://www.fsrw.uni-bayreuth.de/de/index.html'
        },
        {
          name: 'BCG',
          link: 'https://www.bcg.uni-bayreuth.de/de/studium/fachschaft/index.html'
        },
        {
          name: 'SpLit',
          link: 'https://www.fssplit.uni-bayreuth.de/de/index.html'
        },
        {
          name: 'Sport',
          link: 'https://www.fs-sport.uni-bayreuth.de/de/index.html'
        },
        {
          name: 'ING',
          link: 'https://www.fachschaft-ing.uni-bayreuth.de/de/index.html'
        },
        {
          name: 'KuWi',
          link: 'https://www.kuwi.uni-bayreuth.de/de/index.html'
        }
      ],
      hochschulgruppen: [
        {
          name: '"Die Liste"',
          link: 'https://de-de.facebook.com/DieListeUniBayreuth'
        },
        {
          name: 'Grüne',
          link: 'https://www.facebook.com/GHGBayreuth/'
        },
        {
          name: 'Juso',
          link: 'https://www.facebook.com/Juso-Hochschulgruppe-Uni-Bayreuth-161660643852972/'
        },
        {
          name: 'Liberale',
          link: 'https://www.facebook.com/lhg.bayreuth/'
        },
        {
          name: 'RCDS',
          link: 'https://www.facebook.com/rcdsbayreuth/'
        },
        {
          name: 'Volt',
          link: 'https://www.facebook.com/Volt-Bayreuth-401468427008133/'
        }
      ]
    }
  }
})
</script>

<style lang="less">
#externals {
  .link {
    color: var(--color-secondary-header);
  }
  .link:hover {
    color: var(--color-primary);
  }
  h5,
  p {
    color: var(--color-primary-header);
  }
  div {
    text-align: center;
  }
}
</style>

<i18n locale="de">
{
  "mainMessage": "Folgende Links beziehen sich auf externe Inhalte",
  "studentGroups": "Hochschulgruppen",
  "furtherLinks": "Weiterführende Links",
}
</i18n>

<i18n locale="en">
{
  "mainMessage": "Following links refer to external content",
  "studentGroups": "Student groups",
  "furtherLinks": "Further links",
}
</i18n>
