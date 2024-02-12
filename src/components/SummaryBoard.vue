<template>
  <div class="summaryBoard">
    <div class="summaryBoard__top">
      <div class="summaryBoard__top--row">
        <div>Сумма:</div>
        <div>{{ summaryData.sumPrice }} руб.</div>
      </div>
      <div class="summaryBoard__top--row">
        <div>Кол-во:</div>
        <div>{{ summaryData.sumCount }} шт.</div>
      </div>
      <div class="summaryBoard__top--row">
        <div>Общий вес:</div>
        <div>{{ summaryData.sumWeight }} кг</div>
      </div>
    </div>
    <div class="summaryBoard__bottom">
      <div>Общая сумма :</div>
      <div>{{ summaryData.sumPrice }} руб.</div>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  summaryData: {
    type: Object,
    required: true,
  },
});
</script>
<style lang="scss" scoped>
.summaryBoard {
  width: 304px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  &__top {
    width: 304px;
    height: 105px;
    padding: 15px;
    border-radius: 5px;
    border: solid 1px #eeeff1;
    background-color: #fbfcfd;
    &--row {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }
  }
  &__bottom {
    width: 304px;
    display: flex;
    padding: 15px;
    border-radius: 5px;
    border: solid 1px #eeeff1;
    background-color: #fbfcfd;
    justify-content: space-between;
  }
}
</style>
