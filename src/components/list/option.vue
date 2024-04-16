<template>
  <el-radio-group
    v-if="title.type == 1"
    v-model="title.optionId"
    @change="handleChangeOption(title.optionId, title)"
    @dblclick="handleEmptyRadio(title.optionId, title, owningModule)"
  >
    <template v-for="(option, index) in title.orthOptionsList" :key="option.id">
      <el-radio-button
        v-if="!option.optionSuffix"
        :class="{
          serious: option.serious == '1'
        }"
        :label="option.id"
        :disabled="disabled"
      >
        {{ option.optionName }}
        <img
          class="aiFlagImg"
          src="@/assets/svg/AIFlagForFront.svg"
          v-show="title.aiFlag == '1' && option.choosen"
        />
      </el-radio-button>

      <el-popover
        v-else
        popper-class="myPopper"
        :popper-style="{ width: 'auto', 'min-width': '100px' }"
        placement="top-start"
        :width="200"
        :visible="option.visible"
      >
        <template #reference>
          <el-radio-button
            :class="{
              serious: option.serious == '1',
              checked: option.choosen === true
            }"
            :label="option.id"
            @mouseenter="handleMouseEnter(option)"
            @mouseleave="handleMouseLeave(option)"
            :disabled="disabled"
          >
            {{ option.optionName
            }}<svg
              v-if="option.optionSuffix"
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
        <el-input
          maxlength="2"
          v-model="option.otherContent"
          @blur="handleSubmitContent(title.optionId, title, option)"
          :class="{
            borderless: option.otherContent
          }"
        ></el-input
        >{{ option.optionSuffix?.substr(-1) }}
      </el-popover>
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
import useUpdateOption from '@/effects/updateOption.ts'
import emptyRadio from '@/effects/emptyRadio.ts'

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
  checkData: {
    type: Object,
    default: () => {}
  },
  owningModule: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  notShowSvg: {
    type: Boolean,
    default: false
  },
  classId: {
    type: Number,
    default: 0
  },
  faceAccessData: {
    type: Object,
    default: () => {}
  },
  savedTitleList: {
    type: Array,
    default: () => []
  },
  mouthData: {
    type: Object,
    default: () => {}
  },
  module: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['refreshList'])
async function handleEmptyRadio(optionId, title, owningModule) {
  if (
    title.orthOptionsList.some((option) => option.choosen == true) &&
    title.type == 1 &&
    title.optionId == optionId
  ) {
    emptyRadio(optionId, title)
    useUpdateOption(null, title, props.appId, props.classId, props.owningModule)
    emit('refreshList', props.owningModule)
    // 重新请求数据
  }
}
const requestAgain = ref(false)
async function handleChangeOption(optionId, title) {
  // clicked.value = true
  // 这几个选项选过之后重新请求
  if (
    title.titleName == '前牙覆合' ||
    title.titleName == '前牙覆盖' ||
    title.titleName == '后牙' ||
    title.titleName == '锁HE' ||
    title.titleName == '反覆合程度' ||
    title.titleName == '反覆盖程度' ||
    title.titleName == '左侧后牙' ||
    title.titleName == '右侧后牙'
  ) {
    requestAgain.value = true
  }
  if (props.pdfId) {
    sessionStorage.removeItem(props.pdfId)
  }
  const found = props.mouthData?.find((item) => item.className == '前牙覆盖')
  if (title.titleName == '前牙覆合') {
    if (title.orthOptionsList.find((a) => optionId == a.id).optionName == '前牙反覆合') {
      found.orthTitleList = props.savedTitleList.filter((t) => t.titleName !== '反覆盖程度')
    } else if (title.orthOptionsList.find((a) => optionId == a.id).optionName !== '前牙反覆合') {
      if (title.orthOptionsList.find((a) => optionId == a.id).optionName !== '前牙对刃') {
        const title1 = props.savedTitleList.find((title) => title.titleName == '反覆合程度')
        const title1Choose = title1.orthOptionsList.some((item) => item.choosen)

        // 反覆合如果有选中的，需要取消
        if (title1Choose) {
          updateOption(null, title1, props.appId, classId)
        }

        // 判断凹面型表现是否需要清空
        const title2 = props.savedTitleList.find((title) => title.titleName == '前牙覆盖')
        // 如果前牙覆盖中的反覆盖选项被选中，需要清空
        const option = title2.orthOptionsList.find((item) => item.optionName == '前牙反覆盖')
        const option1 = title2.orthOptionsList.find((item) => item.optionName == '前牙对刃')
        if (option.choosen) {
          updateOption(null, title2, props.appId, classId)
        }
        if (option1.choosen) {
          updateOption(null, title2, props.appId, classId)
        }
        const title3 = props.savedTitleList.find((title) => title.titleName == '凹面型表现')
        const title3Choose = title3.orthOptionsList.some((item) => item.choosen)
        if (!option.choosen && title3Choose) {
          updateOption(null, title3, props.appId, classId)
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
        const title1Choose = title1.orthOptionsList.some((item) => item.choosen)
        // 反覆盖如果有选中的，需要取消
        if (title1Choose) {
          updateOption(null, title1, props.appId, classId)
        }

        // 判断凹面型表现是否需要清空
        const title2 = props.savedTitleList.find((title) => title.titleName == '前牙覆合')
        const option = title2.orthOptionsList.find((item) => item.optionName == '前牙反覆合')
        const option1 = title2.orthOptionsList.find((item) => item.optionName == '前牙对刃')
        if (option.choosen) {
          updateOption(null, title2, props.appId, classId)
        }
        if (option1.choosen) {
          updateOption(null, title2, props.appId, classId)
        }
        const title3 = props.savedTitleList.find((title) => title.titleName == '凹面型表现')
        const title3Choose = title3.orthOptionsList.some((item) => item.choosen)
        if (!option.choosen && title3Choose) {
          updateOption(null, title3, props.appId, classId)
        }
      }
    }
  }
  if (title.titleName == '侧貌') {
    const found = props.faceAccessData.find((item) => item.className == '90度侧面像')
    if (title.orthOptionsList.find((a) => optionId == a.id).optionName == '凸面型') {
      const title2 = props.savedTitleList.find((title) => title.titleName == '凹面型表现')
      useUpdateOption(null, title2, props.appId, props.classId, props.owningModule)
      found.orthTitleList = props.savedTitleList.filter((t) => !t.titleName.includes('凹'))
      title2.orthOptionsList.forEach((option) => (option.choosen = false))
      title2.optionId = []
    } else if (title.orthOptionsList.find((a) => optionId == a.id).optionName == '凹面型') {
      const title1 = props.savedTitleList.find((title) => title.titleName == '凸面型表现')
      useUpdateOption(null, title1, props.appId, props.classId, props.owningModule)
      found.orthTitleList = props.savedTitleList.filter((t) => !t.titleName.includes('凸'))
      title1.optionId = []
      title1.orthOptionsList.forEach((option) => (option.choosen = false))
    } else if (title.orthOptionsList.find((a) => optionId == a.id).optionName == '直面型') {
      found.orthTitleList = props.savedTitleList.filter(
        (t) => !t.titleName.includes('凸') && !t.titleName.includes('凹')
      )
      const title1 = props.savedTitleList.find((title) => title.titleName == '凸面型表现')

      const title2 = props.savedTitleList.find((title) => title.titleName == '凹面型表现')
      title1.optionId = []
      title2.optionId = []
      useUpdateOption(null, title1, props.appId, props.classId, props.owningModule)
      useUpdateOption(null, title2, props.appId, props.classId, props.owningModule)
      //  点击完直面型需要重新请求接口
      emit('refreshList', props.owningModule)
    }
    // getOrthFaceAccessList()
  }
  useChangeOption(optionId, title, props.appId, props.isShow, props.checkData)
  await useUpdateOption(title.optionId, title, props.appId, props.classId, props.owningModule)
}
const handleSubmit = (optionId, title) => {
  useUpdateOption(optionId, title, props.appId, props.classId, props.owningModule)
}

const handleMouseEnter = (option) => {
  if (option.otherContent) {
    option.visible = true
  }
  option.hover = true
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
  console.log(option)
  option.visible = false
  if (option.otherContent) {
    const res = await useUpdateOption(optionId, title, option.otherContent, appId)
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
  &:hover {
    svg path {
      fill: #2e6ce4;
    }
  }
  .aiFlagImg {
    position: absolute;
    right: -6px;
    top: -4px;
   
  }
}
</style>
