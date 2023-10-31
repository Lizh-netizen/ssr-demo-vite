<template>
  <div class="task-card-item-content">
    <slot />
  </div>
</template>

<script setup>
/**
 * @name 展示的tab标识 和 显示的 title
 * @svgName svg图的名字，以svgIcon组件为准
 * @leftNum 左边数值的
 * @rightNum 右边的数值
 * @leftTest 左边的文字
 * @rightText 右边的文字
 * @background 背景色
 */
</script>

<style scoped lang="scss">
.task-card-item-content {
  background-color: $text;
}
</style>
