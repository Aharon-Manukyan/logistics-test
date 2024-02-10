<template>
  <table class="table custom-table">
    <colgroup>
      <col
        v-for="(column, index) in tableHeaders"
        :key="index"
        :style="{ width: columnWidths[index] }"
      />
    </colgroup>
    <!-- <thead>
      <tr class="gap-x-2 border border-x-0 border-y-[1px]">
        <th
          class="whitespace-nowrap px-[10px] py-[14px] border border-x-0 border-y-0 column-header"
        ></th>
        <th
          class="whitespace-nowrap overflow-hidden column-header"
          v-for="(header, index) in tableHeaders"
          :key="index + 1"
          :style="{ width: columnWidths[index] }"
        >
          <div class="flex flex-row justify-between">
            <div
              class="px-[10px] py-[14px] cursor-move"
              @mousedown="startDragColumn(index)"
              @mousemove="handleColumnDrag($event, index)"
              @mouseup="endColumnDrag"
            >
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
    </thead> -->
    <thead>
      <draggable
        v-model="tableHeaders"
        tag="tr"
        item-key="id"
        class="gap-x-2 border border-x-0 border-y-[1px] drag-container"
        :animation="150"
      >
        <template #item="{ element: column, index: colIndex }">
          <th
            class="whitespace-nowrap overflow-hidden column-header text-left"
            :key="colIndex"
          >
            <div class="flex flex-row justify-between">
              <div class="px-[10px] py-[14px] cursor-move">
                {{ column }}
              </div>
              <div
                class="resize-handle"
                @mousedown="startResize($event, colIndex)"
                @mousemove="handleResize($event, colIndex)"
                @mouseup="endResize"
              ></div>
            </div>
          </th>
        </template>
      </draggable>
    </thead>
    <draggable
      v-model="matrix"
      tag="tbody"
      @dragover.prevent="onDragOver"
      @drop.prevent="onDrop"
      itemKey="id"
      handle=".drag-handle"
    >
      <template #item="{ element: row, index: rowIndex }">
        <tr
          :key="rowIndex"
          @mousedown="startDragRow(rowIndex)"
          @mousemove="handleRowDrag($event, rowIndex)"
          :class="{ dropzone: isDropzoneActive && rowIndex === dropzoneIndex }"
        >
          <td class="px-[10px] py-[14px] flex flex-row gap-[5px]">
            <img :src="select" alt="select" class="drag-handle" />
            <span>{{ rowIndex + 1 }}</span>
          </td>
          <!-- <transition-group
            name="fade"
            tag="div"
            @dragenter="onDragEnter"
            @dragover.prevent="onDragOver"
            @dragleave="onDragLeave"
            @drop.prevent="onDrop"
          >
          </transition-group> -->
          <td
            v-for="(cell, cellIndex) in row"
            :key="cellIndex"
            class="whitespace-nowrap overflow-hidden px-[10px] py-[14px] file"
          >
            {{ cell === "удаление" ? ":" : cell }}
          </td>
        </tr>
      </template>
    </draggable>
    <rawDisplayer class="col-2" :value="matrix" title="List" />

    <rawDisplayer class="col-2" :value="tableHeaders" title="Headers" />
  </table>
</template>

<script setup>
import { onMounted, ref, watch, watchEffect } from "vue";
import draggable from "vuedraggable";
import select from "@/assets/select.svg";
const props = defineProps({
  tableData: {
    type: Array,
    required: true,
  },
});
const tableHeaders = ref([]);
const matrix = ref([]);
const transposeMatrix = ref();
/* resizing start */

const columnWidths = ref();
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

/* resizing end */
/* row drag start */
const isDropzoneActive = ref(false);
const dropzoneIndex = ref(null);
const draggedRowIndex = ref(null);

const onDrop = () => {
  isDropzoneActive.value = false;
  dropzoneIndex.value = null;
};

const onDragOver = (event) => {
  isDropzoneActive.value = true;
  dropzoneIndex.value = event.target.parentNode.rowIndex;
};
const startDragRow = (rowIndex) => {
  draggedRowIndex.value = rowIndex;
};
const handleRowDrag = (event, rowIndex) => {
  if (draggedRowIndex.value !== null && draggedRowIndex.value !== rowIndex) {
    // Perform row drag logic
  }
};
/* row drag end */
/* column drag start */
const draggedColumnIndex = ref(null);
const columnDropZoneActive = ref(false);
const droppedItems = ref([]);
const dataTransfer = ref([]);
const onDragStartColumn = (event) => {
  columnDropZoneActive.value = true;
  draggedColumnIndex.value = Array.from(event.target.parentNode.children).indexOf(
    event.target
  );

  //   );
  dataTransfer.value = matrix.value.map((row) => {
    return row[draggedColumnIndex.value];
  });
  event.target.dispatchEvent(new CustomEvent("setData", { detail: dataTransfer.value }));
};

const onDragEndColumn = (event) => {
  const droppedIndex = Array.from(event.target.parentNode.children).indexOf(event.target);
  droppedItems.value.push(droppedIndex);
};
const onDragColumn = (event) => {
  //   console.log(event, "onDrag");
  const data = event.target.$data;
  console.log(data);
};

const onDragOverColumn = (event) => {
  columnDropZoneActive.value = true;
  draggedColumnIndex.value = event.target.parentNode;
};
const onDragEnterColumn = (event) => {
  console.log("123123");
};

const onDropColumn = (event) => {
  let index = event.target.parentNode;
  if (index !== null && dropzoneIndex.value !== null) {
    const draggedColumn = matrix.value.map((row) => row[index]);
    matrix.value.forEach((row, rowIndex) => {
      row.splice(draggedColumnIndex.value, 0, row.splice(index, 1)[0]);
    });
    matrix.value.forEach((row, rowIndex) => {
      row.splice(index, 1, draggedColumn[rowIndex]);
    });
    const draggedHeader = tableHeaders.value[index];
    tableHeaders.value.splice(index, 1);
    tableHeaders.value.splice(draggedColumnIndex.value, 0, draggedHeader);
  }
  columnDropZoneActive.value = false;
  draggedColumnIndex.value = null;
};

const startDragColumn = (columnIndex) => {
  draggedColumnIndex.value = columnIndex;
};

const handleColumnDrag = (event, columnIndex) => {
  if (draggedColumnIndex.value !== null && draggedColumnIndex.value !== columnIndex) {
    const temp = tableHeaders.value[draggedColumnIndex.value];
    tableHeaders.value[draggedColumnIndex.value] = tableHeaders.value[columnIndex];
    tableHeaders.value[columnIndex] = temp;
    matrix.value.forEach((row) => {
      const tempCell = row[draggedColumnIndex.value];
      row[draggedColumnIndex.value] = row[columnIndex];
      row[columnIndex] = tempCell;
    });
  }
};
const endColumnDrag = (event) => {
  draggedColumnIndex.value = null;
};

/* column drag end */

// document.addEventListener("click", (event) => {
//   const table = document.querySelector(".table th div .resize-handle");
//   if (!table.contains(event.target)) {
//     endResize();
//   }
//   const draggedColumns = document.querySelectorAll(".column-header");
//   console.log(draggedColumns, "dragged");
// });
function transpose(matrix) {
  return matrix[0].map((_, columnIndex) => matrix.map((row) => row[columnIndex]));
}
onMounted(() => {
  tableHeaders.value = props.tableData?.length ? Object.keys(props.tableData[0]) : [];
  tableHeaders.value.unshift(" ");
  //   props?.tableData.forEach((row) => {
  //     matrix.value = [...matrix.value, Object.values(row)];
  //   });
  matrix.value = [...props?.tableData];
  columnWidths.value =
    columnWidths.value?.length ?? Array(tableHeaders.value.length).fill("300px");
  //   transposeMatrix.value = matrix.value?.length ? transpose(matrix.value) : [];
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
.dropzone {
  border-radius: 5px !important;
  border: dotted 2px #a6b7d4;
  background-color: #fbfcfd;
}
.drag-item {
  margin: 10px 0;
  padding: 10px;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.drag-container {
  min-height: 200px;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
