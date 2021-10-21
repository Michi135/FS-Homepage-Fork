<template>
  <p>{{ studiengang }}</p>
</template>

<script lang="ts">
import type { IStudiengang } from "@dataInterfaces/IVertreter";
import { computed, defineComponent, PropType } from "vue";
import { useI18n } from "vue-i18n";

export default defineComponent({
  props: {
    studiengang: {
      type: Object as PropType<IStudiengang>,
      required: true
    },
  },
  setup(props) {
    const {t, locale} = useI18n({});

    const studiengang = computed(() => {
    
        let val: string = '';
        if (props.studiengang.lectureShip)
            val = t('lectureship') + ' ' + t(props.studiengang.lectureShip) + ' ';

        val += t(props.studiengang.degree);

        if (props.studiengang.field)
            val += t(props.studiengang.field);

        val += ' ' + t(props.studiengang.course);
        
        if (props.studiengang.secondary)
            val += '/' + t(props.studiengang.secondary);

        return val;
    });
    return { studiengang };
  },
});
</script>

<i18n locale="de">
{
  "math": "Mathe",
  "physics": "Physik",
  "computerScience": "Informatik",
  "gymnasium": "GYM",
  "bachelor": "B.",
  "master": "M.",
  "science": "Sc.",
  "lectureship": "LA",
  "technoMath": "Technomathe"
}
</i18n>

<i18n locale="en">
{
  "math": "Math",
  "physics": "Physics",
  "computerScience": "Computer science",
  "gymnasium": "GYM",
  "bachelor": "B.",
  "master": "M.",
  "science": "Sc.",
  "lectureship": "LS",
  "technoMath": "Techno math"
}
</i18n>