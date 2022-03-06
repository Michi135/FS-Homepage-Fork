<template>
  <div id="dynTable">
    <table>
      <colgroup>
        <col />
        <col
          v-for="column in columns"
          :key="column"
        />
      </colgroup>
      <thead>
        <tr>
          <th
            v-if="firstHeaderCell.show === 'BIG' || firstHeaderCell.show === 'BOTH'"
            @mouseenter="mouseEnter"
            @mouseleave="mouseLeave"
          >
            {{ optTranslate(firstHeaderCell.value) }}
          </th>
          <th
            v-else
            @mouseenter="mouseEnter"
            @mouseleave="mouseLeave"
          ></th>
          <th
            v-for="column in columns"
            :key="column"
            @mouseenter="mouseEnter"
            @mouseleave="mouseLeave"
          >
            {{ optTranslate(column) }}
          </th>
        </tr>
      </thead>
      <tbody :id="id">
        <tr
          v-for="row in rows"
          :key="row"
        >
          <td
            @mouseenter="mouseEnter"
            @mouseleave="mouseLeave"
          >
            {{ optTranslate(row) }}
          </td>
          <td
            v-for="column in columns"
            :key="column"
            @mouseenter="mouseEnter"
            @mouseleave="mouseLeave"
          >
            <template
              v-for="dataPoint in data[column][row]"
              :key="dataPoint"
            >
              <p>{{ optTranslate(dataPoint.value) }}</p>
            </template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, onBeforeUnmount, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import type { Ref, PropType } from 'vue'
//https://colorlib.com/wp/css3-table-templates/
//https://colorlib.com/etc/tb/Table_Highlight_Vertical_Horizontal/index.html

export default defineComponent({
  props: {
    columns: {
      type: Array as PropType<Array<string>>,
      required: true
    },
    rows: {
      type: Array as PropType<Array<string>>,
      required: true
    },
    data: {
      type: Object as PropType<Record<string, Record<string, Ref<string>[]>>>,
      required: true
    },
    translation: {
      type: Object as PropType<Record<string, (() => string)>>,
      required: false,
      default: undefined
    },
    breakpoint: {
      type: Number,
      required: true
    },
    firstHeaderCell: {
      type: Object as PropType<{ value: string, show: 'SMALL' | 'BIG' | 'BOTH' }>,
      required: false,
      default: () =>
      {
        return { value: '', show: 'SMALL' }
      }
    }
  },
  setup: (props) =>
  {
    //https://www.npmjs.com/package/@thi.ng/sparse
    //https://adamlynch.com/flexible-data-tables-with-css-grid/
    const { locale } = useI18n({ useScope: 'global' })

    const optTranslate = (value: string) =>
    {
      return (props.translation?.[value]) ? props.translation[value]() : value
    }

    let tableStyle: HTMLStyleElement
    const id = 'table_' + getCurrentInstance()!.uid.toString()

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

    onMounted(() =>
    {
      const calcStyle = () =>
      {
        let str = `@media only screen and (max-width: ${props.breakpoint}px) {
        #${id}`
        for (let i = 0; i < props.columns.length; ++i)
          str += ` td:nth-of-type(${i + 2}):before { content: "${optTranslate(props.columns[i])}"; } `
        if (props.firstHeaderCell.show === 'BOTH' || props.firstHeaderCell.show === 'SMALL')
          str += ` td:nth-of-type(1):before { content: "${optTranslate(props.firstHeaderCell.value)}"; } `
        str += `}`
        return str
      }

      const head = document.querySelector('head')!
      tableStyle = document.createElement('style')
      tableStyle.innerHTML = calcStyle()
      head.appendChild(tableStyle)

      watch(locale, () =>
      {
        tableStyle.innerHTML = calcStyle()
      })
    })

    onBeforeUnmount(() =>
    {
      tableStyle.remove()
    })

    return {
      optTranslate,
      id,
      mouseEnter: (ev: MouseEvent) =>
      {
        if (window.innerWidth > props.breakpoint)
          setColor(ev, '#e68e0b', '#909090', '#995c00')
      },
      mouseLeave: (ev: MouseEvent) => setColor(ev)
    }
  }
})
</script>

<style lang="less">
#dynTable {
  p {
    color: black !important
  }
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
      display: inline-flex;
      flex-direction: column;
      justify-content: center;
      height: calc(100% - 12px);
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