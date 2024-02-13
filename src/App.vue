<template>
  <div class="app">
    <left-side-bar class="app__leftSidebar"></left-side-bar>
    <div class="app__main">
      <div class="app__main--content">
        <h1>Проведение ТО и мелкий ремонт</h1>
        <div class="flex justify-between text-center">
          <nav class="flex flex-row justify-start gap-[20px] text-center">
            <router-link to="/">Общее</router-link>
            <router-link to="/things">Товары</router-link>
            <router-link to="/expenses">Доп. расходы</router-link>
          </nav>
          <div class="mr-[15px] cursor-pointer setting">
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

<style lang="scss" scoped>
.app {
  display: flex;
  &__main {
    background: #fbfcfd;
    padding: 0 25px;
    width: calc(100% - 229px);
    &--content {
      margin: 25px 0 !important;
      display: flex;
      flex-direction: column;
      gap: 25px;
    }
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
}

@media screen and (max-width: 767px) {
  .app {
    &__main {
      width: 100%;
      padding: 0 10px;
    }
    &__leftSidebar,
    .setting {
      display: none;
    }
  }
}
</style>
