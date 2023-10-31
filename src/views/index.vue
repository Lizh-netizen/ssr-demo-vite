<template>
  <div class="treated-page">
    <div class="tab-list">
      <template v-for="(data, index) in dataList" :key="data.label">
        <task-card
          v-bind="data"
          :tabIndex="index"
          :currentIndex="currentIndex"
          @changeTabIndex="changeTabIndex"
        ></task-card>
      </template>
    </div>
    <div class="treated-container">
      <query :tabindex="currentIndex" @handleSearch="handleSearch"></query>
      <table :rows="rows"></table>
    </div>
  </div>
</template>
<script setup>
import { ref, watchEffect } from 'vue'
import taskCard from '../components/task-card'
import query from '../components/query'
const currentIndex = ref(0)
const dataList = [
  {
    label: '面型评估',
    amount: 50,
    visitedDesc: '已面评人数',
    totalDesc: '待面评人数',
    src: require('../assets/crm/icon-1.svg')
  },
  {
    label: '面型评估',
    amount: 50,
    visitedDesc: '已面评人数',
    totalDesc: '待面评人数',
    src: require('../assets/crm/icon-1.svg')
  },
  {
    label: '面型评估',
    amount: 50,
    visitedDesc: '已面评人数',
    totalDesc: '待面评人数',
    src: require('../assets/crm/icon-2.svg')
  },
  {
    label: '面型评估',
    amount: 50,
    visitedDesc: '已面评人数',
    totalDesc: '待面评人数',
    src: require('../assets/crm/icon-1.svg')
  }
]
const changeTabIndex = (val) => {
  currentIndex.value = val
}
const rows = ref([])
const getList0 = () => {}
const getList1 = () => {}
const getList2 = () => {}
const getList3 = () => {}
// 可以用策略模式来切换
const searchStrategies = {
  0: getList0,
  1: getList1,
  2: getList2,
  3: getList3
}
const handleSearch = () => {
  searchStrategies[currentIndex.value]()
}

watchEffect(currentIndex, (newVal) => {
  searchStrategies[newVal]()
})
</script>
<style lang="scss" scoped>
.treated-page {
  clear: both;
  overflow: hidden;
  overflow-y: auto;
  background-color: #f6f7ff;
  height: 100%;

  .tab-list {
    display: flex;
    justify-content: space-between;
    padding: 12px;
  }

  .treated-container {
    border-radius: 12px;
    background-color: #fff;
    padding: 16px 16px 4px;
    margin: 0 12px 12px;
  }
}
</style>
