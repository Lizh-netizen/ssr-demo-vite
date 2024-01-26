<template>
  <div class="layout">
    <div class="top box">
      <div class="top_left">
        <div class="top_left_header">
          <img src="../../assets/layout/issuesIcon.svg" />
          <div>问题列表</div>
        </div>
        <div class="top_left_content">
          <draggable :list="questionData" @update="(val) => updateList(val, 0)"></draggable>
        </div>
      </div>
      <div class="top_right">
        <div class="top_right_header">
          <div>暂观</div>
          <draggable :list="issuesList[1]" @update="(val) => updateList(val, 1)"></draggable>
        </div>
        <div class="top_right_content">
          <img
            src="../../assets/layout/emptyIssues.png"
            :style="{ width: '204px' }"
            v-if="issuesList[1].length == 0"
          />
        </div>
      </div>
    </div>
    <div class="body">
      <div class="content box left">
        <div class="content_left_header">
          <div>目标</div>
          <draggable :list="issuesList1"></draggable>
        </div>
      </div>
      <div class="content plan box" @click="handlePlan" :class="{ planClicked: planClick == true }">
        <div>方案</div>
        <div class="cardGroup plan">
          <div class="card">
            <div class="time">3个月</div>
            <draggable :list="issuesList1"></draggable>
          </div>
          <img src="../../assets/layout/arrowRight.svg" />
          <div class="card">
            <div class="time">3个月</div>
            <draggable :list="issuesList1"></draggable>
          </div>
          <img src="../../assets/layout/arrowRight.svg" />
          <div class="card">
            <div class="time">3个月</div>
            <draggable :list="issuesList1"></draggable>
          </div>
        </div>
        <div class="cardGroup tool" v-if="planClick">
          <div class="card">
            <div class="time">工具</div>
            <draggable :list="issuesList1"></draggable>
          </div>
          <img src="../../assets/layout/arrowRight.svg" />
          <div class="card">
            <div class="time">工具</div>
            <draggable :list="issuesList1"></draggable>
          </div>
          <img src="../../assets/layout/arrowRight.svg" />
          <div class="card">
            <div class="time">工具</div>
            <draggable :list="issuesList1"></draggable>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { Get } from '../../utils/request'
import img from '@/assets/svg/addPic.svg'
import draggable from '../../components/layout/draggable.vue'
const issuesList1 = ref([
  { name: 'name1', id: 1 },
  { name: 'name2', id: 2 },
  { name: 'name3', id: 3 },
  { name: 'name4', id: 4 },
  { name: 'name5', id: 5 }
])
const issuesList = ref([
  [
    { name: 'name1', id: 1 },
    { name: 'name2', id: 2 },
    { name: 'name3', id: 3 },
    { name: 'name4', id: 4 },
    { name: 'name5', id: 5 }
  ],
  []
])
const issuesList2 = ref([])
const questionData = ref()
async function getOrthQuestionList() {
  const result = await Get(`/prod-api/business/orthClass/issuesList?apmtId=${appId}&serious=1`)

  questionData.value = result.data
}
console.log(questionData.value)

getOrthQuestionList()
const handleDragEnd = (val) => {
  console.log(issuesList2.value)
}
const updateList = (val, num) => {
  issuesList.value[num] = val
  console.log(num)
  console.log(issuesList.value)
}
const planClick = ref(false)
const handlePlan = () => {
  planClick.value = !planClick.value
}
const goalList = ref([
  { name: 'name1', id: 1 },
  { name: 'name2', id: 2 }
])
</script>

<style lang="scss" scoped>
.layout {
  padding: 20px;
  display: flex;
  flex-direction: column;
  .top {
    border-radius: 16px;

    opacity: 1;
    display: flex;
    background: #f2f3f5;
    justify-content: space-between;
    box-sizing: border-box;
    /* 线条/深色 */
    border: 1px solid #c9cdd4;
    padding: 12px;
    &_left {
      padding: 4px;
      flex: 1;
      &_header {
        display: flex;
        align-items: center;

        img {
          margin-right: 15px;
        }
      }
      &_content {
        margin-top: 18px;
      }
    }
    &_right {
      width: 600px;
      padding: 16px;
      border-radius: 8px;
      opacity: 1;

      /* 填充/浅色 */
      background: #f7f8fa;

      box-sizing: border-box;
      /* 线条/深色 */
      border: 1px dashed #c9cdd4;
      &_content {
        margin-top: 18px;
      }
    }
  }
}
.handle {
  float: left;
  padding-top: 8px;
  padding-bottom: 8px;
}
.body {
  display: flex;
  flex: 1;
  margin-top: 20px;
}
.box {
  padding: 16px;
  &.content {
    background: #f2f3f5;
    padding: 16px;

    border-radius: 16px;
    box-sizing: border-box;
    /* 线条/一般 */
    border: 1px solid #e5e6eb;
    &.left {
      width: 326px;
      margin-right: 20px;
    }
    .cardGroup {
      display: flex;
      align-items: center;
      .card {
        width: 294px;
        height: 304px;
        border-radius: 12px;
        background: #ffffff;
        .list-group-item {
          background: #ffffff;
        }
      }
    }
    &.plan {
      &.planClicked {
        background: #eaf0fc;
        border: 2px solid #2e6ce4;
      }
    }
  }
}
</style>
