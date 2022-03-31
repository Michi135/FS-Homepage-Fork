<template>
  <iframe
    :src="pdf"
    width="100%"
    height="100%"
    aria-label="Zeitschrift Keine Panik"
  >
    <a
    :href="pdf"
    download
    ><p>
    {{ t('no') }}<br />{{ t('click') }}
    <span class="tw-text-blue-500">{{ t('here') }}</span> {{ t('dl') }}
    </p></a>
  </iframe>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  setup: () =>
  {
    const pdf = require('@static/panik/KeinePanik21.pdf')
    const { t } = useI18n()

    return { pdf, t }
  }
})
</script>

<i18n locale="de">
{
  "no": "Dein Browser kann keine PDF anzeigen.",
  "click": "Klicke",
  "here": "hier",
  "dl": "um sie herunterzuladen"
}
</i18n>

<i18n locale="en">
{
  "no": "Your browser can't show pdfs.",
  "click": "Click",
  "here": "here",
  "dl": "to download it"
}
</i18n>
