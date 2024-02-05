<template>
  <div class="imageItem">
    <div class="img">
      <slot name="img"></slot>
      <div class="imageItem__caption">{{ imageCaption }}</div>
    </div>

    <div class="imageItem__content"><slot name="content"></slot></div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
defineProps({
  imageCaption: String,
  src: String
})
</script>

<style lang="scss" scoped>
.imageItem {
  position: relative;
  display: flex;
  // height: 308px;
  padding: 20px 0;
  padding-bottom: 36px;
  border-bottom: 1.4px dashed #e5e6eb;
  .img {
    width: 320px;
    // height: 240px;
    border-radius: 10px;
    position: relative;
    // border: 1px solid #e5e6eb;
    box-sizing: border-box;
    text-align: center;
  }
  &__content {
    padding-left: 48px;
  }
  &__caption {
    position: absolute;
    left: 50%;
    color: #4e5969;
    transform: translate(-50%, 0);
    margin-top: 10px;
  }
  &.sideImage {
    height: 604px;
    img {
      display: block;
      position: relative;
      &:first-child {
        margin-bottom: 52px;
      }
    }
    .imageItem__caption.pic2 {
      position: absolute;
      left: 125px;
      top: 560px;
    }
  }
  &.sideImage2 {
    img {
      &:first-child {
        margin-right: 48px;
      }
    }
    .imageItem__caption.pic2 {
      left: 493px;
    }
    .sideImages {
      display: flex;
    }
  }
  &__placeholder {
    width: 320px;
    height: 240px;
    border-radius: 10px;
    box-sizing: border-box;
    /* 线条/悬浮 */
    border: 1px dashed #c9cdd4;
    background: #f2f3f5;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
    img.addPic {
      width: 42px;
      height: 42px;
      margin-bottom: 0px !important;
    }
  }
}
</style>
