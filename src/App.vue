<template>
  <div class="flex">
    <left-side-bar></left-side-bar>
    <div class="w-full bg-[#fbfcfd] px-[25px]">
      <div class="my-[25px] flex flex-col gap-[25px]">
        <h1>Проведение ТО и мелкий ремонт</h1>
        <div class="flex justify-between text-center">
          <nav class="flex flex-row justify-start gap-[25px] text-center">
            <router-link to="/">Общее</router-link>
            <router-link to="/things">Товары</router-link>
            <router-link to="/expenses">Доп. расходы</router-link>
          </nav>
          <div class="mr-[15px] cursor-pointer">
            <img :src="settings" alt="settings" />
          </div>
        </div>
      </div>
      <router-view />
    </div>
  </div>
</template>

<script setup>
import LeftSideBar from "@/components/LeftSideBar";
import settings from "@/assets/settings.svg";
</script>

<style lang="scss">
h1 {
  font-family: MyriadPro;
  font-size: 30px !important;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #000;
}
nav {
  a {
    font-family: MyriadPro;
    font-size: 16px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #1253a2;

    &.router-link-exact-active {
      color: #000;
    }
  }
}
</style>
