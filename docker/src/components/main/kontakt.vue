<template>
  <div class="main">
    <h5 class="header">{{tGlobal('contact')}}:</h5>
    <div>
      <br />
      <p>{{t('question')}}</p>
      <br />
      <p>- {{t('message')}}</p>
      <a href="mailto:fsmpi@uni-bayreuth.de">
        <p>
          <v-icon
            large
            color="orange darken-2"
            :icon="mdiEmail"
          />  fsmpi@uni-bayreuth.de
        </p>
      </a>
      <p>
        <v-icon
          large
          color="orange darken-2"
          :icon="mdiPhone"
        />  0921/55-3101
      </p>
      <br />
      <div class="tw-flex tw-justify-center tw-flex-wrap">
        <div class="tw-basis-full">
          <v-img
            :src="uniNowImg"
            max-height="100px"
            class="grey darken-4"
          />
          <p class="text-h6">
            @FS.MPI
          </p>
        </div>
        <div class="tw-basis-1/2 social">
          <a href="https://facebook.com/fsmpi" target="_blank" rel="noopener noreferrer">
          <v-img
            :src="facebookImg"
            height="100px"
            width="100px"
            class="grey darken-4"
          />
          </a>
          <p class="text-h6">
            @fsmpi
          </p>
        </div>
        <div class="tw-basis-1/2 social">
          <a href="https://www.instagram.com/fachschaft_mpi/" target="_blank" rel="noopener noreferrer">
          <v-img
            :src="instagramImg"
            height="100px"
            width="100px"
            class="grey darken-4"
          />
          </a>
          <p class="text-h6">
            @fachschaft_mpi
          </p>
        </div>
      </div>
      <br />
      <p>{{t('invitation')}}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useI18n } from 'vue-i18n'
import uniNowImg from '@static/uninow_AppIcon_rgb_color_rounded.png'
import instagramImg from '@static/6929237_instagram_icon.png'
import facebookImg from '@static/5365678_fb_facebook_facebook logo_icon.png'
import { mdiEmail, mdiPhone } from '@mdi/js'

export default defineComponent({
  setup()
  {
    const { t } = useI18n({});
    const tGlobal = useI18n({useScope: 'global'}).t;

    return {
      t,
      tGlobal,
      uniNowImg,
      instagramImg,
      facebookImg,
      mdiEmail,
      mdiPhone
    };
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
.instagram {
    background: radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%); 
    background: -webkit-radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%);    
    color: white;
    //border-radius: 20
}
.social {
  a {
    display: inline-block;
  }
  a > div {
    display: block;
    margin-left: auto;
    margin-right: auto;
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