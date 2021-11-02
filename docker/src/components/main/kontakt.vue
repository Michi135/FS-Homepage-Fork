<template>
  <div class="main">
    <h5 class="header">{{tGlobal('contact')}}:</h5>
    <div>
      <br />
      <p>{{t('question')}}</p>
      <br />
      <p>- {{t('message')}}</p>
      <p>- {{tGlobal('mail')}}: fsmpi@uni-bayreuth.de</p>
      <p>- {{tGlobal('phone')}}: 0921/55-3101</p>
      <br />
      <p>
        - Facebook:
        <a href="https://facebook.com/fsmpi">https://facebook.com/fsmpi</a>
      </p>
      <br />
      <p>- UniNow: @FS.MPI</p>
      <br />
      <p>
        - Instagram:
        <a href="https://www.instagram.com/fachschaft_mpi/"
          >https://www.instagram.com/fachschaft_mpi/</a
        >
      </p>
      <br />
      <p>{{t('invitation')}}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useI18n } from 'vue-i18n'

export default defineComponent({
  setup()
  {
    const {t} = useI18n({});
    const tGlobal = useI18n({useScope: 'global'}).t;

    return {t, tGlobal};
  }
});
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

<i18n locale='de'>
{
  "message": "Nachricht im e-Learning-Kurs",
  "question": "Ihr braucht Hilfe oder habt Fragen? Wir sind zu erreichen per:",
  "invitation": "Oder Ihr besucht uns persönlich in unserem Büro (NW II, zwischen H 20 und S 78)"
}
</i18n>

<i18n locale='en'>
{
  "message": "Message in the e-Learning-course",
  "question": "You need help or have questions? We're here for you by:",
  "invitation": "Or you visit us in person in our office (NW II, between H 20 and S 78)"
}
</i18n>