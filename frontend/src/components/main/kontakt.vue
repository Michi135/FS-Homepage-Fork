<template>
  <div
    id="kontakt"
    class="main"
  >
    <i18n-t
      keypath="contact"
      tag="h5"
      scope="global"
      class="header"
    />
    <div>
      <br />
      <i18n-t
        keypath="question"
        tag="p"
      />
      <br />
      <a
        href="https://elearning.uni-bayreuth.de/course/view.php?id=20051"
        target="_blank"
        rel="noopener noreferrer"
      >
        <p>- {{ t('message') }}</p>
      </a>
      <a href="mailto:fsmpi@uni-bayreuth.de">
        <p>
          <v-icon
            large
            :icon="mdiEmail"
          />
          fsmpi@uni-bayreuth.de
        </p>
      </a>
      <a href="tel:+49921553101">
        <p>
          <v-icon
            large
            :icon="mdiPhone"
          /> 0921/55-3101
        </p>
      </a>
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
          <a
            href="https://facebook.com/fsmpi"
            target="_blank"
            rel="noopener noreferrer"
          >
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
          <a
            href="https://www.instagram.com/fachschaft_mpi/"
            target="_blank"
            rel="noopener noreferrer"
          >
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
      <i18n-t
        keypath="invitation"
        tag="p"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { useI18nGlobal } from '@shared/i18n'
import uniNowImg from '@static/uninow_AppIcon_rgb_color_rounded.png'
import instagramImg from '@static/6929237_instagram_icon.png'
import facebookImg from '@static/facebook_icon.png'
import { mdiEmail, mdiPhone } from '@mdi/js'

export default defineComponent({
  setup()
  {
    const { t } = useI18n()
    const tGlobal = useI18nGlobal().t

    return {
      t,
      tGlobal,
      uniNowImg,
      instagramImg,
      facebookImg,
      mdiEmail,
      mdiPhone
    }
  }
})
</script>

<style lang="less">
#kontakt {
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
}
</style>

<i18n locale="de">
{
  "message": "Nachricht im e-Learning-Kurs",
  "question": "Ihr braucht Hilfe oder habt Fragen? Wir sind zu erreichen per:",
  "invitation": "Oder Ihr besucht uns persönlich in unserem Büro (NW II, zwischen H 20 und S 78)"
}
</i18n>

<i18n locale="en">
{
  "message": "Message in the e-Learning-course",
  "question": "You need help or have questions? We're here for you by:",
  "invitation": "Or you visit us in person in our office (NW II, between H 20 and S 78)"
}
</i18n>
