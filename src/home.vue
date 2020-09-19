<template>
  <div class="main"></div>
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
.image-container {
  max-height: 200px;
  max-width: 120px;
  height: auto;
  width: auto;
}

.main {
  background-image: url("./static/img/bg-content_orange.png");
  background-repeat: no-repeat;
  background-size: 100%;
  .header {
    font-size: 2rem;
    color: cyan;
    text-align: center;
  }
}

.text {
  color: greenyellow;
}

.details {
  justify-content: space-between;
}

.container {
  display: flex;
  flex-direction: column;
  .item {
    flex: auto;
  }
}

.image {
  max-height: 200px;
  max-width: 120px;
  height: auto;
  width: auto;
}

.grid {
  justify-content: center;
  align-items: center;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(auto, 25%));
  column-gap: 3rem;
  row-gap: 2rem;
}

.box {
  border: 5px solid;
  border-radius: 6px;
  border-color: aquamarine;
  border-style: outset;
  width: 100%;
  height: 100%;
}

/*.content-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding-top: 45px;
  .nav-show-mobile {
    display: none;
    @media (max-width: 1100px) {
      display: block;
    }
  }
  @media (max-width: 1100px) {
    padding-top: 0;
  }

  .nav-show-desktop {
    display: block;
    @media (max-width: 1100px) {
      display: none;
    }
  }

  .content-content {
    display: flex;
    flex-grow: 1;
    .content-nav,
    .content-main {
      overflow-y: scroll;
    }
    .content-nav {
      flex: 0 0 250px;
      padding: 1em 1.5em;
      background: rgba(38, 67, 89, 0.08);
    }
    .content-main {
      min-height: 100vh;
      flex: 1 1 100%;
      display: flex;
      flex-direction: column;
      .content-main-content {
        padding: 1.5em;
        flex-grow: 1;
      }
      .content-footer {
        padding: 1em 1.5em;
        font-size: 0.85em;
        color: rgba(38, 67, 89, 0.2);
        text-align: center;
      }
    }
  }
}*/
</style>