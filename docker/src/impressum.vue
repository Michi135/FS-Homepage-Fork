<template>
  <div class="main px-5 py-2">
    <h1>Impressum</h1>
    <br />
    <h2>Angaben gem&auml;&szlig; &sect; 5 TMG</h2>
    <p>
      Fachschaft Mathematik/Physik/Informatik<br />
      Universitätsstraße 30<br />
      95447 Bayreuth<br />
    </p>
    <br />
    <h2>Vertreten durch</h2>
    <p>Marcel Schalling<br /></p>
    <br />
    <h2>Kontakt</h2>
    <p>
      Telefon: 0921/ 55-3101 <br />
      E-Mail: fsmpi@uni-bayreuth.de <br />
      Gebäude: NW2<br />
    </p>
    <br />
    <h2>Verantwortlich f&uuml;r den Inhalt nach &sect; 55 Abs. 2 RStV</h2>
    <p>
      Olivia Kammerer<br />
      Ahmet Özilban<br />
    </p>
    <br />
    <h2>Verbraucher&shy;streit&shy;beilegung/Universal&shy;schlichtungs&shy;stelle</h2>
    <p>
      Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
      Verbraucherschlichtungsstelle teilzunehmen.
    </p>
    <br />
    <h3>Haftung f&uuml;r Inhalte</h3>
    <p>
      Als Diensteanbieter sind wir gem&auml;&szlig; &sect; 7 Abs.1 TMG f&uuml;r eigene
      Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach
      &sect;&sect; 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet,
      &uuml;bermittelte oder gespeicherte fremde Informationen zu &uuml;berwachen oder
      nach Umst&auml;nden zu forschen, die auf eine rechtswidrige T&auml;tigkeit
      hinweisen.
    </p>
    <p>
      Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den
      allgemeinen Gesetzen bleiben hiervon unber&uuml;hrt. Eine diesbez&uuml;gliche
      Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten
      Rechtsverletzung m&ouml;glich. Bei Bekanntwerden von entsprechenden
      Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
    </p>
    <br />
    <h3>Haftung f&uuml;r Links</h3>
    <p>
      Unser Angebot enth&auml;lt Links zu externen Websites Dritter, auf deren Inhalte wir
      keinen Einfluss haben. Deshalb k&ouml;nnen wir f&uuml;r diese fremden Inhalte auch
      keine Gew&auml;hr &uuml;bernehmen. F&uuml;r die Inhalte der verlinkten Seiten ist
      stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die
      verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf m&ouml;gliche
      Rechtsverst&ouml;&szlig;e &uuml;berpr&uuml;ft. Rechtswidrige Inhalte waren zum
      Zeitpunkt der Verlinkung nicht erkennbar.
    </p>
    <p>
      Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete
      Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von
      Rechtsverletzungen werden wir derartige Links umgehend entfernen.
    </p>
    <br />
    <h3>Urheberrecht</h3>
    <p>
      Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten
      unterliegen dem deutschen Urheberrecht. Die Vervielf&auml;ltigung, Bearbeitung,
      Verbreitung und jede Art der Verwertung au&szlig;erhalb der Grenzen des
      Urheberrechtes bed&uuml;rfen der schriftlichen Zustimmung des jeweiligen Autors bzw.
      Erstellers. Downloads und Kopien dieser Seite sind nur f&uuml;r den privaten, nicht
      kommerziellen Gebrauch gestattet.
    </p>
    <p>
      Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die
      Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche
      gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam
      werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von
      Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
    </p>
    <br />
    <p>Quelle: <a href="https://www.e-recht24.de">https://www.e-recht24.de</a></p>
  </div>
</template>
<script lang="ts">
import { factorLink, factorIcon } from "@factor/ui"
import { setting } from "@factor/api"

export default {
  components: {
    factorLink,
    factorIcon,
  },
  data() {
    return {
      footerLogo: setting("site.logo"),
      footerNav: setting("footer.nav"),
      footerLeft: setting("footer.left"),
      footerRight: setting("footer.right"),
    }
  },

  async mounted() {},
  methods: {
    //success,
    setting,
  },
}
</script>
<style lang="less">
.main {
  h1,
  h2,
  h3 {
    color: var(--color-primary-header);
  }
  h5,
  p {
    color: var(--color-secondary-header);
  }
  div {
    text-align: center;
  }
}
</style>
