<template>
  <div class="px-5 py-2 main">
    <p>Folgende Links beziehen sich auf externe Inhalte</p>
    <br />
    <h5>Fachschaften</h5>
    <ul>
      <li class="ml-5" v-for="fachschaft in fachschaften" :key="fachschaft.name">
        <factor-link :path="fachschaft.link">{{ fachschaft.name }}</factor-link>
      </li>
    </ul>
    <br />
    <h5>Hochschulgruppen</h5>
    <ul>
      <li
        class="ml-5"
        v-for="hochschulgruppe in hochschulgruppen"
        :key="hochschulgruppe.name"
      >
        <factor-link :path="hochschulgruppe.link">{{ hochschulgruppe.name }}</factor-link>
      </li>
    </ul>
    <br />
    <h5>Weiterführende Links</h5>
    <ul>
      <li class="ml-5">
        <factor-link path="https://www.max-academy.de/">Max Academy</factor-link>
      </li>
    </ul>
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
      fachschaften: [
        {
          name: "RW",
          link: "https://www.fsrw.uni-bayreuth.de/de/index.html",
        },
        {
          name: "BCG",
          link: "https://www.bcg.uni-bayreuth.de/de/studium/fachschaft/index.html",
        },
        {
          name: "SpLit",
          link: "https://www.fssplit.uni-bayreuth.de/de/index.html",
        },
        {
          name: "Sport",
          link: "https://www.fs-sport.uni-bayreuth.de/de/index.html",
        },
        {
          name: "ING",
          link: "https://www.fachschaft-ing.uni-bayreuth.de/de/index.html",
        },
        {
          name: "KuWi",
          link: "https://www.kuwi.uni-bayreuth.de/de/index.html",
        },
      ],
      hochschulgruppen: [
        {
          name: '"Die Liste"',
          link: "https://de-de.facebook.com/DieListeUniBayreuth",
        },
        {
          name: "Grüne",
          link: "https://www.facebook.com/GHGBayreuth/",
        },
        {
          name: "Juso",
          link:
            "https://www.facebook.com/Juso-Hochschulgruppe-Uni-Bayreuth-161660643852972/",
        },
        {
          name: "Liberale",
          link: "https://www.facebook.com/lhg.bayreuth/",
        },
        {
          name: "RCDS",
          link: "https://www.facebook.com/rcdsbayreuth/",
        },
        {
          name: "Volt",
          link: "https://www.facebook.com/Volt-Bayreuth-401468427008133/",
        },
      ],
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
.footer {
  background-color: var(--color-secondary);
  color: var(--color-text);
}
.primary {
  color: var(--color-primary-header);
}

.main {
  .factor-link {
    /*&.btn-link {
    color: inherit;
    display: inline-block;
    line-height: 1;
  }*/
    color: var(--color-secondary-header);
  }
  .factor-link:hover {
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
