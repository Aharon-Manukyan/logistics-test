<template>
  <table class="table" v-if="data?.length">
    <colgroup class="table__colgroup">
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
        @start="onDragStartColumn"
        @dragenter="onDragEnterColumn"
        @end="onDragEndColumn"
        handle=".drag-handleColumn"
        class="dragColumn"
      >
        <template #item="{ element: col, index: colIndex }">
          <th
            :class="{ 'non-draggable': colIndex === nonDraggableColumnIndex }"
            :data-draggable="colIndex != nonDraggableColumnIndex"
          >
            <div :class="{ 'drag-handleColumn': colIndex }">{{ col }}</div>
            <div
              class="resize-handle"
              @mousedown="startResize($event, colIndex)"
              @mouseup="endResize"
            ></div>
          </th>
        </template>
      </draggable>
      <tr class="relative addRow" v-show="boolAddColumn">
        <td
          v-for="(header, i) in headers"
          :key="i"
          class="w-full h-[45px] px-[15px] py-[5px] bg-[#eeeff1]"
        >
          <input
            v-if="header !== ' '"
            type="text"
            :placeholder="header"
            :name="header"
            class="overflow-hidden w-full"
          />
          <div v-else class="flex flex-row justify-center gap-2">
            <button class="w-[20px]" @click="addRow">
              <img :src="checked" alt="Checked" />
            </button>
            <button @click="emits('cancelAddingRow')" class="w-[20px]">
              <img :src="cancel" alt="Cancel" />
            </button>
          </div>
        </td>
      </tr>
    </thead>
    <draggable
      v-model="data"
      tag="tbody"
      itemKey="id"
      :animation="150"
      handle=".drag-handle"
      @choose="onChooseRows"
      @dragenter="onDragEnterRow"
      @dragend="onDragEndRow"
      class="table__tbody"
    >
      <template #item="{ element: rows, index: rowIndex }">
        <tr
          class="table__tbody--row"
          :key="rowIndex"
          :class="{
            'drag-over': isChooseRow(rowIndex),
            'drag-enter': isDraggedRow(rowIndex),
          }"
        >
          <template v-for="(value, idx) in rows" :key="idx">
            <td
              v-if="idx === 0"
              class="table__tbody--row__cell"
              :class="{
                'drag-border': isChooseResizingCell(idx),
              }"
            >
              <label>Номер строки</label>
              <div class="table__tbody--row__cell--content firstCell">
                <img :src="select" alt="select" class="drag-handle" />
                <span>{{ rowIndex + 1 }}</span>
              </div>
            </td>
            <td
              class="table__tbody--row__cell"
              v-else-if="value === 'удаление'"
              :class="{
                'drag-border': isChooseResizingCell(idx),
              }"
            >
              <label for="">{{ headers[idx] }}</label>
              <div class="table__tbody--row__cell--content deleteCell">
                <img
                  class="cursor-pointer"
                  :src="other"
                  alt="other"
                  @click.stop="showPopupFunction(rowIndex)"
                />
              </div>
              <div
                v-if="showPopup && showPopupIndex === rowIndex"
                class="smallPopup"
                ref="smallPopup"
                @click.stop="deleteRow(rowIndex)"
              >
                Удалить
              </div>
            </td>
            <td
              v-else
              class="table__tbody--row__cell"
              :class="{
                'drag-border': isChooseResizingCell(idx),
              }"
            >
              <label for="">{{ headers[idx] }}</label>
              <div class="table__tbody--row__cell--content bodyCell">
                <template v-if="value">
                  <template v-if="typeof value === 'string'">
                    <div>
                      {{ value }}
                    </div>
                    <div class="rightSide">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 10 10"
                        width="10"
                        height="10"
                        fill="#C0C0C0"
                      >
                        <polygon points="0,10 5,0 10,10" />
                      </svg>
                    </div>
                  </template>
                  <template v-else-if="typeof value === 'number'">
                    <div>{{ value }}</div>
                  </template>
                </template>
                <template v-else>
                  <div>-</div>
                </template>
              </div>
            </td>
          </template>
        </tr>
      </template>
    </draggable>
  </table>
  <div v-else class="px-[15px] pt-[25px]">No table data</div>
</template>
<script setup>
import { onMounted, ref, computed, watch, onUnmounted } from "vue";
import draggable from "vuedraggable";
import select from "@/assets/select.svg";
import other from "@/assets/other.svg";
import checked from "@/assets/checked.svg";
import cancel from "@/assets/cancel.svg";

const props = defineProps({
  tableData: {
    type: Array,
    required: true,
  },
  boolAddColumn: {
    type: Boolean,
    default: false,
  },
});
const emits = defineEmits(["deleteRow", "cancelAddingRow", "addData"]);
const headers = ref();
const data = ref();
const columnWidths = ref();
const smallPopup = ref();
const showPopup = ref(false);
const showPopupIndex = ref(-1);
const showPopupFunction = (index) => {
  showPopup.value = true;
  showPopupIndex.value = index;
};
const boolAddColumn = computed(() => props.boolAddColumn);
const addRow = () => {
  let inputs = document.querySelectorAll("tr.addRow input");
  const objData = {};
  inputs.forEach((inp) => {
    objData[inp.placeholder] = inp.value;
  });
  emits("addData", objData);
};
const deleteRow = (index) => {
  showPopup.value = false;
  emits("deleteRow", index);
};
/* drag and drop column start */
const columnDragStart = ref(false);
const columnDragIndex = ref(-1);
const selectedCells = ref([]);
const nonDraggableColumnIndex = ref(0);
const moveColumn = () => {
  if (resizing.value) {
    return false;
  } else {
    return true;
  }
};
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
const onDragEnterColumn = () => {
  const numColumns = headers.value.length;
  const numRows = data.value.length;
  const newIndex = event.newIndex;
  const newIndexRow = Math.floor(newIndex / numColumns);
  const newIndexCol = newIndex % numColumns;
  selectedCells.value = [];

  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numColumns; j++) {
      if (i === newIndexRow && j === newIndexCol) {
        selectedCells.value.push({ row: i, col: j, isDragged: true });
      } else {
        selectedCells.value.push({ row: i, col: j });
      }
    }
  }
};
const onDragEndColumn = (event) => {
  const oldIndex = event.oldIndex;
  const newIndex = event.newIndex;
  data.value.forEach((row) => {
    moveElement(row, oldIndex, newIndex);
  });
  /* 
  if we get this from the server, then we need a request while changing columns and rows
  p.s. call emits('switchColumn',{oldIndex,newIndex} and parent component call switchColumn(oldIndex,newIndex)
  */
  moveElement(columnWidths.value, oldIndex, newIndex);
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

function moveElement(array, fromIndex, toIndex) {
  const element = array.splice(fromIndex, 1)[0];
  array.splice(toIndex, 0, element);
  return array;
}
const handleClickOutsideSmallPopup = (event) => {
  const popupHtml = document.querySelector(".smallPopup");
  if (popupHtml && !popupHtml.contains(event.target)) {
    showPopup.value = false;
    showPopupIndex.value = -1;
  }
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
  startWidth.value = parseFloat(columnWidths.value[index]);
  resizingColumnIndex.value = index;
};

const endResize = () => {
  resizing.value = false;
  resizingColumnIndex.value = -1;
};
const handleMouseOver = (event) => {
  if (resizingColumnIndex.value !== -1) {
    const widthDiff = event.pageX - startMouseX.value;
    columnWidths.value[resizingColumnIndex.value] = `${startWidth.value + widthDiff}px`;
  }
};
const handleMouseUp = () => {
  if (resizingColumnIndex.value > 0) {
    resizingColumnIndex.value = -1;
    resizing.value = false;
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

watch(
  () => props.tableData,
  (newValue) => {
    headers.value = newValue.length ? Object.keys(newValue[0]) : [];
    headers.value.unshift(" ");
    data.value = newValue.map((row, index) => {
      return [index + 1, ...Object.values(row)];
    });

    calculateColumnWidths();
  },
  {
    deep: true,
  }
);
onMounted(() => {
  document.addEventListener("click", handleClickOutsideSmallPopup);
  document.addEventListener("mouseover", handleMouseOver);
  document.addEventListener("mouseup", handleMouseUp);

  if (props.tableData) {
    headers.value = props.tableData?.length ? Object.keys(props.tableData[0]) : [];
    headers.value.unshift(" ");

    data.value = props.tableData.map((row, index) => {
      return [index + 1, ...Object.values(row)];
    });
    calculateColumnWidths();
  }
});
onUnmounted(() => {
  document.removeEventListener("click", handleClickOutsideSmallPopup);
  document.removeEventListener("mouseover", handleMouseOver);
  document.removeEventListener("mouseup", handleMouseUp);
});
</script>
<style lang="scss" scoped>
.non-draggable {
  pointer-events: none;
  opacity: 0.6;
}
.table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  margin-bottom: 15px;
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
}
.selectBodyCell {
  width: 21px !important;
  height: 100% !important;
  padding: 10px 0px 9px 0px !important;
  background: #f6f5f3 !important;
  opacity: 0.9 !important;
}
.resize-handle {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 2px;
  cursor: col-resize;
  background-color: #eeeff1;
}
.resize-handle:active {
  cursor: col-resize;
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
.drag-handleColumn {
  cursor: grab;
  &:active {
    cursor: grabbing;
  }
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
  background: #eeeff1;
}
.smallPopup {
  position: absolute;
  width: 179px;
  height: 29px;
  padding: 7px 19.4px 7px 9.6px !important;
  border-radius: 5px;
  box-shadow: 0 0 3px 0 #000, inset 0 1px 2px 0 rgba(255, 255, 255, 0.5) !important;
  background-color: #fff !important;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  z-index: 999;
  font-family: MyriadPro;
  font-size: 15px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #ae0a0a;
  cursor: pointer;
}
.actions {
  position: fixed;
  right: 40px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  justify-content: center;
  align-items: center;
  height: 45px;
  backdrop-filter: blur(5px);
  z-index: 15;
  button {
    width: 15px;
  }
  .bodyCell {
    border-radius: 5px;
    border: solid 1px #ccc;
    background-color: #fff;
    overflow: hidden;

    line-height: 14px;
    div {
      font-size: 16px;
      font-family: "MyriadPro";
      line-height: 14px;
    }
  }
}

.table__tbody {
  &--row {
    &__cell {
      width: 100%;
      label {
        display: none !important;
      }
      padding: 5px 10px;
      &--content {
        display: flex;
        flex-direction: row;
        gap: 8px;

        white-space: nowrap;
        overflow: hidden;
        line-height: 16px;
        font-family: MyriadPro;
        align-items: center;
      }
    }
    .firstCell {
      padding: 15px 10px 14px 10px;
      d img {
        width: 11px;
        height: 12px;
      }
    }
    .deleteCell {
      padding: 16px 10px;
      img {
        width: 3px;
        height: 13px;
      }
    }
    .bodyCell {
      height: 35px;
      display: flex;
      flex-direction: row;
      border-radius: 5px;
      border: solid 1px #ccc;
      background-color: #fff;
      align-items: center;
      padding: 10px 10px 9px 15px;
      line-height: 16px;
      position: relative;
      .rightSide {
        position: absolute;
        right: 0;
        top: 0;
        width: 21px;
        background: #f6f5f3;
        height: 33px;
        display: flex;
        justify-content: center;
        align-items: center;

        svg {
          transform: rotate(90deg);
          width: 5px;
          height: 3px;
        }
      }
    }
  }
}

@media screen and (max-width: 767px) {
  .table {
    &__colgroup {
      display: none;
    }
    thead {
      .dragColumn {
        display: none;
      }
      .addRow {
        display: flex;
        flex-direction: column;
      }
    }
    tbody {
      background: #fbfcfd;
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 5px;
      overflow: scroll;
      border-radius: 10px;

      tr {
        font-family: MyriadPro;
        display: flex;
        flex-direction: column;
        gap: 15px;
        background: #fff;
        flex-wrap: wrap;
        overflow: unset;
        white-space: normal;
        padding: 15px 15px 25px 15px;
        box-shadow: 0 5px 20px 0 rgba(0, 0, 0, 0.07);
        border: solid 1px #eeeff1;
        border-radius: 10px;
        label {
          display: flex;
          font-size: 10px;
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          line-height: normal;
          letter-spacing: normal;
          color: #8f8f8f;
        }
        td {
          display: flex;
          flex-direction: column;
          gap: 6px;
          height: unset;
        }
      }
    }
    .bodyCells {
      border: 1px solid #eeeff1;

      border-radius: 10px;
      line-height: 12px;
    }
    .smallPopup {
      max-width: 179px !important;
    }
    .first_cell div {
      padding: 0;
    }
    .bodyCell__number {
      height: 35px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      padding: 10px 15px;
      width: 100%;
    }
  }
}
</style>
