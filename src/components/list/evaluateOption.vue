<template>
  <el-radio-group
    v-if="title.type == 1"
    v-model="title.optionId"
    @change="handleChangeOption(title.optionId, title)"
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
          :label="option.id"
          :disabled="disabled"
        >
          {{ option.optionName }}
          <img
            class="aiFlagImg"
            src="@/assets/svg/AIFlagForFront.svg"
            v-show="title.aiFlag == '1' && option.choosen"
          /> </el-radio-button
      ></template>
      <template v-else>
        <!-- 刚开始没有牙齿，点击之后悬浮 -->
        <template v-if="option.fdiToothCode == null">
          <el-popover
            placement="right"
            :width="490"
            trigger="click"
            @show="handleBeforeEnterPopover(option)"
            @after-leave="handleSubmitTooth(option, title)"
          >
            <template #reference>
              <!-- 这里是浮上去的时候改变图标的颜色 -->
              <el-radio-button
                :disabled="disabled"
                @mouseenter="handleMouseEnter(option)"
                @mouseleave="handleMouseLeave(option)"
                @click="handleClickOption(option)"
                :class="{
                  serious: option.serious == '1',
                  checked: option.choosen === true
                }"
                :label="option.id"
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
          >
            <!-- 有牙齿的情况下悬浮显示选中牙位 -->
            <template #reference>
              <el-radio-button
                :disabled="disabled"
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
              </el-radio-button>
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
      :disabled="disabled"
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
    @blur="handleSubmit(title.optionId, title)"
  />
</template>

<script setup>
import useChangeOption from '@/effects/changeOption.ts'
import { GetSymptom } from '../../utils/tooth'
import emptyRadio from '@/effects/emptyRadio.ts'
import { Post } from '../../utils/request.ts'
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
  disabled: {
    type: Boolean,
    default: false
  },
  savedTitleList: {
    type: Array,
    default: () => []
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
const emit = defineEmits(['refreshList', 'changeIconColor'])
async function handleEmptyRadio(optionId, title, owningModule) {
  if (
    title.orthOptionsList.some((option) => option.choosen == true) &&
    title.type == 1 &&
    title.optionId == optionId
  ) {
    emptyRadio(optionId, title)
    updateOption(null, title, '', props.appId)
    // 重新请求数据
    emit('refreshList', props.owningModule)
  }
}
const requestAgain = ref(false)
const handleChangeOption = (optionId, title) => {
  // 这几个选项选过之后重新请求
  if (
    title.titleName == '前牙覆合' ||
    title.titleName == '前牙覆盖' ||
    title.titleName == '后牙' ||
    title.titleName == '锁HE' ||
    title.titleName == '反覆合程度' ||
    title.titleName == '反覆盖程度'
  ) {
    requestAgain.value = true
  }
  const found = props.mouthData.find((item) => item.className == '正面咬合')
  if (title.titleName == '前牙覆合') {
    if (title.orthOptionsList.find((a) => optionId == a.id).optionName == '前牙反覆合') {
      found.orthTitleList = props.savedTitleList.filter((t) => t.titleName !== '反覆盖程度')
    } else if (title.orthOptionsList.find((a) => optionId == a.id).optionName !== '前牙反覆合') {
      const title1 = props.savedTitleList.find((title) => title.titleName == '反覆合程度')
      const title1Choose = title1.orthOptionsList.some((item) => item.choosen)
      // 反覆合如果有选中的，需要取消
      if (title1Choose) {
        updateOption(null, title1)
      }

      // 判断凹面型表现是否需要清空
      const title2 = props.savedTitleList.find((title) => title.titleName == '前牙覆盖')
      const option = title2.orthOptionsList.find((item) => item.optionName == '前牙反覆盖')
      const title3 = props.savedTitleList.find((title) => title.titleName == '凹面型表现')
      const title3Choose = title3.orthOptionsList.some((item) => item.choosen)
      if (!option.choosen && title3Choose) {
        updateOption(null, title3)
      }
    }
  }
  if (title.titleName == '前牙覆盖') {
    if (title.orthOptionsList.find((a) => optionId == a.id).optionName == '前牙反覆盖') {
      found.orthTitleList = props.savedTitleList.filter((t) => t.titleName !== '反覆合程度')
    } else if (title.orthOptionsList.find((a) => optionId == a.id).optionName !== '前牙反覆盖') {
      const title1 = props.savedTitleList.find((title) => title.titleName == '反覆盖程度')
      const title1Choose = title1.orthOptionsList.some((item) => item.choosen)
      // 反覆盖如果有选中的，需要取消
      if (title1Choose) {
        updateOption(null, title1)
      }

      // 判断凹面型表现是否需要清空
      const title2 = props.savedTitleList.find((title) => title.titleName == '前牙覆合')
      const option = title2.orthOptionsList.find((item) => item.optionName == '前牙反覆合')
      const title3 = props.savedTitleList.find((title) => title.titleName == '凹面型表现')
      const title3Choose = title3.orthOptionsList.some((item) => item.choosen)
      if (!option.choosen && title3Choose) {
        updateOption(null, title3)
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
  }
  if (title.type == 1) {
    title.orthOptionsList.forEach((option) => {
      if (optionId !== option.id) {
        option.choosen = false
      }
    })
  }
  updateOption(title.optionId, title)
  if (requestAgain.value) {
    emit('refreshList', props.owningModule)
  }
}
const handleSubmitTooth = (option, title, isTitle) => {
  if (isTitle && !title.submitAble) {
    return
  }
  if (!isTitle && !option.submitAble) {
    return
  }

  let obj = {
    apmtId: props.appId,
    titleId: title.id,
    optionsIdStr: isTitle ? [] : [title.optionId],
    otherContent: '',
    cephalometricsContent: '',
    optionSuffix: option.optionSuffix,
    fdiToothCode: isTitle ? title.toothCode.join() : option.toothCode.join(),
    showPosition: isTitle ? JSON.stringify(title.position) : JSON.stringify(option.position)
  }
  Post('/prod-api/business/facialResult', obj).then(() => {
    title.submitAble = false
    option.visible = false
    emit('refreshList', props.owningModule)
  })
}
async function updateOption(optionId, title) {
  let obj = null
  if (title.type == 1) {
    obj = {
      apmtId: props.appId,
      titleId: title.id,
      optionsIdStr: optionId ? [optionId] : [],
      otherContent: title.otherContent,
      cephalometricsContent: title.cephalometricsContent,
      fdiToothCode: '',
      showPosition: ''
    }
  } else if (title.type == 2) {
    obj = {
      apmtId: props.appId,
      titleId: title.id,
      optionsIdStr: optionId,
      otherContent: title.otherContent,
      cephalometricsContent: '',
      fdiToothCode: '',
      showPosition: ''
    }
  }
  await Post('/prod-api/business/facialResult', obj)
}
const handleSubmit = (optionId, title) => {
  updateOption(optionId, title, '', props.appId)
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
  console.log('🚀 ~ closePopper ~ poppers:', poppers)
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

async function handleSubmitContent(optionId, title, option) {
  option.visible = false
  if (option.otherContent) {
    const res = await updateOption(optionId, title, option.otherContent, props.appId)
    if ((res.code == 200) & (title.titleName == '骨龄')) {
      getOrthCheckList()
    }
  } else {
    title.optionId = ''
    nextTick(() => {
      title.orthOptionsList.forEach((option) => (option.clicked = false))
    })
  }
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
    z-index: 10;
  }
}
</style>
