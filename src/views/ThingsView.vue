<template>
  <div class="things">
    <div class="add">
      <button class="flex flex-row justify-center text-center align-middle gap-[7px]">
        <img :src="plus" alt="plus" class="my-[2px]" />
        <span>Добавить строку</span>
      </button>
    </div>
    <section class="things__table flex flex-col gap-[25px]">
      <div class="things__table--save">
        <button>Сохранить изменения</button>
        <div ref="containerSetting" @click="handleClickOutside" class="cursor-pointer">
          <img :src="settings" alt="settings" :onclick="toggleDropdown" />
        </div>
        <div v-if="isDropdownOpen" class="settings-list" ref="dropdown">
          <ul v-if="!columnsSetting">
            <li @click="() => selectedOption('view')">
              <span> Отображение столбцов </span>
              <img :src="arrowRight" alt="arrowRight" />
            </li>
            <li @click="() => selectedOption('sort')">
              <span> Порядок столбцов </span>
              <img :src="arrowRight" alt="arrowRight" />
            </li>
          </ul>
          <ul v-else>
            <li>
              <input type="checkbox" value="Title" />
            </li>
          </ul>
        </div>
      </div>
      <div class="things__table--dragzone h-full overflow-auto pr-[15px]">
        <!-- <Table_DND :tableData="tableData"></Table_DND> -->
        <DragTable :tableData="tableData"></DragTable>
      </div>
    </section>
  </div>
</template>
<script setup>
import { onMounted, reactive, ref, watchEffect } from "vue";
import plus from "@/assets/plus.svg";
import settings from "@/assets/settings.svg";
import arrowRight from "@/assets/arrow-right.svg";
import Table_DND from "@/components/Table_DND.vue";
import DragTable from "@/components/DragTable.vue";
const isDropdownOpen = ref(false);
const columnsSetting = ref(null);
const dropdown = ref(null);
const containerSetting = ref(null);
const toggleDropdown = () => {
  isDropdownOpen.value = true;
};
const handleClickOutside = (event) => {
  if (containerSetting.value && !containerSetting.value.contains(event.target)) {
    isDropdownOpen.value = false;
  }
};
const selectedOption = (type) => (columnsSetting.value = type);
watchEffect(() => {
  if (isDropdownOpen.value) {
    document.addEventListener("click", handleClickOutside);
  } else {
    document.removeEventListener("click", handleClickOutside);
  }
});
onMounted(() => {
  /*
    getTableDate();
    function getTableData
    loading = true
    fetch('url/getTableData').then((response) => {
        return response.json()
    }).then((data) => {
        // tableData = data
    }).catch((err) => {
        //errorMessage = err
    }).finally(() => {
        loading = false
    })

    */
});
// ------------------- //
const tableData = reactive([
  {
    ID: 1231,
    Действие: "удаление",
    "Наименование едeницы": "Мраморный щебень фр. 2-5 мм, 25кг",
    Цена: "1231",
    Количество: 7,
    "Название товар.": "",
    "Дата создания": "",
    "Дата изменения": "",
    "Название [сист.]": "127048",
    "Статус точки [прог.]": "Успешно",
    "Вес, кг": "72",
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
    ID: 1234,
    Действие: "удаление",
    "Наименование едeницы": "Мраморный щебень фр. 2-5 мм, 25кг",
    Цена: "1231",
    Количество: 7,
    "Название товар.": "",
    "Дата создания": "",
    "Дата изменения": "",
    "Название [сист.]": "127048",
    "Статус точки [прог.]": "Успешно",
    "Вес, кг": "72",
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
    ID: 1244,
    Действие: "удаление",
    "Наименование едeницы": "Мраморный щебень фр. 2-5 мм, 25кг",
    Цена: "1231",
    Количество: 7,
    "Название товар.": "",
    "Дата создания": "",
    "Дата изменения": "",
    "Название [сист.]": "127048",
    "Статус точки [прог.]": "Успешно",
    "Вес, кг": "72",
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
    ID: 1255,
    Действие: "удаление",
    "Наименование едeницы": "Мраморный щебень фр. 2-5 мм, 25кг",
    Цена: "1231",
    Количество: 7,
    "Название товар.": "",
    "Дата создания": "",
    "Дата изменения": "",
    "Название [сист.]": "127048",
    "Статус точки [прог.]": "Успешно",
    "Вес, кг": "72",
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
    "Наименование едeницы": "Мраморный щебень фр. 2-5 мм, 25кг",
    Цена: "1231",
    Количество: 7,
    "Название товар.": "",
    "Дата создания": "",
    "Дата изменения": "",
    "Название [сист.]": "127048",
    "Статус точки [прог.]": "Успешно",
    "Вес, кг": "72",
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
]);
</script>
<style lang="scss" scoped>
.things {
  display: flex;
  gap: 25px;
  flex-direction: column;
  width: 100%;
  &__table {
    width: 100%;
    height: 453px;
    padding: 9px 1px 25px;
    border-radius: 10px;
    box-shadow: 0 5px 20px 0 rgba(0, 0, 0, 0.07);
    border: solid 1px var(--pale-grey);
    background-color: #fff;
    &--save {
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
  }
}
.add {
  padding: 20px 25px;
  height: 75px;
  border-radius: 10px;
  box-shadow: 0 5px 20px 0 rgba(0, 0, 0, 0.07);
  border: solid 1px var(--pale-grey);
  background-color: #fff;
  button {
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

.settings-list {
  border-radius: 5px;
  background-color: #fff;
  width: 179px;
  position: absolute;
  top: 20px;
  right: 15px;
  ul {
    box-shadow: 0 0 3px 0 #000, inset 0 1px 2px 0 rgba(255, 255, 255, 0.5);
    width: 100%;
    // padding: 0 10.7px 0 9.6px;
    border-radius: 5px;
    // background-color: #eef3f8;
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
</style>
