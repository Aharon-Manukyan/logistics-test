<template>
  <table class="table custom-table">
    <colgroup>
      <col
        v-for="(column, index) in tableHeaders"
        :key="index"
        :style="{ width: columnWidths[index + 1] }"
      />
    </colgroup>
    <thead>
      <tr class="gap-x-2 border border-x-0 border-y-[1px]">
        <th
          class="whitespace-nowrap px-[10px] py-[14px] border border-x-0 border-y-0 column-header"
        ></th>
        <th
          class="whitespace-nowrap overflow-hidden"
          v-for="(header, index) in tableHeaders"
          :key="index + 1"
          :style="{ width: columnWidths[index] }"
        >
          <div class="column-header flex flex-row justify-between">
            <div class="px-[10px] py-[14px]">
              {{ header }}
            </div>
            <div
              class="resize-handle"
              @mousedown="startResize($event, index)"
              @mousemove="handleResize($event, index)"
              @mouseup="endResize"
            ></div>
          </div>
        </th>
      </tr>
    </thead>
    <draggable
      v-model="matrix"
      tag="tbody"
      @end="onDragEnd"
      itemKey="id"
      handle=".drag-handle"
    >
      <template #item="{ element: row, index: rowIndex }">
        <tr
          :key="rowIndex"
          @mousedown="startDragRow(rowIndex)"
          @mousemove="handleRowDrag($event, rowIndex)"
        >
          <td class="px-[10px] py-[14px] flex flex-row gap-[5px]">
            <img :src="select" alt="select" class="drag-handle" />
            <span>{{ rowIndex + 1 }}</span>
          </td>
          <td
            v-for="(cell, cellIndex) in row"
            :key="cellIndex"
            class="whitespace-nowrap overflow-hidden px-[10px] py-[14px]"
          >
            {{ cell === "удаление" ? ":" : cell }}
          </td>
        </tr>
      </template>
    </draggable>
  </table>
</template>

<script setup>
import { onMounted, ref, watchEffect, reactive, toRefs } from "vue";
import draggable from "vuedraggable";
import select from "@/assets/select.svg";
const props = defineProps({
  tableData: {
    type: Array,
    required: true,
  },
});

const columnWidths = ref(); // Initialize column widths
let resizing = ref(false);
let startMouseX = ref(0);
let startWidth = ref(0);
let resizingColumnIndex = -1;
const startResize = (event, index) => {
  resizing.value = true;
  startMouseX.value = event.pageX;
  startWidth.value = parseInt(columnWidths.value[index]);
  resizingColumnIndex = index;
};

const handleResize = (event, index) => {
  if (!resizing.value || index != resizingColumnIndex) return;
  const widthDiff = event.pageX - startMouseX.value;
  columnWidths.value[index + 2] = `${startWidth.value + widthDiff}px`;
};

const endResize = () => {
  if (resizing.value) {
    resizing.value = false;
    resizingColumnIndex = -1;
  }
};
const tableHeaders = ref([]);
const matrix = ref([]);
const onDragEnd = (event) => {};

const draggedRowIndex = ref(null);
const draggedColumnIndex = ref(null);

const startDragRow = (rowIndex) => {
  draggedRowIndex.value = rowIndex;
};

const handleRowDrag = (event, rowIndex) => {
  if (draggedRowIndex.value !== null && draggedRowIndex.value !== rowIndex) {
    // Perform row drag logic
  }
};

// const startDragColumn = (columnIndex) => {
//   draggedColumnIndex.value = columnIndex;
// };

// const handleColumnDrag = (event, columnIndex) => {
//   if (draggedColumnIndex.value !== null && draggedColumnIndex.value !== columnIndex) {
//     const temp = tableHeaders.value[draggedColumnIndex.value];
//     tableHeaders.value[draggedColumnIndex.value] = tableHeaders.value[columnIndex];
//     tableHeaders.value[columnIndex] = temp;
//     matrix.value.forEach((row) => {
//       const tempCell = row[draggedColumnIndex.value];
//       row[draggedColumnIndex.value] = row[columnIndex];
//       row[columnIndex] = tempCell;
//     });
//   }
// };
document.addEventListener("click", (event) => {
  const table = document.querySelector(".table th div .resize-handle");
  if (!table.contains(event.target)) {
    endResize();
  }
});

onMounted(() => {
  tableHeaders.value = props.tableData?.length ? Object.keys(props.tableData[0]) : [];
  props?.tableData.forEach((row) => {
    matrix.value = [...matrix.value, Object.values(row)];
  });
  columnWidths.value =
    columnWidths.value?.length ?? Array(tableHeaders.value.length).fill("300px");
});
</script>

<style lang="scss" scoped>
.table {
  font-family: MyriadPro;
  thead tr th div {
    font-family: MyriadPro !important;
  }
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
  }
}
.custom-table {
  border-collapse: collapse;
  table-layout: fixed;
  width: 100%;
}

.column-header {
  position: relative;
}

.resize-handle {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 4px;
  cursor: col-resize;
  background-color: #eeeff1;
}

.resize-handle:hover {
  background-color: #000;
}
</style>
