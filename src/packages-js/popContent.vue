<template>
  <div class="popover-content">
    <div v-for="(item, index) in data" :key="index" class="item">
      <span>{{ item.label }}</span>
      <span>{{ item.finished ? '已完成' : '未完成' }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: Array
  }
}
</script>

<style scoped>
.popover-content {
  /* 样式 */
}

.item {
  /* 样式 */
}
</style>
