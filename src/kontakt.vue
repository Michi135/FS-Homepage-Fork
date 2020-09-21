<template>
  <div class="main">
    <h5 class="header">Kontakt:</h5>
    <div>
      <br />
      <p>Ihr braucht Hilfe oder habt Fragen? Wir sind zu erreichen per:</p>
      <br />
      <p>- Nachricht im e-Learning-Kurs</p>
      <p>- Email: fsmpi@uni-bayreuth.de</p>
      <p>- Telefon: 0921/55-3101</p>
      <br />
      <p>- Facebook: https://facebook.com/fsmpi</p>
      <br />
      <p>- Uni Now: @FS.MPI</p>
      <br />
      <p>- Instagram: https://www.instagram.com/fachschaft_mpi/</p>
      <br />
      <p>Oder Ihr besucht uns persönlich in unserem Büro (NW II, zwischen H 20 und S 78)</p>
    </div>
  </div>
</template>
<script lang="ts">
import { setting } from "@factor/api"

export default {
  components: {},
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
.main {
  .header {
    font-size: 2rem;
    color: cyan;
    text-align: center;
  }
  h5,
  p {
    color: greenyellow;
  }
  div {
    text-align: center;
  }
}
</style>