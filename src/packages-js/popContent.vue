<template>
  <div class="popover-content">
    <div v-for="(item, index) in data" :key="index" class="item flex">
      <div>{{ item.label }}</div>
      <div>{{ item.finished ? '已完成' : '未完成' }}</div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
const props = defineProps({
  data: Array
})

console.log(props)
</script>

<style scoped>
.popover-content {
  /* 样式 */
  padding: 16px;
  min-width: 308px;
}
.item {
  background: #f4f7fd;
  padding: 14px 40px;
}
.item:nth-child(even) {
  /* 样式 */
  background: #fff;
}
</style>
