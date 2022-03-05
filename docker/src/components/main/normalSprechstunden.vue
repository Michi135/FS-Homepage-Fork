<template>
  <div
    class="tw-px-5"
  >
    <i18n-t
      tag="h1"
      keypath="consHours"
    />
    <table>
      <colgroup>
        <col />
        <col
          v-for="tag in tage"
          :key="tag"
        />
      </colgroup>
      <thead>
        <tr>
          <th />
          <i18n-t
            tag="th"
            v-for="tag in tage"
            :key="tag"
            :keypath="tag"
            scope="global"
          />
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="stunde in stunden"
          :key="stunde"
        >
          <td>{{ stunde }}</td>
          <td
            v-for="tag in tage"
            :key="tag"
          >
            <template
              v-for="betreuer in sprechstunden[tag][stunde].value"
              :key="betreuer"
            >
              {{ betreuer }}
              <br />
            </template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { Ref } from 'vue'
import { useI18n } from 'vue-i18n'
//import table from "./dashboard/table.vue";
//https://colorlib.com/wp/css3-table-templates/
//https://colorlib.com/etc/tb/Table_Highlight_Vertical_Horizontal/index.html

export default defineComponent({
  setup: () =>
  {
    //https://www.npmjs.com/package/@thi.ng/sparse
    //https://adamlynch.com/flexible-data-tables-with-css-grid/
    let sprechstunden: { [key: string]: { [key: string]: Ref<String[]> } } = {}



    /*const windowWidth = ref(0);
    const tableStyle = computed(() => {
      if (windowWidth.value > 760)
        return "";
      let style = "";
      for (let i = 0; i < tage.length; ++i)
        style += `td:nth-of-type(${i + 2}):before { content: "${tGlobal(tage[i])}"; }`
      console.log(style)
      return style;
    });*/

    const tage = ['monday', 'tuesday', 'wednesday', 'thursday']
    const stunden = ['13:00', '14:00', '15:00']

    let tag = 0
    let tableStyle: HTMLStyleElement

    sprechstunden[tage[tag++]] = {
      [stunden[0]]: ref<String[]>(['Sophie']),
      [stunden[1]]: ref<String[]>(['Julia']),
      [stunden[2]]: ref<String[]>(['Lena'])
    }

    sprechstunden[tage[tag++]] = {
      [stunden[0]]: ref<String[]>(['Charlotte']),
      [stunden[1]]: ref<String[]>(['Olivia', 'Masell']),
      [stunden[2]]: ref<String[]>(['Elias'])
    }

    sprechstunden[tage[tag++]] = {
      [stunden[0]]: ref<String[]>(['Marius', 'Olli']),
      [stunden[1]]: ref<String[]>(['Michelle']),
      [stunden[2]]: ref<String[]>(['Lennart'])
    }

    sprechstunden[tage[tag++]] = {
      [stunden[0]]: ref<String[]>(['Maike']),
      [stunden[1]]: ref<String[]>(['Armin']),
      [stunden[2]]: ref<String[]>(['Dennis'])
    }


    onMounted(() =>
    {
      //windowWidth.value = window.innerWidth;
      //window.onresize = (ev) => {
      // windowWidth.value = window.innerWidth;
      //};

      const setColor = (
        ev: MouseEvent,
        backgroundColor?: string,
        backgroundColorHeader?: string,
        backgroundColorActive?: string
      ) =>
      {
        const target = <HTMLTableCellElement>ev.target
        const index = target.cellIndex

        const table = <HTMLTableElement>(
          target.parentNode!.parentNode!.parentNode
        )
        const tbody = table.tBodies[0]

        const col = <HTMLTableColElement>(
          table.querySelector('colgroup')!.childNodes[index]
        )

        /*if (!col.style) col.style = {};
        col.style.backgroundColor = backgroundColor ? backgroundColor : "";

        console.log(col);*/
        //maybe set style of <col> in <colgroup>
        Array.from(tbody.rows).forEach((value) =>
        {
          value.cells[index].style.backgroundColor = backgroundColor
            ? backgroundColor
            : ''
        })

        Array.from(table.tHead!.rows).forEach((row) =>
        {
          row.cells[index].style.backgroundColor = backgroundColorHeader
            ? backgroundColorHeader
            : ''
        })

        if (backgroundColorActive)
        {
          if (target.tagName === 'TH') return

          target.style.backgroundColor = backgroundColorActive
          target.style.color =
            '#' +
            (Number(`0x1${backgroundColorActive.substring(1)}`) ^ 0xffffff)
              .toString(16)
              .substring(1)
              .toUpperCase()
        }
        else
        {
          target.style.backgroundColor = ''
          target.style.color = ''
        }
      }
      const dataCells = Array.from(document.getElementsByTagName('td')).concat(
        Array.from(document.getElementsByTagName('th'))
      )
      dataCells.forEach((element) =>
      {
        element.onmouseenter = (ev) =>
        {
          if (window.innerWidth > 760)
            setColor(ev, '#e68e0b', '#909090', '#995c00')
        }
        element.onmouseleave = (ev) => setColor(ev)
      })

      const head = document.querySelector('head')!

      //const style = document.createElement("style");
      /*style.innerHTML = `@media only screen and (max-width: 760px),
        (min-device-width: 768px) and (max-device-width: 1024px) {
          #sprechstunden
        td:nth-of-type(1):before { content: "Uhrzeit"; } }`;
      head.appendChild(style);*/

      tableStyle = document.createElement('style')
      tableStyle.innerHTML = `@media only screen and (max-width: 760px) {
        #sprechstunden`
      for (let i = 0; i < tage.length; ++i)
        tableStyle.innerHTML += ` td:nth-of-type(${
          i + 2
        }):before { content: "${tGlobal(tage[i])}"; } `
      tableStyle.innerHTML += `}`
      head.appendChild(tableStyle)
    })

    const tGlobal = useI18n({ useScope: 'global' }).t
    const { locale } = useI18n()

    watch(locale, () =>
    {
      let newHtml = `@media only screen and (max-width: 760px) {
        #sprechstunden`
      for (let i = 0; i < tage.length; ++i)
        newHtml += ` td:nth-of-type(${i + 2}):before { content: "${tGlobal(
          tage[i]
        )}"; } `
      newHtml += `}`
      tableStyle.innerHTML = newHtml
    })

    onBeforeUnmount(() =>
    {
      tableStyle.remove()
    })

    return {
      tage,
      stunden,
      sprechstunden
    }
  }
})
</script>

<i18n locale="de">
{
  "consHours": "Sprechstunden der FSMPI",
}
</i18n>

<i18n locale="en">
{
  "consHours": "Consultation hours of the FSMPI",
}
</i18n>