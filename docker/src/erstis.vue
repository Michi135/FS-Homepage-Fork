<template>
  <div class="text-green-500">
    <div>Ersti-Angebot der Fachschaft</div>
    <br />
    <div>- 24.10. Tüten packen (14.00)</div>
    <div>- 26.10. FS-Sitzung (18.30)</div>
    <div>- 29.10. Kneipentour 1 (18.00)</div>
    <div>- 30.10. Buddytreffen 1 (online) (18.00)</div>
    <div>- 31.10. FS-Sitzung &amp Tütenpacken (14.00)</div>
    <div>- 02.11. Mensaabend (19:30)</div>
    <div>- 03.11. Erstifrühstück (7:00)</div>
    <div>- 05.11. Kneipentour 2 (18.00)</div>
    <div>- 06.11. Buddytreffen 2 (online) (18.00)</div>
    <div>- 10.11. Ersti-FS-Sitzung (20.00)</div>
    <div>- 21.11. Tross-Ralley (10.00)</div>
    <div>Und selbstverständlich auch die Betreuung der Erstis</div>
    <br />
    <div>Willkommensveranstaltungen der Uni Bayreuth:</div>
    <div>26.10.</div>
    <br />
    <div>12:15 - 13:00 Einführung Lehramt Informatik - H14</div>
    <br /><br />
    <div>27.10.</div>
    <br />
    <div>8:00 - 8:45 Einführung Lehramt(Gymnasium) - H15</div>
    <div>9:15 - 10:00 Einführung Lehramt(Gymnasium) - H15</div>
    <div>11:30 - 12:00 Einführung Lehramt(Realschule) Mathematik - H14</div>
    <div>18:30 - 19:15 Einführung Physik - H15</div>
    <div>19:45 - 20:30 Einführung Physik - H15</div>
    <br /><br />
    <div>30.10.</div>
    <br />
    <div>11:30 - 12:15 Einführung Mathematik und Computational Mathematics - H15</div>
    <div>12:45 - 13:30 Einführung Mathematik und Computational Mathematics - H15</div>
    <div>17:00 - 20:00 Einführung in die Informatik - Audimax</div>
    <br /><br />
    <div>02.11</div>
    <br />
    <div>ab 18:00 Uhr Mensaabend - Mensa</div>
    <factor-link
      path="https://www.studierendenkanzlei.uni-bayreuth.de/de/studierende/studienanfaenger/index.html"
      >Informationen der Studierendenkanzlei für Studienanfänger</factor-link
    >
  </div>
</template>
<script lang="ts">
import { setting } from "@factor/api"
import { factorLink } from "@factor/ui"

export default {
  components: {
    factorLink,
  },
  data() {
    return {
      loading: true,
    }
  },

  methods: {
    setting,
  },
}
</script>

<style lang="less">
</style>