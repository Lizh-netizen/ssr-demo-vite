<template>
  <div id="app">
    <table class="table">
      <tr class="one-two">
        <!-- 第一象限 -->
        <td class="one">
          <span v-for="item in data.oneList" :key="item">{{ item }}</span>
        </td>
        <!-- 第二象限 -->
        <td class="two">
          <span v-for="item in data.threeList" :key="item">{{ item }}</span>
        </td>
      </tr>
      <tr class="three-four">
        <!-- 第四象限 -->
        <td class="four">
          <span v-for="item in data.twoList" :key="item">{{ item }}</span>
        </td>
        <!-- 第三象限 -->
        <td class="three">
          <span v-for="item in data.fourList" :key="item">{{ item }}</span>
        </td>
      </tr>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
/**
 * @toothList 牙齿列表 ['11', '21']
 */
const { toothList } = defineProps({
  toothList: {
    type: Array,
    default: []
  }
})

const data = ref({
  oneList: [],
  twoList: [],
  threeList: [],
  fourList: []
})
const list = ['A', 'B', 'C', 'D', 'E']
onMounted(() => {
  // 处理牙位数据
  toothList.forEach((item) => {
    if (item[0] === '1') {
      data.value.oneList.push(item[1])
    }
    if (item[0] === '2') {
      data.value.twoList.push(item[1])
    }
    if (item[0] === '3') {
      data.value.threeList.push(item[1])
    }
    if (item[0] === '4') {
      data.value.fourList.push(item[1])
    }
    if (item[0] === '5') {
      data.value.oneList.push(list[+item[1]])
    }
    if (item[0] === '6') {
      data.value.twoList.push(list[+item[1]])
    }
    if (item[0] === '7') {
      data.value.threeList.push(list[+item[1]])
    }
    if (item[0] === '8') {
      data.value.fourList.push(list[+item[1]])
    }
  })
})
</script>

<style scoped lang="scss">
#app {
  display: flex;
  flex-wrap: wrap;
  width: 122px;
  height: 50px;
  padding: 4px;
  font-size: 12px;
  .table {
    width: 100%;
    height: 100%;
  }
  .one-two {
    display: flex;
    height: 50%;
    width: 100%;
    border-bottom: 0.5px solid #d8d8d8;
    // 第一象限
    .one {
      padding: 0 2px 2px 0;
      height: 100%;
      flex: 1;
      border-right: 0.5px solid #d8d8d8;
      display: flex;
      flex-wrap: wrap;
      align-items: flex-end;
      flex-direction: row-reverse;
    }
    // 第二象限
    .two {
      padding: 0 0 2px 2px;
      height: 100%;
      border-left: 0.5px solid #d8d8d8;
      flex: 1;
      display: flex;
      align-items: end;
    }
  }
  .three-four {
    display: flex;
    height: 50%;
    width: 100%;
    border-top: 0.5px solid #d8d8d8;
    // 第三象限
    .three {
      padding: 2px 0 0 2px;
      height: 100%;
      flex: 1;
      border-left: 0.5px solid #d8d8d8;
    }
    // 第四象限
    .four {
      padding: 2px 2px 0 0;
      height: 100%;
      flex: 1;
      border-right: 0.5px solid #d8d8d8;
      display: flex;
      flex-wrap: wrap;
      flex-direction: row-reverse;
    }
  }
}
</style>
