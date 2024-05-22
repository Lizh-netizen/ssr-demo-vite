<template>
  <div class="selectContainer" id="selectContainer">
    <div class="container">
      <template v-for="(row, rowindex) in symptomList" :key="rowindex">
        <div
          class="symptomBox"
          :class="{
            itemAlignRight: rowindex === 2 || rowindex === 4 || rowindex === 0 || rowindex === 6,
            marginTop: rowindex == 4 || rowindex == 5,
            marginBottom: rowindex == 2 || rowindex == 3,
            marginRight: rowindex === 2 || rowindex === 4 || rowindex === 0 || rowindex === 6,
            marginLeft: rowindex === 1 || rowindex === 3 || rowindex === 5 || rowindex === 7
          }"
        >
          <div
            class="symptomItem"
            :class="{ selected: item.active === true }"
            :id="item.value"
            v-for="(item, index) in row"
            :key="index"
            @click="handleSelectTooth(item, option)"
          >
            {{ item.label }}
          </div>
        </div>
      </template>
    </div>
    <div class="left">右</div>
    <div class="right">左</div>
  </div>
</template>

<script setup>
import { GetSymptom } from '@/utils/tooth'
// import { defineProps, defineEmits } from 'vue';

import useSelectTooth from '@/effects/selectTooth.ts'
const symptomList = ref([])
const props = defineProps(['option', 'arrange'])
const emit = defineEmits(['toothClicked'])
symptomList.value = GetSymptom()
// 传过来的可能是option,也可能是title
const handleSelectTooth = (item, title) => {
  emit('toothClicked')
  useSelectTooth(item, title)
  if (props.arrange) {
    handleArrangeTooth(item, title)
  }
}
const handleArrangeTooth = (item, title) => {
  const hasNumber = /\d/.test(title.name)
  // 添加牙位信息
  if (item.active) {
    if (!hasNumber) {
      title.name = title.name + '(' + String(item.value) + ')'
    } else {
      title.name = title.name.substring(0, title.name.length - 1) + ';' + String(item.value) + ')'
    }
  }
  // 删除牙位信息
  else {
    title.name = title.name.replace(';' + String(item.value), '')
  }
}
</script>

<style lang="scss" scoped>
.selectContainer {
  .container {
    display: grid;
    grid-template-columns: auto auto;
    .symptomBox {
      display: flex;
      .symptomItem {
        width: 24px;
        height: 24px;
        /* border: solid 1px #ccc; */
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 2px 2px;
        cursor: pointer;
        border: 0.5px solid #e9e9eb;
        box-sizing: border-box;
        &.selected {
          background-color: #0081cc;
          border-color: #0081cc;
          color: #fff;
        }
      }
      &.marginTop {
        margin-top: 16px;
      }
      &.marginBottom {
        margin-bottom: 16px;
      }
      &.marginRight {
        margin-right: 12px;
      }
      &.marginLeft {
        margin-left: 12px;
      }
      &.itemAlignRight {
        justify-content: end;
      }
    }
  }
  &:after {
    content: '';
    position: absolute;
    width: 1px;
    height: 138px;
    left: 247px;
    top: 16px;
    background: #d8d8d8;
  }
  &:before {
    content: '';
    position: absolute;
    width: 465px;
    height: 1px;
    left: 20px;
    top: 82px;
    background: #d8d8d8;
  }
  .left {
    position: absolute;
    width: 26px;
    height: 20px;
    z-index: 6;
    left: 120px;
    background: #ffffff;
    top: 72px;
    text-align: center;
  }
  .right {
    position: absolute;
    width: 26px;
    height: 20px;
    z-index: 6;
    right: 120px;
    background: #ffffff;
    top: 72px;
    text-align: center;
  }
}
</style>
