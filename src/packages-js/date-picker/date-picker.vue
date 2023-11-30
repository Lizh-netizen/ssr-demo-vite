<template>
  <div class="date-time">
    <el-button color="#F2F3F5" @click="preNextDate('today')">今天</el-button>
    <el-button color="#F2F3F5" :icon="CaretLeft" @click="preNextDate('pre')" />
    <el-button color="#F2F3F5" :icon="CaretRight" @click="preNextDate('next')" />
    <div class="dateDiv">
      {{ time }}
      {{ dayList[new Date(time).getDay()] }}
    </div>
    <ElDatePicker
      class="el-date-picker"
      v-model="time"
      value-format="YYYY-MM-DD"
      type="date"
      :clearable="false"
    />
  </div>
</template>

<script setup>
/**
 * @dataTime 事件回调，接收当前变化的事件
 */
import { CaretLeft, CaretRight } from '@element-plus/icons-vue'
import { ref, watchEffect } from 'vue'
import { ElDatePicker, ElButton } from 'element-plus'
import dayjs from 'dayjs'

const dayList = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']

// 当前时间
const time = ref(dayjs(new Date()).format('YYYY-MM-DD'))
// 前进/后退天数
const preNextDate = str => {
  const date = new Date(time.value)
  if (str === 'today') return (time.value = dayjs(new Date()).format('YYYY-MM-DD'))
  else if (str === 'pre') {
    // 上一天
    date.setDate(date.getDate() - 1)
  } else if (str === 'next') {
    // 下一天
    date.setDate(date.getDate() + 1)
  }
  time.value = dayjs(date).format('YYYY-MM-DD')
}

// 使用组件接收当前时间 YYYY-MM-DD
const emit = defineEmits()
// 监听时间变化
watchEffect(() => emit('dataTime', time.value))
</script>

<style scoped lang="scss">
.date-time {
  position: relative;
  display: flex;
  align-items: center;
  .el-button {
    margin: 2px;
    &:nth-child(1) {
      border-radius: 8px 0px 0px 8px;
    }
    &:nth-child(2) {
      border-radius: 0;
    }
    &:nth-child(3) {
      border-radius: 0px 8px 8px 0px;
    }
  }
  .dateDiv {
    width: 171px;
    height: 32px;
    font-weight: 600;
    text-align: center;
    line-height: 32px;
    font-size: 16px;
  }
  :deep .el-date-picker {
    position: absolute;
    left: 160px;
    width: 173px;
    height: 32px;
    opacity: 0;
    cursor: pointer;
  }
}
</style>
