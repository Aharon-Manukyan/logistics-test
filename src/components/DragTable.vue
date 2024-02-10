<template>
  <table class="table">
    <colgroup>
      <col
        v-for="(column, index) in headers"
        :key="index"
        :style="{ width: columnWidths[index] }"
      />
    </colgroup>
    <thead>
      <draggable
        v-model="headers"
        tag="tr"
        itemKey="index"
        :animation="150"
        handle=".drag-handle"
        @start="onDragStartColumn"
        @end="onDragEndColumn"
      >
        <template #item="{ element: col, index: colIndex }">
          <th :key="colIndex">
            <div class="drag-handle">{{ col }}</div>
            <div
              class="resize-handle"
              @mousedown="startResize($event, colIndex)"
              @mousemove="handleResize($event, colIndex)"
              @mouseup="endResize"
              @mouseleave="leaveResize"
            ></div>
          </th>
        </template>
      </draggable>
    </thead>
    <draggable
      v-model="data"
      tag="tbody"
      itemKey="id"
      :animation="150"
      handle=".drag-handle"
      @choose="onChooseRows($event)"
      @dragend="onDragEndRow"
      @dragenter="onDragEnterRow($event)"
    >
      <template #item="{ element: rows, index: rowIndex }">
        <tr
          :key="rowIndex"
          :class="{
            'drag-over': isChooseRow(rowIndex),
            'drag-enter': isDraggedRow(rowIndex),
          }"
        >
          <template v-for="(value, idx) in rows" :key="idx">
            <td
              v-if="idx === 0"
              class="first_cell"
              :class="{
                'drag-border': isChooseResizingCell(idx),
              }"
            >
              <img :src="select" alt="select" class="drag-handle" />
              <span>{{ rowIndex + 1 }}</span>
            </td>
            <td
              v-else
              :class="{
                'drag-border': isChooseResizingCell(idx),
              }"
            >
              <div>{{ value }}</div>
            </td>
          </template>
        </tr>
      </template>
    </draggable>
  </table>
</template>
<script setup>
import { onMounted, ref } from "vue";
import draggable from "vuedraggable";
import select from "@/assets/select.svg";

const props = defineProps({
  tableData: {
    type: Array,
    required: true,
  },
});
const headers = ref();
const data = ref();
const columnWidths = ref();
/* drag and drop column start */
const columnDragStart = ref(false);
const columnDragIndex = ref(-1);
const selectedCells = ref([]);
const onDragStartColumn = (event) => {
  columnDragStart.value = true;
  columnDragIndex.value = event.oldIndex;
  data.value.forEach((row, rowIndex) => {
    selectedCells.value.push({
      row: rowIndex,
      col: columnDragIndex.value,
    });
  });
  applySelection(selectedCells.value);
};
const onDragEndColumn = (event) => {
  const oldIndex = event.oldIndex;
  const newIndex = event.newIndex;
  data.value.forEach((d) => {
    let temp = d[oldIndex];
    d[oldIndex] = d[newIndex];
    d[newIndex] = temp;
  });

  removeSelection();
  columnDragStart.value = false;
  columnDragIndex.value = -1;
  selectedCells.value = [];
};
const applySelection = (selectedCells) => {
  selectedCells.forEach((cell) => {
    const row = document.querySelector(`tbody tr:nth-child(${cell.row + 1})`);
    if (row) {
      const cellElement = row.querySelector(`td:nth-child(${cell.col + 1})`);
      if (cellElement) {
        cellElement.classList.add("selected-cell");
      }
    }
  });
};
const removeSelection = () => {
  const selectedCellsAll = document.querySelectorAll(".selected-cell");
  selectedCellsAll.forEach((cell) => {
    cell.classList.remove("selected-cell");
  });
};
/* drag and drop column end */
/* resize start */
let resizing = ref(false);
let startMouseX = ref(0);
let startWidth = ref(0);
let resizingColumnIndex = ref(-1);

const isChooseResizingCell = (idx) => {
  return resizingColumnIndex.value === idx;
};
const startResize = (event, index) => {
  resizing.value = true;
  startMouseX.value = event.pageX;
  startWidth.value = parseInt(columnWidths.value[index]);
  resizingColumnIndex.value = index;
};
const handleResize = (event, index) => {
  if (!resizing.value || index != resizingColumnIndex.value) return;
  const widthDiff = event.pageX - startMouseX.value;
  columnWidths.value[index] = `${startWidth.value + widthDiff}px`;
};
const leaveResize = () => {
  endResize();
};
const endResize = () => {
  if (resizing.value) {
    resizing.value = false;
    resizingColumnIndex.value = -1;
  }
};

/* resize end */
/* drag and drop row start */
const chooseIndexRow = ref(-1);
const dragEnterRowIndex = ref(-1);
const isChooseRow = (index) => {
  return chooseIndexRow.value === index;
};

const isDraggedRow = (index) => {
  return dragEnterRowIndex.value === index;
};
const onChooseRows = (event) => {
  chooseIndexRow.value = event.oldIndex;
};
const onDragEndRow = () => {
  chooseIndexRow.value = -1;
  dragEnterRowIndex.value = -1;
};

const onDragEnterRow = (event) => {
  let els = document.querySelectorAll("tbody tr");
  els.forEach((el, index) => {
    if (el.contains(event.target)) {
      dragEnterRowIndex.value = index + 1;
    }
  });
};
/* drag and drop row end */
const calculateColumnWidths = () => {
  const table = document.querySelector(".table");

  const colWidths = [];

  for (let i = 0; i < headers.value.length; i++) {
    let maxWidth = 0;

    const headerTextWidth = getTextWidth(headers.value[i]);
    maxWidth = Math.max(maxWidth, headerTextWidth);

    data.value.forEach((row) => {
      const cellText = row[i] ? row[i].toString() : "";
      const cellTextWidth = getTextWidth(cellText);
      maxWidth = Math.max(maxWidth, cellTextWidth);
      maxWidth += 15;
    });

    maxWidth += 16;

    colWidths.push(`${maxWidth}px`);
  }

  columnWidths.value = colWidths;
};

const getTextWidth = (text) => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  context.font = "14px MyriadPro";
  const metrics = context.measureText(text);
  return metrics.width;
};
onMounted(() => {
  if (props.tableData) {
    headers.value = props.tableData?.length ? Object.keys(props.tableData[0]) : [];
    headers.value.unshift(" ");
    // data.value = props.tableData;

    data.value = props.tableData.map((row, index) => {
      return [index + 1, ...Object.values(row)];
    });
    calculateColumnWidths();
  }
});
</script>
<style lang="scss" scoped>
.table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  thead {
    tr {
      border: 0px solid #eeeff1;
      border-top-width: 2px;
      border-bottom-width: 2px;
      th {
        text-align: left;
        padding: 14px 10px;
        position: relative;
        white-space: nowrap;
        overflow: hidden;
      }
    }
  }
  tbody {
    tr {
      td div {
        white-space: nowrap;
        overflow: hidden;
        padding: 14px 10px;
      }
    }
  }
}
.resize-handle {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 15px;
  cursor: col-resize;
  background-color: #eeeff1;
}

.drag-handle {
  cursor: move;
  span {
    font-family: MyriadPro;
    font-size: 16px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #000;
    background: red;
  }
}
.first_cell {
  display: flex;
  flex-direction: row;
  gap: 8px;
  padding: 14px 10px;
}

.drag-over {
  border-radius: 5px;
  border: dashed 2px #a6b7d4;
  background-color: #fbfcfd;
  transition: 0.7s ease-in;
}
.drag-enter {
  border: 2px dotted #eeeff1;
}
.drag-border {
  border: 0px solid #eeeff1;
  border-right-width: 2px;
}
.selected-cell {
  background: red;
}
</style>
