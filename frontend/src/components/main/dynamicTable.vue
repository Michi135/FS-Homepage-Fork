<template>
  <div
    id="dynTable"
    :class="classId"
  >
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
            {{ firstHeaderCell.value }}
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
            {{ column }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, i) in rows"
          :key="row"
        >
          <td
            @mouseenter="mouseEnter"
            @mouseleave="mouseLeave"
          >
            {{ row }}
          </td>
          <td
            v-for="(column, j) in columns"
            :key="column"
            @mouseenter="mouseEnter"
            @mouseleave="mouseLeave"
          >
            <template
              v-for="dataPoint in data[j][i]"
              :key="dataPoint"
            >
              <p>{{ dataPoint }}</p>
            </template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, getCurrentInstance,
  onBeforeUnmount, onMounted, watch, onServerPrefetch, useSSRContext } from 'vue'

import type { PropType } from 'vue'
//https://colorlib.com/wp/css3-table-templates/
//https://colorlib.com/etc/tb/Table_Highlight_Vertical_Horizontal/index.html

export type TableCell = string[]
export type TableRow = Record<string, TableCell>
export type Table = Record<string, TableRow>

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
      type: Object as PropType<Table>,
      required: true
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

    let tableLabelStyle: HTMLStyleElement
    let tableStyle: HTMLStyleElement
    const classId = 'table_' + getCurrentInstance()!.uid.toString()

    const calcStyle = computed(() =>
    {
      let str = `@media only screen and (max-width: ${props.breakpoint}px) { `
      for (let i = 0; i < props.columns.length; ++i)
        str += ` .${classId} td:nth-of-type(${i + 2}):before { content: "${props.columns[i]}"; } `
      if (props.firstHeaderCell.show === 'BOTH' || props.firstHeaderCell.show === 'SMALL')
        str += ` .${classId} td:nth-of-type(1):before { content: "${props.firstHeaderCell.value}"; } `
      str += `}`
      return str
    })
    const tableStr = computed(() =>
    {
      const prefix = `#dynTable.${classId}`

      return`
      @media only screen and (min-width: ${props.breakpoint + 1}px) {
        ${prefix} tr:nth-of-type(odd) td {
          background: #eee;
        }
        ${prefix} tr:nth-of-type(even) td {
          background: grey;
        }
        ${prefix} tr:hover td {
          background: #e68e0b;
        }
      }
      @media only screen and (max-width: ${props.breakpoint}px) {
        ${prefix} table, ${prefix} thead, ${prefix} tbody, ${prefix} th, ${prefix} td, ${prefix} tr {
          display: block;
        }
        ${prefix} thead tr {
          position: absolute;
          top: -9999px;
          left: -9999px;
        }
        ${prefix} tr {
          border: 1px solid #ccc;
        }
        ${prefix} td {
          border: none;
          position: relative;
          padding-left: 50%;
        }
        ${prefix} td:before {
          position: absolute;
          top: 6px;
          left: 6px;
          width: 45%;
          padding-right: 10px;
          white-space: nowrap;
          display: inline-flex;
          flex-direction: column;
          justify-content: center;
          height: calc(88%);
        }
        ${prefix} tr:nth-of-type(odd) td:not(:hover) {
          background: #eee;
        }
        ${prefix} tr:nth-of-type(even) td:not(:hover) {
          background: grey;
        }
        ${prefix} td:hover {
          background: #e68e0b;
        }
      }`.replace(/\r?\n|\r|\t/gm, '').replace(/ {2,}/gm, ' ')
    })
    onServerPrefetch(() =>
    {
      const styles: Record<string, string> = {}
      styles[`${classId}_label`] = calcStyle.value,
      styles[`${classId}_table`] = tableStr.value

      Object.assign(useSSRContext()!, {
        styles: styles
      })
    })

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
      const head = document.querySelector('head')!

      const tempTableLabelStyle = <HTMLStyleElement | null>document.getElementById(`${classId}_label`)
      const tempTableStyle = <HTMLStyleElement | null>document.getElementById(`${classId}_table`)

      if (tempTableLabelStyle)
        tableLabelStyle = tempTableLabelStyle
      else
      {
        tableLabelStyle = document.createElement('style')
        tableLabelStyle.id = `${classId}_label`
        tableLabelStyle.innerHTML = calcStyle.value
        head.appendChild(tableLabelStyle)
      }

      if (tempTableStyle)
        tableStyle = tempTableStyle
      else
      {
        tableStyle = document.createElement('style')
        tableStyle.id = `${classId}_table`
        tableStyle.innerHTML = tableStr.value
        head.appendChild(tableStyle)
      }

      watch(calcStyle, (val) =>
      {
        tableLabelStyle.innerHTML = val
      })
    })

    onBeforeUnmount(() =>
    {
      tableLabelStyle.remove()
      tableStyle.remove()
    })

    return {
      classId,
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
}
</style>