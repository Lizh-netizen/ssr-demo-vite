<template>
  <div class="stepFive">
    <Header text="方案" backgroundColor="#f4f7fd" />
    <div class="content plan">
      <template v-for="item in planData" :key="item.id">
        <form-item
          :label="title.titleName"
          v-for="(title, index) in item.orthTitleList"
          :key="title.id"
        >
          <template v-if="index == 0">
            <el-radio-group
              v-if="title.type == 1"
              v-model="title.optionId"
              @change="handleChangeOption(title.optionId, title)"
              @dblclick="handleEmptyRadio(title.optionId, title, 'plan')"
            >
              <el-radio-button
                :class="{
                  serious: option.serious == '1',
                  checked: option.choosen === true
                }"
                v-for="option in title.orthOptionsList"
                :key="option.id"
                :label="option.id"
              >
                {{ option.optionName }}
              </el-radio-button>
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
              </el-checkbox-button> </el-checkbox-group
          ></template>
          <!-- <div class="optionContainer"> -->

          <template v-else>
            <!-- 用法和第二步一样，所以step是2 -->
            <Tooth :title="title" :appId="appId" :step="2" />
          </template>
          <!-- </div> -->
        </form-item>
      </template>
    </div>
    <Header text="目标" backgroundColor="#f4f7fd" />
    <div class="content">
      <template v-for="item in goalData" :key="item.id">
        <template v-for="title in item.orthTitleList" :key="title.id">
          <form-item :label="title.titleName" width="72px">
            <el-radio-group
              v-if="title.type == 1"
              v-model="title.optionId"
              @change="handleChangeOption(title.optionId, title, item.owningModule, '', '目标')"
              @dblclick="handleEmptyRadio(title.optionId, title, 'goal')"
            >
              <el-radio-button
                :class="{
                  serious: option.serious == '1',
                  checked: option.choosen === true
                }"
                v-for="option in title.orthOptionsList"
                :key="option.id"
                :label="option.id"
              >
                {{ option.optionName }}
              </el-radio-button>
            </el-radio-group>
            <el-checkbox-group
              v-model="title.optionId"
              v-if="title.type == 2"
              @change="handleChangeOption(title.optionId, title, item.owningModule, '', '目标')"
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
    <Header text="方法" backgroundColor="#f4f7fd" />
    <div class="content">
      <template v-for="item in methodData" :key="item.id">
        <template v-for="title in item.orthTitleList" :key="title.id">
          <template v-if="title.titleName !== '品牌' && title.titleName !== '预计矫正周期'">
            <form-item :label="title.titleName" width="86px">
              <el-radio-group
                v-if="title.type == 1"
                v-model="title.optionId"
                @change="handleChangeOption(title.optionId, title, '', '', '方法')"
                @dblclick="handleEmptyRadio(title.optionId, title, 'method')"
              >
                <template v-for="option in title.orthOptionsList" :key="option.id">
                  <el-radio-button
                    v-if="!option.optionSuffix"
                    :class="{
                      serious: option.serious == '1'
                    }"
                    :label="option.id"
                  >
                    {{ option.optionName }}
                  </el-radio-button>
                  <el-popover
                    v-else
                    popper-class="myPopper"
                    :popper-style="{ width: 'auto', 'min-width': '100px' }"
                    placement="top-start"
                    :width="200"
                    :visible="option.visible"
                    @after-leave="handleSubmitBrand(title, option)"
                  >
                    <template #reference>
                      <el-radio-button
                        :class="{
                          serious: option.serious == '1'
                        }"
                        :label="option.id"
                        @mouseenter="handleMouseEnter(option)"
                        @mouseleave="handleMouseLeave(option)"
                      >
                        {{ option.optionName
                        }}<svg
                          xmlns="http://www.w3.org/2000/svg"
                          xmlns:xlink="http://www.w3.org/1999/xlink"
                          fill="
                              none
                            "
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
                                  ? option.hoverColor
                                  : option.hover
                                  ? option.hoverColor
                                  : option.fillColor
                              "
                              fill-opacity="1"
                            />
                          </g>
                        </svg>
                      </el-radio-button>
                    </template>
                    <form-item :label="option.brand.titleName">
                      <el-radio-group
                        v-model="option.otherContent"
                        @change="
                          handleChangeOption(
                            option.otherContent,
                            option.brand,
                            option,
                            title,
                            '方法'
                          )
                        "
                        @dblclick="handleEmptyRadio(title.optionId, title, 'method')"
                      >
                        <el-radio-button
                          v-for="option1 in option.brand.orthOptionsList"
                          :key="option1.id"
                          :class="{
                            serious: option1.serious == '1'
                          }"
                          :label="option1.id"
                        >
                          {{ option1.optionName }}</el-radio-button
                        ></el-radio-group
                      >
                    </form-item>
                  </el-popover>
                </template>
              </el-radio-group>
              <el-checkbox-group
                v-model="title.optionId"
                v-if="title.type == 2"
                @change="handleChangeOption(title.optionId, title, '', '', '方法')"
              >
                <template v-for="option in title.orthOptionsList" :key="option.id">
                  <el-checkbox-button
                    :class="{
                      serious: option.serious == '1',
                      checked: option.choosen === true
                    }"
                    :label="option.id"
                  >
                    {{ option.optionName
                    }}<img src="../../assets/svg/checked.svg" v-if="option.serious == '0'" /><img
                      src="../../assets/svg/abnormalChecked.svg"
                      v-else
                    />
                  </el-checkbox-button>
                </template>
              </el-checkbox-group>
            </form-item>
          </template>
        </template>
      </template>
    </div>
    <Header text="周期" backgroundColor="#f4f7fd" />
    <div class="content">
      <template v-for="item in periodData" :key="item.id">
        <template v-for="title in item.orthTitleList" :key="title.id">
          <form-item :label="title.titleName">
            <el-select
              :style="{ width: '60px' }"
              v-model="title.cephalometricsContent"
              @change="handleSubmitAddtionalContent(title)"
              filterable
              remote
            >
              <el-option v-for="item in [10, 15, 18, 20]" :key="item" :label="item" :value="item" />
            </el-select>

            <span :style="{ color: '#4e5969', 'margin-left': '8px' }"> 个月</span></form-item
          ></template
        ></template
      >
    </div>
    <Header text="风险" backgroundColor="#f4f7fd" />
    <div class="content risk">
      <template v-for="item in riskData" :key="item.id">
        <template v-for="title in item.orthTitleList" :key="title.id">
          <template v-if="title.titleName !== '备注'"
            ><form-item :label="title.titleName">
              <el-checkbox-group
                v-model="title.optionId"
                @change="handleChangeOption(title.optionId, title)"
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
                    <template v-if="option.fdiToothCode == null">
                      <el-popover
                        placement="right"
                        :width="490"
                        trigger="click"
                        @show="handleBeforeEnterPopover(option)"
                        @after-leave="handleSubmitTooth(option, title)"
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
                        <div class="selectContainer" id="selectContainer">
                          <div class="container">
                            <template v-for="(row, rowindex) in symptomList" :key="rowindex">
                              <div
                                class="symptomBox"
                                :class="{
                                  itemAlignRight:
                                    rowindex === 2 ||
                                    rowindex === 4 ||
                                    rowindex === 0 ||
                                    rowindex === 6,
                                  marginTop: rowindex == 4 || rowindex == 5,
                                  marginBottom: rowindex == 2 || rowindex == 3,
                                  marginRight:
                                    rowindex === 2 ||
                                    rowindex === 4 ||
                                    rowindex === 0 ||
                                    rowindex === 6,
                                  marginLeft:
                                    rowindex === 1 ||
                                    rowindex === 3 ||
                                    rowindex === 5 ||
                                    rowindex === 7
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
                      </el-popover>
                    </template>
                    <template v-else>
                      <el-popover
                        popper-class="myPopper"
                        :popper-style="{ width: 'auto', 'min-width': '100px' }"
                        placement="top-start"
                        :width="200"
                        :visible="option.visible"
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
                          @submitTooth="(val) => handleSubmitTooth(val, title)"
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
    <div class="content">
      <template v-for="item in remarkData" :key="item.id">
        <template v-for="title in item.orthTitleList" :key="title.id">
          <form-item :label="title.titleName">
            <el-input
              :style="{ width: '400px' }"
              v-model="title.cephalometricsContent"
              @blur="handleSubmitAddtionalContent(title)"
            ></el-input> </form-item></template
      ></template>
    </div>
  </div>
</template>

<script setup>
import Header from '@/components/list/header.vue'
import { ref, defineProps, defineExpose } from 'vue'
import { Get, Post } from '@/utils/request'
import FormItem from '@/components/list/formItem.vue'
import { GetSymptom } from '@/utils/tooth'
import { useRoute } from 'vue-router'
import useChangeOption from '@/effects/changeOption.js'
import useUpdateOption from '@/effects/updateOption.js'
import useSelectTooth from '@/effects/selectTooth.js'
import useFdiToothCodeEffect from '@/effects/fdiToothCode.js'
import Tooth from '@/components/list/tooth.vue'
import emptyRadio from '@/effects/emptyRadio.js'
const submitTooth = (title) => {}
const goalClicked = ref(false)
const methodClicked = ref(false)
defineExpose({
  goalClicked,
  methodClicked
})
const props = defineProps({
  pdfId: String
})
const handleMouseEnter = (option) => {
  if (option.otherContent) {
    option.visible = true
  }
  option.hover = true
}
let timeout1
const handleMouseLeave = (option) => {
  option.hover = false
  timeout1 = setTimeout(() => {
    option.visible = false
  }, 300)
  const poppers = document.querySelectorAll('.myPopper')
  Array.from(poppers).forEach((popper) => {
    popper.addEventListener('mouseenter', () => {
      clearTimeout(timeout1)
    })
  })
}
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
const route = useRoute()
const appId = route.params.appId
const planData = ref([])
async function getOrthPlanList() {
  const result = await Get(`/prod-api/business/orthClass/list/2/方案/${appId}`)
  planData.value = result.data
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
      } else if (title.type == 4) {
        useFdiToothCodeEffect(title)
      }
    })
  })
}
getOrthPlanList()

const goalData = ref([])
async function getOrthGoalList() {
  const result = await Get(`/prod-api/business/orthClass/list/2/目标/${appId}`)
  goalData.value = result.data
  goalClicked.value = result.data[0].classFlag
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
getOrthGoalList()

const methodData = ref([])
async function getOrthMethodList() {
  const result = await Get(`/prod-api/business/orthClass/list/2/方法/${appId}`)
  methodData.value = result.data
  methodClicked.value = result.data[0].classFlag
  result.data.forEach((item) => item.orthTitleList.forEach((title) => (title.showInput = false)))
  result.data.forEach((item) => {
    item.orthTitleList.forEach((title) => {
      if (title.titleName == '矫治器') {
        title.optionId = []
        title.optionId1 = []
        title.orthOptionsList.forEach((option) => {
          if (option.optionName === '无托槽隐形矫治') {
            option.fillColor = '#C9CDD4'
            // option.seriousColor = '#f44c4c'
            option.brand = result.data[0].orthTitleList.find(
              (title) => title.titlePrompt == '无托槽'
            )
            option.hoverColor = '#2e6ce4'
            option.clicked = option.choosen ? true : false

            option.otherContent = option.brand.orthOptionsList.find(
              (option) => option.choosen === true
            )?.id
          } else if (option.optionName === '硅胶矫治器') {
            option.fillColor = '#C9CDD4'
            option.brand = result.data[0].orthTitleList.find((title) => title.titlePrompt == '硅胶')
            option.otherContent = option.brand.orthOptionsList.find(
              (option) => option.choosen === true
            )?.id
            option.hoverColor = '#2e6ce4'
            option.clicked = option.choosen ? true : false
          }
        })
        const choosenOptions = title.orthOptionsList.filter((option) => option.choosen === true)
        if (choosenOptions.length > 0) {
          title.optionId = choosenOptions.map((option) => option.id)
          title.optionId1 = title.optionId
        }
        title.otherContent = ''
      } else if (title.type == 1) {
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
getOrthMethodList()
const periodData = ref([])
async function getPeriod() {
  const result = await Get(`/prod-api/business/orthClass/list/2/周期/${appId}`)
  periodData.value = result.data
}
const remarkData = ref([])
async function getRemark() {
  const result = await Get(`/prod-api/business/orthClass/list/2/备注/${appId}`)
  remarkData.value = result.data
}
getPeriod()
getRemark()
const handleSubmitAddtionalContent = (title) => {
  if (title.cephalometricsContent) {
    const obj = {
      apmtId: appId,
      titleId: title.id,
      optionsIdStr: [],
      otherContent: '',
      cephalometricsContent: title.cephalometricsContent,
      fdiToothCode: '',
      showPosition: ''
    }
    Post('/prod-api/business/optionsResult', obj)
  }
}
const riskData = ref([])
async function getOrthRiskList() {
  const result = await Get(`/prod-api/business/orthClass/list/2/风险/${appId}`)
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
const handleSubmitBrand = (title, option) => {
  if (!option.otherContent) {
    option.clicked = false
    // title.optionId = ''
    // nextTick(() => {
    //   title.orthOptionsList.forEach((option) => (option.clicked = false))
    // })
  }
}
const handleSubmitTooth = (option, title) => {
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
        apmtId: appId,
        titleId: title.id,
        optionsIdStr: title.optionId,
        otherContent: '',
        cephalometricsContent: '',
        fdiToothCode: option2.toothCode.join(),
        showPosition: JSON.stringify(option2.position),
        fdiToothCode1: option.toothCode.join(),
        showPosition1: JSON.stringify(option.position)
      }
    } else if (option.id === 236 && !option.toothCode.join()) {
      title.optionId.splice(
        title.optionId.findIndex((a) => a == 236),
        1
      )
      const option2 = title.orthOptionsList.find((a) => a.id === 237)
      obj = {
        apmtId: appId,
        titleId: title.id,
        optionsIdStr: title.optionId,
        otherContent: '',
        cephalometricsContent: '',
        fdiToothCode: option2.toothCode.join(),
        showPosition: JSON.stringify(option2.position),
        fdiToothCode1: option.toothCode.join(),
        showPosition1: JSON.stringify(option.position)
      }
    }
  }
  if (option.id === 237) {
    const option2 = title.orthOptionsList.find((a) => a.id === 236)
    if (option2.toothCode) {
      obj = {
        apmtId: appId,
        titleId: title.id,
        optionsIdStr: title.optionId,
        otherContent: '',
        cephalometricsContent: '',
        fdiToothCode: option2.toothCode.join(),
        showPosition: JSON.stringify(option2.position),
        fdiToothCode1: option.toothCode.join(),
        showPosition1: JSON.stringify(option.position)
      }
    }
  } else {
    const option2 = title.orthOptionsList.find((a) => a.id === 237)
    if (option2.toothCode) {
      obj = {
        apmtId: appId,
        titleId: title.id,
        optionsIdStr: title.optionId,
        otherContent: '',
        cephalometricsContent: '',
        fdiToothCode1: option2.toothCode.join(),
        showPosition1: JSON.stringify(option2.position),
        fdiToothCode: option.toothCode.join(),
        showPosition: JSON.stringify(option.position)
      }
    } else {
      title.optionId.splice(
        title.optionId.findIndex((a) => a == 236),
        1
      )
      obj = {
        apmtId: appId,
        titleId: title.id,
        optionsIdStr: title.optionId,
        otherContent: '',
        cephalometricsContent: '',
        fdiToothCode: option2.toothCode.join(),
        showPosition: JSON.stringify(option2.position),
        fdiToothCode1: option.toothCode.join(),
        showPosition1: JSON.stringify(option.position)
      }
    }
  }

  Post('/prod-api/business/optionsResult', obj).then(() => {
    option.submitAble = false
    getOrthRiskList()
  })
}
const handleSelectTooth = (item, option) => {
  // 选择了之后是
  useSelectTooth(item, option)
}
const requestAgain = ref(false)
async function handleChangeOption(optionId, title, option, title1, owningModule) {
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
  } else if (title.titleName == '品牌') {
    option.visible = false
    useUpdateOption(option.otherContent, title, '', appId)
    useUpdateOption(title1.optionId, title1, '', appId)
    return
  }
  useChangeOption(optionId, title, appId)
  const res = await useUpdateOption(title.optionId, title, '', appId)
  if (requestAgain.value && res.code == 200) {
    getOrthRiskList()
  }

  if ((res.code == 200) & (title.titleName == '矫治器')) {
    getOrthMethodList()
  }
}
async function handleEmptyRadio(optionId, title, owningModule) {
  if (
    title.orthOptionsList.some((option) => option.choosen == true) &&
    title.type == 1 &&
    title.optionId == optionId
  ) {
    emptyRadio(optionId, title)
    useUpdateOption(null, title, '', appId)
    if (owningModule == 'plan') {
      getOrthPlanList()
    } else if (owningModule == 'method') {
      getOrthMethodList()
    } else if (owningModule == 'goal') {
      getOrthGoalList()
    }
    // 重新请求数据
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
</script>

<style lang="scss" scoped>
.formItem__content {
  display: flow-root;
  :deep .el-checkbox-group {
    width: 100%;
  }
}
.content {
  padding: 20px;
  padding-bottom: 0;
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
