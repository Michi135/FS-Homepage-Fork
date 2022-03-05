<template>
  <div id="sprechstunden">
    <br />
    <ferien-comp v-if="ferien"></ferien-comp>
    <normal-comp v-else></normal-comp>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ferienComp from './feriensprechstunden.vue'
import normalComp from './normalSprechstunden.vue'

export default defineComponent({
  components: {
    ferienComp,
    normalComp
  },
  setup: () =>
  {
    const ferien = true

    return {
      ferien
    }
  }
})
</script>

<style lang="less">
#sprechstunden
{
  h1 {
    color: var(--color-primary-header);
    font-size: 1.5rem;
  }
  h2 {
    color: white;
    font-size: 1.2rem;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }
  /* Zebra striping */

  th {
    background: #333;
    color: white;
    font-weight: bold;
  }
  td,
  th {
    padding: 6px;
    border: 1px solid #ccc;
    text-align: left;
  }

  @media only screen and (min-width: 761px) {
    tr:nth-of-type(odd) td {
      background: #eee;
    }
    tr:nth-of-type(even) td {
      background: grey;
    }
    tr:hover td {
      background: #e68e0b;
    }
  }

  @media only screen and (max-width: 760px) {
    //,
    //(min-device-width: 768px) and (max-device-width: 1024px) {
    /* Force table to not be like tables anymore */
    table,
    thead,
    tbody,
    th,
    td,
    tr {
      display: block;
    }
    /* Hide table headers (but not display: none;, for accessibility) */
    thead tr {
      position: absolute;
      top: -9999px;
      left: -9999px;
    }

    tr {
      border: 1px solid #ccc;
    }

    td {
      // Behave  like a "row"
      border: none;
      //border-bottom: 1px solid #eee;
      position: relative;
      padding-left: 50%;
    }

    td:before {
      // Now like a table header
      position: absolute;
      // Top/left values mimic padding
      top: 6px;
      left: 6px;
      width: 45%;
      padding-right: 10px;
      white-space: nowrap;
    }

    /*td:hover:before {
      background: black;
    }
    */

    tr:nth-of-type(odd) td:not(:hover) {
      background: #eee;
    }
    tr:nth-of-type(even) td:not(:hover) {
      background: grey;
    }

    td:hover {
      background: #e68e0b;
    }
  }
}
</style>