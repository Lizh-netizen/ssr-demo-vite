<template>
  <div class="list1">
    <div class="list__item" v-for="a in list" :key="a.id" :data-serious="a.serious">
      <div class="list__item__desc">
        <div style="overflow-wrap: anywhere">
          {{ a.title_name + (pano ? '' : ':') }} {{ a.option_names }}
        </div>
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
defineProps(['list', 'moduleName', 'pano'])
</script>

<style lang="scss" scoped>
.list1 {
  display: flex;
  flex-wrap: wrap;
  .list__item {
    margin-bottom: 10px;
    width: 50%;
    display: flex;
    align-items: center;
    &:before {
      display: inline-block;
      content: '';
      min-width: 6px;
      height: 6px;
      margin-right: 8px;
      border-radius: 50%;
      position: relative;

      border: 1.5px solid #e57e2b;
    }
    &__desc {
      margin-right: 4px;
      display: flex;
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
