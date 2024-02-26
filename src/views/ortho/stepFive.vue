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
      </div>
      <div class="body">
        <div
          class="body-left content"
          :style="{ height: planList.some((plan) => plan.checked) ? '680px' : '390px' }"
        >
          <div class="content_left_header">
            <div class="flex" :style="{ 'margin-bottom': ' 0px' }">
              <img src="../../assets/svg/goalCheck.svg" />目标
            </div>
            <draggable class="ORTHTARGET" :unmutable="true" :list="goalList"></draggable>
            <template v-if="planList.some((plan) => plan.checked)">
              <div class="flex" :style="{ 'margin-bottom': ' 0px', 'margin-top': '14px' }">
                <img src="../../assets/svg/tool.svg" />工具
              </div>
              <draggable class="ORTHTOOL" :unmutable="true" :list="toolList"></draggable>
            </template>
          </div>
        </div>
        <div class="body-right">
          <div
            class="content plan"
            @click.stop.self="handlePlan(plan)"
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

              <div>
                <a-select
                  class="difficulty"
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
                <a-select
                  class="orthoTool"
                  v-model="plan.orthoTool"
                  placeholder="选择主矫正器"
                  @click.stop=""
                >
                  <a-option v-for="item in alignerList" :key="item.name" :value="item.id">
                    {{ item.name }}
                  </a-option>
                </a-select>

                <el-popover
                  popper-class="feature"
                  placement="bottom-start"
                  :width="400"
                  trigger="click"
                  content="this is content, this is content, this is content"
                >
                  <template #reference>
                    <div class="addFeature" @click.stop="plan.popVisible = true">
                      <a-button class="addFeatureBtn"
                        ><template #icon> <icon-plus /> </template>添加特点
                      </a-button>
                    </div>
                  </template>
                  <el-checkbox-group
                    v-model="plan.featureMeritList"
                    @change="handleMeritFeature(plan.featureMeritList, plan.name)"
                  >
                    <el-checkbox
                      v-for="item in featureMeritList"
                      :key="item.name"
                      :label="item.id"
                      >{{ item.name }}</el-checkbox
                    >
                  </el-checkbox-group>
                  <el-checkbox-group
                    v-model="plan.featureEffectList"
                    @change="handleEffectFeature(plan.featureEffectList, plan.name)"
                  >
                    <el-checkbox
                      v-for="item in featureEffectList"
                      :key="item.name"
                      :label="item.id"
                      >{{ item.name }}</el-checkbox
                    >
                  </el-checkbox-group>
                </el-popover>
              </div>

              <div
                class="tag"
                v-if="
                  planList.some((plan) =>
                    plan.stageList.some((stage) =>
                      stage.targetIds.some((target) => target.name === '拔牙')
                    )
                  )
                "
              >
                拔牙
              </div>
            </div>
            <div class="flex">
              <div class="cardGroup" v-for="stage in plan.stageList" :key="stage.stageName">
                <template v-if="!plan.checked">
                  <div class="card">
                    <div class="time">{{ stage.stageName }}</div>
                    <draggable
                      class="ORTHTARGET"
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
                        class="ORTHTARGET"
                        :list="stage.targetIds"
                        @update="(val) => updateList(val, plan.name, stage.stageName, 'target')"
                        :showDeleteBtn="true"
                      ></draggable>
                    </div>
                    <div class="tool card">
                      <div class="tool_title">工具</div>
                      <draggable
                        class="ORTHTOOL"
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
          <!-- <div class="addPlan flex" @click.stop="handleAddPlan">
            <img :style="{ 'margin-right': '12px' }" src="../../assets/svg/addPlan.svg" />添加新方案
          </div> -->
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
import useChangeOption from '@/effects/changeOption.ts'
import useUpdateOption from '@/effects/updateOption.ts'
import emptyRadio from '@/effects/emptyRadio.ts'
import img from '@/assets/svg/addPic.svg'
import draggable from '../../components/layout/draggable.vue'
import { useStore } from 'vuex'
const route = useRoute()
const appId = route.params.appId
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

// const appId = route.params.appId
const questionData = ref([])
async function getOrthQuestionList() {
  const result = await Get(`/prod-api/business/orthClass/issuesList?apmtId=${appId}&serious=1`)
  questionData.value = result.data.map((item) => ({
    name: item.option_names,
    label: item.question_level_one,
    active: true
  }))
}
getOrthQuestionList()
// 新增阶段
const handleAddStage = (planName) => {
  store.commit('addStage', planName)
}
// 新增方案
const handleAddPlan = () => {
  if (planList.length == 3) {
    ElMessage({
      message: '方案最多添加三个',
      type: 'warning'
    })
  }
  store.commit('addPlan')
}
// 方案
const planList = ref([])
// 判断是否可以拖拽
const onMove = (e) => {
  console.log(e)
}
// 添加特点
const handleMeritFeature = (featureList, name) => {
  store.commit('setFeatureMeritList', { featureList, name })
}
const handleEffectFeature = (featureList, name) => {
  store.commit('setFeatureEffectList', { featureList, name })
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
  nextTick(() => {
    const plan = document.querySelector('.plan')
    console.log('🚀 ~ nextTick ~ plan:', plan)
    plan.addEventListener(
      'click',
      (e) => {
        e.stopPropagation()
        e.preventDefault()
      },
      false
    )
  })
})
const popClose = ref(true)
const handlePlan = (plan) => {
  console.log(popClose.value)
  if (!popClose) return
  plan.checked = !plan.checked
}

const alignerList = ref()
const getAlignerList = async () => {
  const result = await Post('/prod-api/business/globalDict/getDictListByType', {
    dictType: 'ORTHPRIMARYAPPLIANCE'
  })
  alignerList.value = result.data.map((item) => ({
    name: item.dictCodeName,
    id: item.id,
    dictType: item.dictType
  }))
  store.commit('setAlignerList', alignerList.value)
}
getAlignerList()
const featureMeritList = ref([])
const getFeatureMerit = async () => {
  const result = await Post('/prod-api/business/globalDict/getDictListByType', {
    dictType: 'ORTHFEATURETAGMERIT'
  })
  featureMeritList.value = result.data.map((item) => ({
    name: item.dictCodeName,
    id: item.id,
    dictType: item.dictType
  }))
  console.log(featureMeritList.value)
}
getFeatureMerit()
const featureEffectList = ref([])
const getFeatureEffect = async () => {
  const result = await Post('/prod-api/business/globalDict/getDictListByType', {
    dictType: 'ORTHFEATURETAGDEFECT'
  })
  featureEffectList.value = result.data.map((item) => ({
    name: item.dictCodeName,
    id: item.id,
    dictType: item.dictType
  }))
}
getFeatureEffect()
</script>

<style lang="scss" scoped>
:deep .el-checkbox {
  margin-right: 8px;
  background: #f2f3f5;
  height: 28px;
  margin-bottom: 8px;
  padding: 4px 8px;
  border-radius: 6px;
}
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
    position: sticky;
    top: 72px;
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
        width: 110px;
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
        &.difficulty {
          width: 110px;
        }
        &.orthoTool {
          width: 140px;
        }
      }
      .addFeature {
        position: relative;
        display: inline-block;
        .addFeatureBtn {
          border: 1px solid #c9cdd4;
          border-radius: 6px;
          margin-left: 16px;
        }
        .featureCard {
          position: absolute;
          background: #ffffff;
          box-sizing: border-box;
          width: 362px;
          /* 线条/一般 */
          border: 1px solid #e5e6eb;
          box-shadow: 0px 0px 16px 0px rgba(0, 0, 0, 0.12);
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
