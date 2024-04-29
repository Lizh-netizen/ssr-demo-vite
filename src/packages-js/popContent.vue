<template>
  <div class="popover-content">
    <div v-for="(item, index) in data" :key="index" class="item flex justify-between">
      <div>{{ item.label }}</div>
      <div>
        <img :src="complete" v-if="item.finished" /><img :src="incomplete" v-if="!item.finished" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import complete from '@/assets/svg/complete.svg'
import incomplete from '@/assets/svg/incomplete.svg'
const props = defineProps({
  data: Array
})
</script>

<style scoped>
.popover-content {
  /* 样式 */
  padding: 6px;
  overflow: auto;
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
