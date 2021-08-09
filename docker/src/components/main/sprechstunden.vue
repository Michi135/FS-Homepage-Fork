<template>
  <div>
    <br />
    <div
      v-if="ferien"
      class="tw-flex tw-flex-col tw-items-center tw-text-center tw-space-y-2"
    >
      <div>
        Die Fachschaft wünscht schöne Ferien und ist weiterhin
        <br />
        an den folgenden Tagen von
        {{ ferien_sprechstunden.uhrzeit }} für euch da
      </div>
      <div />
      <div />
      <div>Feriensprechstunden der FSMPI</div>
      <div
        class="
          tw-flex
          tw-flex-wrap
          tw-space-x-2
          tw-border-solid
          tw-border-2
          tw-border-gray-600
          tw-text-left
          tw-justify-center
        "
      >
        <div
          v-for="(sprechstunde, index) in ferien_sprechstunden.sprechstunden"
          :key="index"
        >
          <div v-text="sprechstunde.tag" />
          <div v-text="sprechstunde.betreuer" />
        </div>
      </div>
    </div>
    <div v-else class="tw-px-5">
      <div class="heading">Sprechstunden der FSMPI</div>
      <table :style="gridStyle">
        <colgroup>
          <col />
          <col v-for="tag in tage" :key="tag" />
        </colgroup>
        <thead>
          <tr>
            <th />
            <th v-for="tag in tage" :key="tag">{{ tag }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="stunde in stunden" :key="stunde">
            <td>{{ stunde }}</td>
            <td v-for="tag in tage" :key="tag">
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
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, Ref } from "vue";
//import table from "./dashboard/table.vue";
//https://colorlib.com/wp/css3-table-templates/
//https://colorlib.com/etc/tb/Table_Highlight_Vertical_Horizontal/index.html
export default defineComponent({
  //components: { table },
  setup: () => {
    const loading = true;
    const ferien = false;
    //https://www.npmjs.com/package/@thi.ng/sparse
    //https://adamlynch.com/flexible-data-tables-with-css-grid/
    let sprechstunden: { [key: string]: { [key: string]: Ref<String[]> } } = {};

    const tage = [
      "11.08",
      "18.08",
      "25.08",
      "01.09",
      "08.09",
      "15.09",
      "22.09",
      "29.09",
      "06.10",
      "13.10",
    ];
    const stunden = ["14:00-16:00"];

    let tag = 0;

    sprechstunden[tage[tag++]] = {
      [stunden[0]]: ref<String[]>(["Julia"]),
    };
    sprechstunden[tage[tag++]] = {
      [stunden[0]]: ref<String[]>(["Michelle"]),
    };
    sprechstunden[tage[tag++]] = {
      [stunden[0]]: ref<String[]>(["Sophie"]),
    };
    sprechstunden[tage[tag++]] = {
      [stunden[0]]: ref<String[]>(["Masell"]),
    };
    sprechstunden[tage[tag++]] = {
      [stunden[0]]: ref<String[]>(["Charlotte"]),
    };
    sprechstunden[tage[tag++]] = {
      [stunden[0]]: ref<String[]>(["Olivia"]),
    };
    sprechstunden[tage[tag++]] = {
      [stunden[0]]: ref<String[]>(["Elias"]),
    };
    sprechstunden[tage[tag++]] = {
      [stunden[0]]: ref<String[]>(["Marius"]),
    };
    sprechstunden[tage[tag++]] = {
      [stunden[0]]: ref<String[]>(["Lena"]),
    };
    sprechstunden[tage[tag++]] = {
      [stunden[0]]: ref<String[]>(["Olli"]),
    };

    const ferien_sprechstunden = {
      uhrzeit: "14 bis 16 Uhr",
      sprechstunden: [
        {
          tag: "19.08",
          betreuer: "Fabi",
        },
        {
          tag: "26.08",
          betreuer: "Dennis",
        },
        {
          tag: "02.09",
          betreuer: "Ruth",
        },
        {
          tag: "09.09",
          betreuer: "Julia",
        },
        {
          tag: "16.09",
          betreuer: "Masell",
        },
        {
          tag: "23.09",
          betreuer: "Olivia",
        },
        {
          tag: "30.09",
          betreuer: "David",
        },
        {
          tag: "07.10",
          betreuer: "Elias",
        },
        {
          tag: "14.10",
          betreuer: "Charlotte",
        },
        {
          tag: "21.10",
          betreuer: "Marius",
        },
        {
          tag: "28.10",
          betreuer: "Armin",
        },
      ],
    };
    const gridStyle = computed(() => {
      return {
        gridTemplateColumns: `repeat(${
          tage.length + 1
        }, minmax(min-content, max-content))`,
        gridTemplateRows: `0px repeat(${
          stunden.length + 1
        }, minmax(max-content, 1fr))`,
      };
    });
    onMounted(() => {
      const setColor = (
        ev: MouseEvent,
        backgroundColor?: string,
        backgroundColorHeader?: string,
        backgroundColorActive?: string
      ) => {
        const target = <HTMLTableCellElement>ev.target;
        const index = target.cellIndex;

        const table = <HTMLTableElement>(
          target.parentNode!.parentNode!.parentNode
        );
        const tbody = table.tBodies[0];

        const col = <HTMLTableColElement>(
          table.querySelector("colgroup")!.childNodes[index]
        );

        /*if (!col.style) col.style = {};
        col.style.backgroundColor = backgroundColor ? backgroundColor : "";

        console.log(col);*/
        //maybe set style of <col> in <colgroup>
        Array.from(tbody.rows).forEach((value) => {
          value.cells[index].style.backgroundColor = backgroundColor
            ? backgroundColor
            : "";
        });

        Array.from(table.tHead!.rows).forEach((row) => {
          row.cells[index].style.backgroundColor = backgroundColorHeader
            ? backgroundColorHeader
            : "";
        });

        if (backgroundColorActive) {
          if (target.tagName === "TH") return;

          target.style.backgroundColor = backgroundColorActive;
          target.style.color =
            "#" +
            (Number(`0x1${backgroundColorActive.substring(1)}`) ^ 0xffffff)
              .toString(16)
              .substring(1)
              .toUpperCase();
        } else {
          target.style.backgroundColor = "";
          target.style.color = "";
        }
      };
      const dataCells = Array.from(document.getElementsByTagName("td")).concat(
        Array.from(document.getElementsByTagName("th"))
      );
      dataCells.forEach((element) => {
        element.onmouseenter = (ev) =>
          setColor(ev, "#e68e0b", "#909090", "#995c00");
        element.onmouseleave = (ev) => setColor(ev);
      });

      const head = document.querySelector("head")!;

      const style = document.createElement("style");
      style.innerHTML = `@media only screen and (max-width: 760px),
        (min-device-width: 768px) and (max-device-width: 1024px) {
        td:nth-of-type(1):before { content: "Uhrzeit"; } }`;
      head.appendChild(style);

      for (let i = 0; i < tage.length; ++i) {
        const style = document.createElement("style");
        style.innerHTML = `@media only screen and (max-width: 760px),
        (min-device-width: 768px) and (max-device-width: 1024px) {
        td:nth-of-type(${i + 2}):before { content: "${tage[i]}"; } }`;
        head.appendChild(style);
      }
    });
    return {
      loading,
      ferien,
      tage,
      stunden,
      sprechstunden,
      ferien_sprechstunden,
      gridStyle,
    };
  },
});
</script>

<style scoped lang="less">
.heading {
  color: var(--color-primary-header);
}
.secondary {
  color: var(--color-secondary-header);
}
/*
.contained {
  display: flex;
  overflow: auto;
}

thead {
  color: white;
}

th,
td {
  padding: 15px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

td {
  padding-top: 10px;
  padding-bottom: 10px;
  color: #4b4b4b;
}

tr:nth-child(even) td {
  background: #e09f3d;
}

tr:nth-child(odd) td {
  background: #f8ce8e;
}

tr:hover th {
  background: #909090;
}

tr:hover td {
  background: #e68e0b;
}*/

table {
  width: 100%;
  border-collapse: collapse;
}
/* Zebra striping */
tr:nth-of-type(odd) td {
  background: #eee;
}
tr:nth-of-type(even) td {
  background: grey;
}

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

tr:hover td {
  background: #e68e0b;
}

@media only screen and (max-width: 760px),
  (min-device-width: 768px) and (max-device-width: 1024px) {
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
    /* Behave  like a "row" */
    border: none;
    border-bottom: 1px solid #eee;
    position: relative;
    padding-left: 50%;
  }

  td:before {
    /* Now like a table header */
    position: absolute;
    /* Top/left values mimic padding */
    top: 6px;
    left: 6px;
    width: 45%;
    padding-right: 10px;
    white-space: nowrap;
  }
}
</style>