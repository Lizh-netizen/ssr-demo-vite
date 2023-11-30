<template>
  <div class="header" :style="{ 'background-color': backgroundColor }">
    <div :style="{ display: 'flex','align-items': 'center' }">  
      <div class="line"></div>
      <div class="text">{{ text }}</div>
    </div>
    <slot></slot>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
defineProps({
  text: String,
  backgroundColor: String
})
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  width: 100%;
  height: 47px;
  display: flex;
  align-items: center;
  padding: 12px 20px;
  justify-content: space-between;
  /* 主色-5% */
  border-radius: 8px;
  box-sizing: border-box;
  .line {
    width: 4px;
    height: 14px;
    border-radius: 133px;
    opacity: 1;
    background: #2e6ce4;
  }
  .text {
    font-size: 16px;
    font-weight: 500;
    letter-spacing: 0em;
    margin-left: 4px;
    /* 文字/1级 */
    color: #1d2129;
  }
}
</style>
