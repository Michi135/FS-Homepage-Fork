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
      <p>
        - Facebook:
        <a href="https://facebook.com/fsmpi">https://facebook.com/fsmpi</a>
      </p>
      <br />
      <p>- Uni Now: @FS.MPI</p>
      <br />
      <p>
        - Instagram:
        <a href="https://www.instagram.com/fachschaft_mpi/"
          >https://www.instagram.com/fachschaft_mpi/</a
        >
      </p>
      <br />
      <p>
        Oder Ihr besucht uns persönlich in unserem Büro (NW II, zwischen H 20
        und S 78)
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({});
</script>

<style scoped lang="less">
.main {
  .header {
    font-size: 2rem;
    color: var(--color-primary-header);
    text-align: center;
  }
  h5,
  p {
    color: #ffffff;
  }
  div {
    text-align: center;
  }
  a:hover {
    color: var(--color-primary);
  }
}
</style>