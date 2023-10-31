<template>
  <div class="header" :style="{ 'background-color': backgroundColor }">
    <div class="line"></div>
    <div class="text">{{ text }}</div>
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
  width: 700px;
  height: 47px;
  display: flex;
  align-items: center;
  /* 主色-5% */
  box-sizing: border-box;
  margin-bottom: 40px;
  .line {
    width: 7px;
    height: 28px;
    border-radius: 6px;
    opacity: 1;
    background: #2e6ce4;
  }
  .text {
    font-size: 28px;
    font-weight: bold;
    line-height: normal;
    letter-spacing: 0px;
    margin-left: 8px;
    color: #2e6ce4;
  }
}
</style>
