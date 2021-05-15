<template>
  <div class="tw-px-5 tw-py-2 main">
    <p class="tw-text-2xl">Folgende Links beziehen sich auf externe Inhalte</p>
    <br />
    <h5 class="tw-text-2xl">Fachschaften</h5>
    <ul>
      <li
        class="tw-ml-5 tw-py-1"
        v-for="fachschaft in fachschaften"
        :key="fachschaft.name"
      >
        <a class="link tw-text-xl" :href="fachschaft.link">{{
          fachschaft.name
        }}</a>
      </li>
    </ul>
    <br />
    <h5 class="tw-text-2xl">Hochschulgruppen</h5>
    <ul>
      <li
        class="tw-ml-5 tw-py-1"
        v-for="hochschulgruppe in hochschulgruppen"
        :key="hochschulgruppe.name"
      >
        <a class="link tw-text-xl" :href="hochschulgruppe.link">{{
          hochschulgruppe.name
        }}</a>
      </li>
    </ul>
    <br />
    <h5 class="tw-text-2xl">Weiterführende Links</h5>
    <ul>
      <li class="tw-ml-5 tw-py-1">
        <a class="link tw-text-xl" href="https://alumpi.de/">Alumpi</a>
      </li>
      <li class="tw-ml-5 tw-py-1">
        <a class="link tw-text-xl" href="https://www.max-academy.de/"
          >Max Academy</a
        >
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  setup: () => {
    return {
      fachschaften: [
        {
          name: "RW",
          link: "https://www.fsrw.uni-bayreuth.de/de/index.html",
        },
        {
          name: "BCG",
          link:
            "https://www.bcg.uni-bayreuth.de/de/studium/fachschaft/index.html",
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
    };
  },
});
</script>

<style scoped lang="less">
.footer {
  background-color: var(--color-secondary);
  color: var(--color-text);
}
.primary {
  color: var(--color-primary-header);
}

.main {
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