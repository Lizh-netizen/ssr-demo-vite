<template>
  <el-radio-group
    v-if="title.type == 1"
    v-model="title.optionId"
    @change="handleChangeOption(title.optionId, title, classId, owningModule)"
    @dblclick="handleEmptyRadio(title.optionId, title, owningModule)"
  >
    <template v-for="(option, index) in title.orthOptionsList" :key="option.id">
      <!-- 没有optionSuffix的情况 -->
      <template v-if="!option.optionSuffix">
        <el-radio-button
          :class="{
            serious: option.serious == '1',
            checked: option.choosen === true
          }"
          :value="option.id"
        >
          {{ option.optionName }}
          <img
            class="aiFlagImg"
            src="@/assets/svg/AIFlagForFront.svg"
            v-show="title.aiFlag == '1' && option.choosen"
          /> </el-radio-button
      ></template>
      <template v-else>
        <!-- 刚开始没有牙齿，点击之后悬浮，这里的trigger:click是点击选项的时候才显示 -->
        <template v-if="!option.fdiToothCode">
          <el-popover
            placement="right"
            :width="490"
            trigger="click"
            @show="handleBeforeEnterPopover(option)"
            @after-leave="handleSubmitTooth(option, title, classId, owningModule)"
          >
            <template #reference>
              <!-- 这里是浮上去的时候改变图标的颜色 -->
              <el-radio-button
                @mouseenter="handleMouseEnter(option)"
                @mouseleave="handleMouseLeave(option)"
                @click="handleClickOption(option)"
                :class="{
                  serious: option.serious == '1',
                  checked: option.choosen === true
                }"
                :value="option.id"
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
                        option.choosen
                          ? option.seriousColor
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
            <ChooseTooth :option="option" @toothClicked="handleToothClicked(option)"></ChooseTooth>
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
            <!-- 有牙齿的情况下悬浮显示选中牙位 -->
            <template #reference>
              <el-radio-button
                @mouseenter="handleMouseEnterBtn(option)"
                :class="{
                  serious: option.serious == '1',
                  checked: option.choosen === true
                }"
                :value="option.id"
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
              </el-radio-button>
            </template>
            <Tooth
              :step="5"
              :title="option"
              :appId="appId"
              @submitTooth="(val) => handleSubmitTooth(val, title, classId, owningModule)"
              @toothClicked="handleToothClicked(option)"
            />
          </el-popover>
        </template>
      </template>
    </template>
  </el-radio-group>
  <el-checkbox-group
    v-model="title.optionId"
    v-if="title.type == 2"
    @change="handleChangeOption(title.optionId, title, classId, owningModule)"
  >
    <el-checkbox-button
      :class="{
        serious: option.serious == '1',
        checked: option.choosen === true
      }"
      v-for="option in title.orthOptionsList"
      :key="option.id"
      :value="option.id"
    >
      {{ option.optionName }}
      <img src="../../assets/svg/checked.svg" v-if="option.serious == '0'" /><img
        src="../../assets/svg/abnormalChecked.svg"
        v-else
      />
    </el-checkbox-button>
  </el-checkbox-group>

  <el-input
    v-if="
      (title.optionId.constructor === Array && title.optionId.includes(9)) || title.optionId == 9
    "
    placeholder="请输入"
    v-model="title.otherContent"
    @blur="handleSubmit(title.optionId, title, classId, owningModule)"
  />
</template>

<script setup>
import { GetSymptom } from '../../utils/tooth'
import emptyRadio from '@/effects/emptyRadio.ts'
import { Post } from '../../utils/request.ts'
import updateOption from '@/effects/evaluateUpdateOption.ts'
import ChooseTooth from '@/components/list/chooseTooth.vue'
const props = defineProps({
  title: {
    type: Object,
    default: () => {}
  },
  pdfId: {
    type: String,
    default: ''
  },
  appId: {
    type: String,
    default: ''
  },
  isShow: {
    type: Boolean,
    default: false
  },
  mouthData: {
    type: Object,
    default: () => []
  },
  owningModule: {
    type: String,
    default: ''
  },
  // disabled: {
  //   type: Boolean,
  //   default: false
  // },
  savedTitleList: {
    type: Array,
    default: () => []
  },
  classId: {
    type: Number,
    default: ''
  },
  className: {
    type: String,
    default: ''
  }
})

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
const emit = defineEmits(['refreshList', 'syncOption'])
async function handleEmptyRadio(optionId, title, classId, owningModule) {
  if (
    title.orthOptionsList.some((option) => option.choosen == true) &&
    title.type == 1 &&
    title.optionId == optionId
  ) {
    emptyRadio(optionId, title)
    updateOption(null, title, props.appId, classId, owningModule)
    // 重新请求数据
    emit('refreshList', props.owningModule)
  }
}
const requestAgain = ref(false)
const handleChangeOption = (optionId, title, classId, owningModule) => {
  // 这几个选项选过之后重新请求
  if (
    title.titleName == '前牙覆合' ||
    title.titleName == '前牙覆盖' ||
    title.titleName == '后牙' ||
    title.titleName == '锁HE' ||
    title.titleName == '反覆合程度' ||
    title.titleName == '反覆盖程度' ||
    title.titleName == '左侧后牙' ||
    title.titleName == '右侧后牙' ||
    title.titleName == '凹面型表现'
  ) {
    requestAgain.value = true
  }
  const found = props.mouthData.find((item) => item.className == '正面咬合')
  if (title.titleName == '前牙覆合') {
    if (title.orthOptionsList.find((a) => optionId == a.id).optionName == '前牙反覆合') {
      found.orthTitleList = props.savedTitleList.filter((t) => t.titleName !== '反覆盖程度')
    } else if (title.orthOptionsList.find((a) => optionId == a.id).optionName !== '前牙反覆合') {
      if (title.orthOptionsList.find((a) => optionId == a.id).optionName !== '前牙对刃') {
        const title1 = props.savedTitleList.find((title) => title.titleName == '反覆合程度')
        const title4 = props.savedTitleList.find((title) => title.titleName == '反覆盖程度')
        const title1Choose = title1.orthOptionsList.some((item) => item.choosen)
        const title4Choose = title4.orthOptionsList.some((item) => item.choosen)
        // 反覆合如果有选中的，需要取消
        if (title1Choose) {
          updateOption(null, title1, props.appId, classId, owningModule)
        }
        if (title4Choose) {
          updateOption(null, title4, props.appId, classId, owningModule)
        }

        // 判断凹面型表现是否需要清空
        const title2 = props.savedTitleList.find((title) => title.titleName == '前牙覆盖')

        // 如果前牙覆盖中的反覆盖选项被选中，需要清空
        const option = title2.orthOptionsList.find((item) => item.optionName == '前牙反覆盖')
        const option1 = title2.orthOptionsList.find((item) => item.optionName == '前牙对刃')
        if (option.choosen) {
          updateOption(null, title2, props.appId, classId, owningModule)
        }
        if (option1.choosen) {
          updateOption(null, title2, props.appId, classId, owningModule)
        }
        const title3 = props.savedTitleList.find((title) => title.titleName == '凹面型表现')
        const title3Choose = title3.orthOptionsList.some((item) => item.choosen)

        if (title3Choose) {
          updateOption(null, title3, props.appId, classId, owningModule)
        }
      } else {
        const title1 = props.savedTitleList.find((title) => title.titleName == '反覆合程度')
        const title4 = props.savedTitleList.find((title) => title.titleName == '反覆盖程度')
        const title1Choose = title1.orthOptionsList.some((item) => item.choosen)
        const title4Choose = title4.orthOptionsList.some((item) => item.choosen)
        // 反覆合如果有选中的，需要取消
        if (title1Choose) {
          updateOption(null, title1, props.appId, classId, owningModule)
        }
        if (title4Choose) {
          updateOption(null, title4, props.appId, classId, owningModule)
        }
        const title3 = props.savedTitleList.find((title) => title.titleName == '凹面型表现')
        const title3Choose = title3.orthOptionsList.some((item) => item.choosen)

        if (title3Choose) {
          updateOption(null, title3, props.appId, classId, owningModule)
        }
      }
    }
  }
  if (title.titleName == '前牙覆盖') {
    if (title.orthOptionsList.find((a) => optionId == a.id).optionName == '前牙反覆盖') {
      found.orthTitleList = props.savedTitleList.filter((t) => t.titleName !== '反覆合程度')
    } else if (title.orthOptionsList.find((a) => optionId == a.id).optionName !== '前牙反覆盖') {
      if (title.orthOptionsList.find((a) => optionId == a.id).optionName !== '前牙对刃') {
        const title1 = props.savedTitleList.find((title) => title.titleName == '反覆盖程度')
        const title4 = props.savedTitleList.find((title) => title.titleName == '反覆合程度')
        const title1Choose = title1.orthOptionsList.some((item) => item.choosen)
        const title4Choose = title4.orthOptionsList.some((item) => item.choosen)
        // 反覆盖如果有选中的，需要取消
        if (title1Choose) {
          updateOption(null, title1, props.appId, classId, owningModule)
        }
        // 反覆合如果有选中的，需要取消
        if (title4Choose) {
          updateOption(null, title4, props.appId, classId, owningModule)
        }
        // 判断凹面型表现是否需要清空
        const title2 = props.savedTitleList.find((title) => title.titleName == '前牙覆合')

        const option = title2.orthOptionsList.find((item) => item.optionName == '前牙反覆合')
        const option1 = title2.orthOptionsList.find((item) => item.optionName == '前牙对刃')
        if (option.choosen) {
          updateOption(null, title2, props.appId, classId, owningModule)
        }
        if (option1.choosen) {
          updateOption(null, title2, props.appId, classId, owningModule)
        }
        const title3 = props.savedTitleList.find((title) => title.titleName == '凹面型表现')
        const title3Choose = title3.orthOptionsList.some((item) => item.choosen)
        if (title3Choose) {
          updateOption(null, title3, props.appId, classId, owningModule)
        }
      } else {
        const title1 = props.savedTitleList.find((title) => title.titleName == '反覆合程度')
        const title4 = props.savedTitleList.find((title) => title.titleName == '反覆盖程度')
        const title1Choose = title1.orthOptionsList.some((item) => item.choosen)
        const title4Choose = title4.orthOptionsList.some((item) => item.choosen)
        // 反覆合如果有选中的，需要取消
        if (title1Choose) {
          updateOption(null, title1, props.appId, classId, owningModule)
        }
        if (title4Choose) {
          updateOption(null, title4, props.appId, classId, owningModule)
        }
        const title3 = props.savedTitleList.find((title) => title.titleName == '凹面型表现')
        const title3Choose = title3.orthOptionsList.some((item) => item.choosen)

        if (title3Choose) {
          updateOption(null, title3, props.appId, classId, owningModule)
        }
      }
    }
  }
  if (title.type == 2) {
    // 无和别的选项互斥逻辑
    if (title.optionId1.includes(10) && title.optionId1.length < title.optionId.length) {
      title.optionId1 = title.optionId.filter((o) => o !== 10)
      title.optionId = title.optionId1
    } else if (
      !title.optionId1.includes(10) &&
      title.optionId1.length < title.optionId.length &&
      title.optionId.includes(10)
    ) {
      title.optionId1 = [10]
      title.optionId = [10]
      title.otherContent = ''
    }
    title.orthOptionsList.forEach((option) => {
      if (!title.optionId.includes(option.id)) {
        option.choosen = false
      } else {
        option.choosen = true
      }
    })
    if (title.optionId1.includes(299) && title.optionId1.length < title.optionId.length) {
      title.optionId1 = title.optionId.filter((o) => o !== 299)
      title.optionId = title.optionId1
    } else if (
      !title.optionId1.includes(299) &&
      title.optionId1.length < title.optionId.length &&
      title.optionId.includes(299)
    ) {
      title.optionId1 = [299]
      title.optionId = [299]
      title.otherContent = ''
    }
    title.orthOptionsList.forEach((option) => {
      if (!title.optionId.includes(option.id)) {
        option.choosen = false
      } else {
        option.choosen = true
      }
    })
  }
  if (title.type == 1) {
    title.orthOptionsList.forEach((option) => {
      if (optionId !== option.id) {
        option.choosen = false
      }
    })
  }
  updateOption(title.optionId, title, props.appId, classId, owningModule)
  if (requestAgain.value) {
    emit('refreshList', props.owningModule)
  }
}
const handleToothClicked = (option) => {
  option.toothClicked = true
}
// chooseTooth那里在里边选择牙齿，等到弹窗消失之后提交牙齿, 是标题和选项公用的
const handleSubmitTooth = (option, title, classId, owningModule) => {
  let obj
  if (option) {
    option.visible = false
    if (!option.toothClicked && option.toothCode.length > 0) {
      return
    }
  }
  if (title) {
    title.visible = false
  }
  if (!option && !title.submitAble) {
    return
  }
  // 选项中的牙位
  if (option) {
    if (option.toothCode.length == 0) {
      if (props.className == '正面咬合') {
        let item1 = props.mouthData.find((item) => item.className == '正面咬合')
        obj = {
          aptmId: props.appId,
          titleId: title.id,
          optionsIdStr: [],
          otherContent: '',
          cephalometricsContent: '',
          optionSuffix: '牙位图',
          fdiToothCode: '',
          showPosition: '',
          classId: classId,
          owningModule: owningModule
        }
        const obj1 = {
          aptmId: props.appId,
          titleId: '',
          optionsIdStr: [],
          otherContent: '',
          cephalometricsContent: '',
          optionSuffix: '牙位图',
          fdiToothCode: '',
          showPosition: '',
          classId: classId,
          owningModule: owningModule
        }
        const obj2 = {
          aptmId: props.appId,
          titleId: '',
          optionsIdStr: [],
          otherContent: '',
          cephalometricsContent: '',
          optionSuffix: '牙位图',
          fdiToothCode: '',
          showPosition: '',
          classId: classId,
          owningModule: owningModule
        }
        const obj3 = {
          aptmId: props.appId,
          titleId: '',
          optionsIdStr: [],
          otherContent: '',
          cephalometricsContent: '',
          optionSuffix: '牙位图',
          fdiToothCode: '',
          showPosition: '',
          classId: classId,
          owningModule: owningModule
        }
        const obj4 = {
          aptmId: props.appId,
          titleId: '',
          optionsIdStr: [],
          otherContent: '',
          cephalometricsContent: '',
          optionSuffix: '牙位图',
          fdiToothCode: '',
          showPosition: '',
          classId: classId,
          owningModule: owningModule
        }
        let title1 = {}
        let title2 = {}
        let title3 = {}
        let title4 = {}
        if (option.optionName == '前牙反覆合') {
          title1 = item1.orthTitleList.find((title) => title.titleName == '前牙覆盖')
          title2 = item1.orthTitleList.find((title) => title.titleName == '反覆合程度')
          title3 = item1.orthTitleList.find((title) => title.titleName == '反覆盖程度')
          title4 = item1.orthTitleList.find((title) => title.titleName == '凹面型表现')
        } else if (option.optionName == '前牙反覆盖') {
          title1 = item1.orthTitleList.find((title) => title.titleName == '前牙覆合')
          title2 = item1.orthTitleList.find((title) => title.titleName == '反覆盖程度')
          title3 = item1.orthTitleList.find((title) => title.titleName == '反覆合程度')
          title4 = item1.orthTitleList.find((title) => title.titleName == '凹面型表现')
        } else if (option.optionName == '前牙对刃' && title.titleName == '前牙覆盖') {
          title1 = item1.orthTitleList.find((title) => title.titleName == '前牙覆合')
        } else if (option.optionName == '前牙对刃' && title.titleName == '前牙覆合') {
          title1 = item1.orthTitleList.find((title) => title.titleName == '前牙覆盖')
        }
        obj1.titleId = title1?.id
        obj2.titleId = title2?.id
        obj3.titleId = title3?.id
        obj4.titleId = title4?.id
        if (obj1.titleId) {
          Post('/prod-api/emr/facialAssessment/addFacialResult', obj1)
        }
        if (obj2.titleId) {
          Post('/prod-api/emr/facialAssessment/addFacialResult', obj2)
        }
        if (obj3.titleId) {
          Post('/prod-api/emr/facialAssessment/addFacialResult', obj3)
        }
        if (obj4.titleId) {
          Post('/prod-api/emr/facialAssessment/addFacialResult', obj4)
        }
        Post('/prod-api/emr/facialAssessment/addFacialResult', obj).then(() => {
          option.submitAble = false
          title.submitAble = false
          emit('refreshList', owningModule)
        })
        return
      } else {
        obj = {
          aptmId: props.appId,
          titleId: title.id,
          optionsIdStr: [],
          otherContent: '',
          cephalometricsContent: '',
          optionSuffix: '牙位图',
          fdiToothCode: '',
          showPosition: '',
          classId: classId,
          owningModule: owningModule
        }
        Post('/prod-api/emr/facialAssessment/addFacialResult', obj).then(() => {
          option.submitAble = false
          title.submitAble = false
          emit('refreshList', owningModule)
        })
        return
      }
    }
  }
  if (
    option.optionName == '前牙反覆合' ||
    option.optionName == '前牙反覆盖' ||
    option.optionName == '前牙对刃'
  ) {
    emit('syncOption', { option: option, titleName: title.titleName })
  }
  updateOption(title.optionId, title, props.appId, classId, owningModule, option).then(() => {
    if (option) {
      option.submitAble = false
    }
    if (title) {
      title.submitAble = false
    }
    emit('refreshList', props.owningModule)
  })
}

const handleSubmit = (optionId, title, classId, owningModule) => {
  updateOption(optionId, title, props.appId, classId, owningModule)
}
const handleClickOption = (option) => {
  option.visible = true
  option.clicked = true
}
const handleMouseEnterBtn = (option) => {
  option.visible = true
  option.hover = true
}
const closePopper = (option) => {
  const poppers = document.querySelectorAll('.myPopper')
  option.visible = false
}
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
const handleMouseEnter = (option) => {
  option.visible = true
  if (!props.disabled) {
    option.hover = true
  }
}
let timeout
const handleMouseLeave = (option) => {
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
</script>

<style scoped>
:deep .el-radio-button {
  svg {
    position: relative;
    left: 3px;
  }

  .aiFlagImg {
    position: absolute;
    right: -6px;
    top: -4px;
  }
}
</style>
