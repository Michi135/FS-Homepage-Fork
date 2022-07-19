<template>
  <div class="content tw-flex tw-flex-col">
    <primeheader class="tw-flex-none" />
    <div
      class="tw-flex-1 bgrd"
    >
      <router-view
        v-slot="{Component}"
      >
        <transition
          name="bbb"
          mode="out-in"
        >
          <component
            :is="Component"
          />
        </transition>
      </router-view>
    </div>
    <primefooter class="tw-flex-none" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import primeheader from './header.vue'
import primefooter from './footer.vue'

export default defineComponent({
  //name: 'content',
  components: {
    primeheader,
    primefooter
  }
})
</script>

<style  lang="less">

/*.slide-fade-enter { transform: translateX(100%);}
.slide-fade-enter-to { transform: translateX(0);}
//.slide-fade-enter-active { position: relative;}

.slide-fade-leave { transform: translateX(0)}
.slide-fade-leave-to { transform: translateX(-100%)}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 750ms ease-in-out;
}*/

/*.slide-fade-enter-active {
  transition: all 12s ease-out;
}

.slide-fade-leave-active {
  transition: all 12s ease-in;
}

.slide-fade-enter-from
{
  transform: translateX(100px);
  opacity: 0;
}
.slide-fade-leave-to {
  transform: translateX(-100px);
  opacity: 0;
}*/

.bbb-enter-active,
.bbb-leave-active {
  transition: opacity 0.5s ease;
}

.bbb-enter-from,
.bbb-leave-to {
  opacity: 0;
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.content {
  min-width: 100%;
  min-height: 100vh;
}

.bgrd {
  background-image: url('@static/img/bg.jpg');
  background-repeat: no-repeat;
  background-size: cover;
}

.page-enter-active {
    overflow: hidden;
    transition: transform 400ms cubic-bezier(0.4, 0.1, 0.7, 0.95);

    .enter {
      transition: 300ms cubic-bezier(0.1, 0.7, 0.6, 0.9);
      transition-property: opacity, transform;
      transition-delay: 120ms;
    }
  }

  .page-enter {
    transform: translateX(100%);

    .enter {
      opacity: 0;
      transform: translateX(50px);
    }
  }

  .page-leave-active {
    display: block;
  }
</style>
