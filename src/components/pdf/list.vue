<template>
  <div class="list1">
    <div
      class="list__item"
      v-for="a in list"
      :key="a.id"
      :data-serious="a.serious"
      :class="{ 'mb-[0px]': noMB == true, 'mb-[16px]': noMB != true }"
    >
      <div class="list__item__desc">
        {{ a.title_name }}
        <span v-if="a.option_names">: {{ a.option_names }}</span
        ><span v-if="a.active == '0'">(暂不干预)</span>
        <img
          class="seriousIcon"
          src="../../assets/svg/serious.svg"
          v-show="a.serious == '1' && moduleName !== '问题列表'"
          :style="{
            'margin-left': '8px'
          }"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
defineProps(['list', 'moduleName', 'noMB'])
</script>

<style lang="scss" scoped>
.list1 {
  display: flex;
  flex-wrap: wrap;
  .list__item {
    width: 50%;
    display: flex;
    // align-items: center;
    &:before {
      display: inline-block;
      content: '';
      min-width: 8px;
      height: 8px;
      background: #404682;
      margin-right: 8px;
      border-radius: 50%;
      position: relative;
      top: 4px;
    }
    &__desc {
      margin-right: 4px;
      // display: flex;
      align-items: center;
    }
    .seriousIcon {
      position: relative;
      top: 1px;
      // display: block;
      width: 12px;
      height: 12px;
    }
  }
}
</style>
