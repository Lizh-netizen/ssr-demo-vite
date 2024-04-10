<template>
  <div class="stepFiveLayout">
    <div class="layout">
      <div class="top box">
        <div class="top_left">
          <div class="top_left_header">
            <img src="../../assets/layout/issuesIcon.svg" />
            <div class="title">问题列表</div>
          </div>
          <div class="top_left_content">
            <draggable
              :list="questionData"
              :question="true"
              @changeState="(val) => changeState(val)"
            ></draggable>
          </div>
        </div>
      </div>
      <div class="body pb-[16px]">
        <div
          class="body-left content"
          :style="{ height: planList?.some((plan) => plan.checked) ? '680px' : '390px' }"
        >
          <div class="content_left_header">
            <div class="flex" :style="{ 'margin-bottom': ' 0px' }">
              <img
                src="../../assets/svg/goalCheck.svg"
                style="margin-right: 12px"
                class="object-none"
              />
              <div class="title">目标</div>
            </div>
            <draggable
              class="ORTHTARGET"
              :unmutable="true"
              :list="goalList"
              :style="{ height: planList?.some((plan) => plan.checked) ? '250px' : 'auto' }"
            ></draggable>
            <template v-if="planList?.some((plan) => plan.checked)">
              <div class="flex" :style="{ 'margin-bottom': ' 0px', 'margin-top': '14px' }">
                <img src="../../assets/svg/tool.svg" style="margin-right: 12px" />
                <div class="title">工具</div>
              </div>
              <a-space direction="vertical" size="large">
                <a-input-search
                  :style="{
                    'margin-top': '12px'
                  }"
                  class="border-rd-[7px]! bg-#E6E8EB!"
                  placeholder="请搜索"
                  v-model="searchValue"
                  @search="handleSearch(searchValue)"
                  @press-enter="handleSearch(searchValue)"
                />
              </a-space>

              <draggable class="ORTHTOOL" :unmutable="true" :list="toolList"></draggable>
            </template>
          </div>
        </div>
        <div class="body-right">
          <div
            class="content plan"
            :style="{ padding: '0px', 'padding-right': plan.stageList.length > 4 ? '0' : '12px' }"
            :class="{ checkeded: plan.checked == true }"
            v-for="(plan, planIndex) in planList"
            :key="plan.name"
          >
            <div
              class="flex items-center mb-[12px] p-[12px]"
              style="position: relative; overflow: visible"
            >
              <div @click.stop="handlePlan(plan)" class="w-[20px] h-[20px]">
                <template v-if="plan.checked == true">
                  <img src="../../assets/svg/planCheck.svg" :style="{ 'margin-right': ' 8px' }" />
                </template>
                <template v-else>
                  <img src="../../assets/svg/Rectangle.svg" :style="{ 'margin-right': ' 8px' }" />
                </template>
              </div>
              <div
                contenteditable
                :style="{ height: '30px' }"
                class="title planName"
                @input="(e) => handleInput(e, plan)"
                @blur="(e) => handleBlur(e, plan)"
              >
                {{ plan.name }}
              </div>
              <div class="planTime">
                预计{{ plan.stageList?.[plan.stageList?.length - 1].stageName }}
              </div>
              <div @click.stop="">
                <a-select
                  class="difficulty"
                  v-model="plan.difficultyLevel"
                  placeholder="选择难度"
                  @change="handleDifficultyLevel(plan.difficultyLevel, plan)"
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
                  class="primaryApplianceId"
                  v-model="plan.primaryApplianceId"
                  placeholder="选择主矫正器"
                  @click.stop=""
                  @change="handleprimaryApplianceId(plan.primaryApplianceId, plan)"
                >
                  <a-option v-for="item in alignerList" :key="item.name" :value="item.id">
                    {{ item.name }}
                  </a-option>
                </a-select>
                <a-dropdown trigger="click" class="mt-[4px]!">
                  <span class="el-dropdown-link">
                    <div class="addFeature" @click="plan.popVisible = true">
                      <a-button class="addFeatureBtn"
                        ><template #icon> <icon-plus /> </template>添加特点
                      </a-button>
                      <span class="featureNum" v-if="plan.featureTagIds?.length > 0">
                        {{ plan.featureTagIds?.length }}
                      </span>
                    </div>
                  </span>
                  <template #content>
                    <div style="padding: 16px" class="flex flex-col">
                      <a-checkbox-group
                        :style="'width: 380px'"
                        v-model="plan.featureTagIds"
                        @change="handleFeature(plan.featureTagIds, plan)"
                      >
                        <a-checkbox
                          v-for="item in featureMeritList"
                          :key="item.name"
                          :value="item.id"
                          >{{ item.name }}</a-checkbox
                        >
                      </a-checkbox-group>
                      <a-divider style="margin: 0 0 8px 0" />
                      <a-checkbox-group
                        :style="'width: 380px'"
                        v-model="plan.featureTagIds"
                        @change="handleFeature(plan.featureTagIds, plan)"
                      >
                        <a-checkbox
                          v-for="item in featureEffectList"
                          :key="item.name"
                          :value="item.id"
                          >{{ item.name }}</a-checkbox
                        >
                      </a-checkbox-group>
                    </div>
                  </template>
                </a-dropdown>
              </div>

              <!-- <div
                class="tag"
                v-if="
                  planList.some((plan) =>
                    plan.stageList?.some((stage) =>
                      stage.targetIds?.some((target) => target.name === '拔牙')
                    )
                  )
                "
              >
                拔牙
              </div> -->
              <div style="position: absolute; right: 12px" class="flex">
                <el-tooltip class="box-item" effect="dark" content="复制方案" placement="top"
                  ><img
                    src="../../assets/layout/Copy.svg"
                    style="cursor: pointer"
                    @click.stop="handleCopyPlan(plan)"
                    class="mr-[14px]"
                /></el-tooltip>

                <a-popconfirm
                  :style="{ width: planList.length > 1 ? 'auto' : '260px' }"
                  :content="planList.length > 1 ? '确定要删除吗？' : '方案必须有一个，确定清空吗？'"
                  @click.self.stop="
                    () => {
                      return false
                    }
                  "
                  @ok="handleDeletePlan(plan, planIndex)"
                  @cancel="
                    () => {
                      return false
                    }
                  "
                >
                  <a-tooltip class="box-item" effect="dark" content="删除方案" placement="top">
                    <img style="cursor: pointer" src="../../assets/layout/Delete.svg" /> </a-tooltip
                ></a-popconfirm>
              </div>
            </div>
            <div
              class="flex overflow-scroll"
              :style="{ 'padding-left': plan.stageList.length > 4 ? '0' : '12px' }"
            >
              <div
                class="cardGroup"
                v-for="(stage, stageIndex) in plan.stageList"
                :key="stage.stageName"
              >
                <template v-if="!plan.checked">
                  <div class="card">
                    <div class="time flex justify-between! pr-[12px]">
                      {{ stage.stageName }}
                      <template v-if="stageIndex == plan.stageList.length - 1 && stageIndex > 0">
                        <a-popconfirm
                          content="确定要删除吗？"
                          @ok="handleDeleteStage(plan, stage, planIndex, stageIndex)"
                          @cancel="
                            () => {
                              return false
                            }
                          "
                        >
                          <img class="deleteBtn cursor-pointer" src="../../assets/svg/delete.svg" />
                        </a-popconfirm>
                      </template>
                      <template v-if="stageIndex == plan.stageList.length - 1 && stageIndex == 0">
                        <img
                          class="deleteBtn cursor-pointer"
                          src="../../assets/svg/delete.svg"
                          @click="handleDeleteStage1(plan, stage, planIndex, stageIndex)"
                        />
                      </template>
                    </div>
                    <draggable
                      class="ORTHTARGET"
                      :list="stage.targetIds"
                      @update="(val) => updateList(val, plan, stage.stageName, 'target')"
                      :showDeleteBtn="true"
                      :planTarget="true"
                      :planIndex="planIndex"
                      :stageIndex="stageIndex"
                    ></draggable>
                  </div>
                  <img src="../../assets/layout/arrowRight.svg" />
                </template>
                <template v-else>
                  <div>
                    <div class="card">
                      <div class="time flex justify-between! pr-[12px]">
                        {{ stage.stageName }}
                        <template v-if="stageIndex == plan.stageList.length - 1 && stageIndex > 0">
                          <a-popconfirm
                            content="确定要删除吗？"
                            @ok="handleDeleteStage(plan, stage, planIndex, stageIndex)"
                            @cancel="
                              () => {
                                return false
                              }
                            "
                          >
                            <img
                              class="deleteBtn cursor-pointer"
                              src="../../assets/svg/delete.svg"
                            />
                          </a-popconfirm>
                        </template>
                        <template v-if="stageIndex == plan.stageList.length - 1 && stageIndex == 0">
                          <img
                            class="deleteBtn cursor-pointer"
                            src="../../assets/svg/delete.svg"
                            @click="handleDeleteStage1(plan, stage, planIndex, stageIndex)"
                          />
                        </template>
                      </div>
                      <draggable
                        class="ORTHTARGET"
                        :list="stage.targetIds"
                        @update="(val) => updateList(val, plan, stage.stageName, 'target')"
                        :showDeleteBtn="true"
                        @submit="handleSubmit"
                        :planTarget="true"
                        :planIndex="planIndex"
                        :stageIndex="stageIndex"
                      ></draggable>
                    </div>
                    <div class="tool card">
                      <div class="tool_title ml-[12px]">工具</div>
                      <draggable
                        class="ORTHTOOL"
                        :list="stage.toolIds"
                        :planTool="true"
                        @update="(val) => updateList(val, plan, stage.stageName, 'tool')"
                        :showDeleteBtn="true"
                        :planIndex="planIndex"
                        :stageIndex="stageIndex"
                      ></draggable>
                    </div>
                  </div>

                  <img src="../../assets/layout/arrowRight.svg" />
                </template>
              </div>

              <div @click.stop="handleAddStage(plan)">
                <div
                  class="addStage w-[224px]"
                  :style="{ height: plan.checked == true ? '600px' : '284px' }"
                >
                  <img :style="{ 'margin-right': '12px' }" src="../../assets/svg/addStage.svg" />
                  <div>新增阶段</div>
                </div>
              </div>
            </div>
          </div>
          <div class="addPlan flex" @click.stop="handleAddPlan">
            <img :style="{ 'margin-right': '12px' }" src="../../assets/layout/add.svg" />添加新方案
          </div>
        </div>
      </div>
    </div>
    <Header text="风险" backgroundColor="#f4f7fd" />
    <div class="content risk" style="background: #fff; border: none">
      <template v-for="item in riskData" :key="item.id">
        <template v-for="title in item.orthTitleList" :key="title.id">
          <template v-if="title.titleName !== '备注'"
            ><form-item :label="title.titleName">
              <el-checkbox-group
                v-model="title.optionId"
                @change="handleChangeOption(title.optionId, title, item.id, item.owningModule)"
              >
                <template v-for="option in title.orthOptionsList" :key="option.id">
                  <template v-if="!option.optionSuffix"
                    ><el-checkbox-button
                      :class="{
                        serious: option.serious == '1',
                        checked: option.choosen === true
                      }"
                      :label="option.id"
                    >
                      {{ option.optionName }}
                      <img src="../../assets/svg/checked.svg" v-if="option.serious == '0'" /><img
                        src="../../assets/svg/abnormalChecked.svg"
                        v-else
                      />
                    </el-checkbox-button>
                  </template>
                  <template v-else>
                    <!-- 没有选中牙齿直接显示十字牙位图，否则先显示牙位，点击再显示十字牙位 -->
                    <template v-if="!option.fdiToothCode">
                      <el-popover
                        placement="right"
                        :width="490"
                        trigger="click"
                        @show="handleBeforeEnterPopover(option)"
                        @after-leave="handleSubmitTooth(option, title, item.id, item.owningModule)"
                      >
                        <template #reference>
                          <el-checkbox-button
                            @click="option.visible = true"
                            :class="{
                              serious: option.serious == '1',
                              checked: option.choosen === true
                            }"
                            :label="option.id"
                            @mouseenter="option.hover = true"
                            @mouseleave="option.hover = false"
                          >
                            {{ option.optionName
                            }}<svg
                              v-if="option.optionSuffix"
                              xmlns="http://www.w3.org/2000/svg"
                              xmlns:xlink="http://www.w3.org/1999/xlink"
                              fill="none"
                              version="1.1"
                              width="9.999975204467773"
                              height="9.999975204467773"
                              viewBox="0 0 9.999975204467773 9.999975204467773"
                            >
                              <g>
                                <path
                                  d="M0,4.99999C0,2.23857,2.23857,0,4.99999,0C7.76141,0,9.99998,2.23857,9.99998,4.99999C9.99998,7.76141,7.76141,9.99998,4.99999,9.99998C2.23857,9.99998,0,7.76141,0,4.99999C0,4.99999,0,4.99999,0,4.99999ZM5.49999,3.49999C5.49999,3.49999,5.49999,2.49999,5.49999,2.49999C5.49999,2.49999,4.49999,2.49999,4.49999,2.49999C4.49999,2.49999,4.49999,3.49999,4.49999,3.49999C4.49999,3.49999,5.49999,3.49999,5.49999,3.49999C5.49999,3.49999,5.49999,3.49999,5.49999,3.49999ZM4.49999,3.99999C4.49999,3.99999,4.49999,7.49998,4.49999,7.49998C4.49999,7.49998,5.49999,7.49998,5.49999,7.49998C5.49999,7.49998,5.49999,3.99999,5.49999,3.99999C5.49999,3.99999,4.49999,3.99999,4.49999,3.99999C4.49999,3.99999,4.49999,3.99999,4.49999,3.99999Z"
                                  fill-rule="evenodd"
                                  :fill="
                                    option.clicked
                                      ? option.seriousColor
                                      : option.hover
                                        ? option.hoverColor
                                        : option.fillColor
                                  "
                                  fill-opacity="1"
                                />
                              </g>
                            </svg>
                            <img
                              src="../../assets/svg/checked.svg"
                              v-if="option.serious == '0'"
                            /><img src="../../assets/svg/abnormalChecked.svg" v-else />
                          </el-checkbox-button>
                        </template>
                        <ChooseTooth :option="option"></ChooseTooth>
                      </el-popover>
                    </template>
                    <template v-else>
                      <el-popover
                        popper-class="myPopper"
                        :popper-style="{ width: 'auto', 'min-width': '100px' }"
                        placement="top-start"
                        :width="200"
                        :visible="option.visible"
                        @mouseleave="option.visible = false"
                      >
                        <template #reference>
                          <el-checkbox-button
                            @mouseenter="handleMouseEnterBtn(option)"
                            :class="{
                              serious: option.serious == '1',
                              checked: option.choosen === true
                            }"
                            :label="option.id"
                            @mouseleave="(e) => handleMouseLeaveBtn(e, option)"
                          >
                            {{ option.optionName
                            }}<svg
                              v-if="option.optionSuffix"
                              xmlns="http://www.w3.org/2000/svg"
                              xmlns:xlink="http://www.w3.org/1999/xlink"
                              fill="none"
                              version="1.1"
                              width="9.999975204467773"
                              height="9.999975204467773"
                              viewBox="0 0 9.999975204467773 9.999975204467773"
                            >
                              <g>
                                <path
                                  d="M0,4.99999C0,2.23857,2.23857,0,4.99999,0C7.76141,0,9.99998,2.23857,9.99998,4.99999C9.99998,7.76141,7.76141,9.99998,4.99999,9.99998C2.23857,9.99998,0,7.76141,0,4.99999C0,4.99999,0,4.99999,0,4.99999ZM5.49999,3.49999C5.49999,3.49999,5.49999,2.49999,5.49999,2.49999C5.49999,2.49999,4.49999,2.49999,4.49999,2.49999C4.49999,2.49999,4.49999,3.49999,4.49999,3.49999C4.49999,3.49999,5.49999,3.49999,5.49999,3.49999C5.49999,3.49999,5.49999,3.49999,5.49999,3.49999ZM4.49999,3.99999C4.49999,3.99999,4.49999,7.49998,4.49999,7.49998C4.49999,7.49998,5.49999,7.49998,5.49999,7.49998C5.49999,7.49998,5.49999,3.99999,5.49999,3.99999C5.49999,3.99999,4.49999,3.99999,4.49999,3.99999C4.49999,3.99999,4.49999,3.99999,4.49999,3.99999Z"
                                  fill-rule="evenodd"
                                  :fill="
                                    option.clicked
                                      ? option.seriousColor
                                      : option.hover
                                        ? option.hoverColor
                                        : option.fillColor
                                  "
                                  fill-opacity="1"
                                />
                              </g>
                            </svg>
                            <img
                              src="../../assets/svg/checked.svg"
                              v-if="option.serious == '0'"
                            /><img src="../../assets/svg/abnormalChecked.svg" v-else />
                          </el-checkbox-button>
                        </template>
                        <Tooth
                          :step="5"
                          :title="option"
                          :appId="appId"
                          @submitTooth="
                            (val) => handleSubmitTooth(val, title, item.id, item.owningModule)
                          "
                        />
                      </el-popover>
                    </template>
                  </template>
                </template>
              </el-checkbox-group>
            </form-item>
          </template>

          <template v-else-if="title.titleName == '备注'">
            <form-item :label="title.titleName" width="72px">
              <el-input
                :style="{ width: '100px' }"
                v-model="title.cephalometricsContent"
                @blur="handleSubmitAddtionalContent(title)"
              ></el-input>
            </form-item>
          </template>
        </template>
      </template>
    </div>
    <Header text="备注" backgroundColor="#f4f7fd" />
    <div class="content" style="background: #fff; border: none">
      <template v-for="item in remarkData" :key="item.id">
        <template v-for="title in item.orthTitleList" :key="title.id">
          <form-item :label="title.titleName">
            <a-textarea
              :style="{ width: '400px', 'border-radius': '8px' }"
              allow-clear
              v-model="title.cephalometricsContent"
              @blur="
                handleSubmitAddtionalContent(title, remarkData[0].id, remarkData[0].owningModule)
              "
            /> </form-item></template
      ></template>
    </div>
  </div>
</template>

<script setup>
import Header from '@/components/list/header.vue'
import {
  ref,
  defineProps,
  defineExpose,
  onMounted,
  watch,
  nextTick,
  computed,
  defineEmits
} from 'vue'
import { GetSymptom } from '@/utils/tooth'
import FormItem from '@/components/list/formItem.vue'
import { Get, Post, Delete } from '@/utils/request'
import { useRoute } from 'vue-router'
import useChangeOption from '@/effects/changeOption.ts'
import useUpdateOption from '@/effects/updateOption.ts'
import emptyRadio from '@/effects/emptyRadio.ts'
import img from '@/assets/svg/addPic.svg'
import draggable from '../../components/layout/draggable.vue'
import { useStore } from 'vuex'
import useFdiToothCodeEffect from '@/effects/fdiToothCode.ts'
import Tooth from '@/components/list/tooth.vue'
import ChooseTooth from '@/components/list/chooseTooth.vue'
const route = useRoute()
const appId = route.params.appId
const store = useStore()
const clicked = ref(false)
const requestAgain = ref(false)
const difficultyList = ref([{ label: '难度低' }, { label: '难度中等' }, { label: '难度高' }])

const props = defineProps({
  pdfId: String
})
const emit = defineEmits(['requestPlanList'])
// 获取工具数据
const toolList = ref([])
async function getOrthToolList() {
  const result = await Post('/prod-api/business/globalDict/getDictListByType', {
    dictType: 'ORTHTOOL'
  })
  toolList.value = result.data.map((item) => ({
    name: item.dictCodeName,
    id: item.id,
    dictType: item.dictType
  }))
}
// 搜索工具
const searchValue = ref('')
const handleSearch = async (val) => {
  const result = await Post(`/prod-api/business/globalDict/getDictListByType`, {
    dictType: 'ORTHTOOL',
    dictCodeName: val
  })
  toolList.value = result.data.map((item) => ({
    name: item.dictCodeName,
    id: item.id,
    dictType: item.dictType,
    showPosition: null
  }))
}
getOrthToolList()
// 获取目标数据
const goalList = ref([])
async function getOrthGoalList() {
  const result = await Post(`/prod-api/business/globalDict/getDictListByType`, {
    dictType: 'ORTHTARGET'
  })
  goalList.value = result.data.map((item) => ({
    name: item.dictCodeName,
    id: item.id,
    dictType: item.dictType,
    showPosition: null
  }))
  // store.commit('setOrthGoalList', goalList.value)
}
getOrthGoalList()
const planList = ref()
async function getPlanList() {
  const result = await Get(`/prod-api/emr/public/api/v1/scheme/list?aptmId=${appId}`)
  if (result.code == 200 && result.data?.length > 0) {
    planList.value = result.data.map((scheme) => ({
      ...scheme,
      featureTagIds: scheme.featureTagIds ? scheme.featureTagIds.split(',') : [],
      checked: scheme.checked || false,
      difficultyLevel: scheme.difficultyLevel || '',
      stageList:
        scheme.stageList?.length == 0 || !scheme.stageList
          ? [
              {
                stageName: '3个月',
                targetIds: [],
                toolIds: [],
                meritIds: [],
                effectIds: []
              },
              {
                stageName: '6个月',
                targetIds: [],
                toolIds: [],
                meritIds: [],
                effectIds: []
              },
              {
                stageName: '9个月',
                targetIds: [],
                toolIds: [],
                meritIds: [],
                effectIds: []
              },
              {
                stageName: '12个月',
                targetIds: [],
                toolIds: [],
                meritIds: [],
                effectIds: []
              }
            ]
          : scheme.stageList?.map((item) => ({
              ...item,
              targetIds: item.targetIds
                ? item.targetIds.split(',')?.map((target, index) => ({
                    id: target,
                    name: item.targetNames.split(',')[index],
                    dictType: 'ORTHTARGET'
                  }))
                : [],
              toolIds: item.toolIds
                ? item.toolIds.split(',')?.map((tool, index) => ({
                    id: tool,
                    name: item.toolNames.split(',')[index],
                    dictType: 'ORTHTOOL'
                  }))
                : []
            }))
    }))
    // const defaultStage = ['3个月', '6个月', '9个月', '12个月']

    // 不够的打上补丁
    // planList.value.forEach((plan) => {
    //   const length = plan.stageList?.length
    //   if (plan.stageList?.length < 4) {
    //     for (let i = 0; i < 4 - length; i++) {
    //       plan.stageList.push({
    //         stageName: defaultStage[length + i],
    //         targetIds: [],
    //         toolIds: [],
    //         meritIds: [],
    //         effectIds: []
    //       })
    //     }
    //   }
    // })

    planList.value.forEach((plan) => {
      plan.stageList?.forEach((stage) => {
        const a = stage.targetIds.find((item) => item.name == '拔牙')
        if (stage.showPosition && a) {
          if (a) {
            a.topLeft = []
            a.topRight = []
            a.bottomLeft = []
            a.bottomRight = []
          }

          const arr = JSON.parse(stage.showPosition)
          if (stage.fdiToothCode) {
            a.toothCode = stage.fdiToothCode.split(',')
            stage.fdiToothCode.split(',').forEach((code, index) => {
              if (code.startsWith('1') || code.startsWith('5')) {
                a.topLeft.push(arr[+index][0])
              } else if (code.startsWith('2') || code.startsWith('6')) {
                a.topRight.push(arr[+index][0])
              } else if (code.startsWith('4') || code.startsWith('8')) {
                a.bottomLeft.push(arr[+index][0])
              } else if (code.startsWith('3') || code.startsWith('7')) {
                a.bottomRight.push(arr[+index][0])
              }
            })
          } else {
            a.toothCode = []
          }
          a.position = arr || []
          a.submitAble = false
        }
      })
    })
    planList.value.forEach((plan) => {
      plan.stageList?.forEach((stage) => {
        if (stage.targetIds.length > 0) {
          stage.targetIds?.forEach((target) => {
            if (target.name?.includes('拔牙') && target.toothCode?.length > 0) {
              target.name = '拔牙' + '(' + target.toothCode?.join(';') + ')'
            }
          })
        }
      })
    })
  } else {
    let obj = {
      name: '方案一', //方案名
      id: null,
      checked: false,
      difficultyLevel: '',
      aptmId: appId,
      featureTagIds: [],
      primaryApplianceId: '',
      stageList: [
        {
          stageName: '3个月',
          id: null,
          targetIds: [],
          toolIds: [],
          showPosition: ''
        },
        {
          stageName: '6个月',
          id: null,
          targetIds: [],
          toolIds: [],
          showPosition: ''
        },
        {
          stageName: '9个月',
          id: null,
          targetIds: [],
          toolIds: [],
          showPosition: ''
        },
        {
          stageName: '12个月',
          id: null,
          targetIds: [],
          toolIds: [],
          showPosition: ''
        }
      ]
    }
    await handleScheme(obj)
    getPlanList()
  }
  planList.value.forEach((plan) => {
    if (plan.stageList.length > 4) {
      plan.contentOverflow = true
    }
  })
}
getPlanList()
// 获取问题列表数据

// const appId = route.params.appId
const questionData = ref([])
async function getOrthQuestionList() {
  const result = await Get(`/prod-api/business/orthClass/issuesList?apmtId=${appId}&serious=1`)
  const obj = result.data.reduce((pre, cur) => {
    if (pre[cur.question_level_one]) {
      pre[cur.question_level_one].push(cur)
    } else {
      pre[cur.question_level_one] = []
      pre[cur.question_level_one].push(cur)
    }
    return pre
  }, {})
  const data = Object.values(obj).flat()
  questionData.value = data.map((item) => ({
    ...item,
    name: item.option_names,
    label: item.question_level_one,
    active: item.active == '1' ? true : false
  }))
  // store.commit('setOrthQuestionList', questionData.value)
}
getOrthQuestionList()
// 新增阶段
const handleAddStage = async (plan) => {
  if (plan.stageList.length >= 12) {
    ElMessage({
      message: '二期矫正请另行发起方案设计',
      type: 'warning'
    })
    return
  }
  const finalStage = plan.stageList[plan.stageList.length - 1].stageName
  // @ts-expect-error TS(2531): Object is possibly 'null'.
  const stage = +finalStage.match(/(\d+)/)[0] + 3
  // @ts-expect-error TS(2532): Object is possibly 'undefined'.
  plan.stageList.push({
    id: null,
    stageName: stage + '个月',
    targetIds: [],
    toolIds: []
  })
  handleScheme(plan).then(() => {
    getPlanList()
  })
}
// 新增方案
const handleAddPlan = async () => {
  if (planList.value?.length == 4) {
    ElMessage({
      message: '方案数超过4个，请删除不需要的方案后重试',
      type: 'warning'
    })
    return
  }
  let obj = {
    id: null,
    checked: false,
    difficultyLevel: '',
    aptmId: appId,
    featureTagIds: '',
    primaryApplianceId: '',
    stageList: [
      {
        stageName: '3个月',
        id: null,
        targetIds: '',
        toolIds: '',
        showPosition: ''
      },
      {
        stageName: '6个月',
        id: null,
        targetIds: '',
        toolIds: '',
        showPosition: ''
      },
      {
        stageName: '9个月',
        id: null,
        targetIds: '',
        toolIds: '',
        showPosition: ''
      },
      {
        stageName: '12个月',
        id: null,
        targetIds: '',
        toolIds: '',
        showPosition: ''
      }
    ]
  }
  if (planList.value.length == 1) {
    obj.name = '方案二'
    planList.value.push(obj)
  } else if (planList.value.length == 2) {
    obj.name = '方案三'
    planList.value.push(obj)
  } else if (planList.value.length == 3) {
    obj.name = '方案四'
    planList.value.push(obj)
  }
  await Post('/prod-api/emr/public/api/v1/scheme', [obj])
  getPlanList()
}
const handleCopyPlan = async (plan) => {
  if (planList.value.length == 4) {
    ElMessage({
      message: '方案数超过4个，请删除不需要的方案后重试',
      type: 'warning'
    })
    return
  }
  // 深拷贝，第二个不会影响到第一个
  let obj = JSON.parse(
    JSON.stringify({
      ...plan,
      name: plan.name + '_副本',
      id: null,
      checked: false
    })
  )
  obj.stageList.forEach((stage) => (stage.id = null))
  await handleScheme(obj)
  planList.value.push(obj)
  getPlanList()
}
// 删除方案
const handleDeletePlan = async (plan, index) => {
  if (planList.value.length == 1) {
    plan.difficultyLevel = ''
    plan.featureTagIds = []
    plan.primaryApplianceId = ''
    plan.stageList.forEach((stage) => {
      stage.showPosition = ''
      stage.fdiToothCode = null
      stage.targetIds = []
      stage.toolIds = []
    })
    await handleScheme(plan)
    getPlanList()
  } else {
    Delete(`/prod-api/emr/public/api/v1/scheme/delScheme/${plan.id}`).then(() => {
      planList.value.splice(index, 1)
    })
  }
}
const handleDeleteStage = (plan, stage, planIndex, stageIndex) => {
  if (!stage.id) {
    planList.value[planIndex].stageList.splice(stageIndex, 1)
  } else {
    Delete(`/prod-api/emr/public/api/v1/scheme/delSchemeStage/${plan.id}/${stage.id}`).then(() => {
      planList.value[planIndex].stageList.splice(stageIndex, 1)
    })
  }
}
const handleDeleteStage1 = async (plan, stage, planIndex, stageIndex) => {
  if (!stage.id) {
    return
  } else {
    plan.stageList.forEach((stage) => {
      stage.showPosition = ''
      stage.fdiToothCode = null
      stage.targetIds = []
      stage.toolIds = []
    })
    await handleScheme(plan)
    getPlanList()
  }
}
// 判断是否可以拖拽
const onMove = (e) => {}
const handleDifficultyLevel = (difficultyLevel, plan) => {
  const found = planList.value.find((item) => item.id == plan.id)
  found.difficultyLevel = difficultyLevel
  handleScheme(found).then(() => {})
}
// 添加特点
const handleFeature = (featureList, plan) => {
  const found = planList.value.find((item) => item.id == plan.id)
  found.featureTagIds = featureList
  handleScheme(found).then(() => {})
  // store.commit('setFeatureList', { featureList, name })
}

const featureNum = computed(() => {})
const handleprimaryApplianceId = (primaryApplianceId, plan) => {
  const found = planList.value.find((item) => item.id == plan.id)
  found.primaryApplianceId = primaryApplianceId
  handleScheme(found).then(() => {})
  // store.commit('setPrimaryApplianceId', { primaryApplianceId, name })
}

// 更改store中数据，在下一步的时候提交
const updateList = (val, plan, stageName, cardName) => {
  const found = planList.value.find((item) => item.id == plan.id && item.name == plan.name)
  if (cardName == 'target') {
    found.stageList.find((item) => item.stageName == stageName).targetIds = val.data

    // 刚开始选择牙位
    if (val.flag) {
      // 避免修改右侧数据影响左侧
      goalList.value.find((item) => (item.visible = false))
      const stage = planList.value[val.planIndex].stageList[val.stageIndex]
      const target = stage.targetIds.find((item) => item.name.includes('拔牙'))
      const id = featureEffectList.value.find((item) => item.name == '拔牙').id
      if (!found.featureTagIds.some((i) => i == id)) {
        found.featureTagIds.push(id)
      }

      target.visible = true
      // 设置牙位
      useFdiToothCodeEffect(target)
      symptomList.value.forEach((row) => {
        row.forEach((a) => {
          a.active = false
        })
      })
    }
    // 删除目标或工具
    if (val.delete) {
      const stage = planList.value[val.planIndex].stageList[val.stageIndex]
      const index = stage.targetIds.findIndex((item) => item.name == val.element.name)
      // 如果删除了拔牙，特点中也要移除

      stage.targetIds.splice(index, 1)
      const hasTooth = found.stageList.find((stage) =>
        stage.targetIds.some((target) => target.name.includes('拔牙'))
      )
      if (!hasTooth) {
        const id = featureEffectList.value.find((item) => item.name == '拔牙').id
        if (found.featureTagIds.some((i) => i == id)) {
          found.featureTagIds.splice(found.featureTagIds.indexOf(id), 1)
        }
      }
    }
    if (val.removeFlag) {
    }
  } else {
    found.stageList.find((item) => item.stageName == stageName).toolIds = val.data
  }
  if (cardName == 'tool') {
    // 如果是目标，则先不提交
    if (val.delete) {
      const stage = planList.value[val.planIndex].stageList[val.stageIndex]
      const index = stage.toolIds.findIndex((item) => item.name == val.element.name)
      stage.toolIds.splice(index, 1)
    }
  }
  // 如果是拔牙，则先不提交
  if (val.flag || val.addFlag) return
  handleScheme(found).then(() => {
    if (val.delete) {
      getOrthGoalList()
      // 也要重新请求一次planList
    }
  })
  if (cardName == 'tool') {
    getOrthToolList()
  }
  getOrthGoalList()
}
// 更改问题状态
const changeState = (val) => {
  const found = questionData.value.find((item) => item.option_names == val.element.option_names)
  found.active = val.flag
  getOrthQuestionList()
}
const handleInput = (e, plan) => {
  if (e.target.innerText.length > 20) {
    const truncatedContent = e.target.textContent.substring(0, 20)
    e.target.innerText = truncatedContent
    e.preventDefault()
    ElMessage({
      message: '方案名称不能超过20个字',
      type: 'warning'
    })
  }
}
const handleBlur = (e, plan) => {
  plan.name = e.target.innerHTML
  handleScheme(plan)
}
onMounted(() => {
  // const divs = document.querySelectorAll('.planName')
  // divs.forEach((div) => {
  //   div.addEventListener('input', (event) => {
  //     const maxLength = 20 // 最大字数限制
  //     const currentLength = div.textContent.length
  //     if (currentLength > maxLength) {
  //       const truncatedContent = div.textContent.substring(0, maxLength)
  //       div.textContent = truncatedContent
  //       event.preventDefault()
  //     }
  //   })
  // })
  // planList.value = store.state.planList
})

const handlePlan = (plan) => {
  planList.value.forEach((item) => {
    if (item.id == plan.id) {
      plan.checked = !plan.checked
    } else {
      item.checked = false
    }
    handleScheme(plan)
  })
}

const alignerList = ref()
const getAlignerList = async () => {
  const result = await Post('/prod-api/business/globalDict/getDictListByType', {
    dictType: 'ORTHPRIMARYAPPLIANCE'
  })
  alignerList.value = result.data.map((item) => ({
    name: item.dictCodeName,
    id: +item.id,
    dictType: item.dictType
  }))
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
// 提交过牙齿重新请求一次目标
const handleSubmit = () => {
  getOrthGoalList()
}
async function handleChangeOption(optionId, title, classId, owningModule) {
  if (owningModule == '目标') {
    goalClicked.value = true
  }
  if (owningModule == '方法') {
    methodClicked.value = true
  }
  if (props.pdfId) {
    sessionStorage.removeItem(props.pdfId)
  }
  if (title.titleName == '矫治风险') {
    requestAgain.value = true
    title.orthOptionsList.forEach((option) => {
      if (optionId.includes(option.id)) {
        option.clicked = true
      } else {
        option.clicked = false
      }
    })
  } else if (title.titleName == '矫治器') {
    const optionId = title.optionId.filter((optionId) => !title.optionId1.includes(optionId))
    const optionName = title.orthOptionsList.find((a) => a.id === optionId[0])?.optionName
    if (optionId && optionName && (optionName == '无托槽隐形矫治' || optionName == '硅胶矫治器')) {
      title.orthOptionsList.forEach((option) => {
        if (optionId.includes(option.id)) {
          option.clicked = true
          option.visible = true
        } else {
          option.clicked = false
        }
      })
    }
  }
  useChangeOption(optionId, title, appId, classId, owningModule)
  const res = await useUpdateOption(title.optionId, title, appId, classId, owningModule)
  if (requestAgain.value && res.code == 200) {
    getOrthRiskList()
  }

  if ((res.code == 200) & (title.titleName == '矫治器')) {
    getOrthMethodList()
  }
}
const symptomList = ref([])
symptomList.value = GetSymptom()

const handleBeforeEnterPopover = (title) => {
  symptomList.value.forEach((row) => {
    row.forEach((a) => {
      a.active = false
      if (title.toothCode?.includes(a.value + '')) {
        a.active = true
      }
    })
  })
}
const handleSubmitTooth = (option, title, classId, owningModule) => {
  option.visible = false
  symptomList.value.forEach((row) => row.forEach((item) => (item.active = false)))
  let obj
  // 判断是否选择了牙齿/点击了小牙位图，然后再判断是否有牙齿选中
  if (!option.submitAble) {
    if (option.id === 237 && !option.toothCode.join()) {
      title.optionId.splice(
        title.optionId.findIndex((a) => a == 237),
        1
      )
      const option2 = title.orthOptionsList.find((a) => a.id === 236)
      obj = {
        aptmId: appId,
        titleId: title.id,
        optionsIdStr: title.optionId,
        otherContent: '',
        cephalometricsContent: '',
        classId: classId,
        owningModule: owningModule,
        fdiToothCode: option2.toothCode.join(),
        showPosition: option2.position.length ? JSON.stringify(option2.position) : '',
        fdiToothCode1: option.toothCode.join(),
        showPosition1: option.position.length ? JSON.stringify(option.position) : '',
        optionSuffix: '牙位图'
      }
    } else if (option.id === 236 && !option.toothCode.join()) {
      title.optionId.splice(
        title.optionId.findIndex((a) => a == 236),
        1
      )
      const option2 = title.orthOptionsList.find((a) => a.id === 237)
      obj = {
        aptmId: appId,
        titleId: title.id,
        optionsIdStr: title.optionId,
        otherContent: '',
        cephalometricsContent: '',
        optionSuffix: '牙位图',
        fdiToothCode: option2.toothCode.join(),
        showPosition: option2.position.length ? JSON.stringify(option2.position) : '',
        fdiToothCode1: option.toothCode.join(),
        showPosition1: option.position.length ? JSON.stringify(option.position) : '',
        classId: classId,
        owningModule: owningModule
      }
    }
  }
  if (option.id === 237) {
    const option2 = title.orthOptionsList.find((a) => a.id === 236)
    if (option2.toothCode) {
      obj = {
        aptmId: appId,
        titleId: title.id,
        optionsIdStr: title.optionId,
        otherContent: '',
        cephalometricsContent: '',
        optionSuffix: '牙位图',
        fdiToothCode: option2.toothCode.join(),
        showPosition: option2.position.length ? JSON.stringify(option2.position) : '',
        fdiToothCode1: option.toothCode.join(),
        showPosition1: option.position.length ? JSON.stringify(option.position) : '',
        classId: classId,
        owningModule: owningModule
      }
    }
  } else {
    const option2 = title.orthOptionsList.find((a) => a.id === 237)
    if (option2.toothCode) {
      obj = {
        aptmId: appId,
        titleId: title.id,
        optionsIdStr: title.optionId,
        otherContent: '',
        cephalometricsContent: '',
        fdiToothCode1: option2.toothCode.join(),
        showPosition1: option2.position.length ? JSON.stringify(option2.position) : '',
        fdiToothCode: option.toothCode.join(),
        showPosition: option.position.length ? JSON.stringify(option.position) : '',
        classId: classId,
        owningModule: owningModule,
        optionSuffix: '牙位图'
      }
    } else {
      title.optionId.splice(
        title.optionId.findIndex((a) => a == 236),
        1
      )
      obj = {
        aptmId: appId,
        titleId: title.id,
        optionsIdStr: title.optionId,
        otherContent: '',
        cephalometricsContent: '',
        fdiToothCode: option2.toothCode.join(),
        showPosition: option2.position.length ? JSON.stringify(option2.position) : '',
        fdiToothCode1: option.toothCode.join(),
        showPosition1: option.position.length ? JSON.stringify(option.position) : '',
        classId: classId,
        owningModule: owningModule,
        optionSuffix: '牙位图'
      }
    }
  }

  Post('/prod-api/emr/orthPlan/addOrthInspectResult', obj).then(() => {
    option.submitAble = false
    getOrthRiskList()
  })
}
// 有已选中的牙位的悬浮显示选中的牙位
const handleMouseEnterBtn = (option) => {
  option.visible = true
  option.hover = true
}

let timeout
const handleMouseLeaveBtn = (e, option) => {
  option.hover = false
  timeout = setTimeout(() => {
    option.visible = false
  }, 300)
  const poppers = document.querySelectorAll('.myPopper')
  Array.from(poppers).forEach((popper) => {
    popper.addEventListener('mouseenter', () => {
      clearTimeout(timeout)
    })
  })
}
const handleSubmitAddtionalContent = (title, classId, owningModule) => {
  if (title.cephalometricsContent) {
    const obj = {
      aptmId: appId,
      titleId: title.id,
      optionsIdStr: [],
      otherContent: '',
      cephalometricsContent: title.cephalometricsContent,
      fdiToothCode: '',
      showPosition: '',
      classId: classId,
      owningModule: owningModule
    }
    Post('/prod-api/emr/orthPlan/addOrthInspectResult', obj)
  }
}
const riskData = ref([])
async function getOrthRiskList() {
  const result = await Get(`/prod-api/emr/orthCommon/list/2/风险/${appId}`)
  riskData.value = result.data
  riskData.value.forEach((item) => {
    item.orthTitleList.forEach((i) => {
      i.orthOptionsList.forEach((a) => {
        if (a.optionSuffix) {
          useFdiToothCodeEffect(a)
        }
      })
    })
  })
  riskData.value.forEach((item) => item.orthTitleList.forEach((title) => (title.showInput = false)))
  riskData.value.forEach((item) => {
    item.orthTitleList.forEach((title) => {
      if (title.type == 1) {
        title.optionId = ''
        title.text = ''
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
      if (title.titleName == '矫治风险') {
        title.orthOptionsList.forEach((option) => {
          if (option.optionName === '牙根吸收' || option.optionName === '乳牙早失') {
            option.fillColor = '#C9CDD4'
            option.seriousColor = '#f44c4c'
            option.hoverColor = '#2e6ce4'
            option.clicked = option.choosen ? true : false
          }
        })
      }
    })
  })
}
getOrthRiskList()
const remarkData = ref([])
async function getRemark() {
  const result = await Get(`/prod-api/emr/orthCommon/list/2/备注/${appId}`)
  remarkData.value = result.data
}

getRemark()

const handleScheme = async (scheme) => {
  // 校验哪个计划的选择器没写
  let obj = {
    id: scheme.id || null,
    difficultyLevel: scheme.difficultyLevel,
    checked: scheme.checked,
    name: scheme.name,
    aptmId: appId, // Example value, replace with actual data
    featureTagIds: scheme.featureTagIds?.join(','),
    primaryApplianceId: scheme.primaryApplianceId,
    stageList: scheme.stageList?.map((stage) => {
      return {
        id: stage.id || null,
        fdiToothCode:
          stage.targetIds &&
          stage.targetIds.find((target) => target.name?.includes('拔牙'))?.toothCode?.join(),
        optionId:
          stage.targetIds && stage.targetIds.find((target) => target.name?.includes('拔牙'))?.id,
        showPosition:
          stage.targetIds && stage.targetIds.find((target) => target.name?.includes('拔牙'))
            ? JSON.stringify(
                stage.targetIds.find((target) => target.name?.includes('拔牙'))?.position
              )
            : '',
        stageName: stage.stageName,
        targetIds: stage.targetIds?.map((target) => target.id)?.join(','),
        toolIds: stage.toolIds?.map((tool) => tool.id)?.join(',')
      }
    })
  }
  // if (planList.value.some((plan) => !plan.primaryApplianceId || !plan.difficultyLevel)) {
  //   validate(planList.value)
  //   return false
  // }
  await Post('/prod-api/emr/public/api/v1/scheme', [obj])
}
defineExpose({
  clicked,
  planList
})
</script>

<style lang="scss" scoped>
.mask {
  z-index: 2000;
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  left: 0;
}
.container.ORTHTOOL {
  :deep(.list-group) {
    margin-top: 10px !important;
  }
}
.deleteBtn {
  opacity: 0;
}

.title {
  color: #1d2129;
  font-size: 16px;
  font-weight: bold;
}
.planName {
  padding: 6px 10px;
  &:hover {
    border: 1px solid #c9cdd4;
    border-radius: 6px;
  }
}
:deep .arco-checkbox {
  margin-right: 8px;
  background: #f2f3f5;
  height: 28px;
  margin-bottom: 8px;
  padding: 4px 8px;
  border-radius: 6px;
}
@import '../../style/mixins.scss';

.layout {
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
    width: 250px;
    margin-right: 20px;
    position: sticky;
    top: 72px;
    overflow: scroll;
    :deep(.list-group-item) {
      margin-right: 0;
    }
  }
  &-right {
    width: calc(100% - 250px);
    .plan {
      margin-bottom: 16px;
      &:last-child {
        margin-bottom: 0;
      }

      :deep .list-group {
        height: 200px;
        width: 200px;
      }
      :deep(.list-group-item) {
        margin-right: 0;
      }
      .planTime {
        font-size: 14px;
        font-weight: normal;
        line-height: normal;
        text-align: center;
        letter-spacing: 0px;
        padding: 4px 8px;
        gap: 6px;
        border-radius: 6px;
        /* 主色/10% */
        /* 样式描述：浅色背景/hover等 */
        background: #eaf0fc;

        box-sizing: border-box;
        /* 主色/100% */
        border: 1px solid #2e6ce4;
        font-variation-settings: 'opsz' auto;
        /* 主色/100% */
        color: #2e6ce4;
      }

      &.checkeded {
        background: #f4f7fd;
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
        // &.high {
        //   background: #f76560;
        //   color: #ffffff;
        // }
        // &.middle {
        //   background: #ff9a2e;
        //   color: #ffffff;
        // }
        // &.low {
        //   background: #23c343;
        //   color: #ffffff;
        // }
        &.difficulty {
          width: 110px;
          &.validateFail {
            border: 1px solid red;
          }
        }
        &.primaryApplianceId {
          width: 140px;
          &.validateFail {
            border: 1px solid red;
          }
        }
      }
      :deep .arco-select-view-single.arco-select-view-focus {
        background-color: var(--color-bg-2);
        border-color: rgb(var(--primary-6));
        box-shadow: 0 0 0 0 var(--color-primary-light-2);
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
        .featureNum {
          line-height: 18px;
          text-align: center;
          position: absolute;
          background: #f65b56;
          border-radius: 100px;
          width: 18px;
          height: 18px;
          top: -6px;
          color: #ffffff;
          right: -6px;
        }
      }

      :deep .container {
        height: 220px;
      }
      :deep .container.ORTHTOOL {
        .list-group {
          margin-top: 8px !important;
        }
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
          display: flex;
          align-items: center;
          justify-content: flex-start;
          padding-left: 12px;
          color: #2e6ce4;
          font-weight: bold;
          border-radius: 8px;
          &:hover {
            .deleteBtn {
              opacity: 1;
              z-index: 100;
            }
          }
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

.stepFour {
  .content {
    padding: 16px;
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

.formItem__content {
  display: flow-root;
  :deep .el-checkbox-group {
    width: 100%;
  }
}
.content {
  padding: 16px;
  padding-bottom: 0;
  &.period {
    :deep .el-input {
      width: 120px;
    }
  }
  :deep .el-checkbox-button.is-focus .el-checkbox-button__inner {
    --el-checkbox-button-checked-border-color: #dcdfe6;
  }
  :deep .el-checkbox-button {
    &.is-focus {
      border: none;
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
    position: relative;
    img {
      position: absolute;
      right: 4px;
      bottom: 2px;
    }
    svg {
      position: relative;
      left: 3px;
    }
    &.is-focus {
      border: none;
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
  &.risk {
    :deep .el-checkbox-button {
      margin-bottom: 12px;
    }
  }
}
.diagramWrapper {
  width: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  .diagram {
    position: relative;
    .diagramBox {
      width: 122px;
      height: 25px;
      display: flex;
      div {
        height: 25px;
        width: 61px;
        display: flex;
        align-items: center;
        padding: 4px;
        box-sizing: border-box;
      }
      &:nth-child(1) {
        border-bottom: 1px solid #d8d8d8;
        > div:nth-child(1) {
          border-right: 1px solid #d8d8d8;
          justify-content: end;
        }
      }
      &:nth-child(2) {
        > div:nth-child(1) {
          border-right: 1px solid #d8d8d8;
          justify-content: end;
        }
      }
    }
  }
}
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
