<template>
  <div class="content">
    <div class="googleInput" @click.stop="handleClick">
      <input @input="handleInput" v-model="input" @blur="handleBlur" />
      <span
        class="placeholder"
        v-if="props.placeholder"
        :class="{
          clicked: props.hasVal
        }"
        >{{ props.placeholder }}</span
      >
      <div class="suffix">{{ titleName === 'SPEE曲线' ? 'mm' : '%' }}</div>
    </div>
    <div class="showRange">
      <div class="range left" :class="{ active: props.conclusion === props.left }">
        <div class="text">{{ props.left }}</div>
      </div>
      <div class="range middle" :class="{ active: props.conclusion === props.middle }">
        <div class="text">{{ props.middle }}</div>
      </div>
      <div class="range right" :class="{ active: props.conclusion === props.right }">
        <div class="text">{{ props.right }}</div>
      </div>
      <div class="refNum firstRefNum" :class="{ distanceNum: String(props.min).endsWith('m') }">
        {{ props.min }}
      </div>
      <div class="refNum secondRefNum" :class="{ distanceNum: String(props.max).endsWith('m') }">
        {{ props.max }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, watch } from 'vue'

const props = defineProps({
  titleName: String,
  min: String,
  max: String,
  placeholder: String,
  left: String,
  middle: String,
  right: String,
  conclusion: String,
  value: Number,
  cephalometricsContent: String,
  hasVal: Boolean
})
// 初始化进来有值的时候可以用一个字段hasVal来判断
// 输入的时候进行比较

const input = ref(props.cephalometricsContent)

const emit = defineEmits(['change'])
const handleBlur = (e) => {
  if (!input.value) e.target.parentElement.children[1].classList?.remove('clicked')
}
const handleInput = (e) => {}

watch(input, (newVal) => {
  emit('change', newVal, props.value)
})

let focusElement = ref(null)
const handleClick = (e) => {
  if (Array.from(e.target.parentElement.classList).includes('googleInput')) {
    e.target.parentElement.children[1].classList?.add('clicked')
    e.target.parentElement.children[0].focus()
    focusElement.value = e.target.parentElement.children[1]
  }
}
</script>

<style lang="scss" scoped>
.content {
  display: flex;
  .googleInput {
    position: relative;
    // width: 100px;
    height: 32px;
    border: 1px solid #dcdfe6;
    display: flex;
    align-items: center;
    border-radius: 8px;
    z-index: 10;
    input {
      width: 98px;
      height: 30px;
      border: none;
      outline: none;
      border-radius: 8px;
      padding-left: 8px;
    }
    .placeholder {
      position: absolute;
      left: 6px;
      color: #86909c;
      &.clicked {
        top: -8px;
        font-size: 10px;
        width: 38px;
        height: 14px;
        background: #ffffff;
        z-index: 5;
        text-align: center;
      }
    }
    .suffix {
      width: 27px;
      height: 32px;
      background: #f2f3f5;
      border-radius: 0px 7px 7px 0px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #3d3d3d;
      font-size: 12px;
    }
  }
  .showRange {
    position: relative;
    display: flex;
    align-items: center;
    margin-left: 14px;
    margin-right: 29px;
    .range {
      width: 60px;
      height: 20px;
      border-radius: 2px;
      opacity: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      color: #e5e6eb;
      /* 填充/深底悬浮 */
      background: #e5e6eb;
      margin-right: 2px;
      .text {
        font-size: 12px;
        // transform: scale(0.5);
        // transform-origin: center;
      }
      &.active {
        color: #ffffff;
        &.left {
          background: #ff7d00;
        }
        &.middle {
          background: #00b42a;
        }
        &.right {
          background: #f53f3f;
        }
      }
    }
    .refNum {
      position: absolute;
      font-weight: normal;
      letter-spacing: 0em;
      font-size: 20px;
      transform: scale(0.5);
      transform-origin: center;
      /* 文字/3级 */
      color: #86909c;
      &.firstRefNum {
        left: 30px;
        top: -14px;
        &.distanceNum {
          left: 36px;
          top: -14px;
        }
      }
      &.secondRefNum {
        right: 30px;
        top: -14px;
        &.distanceNum {
          right: 36px;
          top: -14px;
        }
      }
    }
  }
  .reminder {
    font-size: 12px;
    font-weight: normal;
    letter-spacing: 0em;

    color: #ff0000;
  }
}
</style>
