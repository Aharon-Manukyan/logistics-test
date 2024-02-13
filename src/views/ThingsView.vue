<template>
  <div class="things">
    <div class="things__addRow">
      <button @click.stop="addColumnInTable">
        <img :src="plus" alt="plus" class="my-[2px]" />
        <span>Добавить строку</span>
      </button>
    </div>
    <section class="things__section">
      <div class="things__section--actions">
        <button>Сохранить изменения</button>
        <div ref="containerSetting" class="containerSetting">
          <div class="cursor-pointer">
            <img :src="settings" alt="settings" @click="toggleDropdown" />
          </div>
          <div v-if="isDropdownOpen" class="settings-list">
            <div>
              <ul v-if="!columnsSetting.value || columnsSetting.step === 0">
                <li @click.stop="() => setingsChangeSteps('view', 1)">
                  <span> Отображение столбцов </span>
                  <img :src="arrowRight" alt="arrowRight" />
                </li>
                <li @click.stop="() => setingsChangeSteps('sort', 1)">
                  <span> Порядок столбцов </span>
                  <img :src="arrowRight" alt="arrowRight" />
                </li>
              </ul>
              <div
                v-if="columnsSetting.step === 1 && columnsSetting.value === 'view'"
                class="checkbox"
                ref="checkbox"
              >
                <div
                  class="flex flex-row text-[14px] justify-content items-center cursor-pointer gap-[10px] pl-[9.6px] pr-[10px] py-[7px] hover:bg-[#eeeff1] rounded-[5px]"
                  @click.stop="setingsChangeSteps('', 0)"
                >
                  <img :src="arrowRight" alt="back" class="w-[5px] h-[16px] rotate-180" />
                  <span class="font-['MyriadPo']">Отображение столбцов</span>
                </div>
                <div
                  v-for="(item, index) in tableHeaders"
                  :key="index"
                  class="checkboxItem"
                >
                  <input
                    type="checkbox"
                    :checked="item.checked"
                    @click.stop
                    @change="handleChange(index)"
                  />
                  <span>{{ item.header }}</span>
                </div>
              </div>
              <template
                v-if="columnsSetting.step === 1 && columnsSetting.value === 'sort'"
              >
                <div>Порядок столбцов</div>
              </template>
            </div>
          </div>
        </div>
      </div>
      <div class="things__section--main overflow-auto pr-[15px]">
        <DragTable
          :tableData="availableTableData"
          :addCol="addCol"
          @deleteRow="deleteRow"
          @addData="addData"
        ></DragTable>
      </div>
      <div class="things__section--summary">
        <SummaryBoard :summaryData="computedAllData"></SummaryBoard>
      </div>
    </section>
  </div>
</template>
<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import plus from "@/assets/plus.svg";
import settings from "@/assets/settings.svg";
import arrowRight from "@/assets/arrow-right.svg";
import DragTable from "@/components/DragTable.vue";
import SummaryBoard from "@/components/SummaryBoard.vue";
const isDropdownOpen = ref(false);
const columnsSetting = ref({
  value: "",
  step: null,
});
const checkbox = ref();
const containerSetting = ref(null);
const toggleDropdown = () => {
  isDropdownOpen.value = true;
  columnsSetting.value.step = 0;
};
const availableTableData = ref([]);
const tableHeaders = ref([]);
const handleClickOutside = (event) => {
  const modal = document.querySelector(".containerSetting");
  if (modal && !modal.contains(event.target)) {
    isDropdownOpen.value = false;
    columnsSetting.value.value = "";
    columnsSetting.value.step = null;
  }
};

const handleChange = (index) => {
  /* call changeAvailableColumns()  */
  tableHeaders.value[index]["checked"] = !tableHeaders.value[index]["checked"];
  let currentFieldName = tableHeaders.value[index]["header"];

  availableTableData.value.forEach((row, index) => {
    if (currentFieldName in row) {
      delete row[currentFieldName];
    } else {
      row[currentFieldName] = tableData.value[index][currentFieldName];
    }
  });
};

const setingsChangeSteps = (type, step) => {
  columnsSetting.value.value = type;
  columnsSetting.value.step = step;
};

const addData = (data) => {
  tableData.value.push(data);
  addCol.value = false;
  availableTableData.value.push(data);
  /* call addRow(data) function
   */
};

const deleteRow = (index) => {
  let start = tableData.value.slice(0, index);
  let end = tableData.value.slice(index + 1);
  let final = [...start, ...end];
  tableData.value = final;
  availableTableData.value = [
    ...availableTableData.value.slice(0, index),
    ...availableTableData.value.slice(index + 1),
  ];
  /* call deleteRow(index) function
   */
};

// const tableData = ref([
//   {
//     Действие: "удаление",
//     "Наименование единицы": "Мраморный щебень фр. 2-5 мм, 25кг",
//     Цена: 1231,
//     Количество: 7,
//     "Вес, кг": 25,
//     Итого: 8617,
//   },
//   {
//     Действие: "удаление",
//     "Наименование единицы": "Мраморный щебень фр. 2-5 мм, 1т",
//     Цена: 7000,
//     Количество: 8,
//     "Вес, кг": 1000,
//     Итого: 56000,
//   },
//   {
//     Действие: "удаление",
//     "Наименование единицы": "Мраморный щебень фр. 2-5 мм, 25кг (белый)",
//     Цена: 1500,
//     Количество: 6,
//     "Вес, кг": 25,
//     Итого: 9000,
//   },
// ]);

const tableData = ref([
  {
    ID: 1231,
    Действие: "удаление",
    "Наименование единицы": "Мраморный щебень фр. 2-5 мм, 25кг",
    Цена: 1231,
    Количество: 7,
    "Название товар.": "",
    "Дата создания": "",
    "Дата изменения": "",
    "Название [сист.]": "127048",
    "Статус точки [прог.]": "Успешно",
    "Вес, кг": 72,
    Состав: "Мрамор природный галтованный фр. 20-40 мм, 25кг: 3 шт.",
    "Тип ТК": 2301,
    "Дата доставки [прог.]": "",
    "Ответственный [прог.]": "Илья",
    "Тест поле": "",
    Адрес: "коттеджный посёлок Романово Лайф 2, 253",
    Телефон: "+7 903 513-45-45",
    "Требования к машине [лог.]": "Манипулятор",
    "Заложено на доставку [лог.]": "",
    "Склад отгрузки": "",
    Примечание: "Доставка 15.04.2024",
  },
  {
    ID: 1234,
    Действие: "удаление",
    "Наименование единицы": "Мраморный щебень фр. 2-5 мм, 25кг",
    Цена: 1231,
    Количество: 7,
    "Название товар.": "",
    "Дата создания": "",
    "Дата изменения": "",
    "Название [сист.]": "127048",
    "Статус точки [прог.]": "Успешно",
    "Вес, кг": 72,
    Состав: "Мрамор природный галтованный фр. 20-40 мм, 25кг: 3 шт.",
    "Тип ТК": 2301,
    "Дата доставки [прог.]": "",
    "Ответственный [прог.]": "Илья",
    "Тест поле": "",
    Адрес: "коттеджный посёлок Романово Лайф 2, 253",
    Телефон: "+7 903 513-45-45",
    "Требования к машине [лог.]": "Манипулятор",
    "Заложено на доставку [лог.]": "",
    "Склад отгрузки": "",
    Примечание: "Доставка 15.04.2024",
  },
  {
    ID: 1244,
    Действие: "удаление",
    "Наименование единицы": "Мраморный щебень фр. 2-5 мм, 25кг",
    Цена: 1231,
    Количество: 7,
    "Название товар.": "",
    "Дата создания": "",
    "Дата изменения": "",
    "Название [сист.]": "127048",
    "Статус точки [прог.]": "Успешно",
    "Вес, кг": 72,
    Состав: "Мрамор природный галтованный фр. 20-40 мм, 25кг: 3 шт.",
    "Тип ТК": 2301,
    "Дата доставки [прог.]": "",
    "Ответственный [прог.]": "Илья",
    "Тест поле": "",
    Адрес: "коттеджный посёлок Романово Лайф 2, 253",
    Телефон: "+7 903 513-45-45",
    "Требования к машине [лог.]": "Манипулятор",
    "Заложено на доставку [лог.]": "",
    "Склад отгрузки": "",
    Примечание: "Доставка 15.04.2024",
  },
  {
    ID: 1255,
    Действие: "удаление",
    "Наименование единицы": "Мраморный щебень фр. 2-5 мм, 25кг",
    Цена: 1231,
    Количество: 7,
    "Название товар.": "",
    "Дата создания": "",
    "Дата изменения": "",
    "Название [сист.]": "127048",
    "Статус точки [прог.]": "Успешно",
    "Вес, кг": 72,
    Состав: "Мрамор природный галтованный фр. 20-40 мм, 25кг: 3 шт.",
    "Тип ТК": "2301",
    "Дата доставки [прог.]": "",
    "Ответственный [прог.]": "Илья",
    "Тест поле": "",
    Адрес: "коттеджный посёлок Романово Лайф 2, 253",
    Телефон: "+7 903 513-45-45",
    "Требования к машине [лог.]": "Манипулятор",
    "Заложено на доставку [лог.]": "",
    "Склад отгрузки": "",
    Примечание: "Доставка 15.04.2024",
  },
  {
    ID: 1266,
    Действие: "удаление",
    "Наименование единицы": "Мраморный щебень фр. 2-5 мм, 25кг",
    Цена: 1231,
    Количество: 7,
    "Название товар.": "",
    "Дата создания": "",
    "Дата изменения": "",
    "Название [сист.]": "127048",
    "Статус точки [прог.]": "Успешно",
    "Вес, кг": 72,
    Состав: "Мрамор природный галтованный фр. 20-40 мм, 25кг: 3 шт.",
    "Тип ТК": 2301,
    "Дата доставки [прог.]": "",
    "Ответственный [прог.]": "Илья",
    "Тест поле": "",
    Адрес: "коттеджный посёлок Романово Лайф 2, 253",
    Телефон: "+7 903 513-45-45",
    "Требования к машине [лог.]": "Манипулятор",
    "Заложено на доставку [лог.]": "",
    "Склад отгрузки": "",
    Примечание: "Доставка 15.04.2024",
  },
]);

const deepClone = (obj) => {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  const cloned = Array.isArray(obj) ? [] : {};

  for (let key in obj) {
    if (typeof obj[key] === "object" && obj[key] !== null) {
      cloned[key] = deepClone(obj[key]);
    } else {
      cloned[key] = obj[key];
    }
  }

  return cloned;
};
/* final */
const addCol = ref(false);
const addColumnInTable = () => {
  addCol.value = true;
};
onMounted(() => {
  // call getTableData() function
  document.addEventListener("click", handleClickOutside);
  if (tableData.value?.length) {
    Object.keys(tableData.value[0]).forEach((element, index) => {
      tableHeaders.value.push({
        header: element,
        checked: true,
      });
      availableTableData.value = deepClone(tableData.value);
    });
  }
  onUnmounted(() => {
    document.removeEventListener("click", handleClickOutside);
  });

  //   async function getTableData() {
  //   loading = true;
  //   try {
  //     const response = await fetch('url/getTableData');
  //     if (!response.ok) {
  //       throw new Error('Network response was not ok');
  //     }
  //     const tableData.value = await response.json();
  //   } catch (error) {
  //      errorMessage = error;
  //   } finally {
  //     loading = false;
  //   }
  // }
  /*
    function addRow (data) {
      fetch('url', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify(data) 
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error('Network response was not ok');
          }
          return res.json();
        })
        .then((respData) => {
          console.log('Success:', respData);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
    function deleteRow(index){
      fetch('url',{
          method:"DELETE",
          headers:{ 'Content-Type': 'application/json'},
          body:index
        }) .then((res) => {
          if (!res.ok) {
            throw new Error('Network response was not ok');
          }
          return res.json();
        })
        .then((respData) => {
          console.log('Success:', respData);
        })
        .catch((error) => {
          console.error('Error:', error);
        });

    }
    
  */
});
// ------------------- //

const sumPrice = computed(() => {
  return tableData.value.reduce((total, currentItem) => {
    return total + parseFloat(currentItem["Цена"]) * currentItem["Количество"];
  }, 0);
});

const sumCount = computed(() => {
  return tableData.value.reduce((total, currentItem) => {
    return total + parseFloat(currentItem["Количество"]);
  }, 0);
});
const sumWeight = computed(() => {
  return tableData.value.reduce((total, currentItem) => {
    return total + currentItem["Вес, кг"] * currentItem["Количество"];
  }, 0);
});
const computedAllData = ref({
  sumPrice,
  sumCount,
  sumWeight,
});
</script>
<style lang="scss" scoped>
.things {
  display: flex;
  gap: 25px;
  flex-direction: column;
  width: 100%;
  background-color: #fff;
  &__addRow {
    display: flex;
    flex-direction: column;
    gap: 25px;
    padding: 20px 25px;
    height: 75px;
    border-radius: 10px;
    box-shadow: 0 5px 20px 0 rgba(0, 0, 0, 0.07);
    border: solid 1px var(--pale-grey);
    background-color: #fff;
    button {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      gap: 7px;
      width: 146px;
      height: 35px;
      padding: 10px 15px 10px 10px;
      border-radius: 5px;
      background-color: #2f8cff;
    }

    button span {
      width: 103px;
      height: 15px;
      font-family: MyriadPro;
      font-size: 14px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      color: #fff;
    }
  }

  &__section {
    width: 100%;
    padding: 9px 1px 25px;
    border-radius: 10px;
    box-shadow: 0 5px 20px 0 rgba(0, 0, 0, 0.07);
    border: solid 1px var(--pale-grey);
    display: flex;
    flex-direction: column;
    gap: 8px;
    &--actions {
      position: relative;
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      padding-right: 15px;
      gap: 15px;
      align-items: center;
      button {
        font-family: MyriadPro;
        font-size: 12px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        text-align: right;
        color: #a6b7d4;
        cursor: pointer;
      }
    }
    &--summary {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      padding: 15px;
    }
  }
}

.settings-list {
  z-index: 999;
  border-radius: 5px;
  background-color: #fff;
  width: 179px;
  position: absolute;
  top: 20px;
  right: 15px;
  box-shadow: 0 0 3px 0 #000, inset 0 1px 2px 0 rgba(255, 255, 255, 0.5);
  ul {
    width: 100%;
    border-radius: 5px;
    li {
      cursor: pointer;
      display: flex;
      text-align: left !important;
      justify-content: space-between;
      flex-direction: row;
      padding: 7px 10.7px 7px 9.6px;
      font-family: MyriadPro;
      font-size: 14px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      color: #161616 !important;
      border-radius: 5px;
      &:hover {
        background: #eef3f8;
      }
    }
  }
}
.checkbox {
  height: fit-content;
  max-height: 400px;
  overflow: scroll;
}
.checkboxItem {
  padding: 7px 10.7px 7px 9.6px;
  font-size: 14px;
  font-family: MyriadPro;
  display: flex;
  flex-direction: row;
  gap: 5px;
}

@media screen and (max-width: 767px) {
  .things {
    &__section {
      padding: 1px 1px 25px;
    }
    &__section--actions {
      display: none;
    }
    &__section--main {
      padding-right: 0px;
    }
  }
}
</style>
