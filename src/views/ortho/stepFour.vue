<template>
  <div class="stepFour">
    <div class="layout">
      <div class="top box">
        <div class="top_left">
          <div class="top_left_header">
            <img src="../../assets/layout/issuesIcon.svg" />
            <div>问题列表</div>
          </div>
          <div class="top_left_content">
            <draggable :list="questionData" :question="true"></draggable>
          </div>
        </div>
        <!-- <div class="top_right">
          <div class="top_right_header">
            <div>暂观</div>
            <draggable></draggable>
          </div>
          <div class="top_right_content">
            <img src="../../assets/layout/emptyIssues.png" :style="{ width: '204px' }" />
          </div>
        </div> -->
      </div>
      <div class="body">
        <div class="body-left content">
          <div class="content_left_header">
            <div class="flex" :style="{ 'margin-bottom': ' 0px' }">
              <img src="../../assets/svg/goalCheck.svg" />目标
            </div>
            <draggable :unmutable="true" :list="goalList" :move="onMove"></draggable>
            <template v-if="planList.some((plan) => plan.checked)">
              <div class="flex" :style="{ 'margin-bottom': ' 0px', 'margin-top': '14px' }">
                <img src="../../assets/svg/tool.svg" />工具
              </div>
              <draggable :unmutable="true" :list="toolList"></draggable>
            </template>
          </div>
        </div>
        <div class="body-right">
          <div
            class="content plan"
            @click="handlePlan(plan)"
            :class="{ checkeded: plan.checked == true }"
            v-for="plan in planList"
            :key="plan.name"
          >
            <div class="flex">
              <template v-if="plan.checked == true">
                <img src="../../assets/svg/planCheck.svg" :style="{ 'margin-right': ' 8px' }" />
              </template>
              <template v-else>
                <img src="../../assets/svg/Rectangle.svg" :style="{ 'margin-right': ' 8px' }" />
              </template>
              {{ plan.name }}
              <div class="period">
                预计{{ plan.stageList[plan.stageList.length - 1].stageName }}
              </div>
              <a-select
                v-model="plan.difficultyLevel"
                placeholder="选择难度"
                @click.stop=""
                :class="{
                  high: plan.difficultyLevel == '难度高',
                  middle: plan.difficultyLevel == '难度中等',
                  low: plan.difficultyLevel == '难度低'
                }"
              >
                <a-option v-for="item in difficultyList" :key="item.label" :value="item.label">
                  {{ item.label }}
                </a-option>
              </a-select>
              <div class="tag" v-if="plan.stageList.some((item) => item.name == '拔牙')">拔牙</div>
            </div>
            <div class="flex">
              <div class="cardGroup" v-for="stage in plan.stageList" :key="stage.stageName">
                <template v-if="!plan.checked">
                  <div class="card">
                    <div class="time">{{ stage.stageName }}</div>
                    <draggable
                      :move="onMove"
                      :list="stage.targetIds"
                      @update="(val) => updateList(val, plan.name, stage.stageName, 'target')"
                      :showDeleteBtn="true"
                    ></draggable>
                  </div>
                  <img src="../../assets/layout/arrowRight.svg" />
                </template>
                <template v-else>
                  <div>
                    <div class="card">
                      <div class="time">{{ stage.stageName }}</div>
                      <draggable
                        :move="onMove"
                        :list="stage.targetIds"
                        @update="(val) => updateList(val, plan.name, stage.stageName, 'target')"
                        :showDeleteBtn="true"
                      ></draggable>
                    </div>
                    <div class="tool card">
                      <div class="tool_title">工具</div>
                      <draggable
                        :list="stage.toolIds"
                        @update="(val) => updateList(val, plan.name, stage.stageName, 'tool')"
                        :showDeleteBtn="true"
                      ></draggable>
                    </div>
                  </div>

                  <img src="../../assets/layout/arrowRight.svg" />
                </template>
              </div>

              <div @click.stop="handleAddStage(plan.name)">
                <div class="addStage" :style="{ height: plan.checked == true ? '620px' : '308px' }">
                  <img :style="{ 'margin-right': '12px' }" src="../../assets/svg/addStage.svg" />
                  <div>新增阶段</div>
                </div>
              </div>
            </div>
          </div>
          <div class="addPlan flex" @click.stop="handleAddPlan">
            <img :style="{ 'margin-right': '12px' }" src="../../assets/svg/addPlan.svg" />添加新方案
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Header from '@/components/list/header.vue'
import { ref, defineProps, defineExpose, onMounted, watch, nextTick } from 'vue'
import FormItem from '@/components/list/formItem.vue'
import { Get, Post } from '@/utils/request'
import { useRoute } from 'vue-router'
import useChangeOption from '@/effects/changeOption.js'
import useUpdateOption from '@/effects/updateOption.js'
import emptyRadio from '@/effects/emptyRadio.js'
import img from '@/assets/svg/addPic.svg'
import draggable from '../../components/layout/draggable.vue'
import { useStore } from 'vuex'
const store = useStore()
const clicked = ref(false)
const goalList = ref()
goalList.value = store.state.goalList
const toolList = ref()
toolList.value = store.state.toolList
const difficultyList = ref([{ label: '难度低' }, { label: '难度中等' }, { label: '难度高' }])
defineExpose({
  clicked
})
const props = defineProps({
  pdfId: String
})
// 获取问题列表数据
const route = useRoute()
const appId = route.params.appId
const questionData = ref([])
async function getOrthQuestionList() {
  const result = await Get(`/prod-api/business/orthClass/issuesList?apmtId=${appId}&serious=1`)
  questionData.value = result.data.map((item) => ({
    name: item.option_names,
    label: item.question_level_one
  }))
}
getOrthQuestionList()
// 新增阶段
const handleAddStage = (planName) => {
  store.commit('addStage', planName)
}
// 新增方案
const handleAddPlan = () => {
  store.commit('addPlan')
}
// 方案
const planList = ref([])
// 判断是否可以拖拽
const onMove = (e) => {
  console.log(e)
}

// 更改store中数据，在下一步的时候提交
const updateList = (val, planName, stageName, cardName) => {
  const found = planList.value.find((plan) => plan.name == planName)
  if (cardName == 'target') {
    found.stageList.find((item) => item.stageName == stageName).targetIds = val
  } else {
    found.stageList.find((item) => item.stageName == stageName).toolIds = val
  }
  store.commit('updatePlanList', planList.value)
}
const updateGoal = (val) => {
  val = store.state.goalList
}

onMounted(() => {
  planList.value = store.state.planList
})

const handlePlan = (plan) => {
  plan.checked = !plan.checked
}
</script>

<style lang="scss" scoped>
@import '../../style/mixins.scss';
img {
  margin-right: 16px;
}
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
        :deep .list-group {
          display: flex;
          .list-group-item {
            width: 294px;
          }
        }
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
  &-left {
    width: 326px;
    margin-right: 20px;
  }
  &-right {
    width: calc(100% - 326px);
    .plan {
      margin-bottom: 16px;
      :deep .list-group {
        height: 200px;
        width: 200px;
      }
      &.checkeded {
        background: #eaf0fc;
        border: 2px solid #2e6ce4;
      }
      .tag {
        margin-left: 16px;
        height: 28px;
        border-radius: 6px;
        opacity: 1;

        /* 自动布局 */
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        padding: 4px 8px;
        gap: 6px;

        /* 主色/10% */
        /* 样式描述：浅色背景/hover等 */
        background: #eaf0fc;

        box-sizing: border-box;
        /* 主色/100% */
        border: 1px solid #2e6ce4;
      }
      :deep .arco-select-view-single {
        width: auto;
        border: 1px solid #c9cdd4;
        border-radius: 6px;
        margin-left: 16px;
        &.high {
          background: #f76560;
          color: #ffffff;
        }
        &.middle {
          background: #ff9a2e;
          color: #ffffff;
        }
        &.low {
          background: #23c343;
          color: #ffffff;
        }
      }
      :deep .container {
        height: 220px;
      }
      .period {
        margin-left: 16px;
        height: 28px;
        border-radius: 6px;
        opacity: 1;

        /* 自动布局 */
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        padding: 4px 8px;
        gap: 6px;

        /* 填充/深底悬浮 */
        background: #e5e6eb;

        box-sizing: border-box;
        /* 线条/特殊 */
        border: 1px solid #86909c;
      }
    }
    .cardGroup {
      display: flex;
      align-items: center;
      .card {
        padding: 12px;
        width: 224px;
        // height: 304px;
        border-radius: 12px;
        background: #ffffff;
        .list-group-item {
          background: #ffffff;
        }
        .time {
          background: #eaf0fc;
          height: 40px;
          margin: 12px;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          padding-left: 12px;
          color: #2e6ce4;
          font-weight: bold;
          border-radius: 8px;
        }
      }
      .tool {
        margin-top: 8px;
        height: 308px;
        &_title {
          color: #1d2129;
          font-size: 16px;
          font-weight: bold;
        }
      }
    }
    .addStage {
      display: flex;
      align-items: center;
      border: 1px dashed #2e6ce4;
      background: rgba(255, 255, 255, 0.6);
      width: 200px;
      border-radius: 12px;
      justify-content: center;
      cursor: pointer;
      margin-bottom: 0;
    }
    .addPlan {
      border: 1px dashed #c9cdd4;
      height: 48px;
      display: flex;
      border-radius: 12px;
      align-items: center;
      padding-left: 16px;
      margin-top: 18px;
      cursor: pointer;
    }
  }
}
.content {
  background: #f2f3f5;
  padding: 16px;

  border-radius: 16px;
  box-sizing: border-box;
  /* 线条/一般 */
  border: 1px solid #e5e6eb;
}
.flex {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  width: 100%;
  overflow: scroll;
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

    &.plan {
      width: calc(100% - 346px);

      .flex {
        display: flex;
        align-items: center;
        margin-bottom: 12px;
        width: 100%;
        overflow: scroll;
      }
    }
  }
}
.stepFour {
  .content {
    padding: 20px;
    padding-bottom: 0;
    .questionItem {
      &__header {
        display: flex;
        align-items: center;
        padding: 12px 0;

        &__title {
          margin-left: 9px;
          font-weight: 500;
          letter-spacing: 0em;

          /* 文字/1级 */
          color: #1d2129;
        }
      }
      &__content {
        padding: 20px;
        padding-bottom: 4px;
        .singleQuestionItem {
          position: relative;
          display: flex;
          align-items: center;
          margin-bottom: 16px;
          padding-right: 20px;
          box-sizing: border-box;

          border-radius: 12px;
          opacity: 1;
          box-sizing: border-box;
          border: 1px solid #e5e6eb;
          padding: 37px 20px 0px 20px;
          &__label {
            color: #4e5969;
            margin-right: 16px;

            white-space: nowrap;
          }
          &__content {
            color: #1d2129;
            font-weight: 500;
          }
          .question_level_two {
            @include caption;
            top: 0;
            left: 0;
            background: #eaf0fc;
            color: #2e6ce4;
            font-size: 14px;
          }
          .itemContainer {
            display: flex;
            width: 100%;
            flex-wrap: wrap;
            .item {
              width: 25%;
              margin-bottom: 16px;
            }
          }
          &:last-child {
            margin-bottom: 4px;
          }
        }

        &.content {
          padding: 0;
        }
      }
    }
    :deep .el-checkbox-button__inner {
      height: 32px;
      img {
        position: absolute;
        right: 0;
        bottom: 0;
      }
    }
    :deep .el-radio-button {
      svg {
        position: relative;
        left: 3px;
      }
    }

    :deep .el-checkbox-button__inner {
      img {
        display: none;
      }
    }
    :deep .el-checkbox-button.checked {
      background: #ffffff;
      --el-checkbox-button-checked-bg-color: none;
      --el-checkbox-button-checked-border-color: none;
      --el-checkbox-button-checked-text-color: none;
      box-shadow: none;
      img {
        display: block;
      }
      .el-checkbox-button__inner {
        border: 1px solid #2e6ce4;
        --el-border: none;
        color: #2e6ce4;
        box-shadow: none;
      }
      .el-checkbox-button {
        &.is-focus {
          border: none;
        }
      }
      &.serious {
        .el-checkbox-button__inner {
          border: 1px solid #f44c4c;
          --el-border: none;
          color: #f44c4c;
        }
      }
    }
  }
}
:deep .el-radio-button__original-radio:checked + .el-radio-button__inner {
  color: #2e6ce4;
  background-color: #fff;
  border-color: #2e6ce4;
  --el-radio-button-checked-border-color: #2e6ce4;
}
:deep .el-radio-button.serious .el-radio-button__original-radio:checked + .el-radio-button__inner {
  color: red;
  background-color: #fff;
  border-color: red;
  --el-radio-button-checked-border-color: red;
}
</style>
<!-- <template>
  <div class="stepFour">
    <Header text="问题列表" backgroundColor="#f4f7fd" />
    <template v-if="questionData.length > 0">
      <div class="content" :style="{ 'padding-top': '4px' }">
        <div class="questionItem" v-for="item in questionData" :key="item.id">
          <div class="questionItem__header">
            <img src="../../assets/svg/flag.svg" /><span class="questionItem__header__title">{{
              item.question_level_one
            }}</span>
          </div>
          <div class="questionItem__content content">
            <div class="singleQuestionItem" v-for="a in item.list1" :key="a.id">
              <div class="question_level_two">{{ a.question_level_two }}</div>
              <div class="itemContainer">
                <div class="item" v-for="item in a.list2" :key="item.title_name">
                  <span class="singleQuestionItem__label">{{ item.title_name }}</span>
                  <span class="singleQuestionItem__content">{{ item.option_names }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-else
      ><div
        :style="{
          padding: '20px'
        }"
      >
        无
      </div></template
    >
    <Header text="诊断" backgroundColor="#f4f7fd" :style="{ 'margin-top': '20px' }" />
    <div class="content diagnose">
      <template v-for="item in diagnoseData" :key="item.id">
        <template v-for="title in item.orthTitleList" :key="title.id">
          <form-item :label="title.titleName" width="80px">
            <el-radio-group
              v-if="title.type == 1"
              v-model="title.optionId"
              @change="handleChangeOption(title.optionId, title)"
              @dblclick="handleEmptyRadio(title.optionId, title)"
            >
              <template v-for="option in title.orthOptionsList" :key="option.id">
                <el-radio-button
                  :class="{
                    serious: option.serious == '1',
                    checked: option.choosen === true
                  }"
                  :label="option.id"
                >
                  {{ option.optionName }}
                </el-radio-button>
              </template>
            </el-radio-group>
            <el-checkbox-group
              v-model="title.optionId"
              v-if="title.type == 2"
              @change="handleChangeOption(title.optionId, title)"
            >
              <el-checkbox-button
                :class="{
                  serious: option.serious == '1',
                  checked: option.choosen === true
                }"
                v-for="option in title.orthOptionsList"
                :key="option.id"
                :label="option.id"
              >
                {{ option.optionName }}
                <img src="../../assets/svg/checked.svg" v-if="option.serious == '0'" /><img
                  src="../../assets/svg/abnormalChecked.svg"
                  v-else
                />
              </el-checkbox-button>
            </el-checkbox-group>
          </form-item>
        </template>
      </template>
    </div>
  </div>
</template>

<script setup>
import Header from '@/components/list/header.vue'
import { ref, defineProps, defineExpose } from 'vue'
import FormItem from '@/components/list/formItem.vue'
import { Get } from '@/utils/request'
import { useRoute } from 'vue-router'
import useChangeOption from '@/effects/changeOption.js'
import useUpdateOption from '@/effects/updateOption.js'
import emptyRadio from '@/effects/emptyRadio.js'
const clicked = ref(false)
defineExpose({
  clicked
})
const props = defineProps({
  pdfId: String
})
// 获取问题列表数据
const route = useRoute()
const appId = route.params.appId
const questionData = ref([])
async function getOrthQuestionList() {
  const result = await Get(`/prod-api/business/orthClass/issuesList?apmtId=${appId}&serious=1`)
  if (result.data) {
    const acc = result.data.reduce((acc, cur) => {
      if (acc[cur.question_level_one]) {
        const found = acc[cur.question_level_one].list1.find(
          (item) => item.question_level_two === cur.question_level_two
        )
        if (found) {
          found.list2.push({
            title_name: cur.title_name,
            option_names: cur.option_names
          })
        } else {
          acc[cur.question_level_one].list1.push({
            question_level_two: cur.question_level_two,
            list2: [
              {
                title_name: cur.title_name,
                option_names: cur.option_names
              }
            ]
          })
        }
      } else {
        acc[cur.question_level_one] = cur
        acc[cur.question_level_one].list1 = []
        acc[cur.question_level_one].list1.push({
          question_level_two: cur.question_level_two,
          list2: [
            {
              title_name: cur.title_name,
              option_names: cur.option_names
            }
          ]
        })
      }
      return acc
    }, {})
    questionData.value = Object.values(acc)
  }
}
getOrthQuestionList()

// 获取诊断数据

const diagnoseData = ref([])
async function getOrthDiagnoseList() {
  const result = await Get(`/prod-api/business/orthClass/list/2/诊断/${appId}`)
  diagnoseData.value = result.data
  if (result.data[0].classFlag) {
    clicked.value = true
  }
  result.data.forEach((item) => item.orthTitleList.forEach((title) => (title.showInput = false)))
  result.data.forEach((item) => {
    item.orthTitleList.forEach((title) => {
      if (title.type == 1) {
        title.optionId = ''
        title.text = ''
        title.showInput = false
        const choosenOptions = title.orthOptionsList.filter((option) => option.choosen === true)
        if (choosenOptions.length > 0) {
          title.optionId = choosenOptions[0].id
        }
      } else if (title.type == 2) {
        title.optionId = []
        title.optionId1 = []
        title.text = ''
        title.showInput = false
        const choosenOptions = title.orthOptionsList.filter((option) => option.choosen === true)
        if (choosenOptions.length > 0) {
          title.optionId = choosenOptions.map((option) => option.id)
          title.optionId1 = title.optionId
        }
      }
    })
  })
}
getOrthDiagnoseList()
const handleChangeOption = (optionId, title) => {
  clicked.value = true
  if (props.pdfId) {
    sessionStorage.removeItem(props.pdfId)
  }
  useChangeOption(optionId, title, appId)
  useUpdateOption(title.optionId, title, '', appId)
}
async function handleEmptyRadio(optionId, title) {
  if (
    title.orthOptionsList.some((option) => option.choosen == true) &&
    title.type == 1 &&
    title.optionId == optionId
  ) {
    emptyRadio(optionId, title)
    useUpdateOption(null, title, '', appId)
    getOrthDiagnoseList()
    // 重新请求数据
  }
}
</script>

<style lang="scss" scoped>
@import '../../style/mixins.scss';
.stepFour {
  .content {
    padding: 20px;
    padding-bottom: 0;
    .questionItem {
      &__header {
        display: flex;
        align-items: center;
        padding: 12px 0;

        &__title {
          margin-left: 9px;
          font-weight: 500;
          letter-spacing: 0em;

          /* 文字/1级 */
          color: #1d2129;
        }
      }
      &__content {
        padding: 20px;
        padding-bottom: 4px;
        .singleQuestionItem {
          position: relative;
          display: flex;
          align-items: center;
          margin-bottom: 16px;
          padding-right: 20px;
          box-sizing: border-box;

          border-radius: 12px;
          opacity: 1;
          box-sizing: border-box;
          border: 1px solid #e5e6eb;
          padding: 37px 20px 0px 20px;
          &__label {
            color: #4e5969;
            margin-right: 16px;

            white-space: nowrap;
          }
          &__content {
            color: #1d2129;
            font-weight: 500;
          }
          .question_level_two {
            @include caption;
            top: 0;
            left: 0;
            background: #eaf0fc;
            color: #2e6ce4;
            font-size: 14px;
          }
          .itemContainer {
            display: flex;
            width: 100%;
            flex-wrap: wrap;
            .item {
              width: 25%;
              margin-bottom: 16px;
            }
          }
          &:last-child {
            margin-bottom: 4px;
          }
        }

        &.content {
          padding: 0;
        }
      }
    }
    :deep .el-checkbox-button__inner {
      height: 32px;
      img {
        position: absolute;
        right: 0;
        bottom: 0;
      }
    }
    :deep .el-radio-button {
      svg {
        position: relative;
        left: 3px;
      }
    }

    :deep .el-checkbox-button__inner {
      img {
        display: none;
      }
    }
    :deep .el-checkbox-button.checked {
      background: #ffffff;
      --el-checkbox-button-checked-bg-color: none;
      --el-checkbox-button-checked-border-color: none;
      --el-checkbox-button-checked-text-color: none;
      box-shadow: none;
      img {
        display: block;
      }
      .el-checkbox-button__inner {
        border: 1px solid #2e6ce4;
        --el-border: none;
        color: #2e6ce4;
        box-shadow: none;
      }
      .el-checkbox-button {
        &.is-focus {
          border: none;
        }
      }
      &.serious {
        .el-checkbox-button__inner {
          border: 1px solid #f44c4c;
          --el-border: none;
          color: #f44c4c;
        }
      }
    }
  }
}
:deep .el-radio-button__original-radio:checked + .el-radio-button__inner {
  color: #2e6ce4;
  background-color: #fff;
  border-color: #2e6ce4;
  --el-radio-button-checked-border-color: #2e6ce4;
}
:deep .el-radio-button.serious .el-radio-button__original-radio:checked + .el-radio-button__inner {
  color: red;
  background-color: #fff;
  border-color: red;
  --el-radio-button-checked-border-color: red;
}
</style> -->
