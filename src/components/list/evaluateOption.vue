<template>
  <!-- 单选 -->
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
            src="@/assets/svg/AIFlagForFront.png"
            v-show="title.aiFlag == '1' && option.choosen"
          />
        </el-radio-button>
      </template>
      <template v-else>
        <!-- 这里是浮上去的时候改变图标的颜色 -->
        <el-radio-button
          @mouseenter="(e) => handleMouseEnter(e, option, index)"
          @mouseleave="handleMouseLeave(option)"
          @click="(e) => handleClickOption(e, option, index)"
          :class="{
            serious: option.serious == '1',
            checked: option.choosen === true
          }"
          :value="option.id"
        >
          {{ option.optionName }}
          <span
            class="iconfont icon-warning"
            :style="{
              color: option.choosen
                ? option.seriousColor
                : option.hover
                  ? option.hoverColor
                  : option.fillColor,
              fontSize: '14px'
            }"
          ></span>
        </el-radio-button>
      </template>
    </template>
  </el-radio-group>

  <!-- 多选 -->
  <el-checkbox-group
    v-if="title.type == 2"
    v-model="title.optionId"
    @change="handleChangeOption(title.optionId, title, classId, owningModule)"
  >
    <template v-for="(option, index) in title.orthOptionsList" :key="option.id">
      <template v-if="!option.optionSuffix">
        <el-checkbox-button
          :class="{
            serious: option.serious == '1',
            checked: option.choosen === true
          }"
          :value="option.id"
        >
          {{ option.optionName }}
          <img src="../../assets/svg/checked.svg" v-if="option.serious == '0'" />
          <img src="../../assets/svg/abnormalChecked.svg" v-else />
        </el-checkbox-button>
      </template>
      <template v-else>
        <el-checkbox-button
          @mouseenter="(e) => handleMouseEnter(e, option, index)"
          @mouseleave="handleMouseLeave(option)"
          @click="(e) => handleClickOption(e, option, index)"
          :class="{
            serious: option.serious == '1',
            checked: option.choosen === true
          }"
          :value="option.id"
        >
          {{ option.optionName }}
          <span
            class="iconfont icon-warning"
            :style="{
              color: option.clicked
                ? option.seriousColor
                : option.hover
                  ? option.hoverColor
                  : option.fillColor,
              fontSize: '14px'
            }"
          ></span>

          <img src="../../assets/svg/checked.svg" v-if="option.serious == '0'" /><img
            src="../../assets/svg/abnormalChecked.svg"
            v-else
          />
        </el-checkbox-button>
      </template>
    </template>
  </el-checkbox-group>

  <!-- 选择牙位 -->
  <el-popover
    :width="490"
    placement="right"
    trigger="click"
    @after-leave="handleSubmitTooth(optionData, title, classId, owningModule)"
    ref="virtualRef"
    :visible="optionData.selected"
    :virtual-ref="buttonRef"
    virtual-triggering
  >
    <div v-click-outside="onClickOutside">
      <ChooseTooth :option="optionData" @toothClicked="handleToothClicked"></ChooseTooth>
    </div>
  </el-popover>

  <!--  有牙齿的情况下悬浮显示选中牙位 -->
  <el-popover
    popper-class="myPopper"
    :popper-style="{ width: 'auto', 'min-width': '100px' }"
    placement="top-start"
    ref="popoverRef"
    :visible="optionData.visible"
    :virtual-ref="buttonRef"
    virtual-triggering
  >
    <div class="diagramWrapper" @click="handleClickTooth">
      <div class="diagram">
        <div class="diagramBox">
          <div class="toothItem1">
            {{ sortTooth(optionData.topLeft) }}
          </div>
          <div class="toothItem2">
            {{ sortTooth(optionData.topRight) }}
          </div>
        </div>
        <div class="diagramBox">
          <div class="toothItem3">
            {{ sortTooth(optionData.bottomLeft) }}
          </div>
          <div class="toothItem4">
            {{ sortTooth(optionData.bottomRight) }}
          </div>
        </div>
      </div>
    </div>
  </el-popover>

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
import { handleExclusiveOptions } from '@/effects/changeOption.ts'
import { ClickOutside as vClickOutside } from 'element-plus'
import { useStore } from 'vuex'

const store = useStore()
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
    handleExclusiveOptions(title, 10)
    handleExclusiveOptions(title, 44)
    handleExclusiveOptions(title, 299)
    handleExclusiveOptions(title, 321)
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
  if (title.titleName == '右侧后牙' || title.titleName == '左侧后牙') {
    updateOption(title.optionId, title, props.appId, classId, owningModule, null, props.mouthData)
  } else {
    updateOption(title.optionId, title, props.appId, classId, owningModule)
  }

  if (requestAgain.value) {
    emit('refreshList', props.owningModule)
  }
}
const handleToothClicked = (val) => {
  // props.title.orthOptionsList.forEach((item) => {
  //   if (item.id == val.id) {
  //     item.toothClicked = true
  //   }
  // })
  optionData.value = val
  optionData.value.toothClicked = true
}
// chooseTooth那里在里边选择牙齿，等到弹窗消失之后提交牙齿, 是标题和选项公用的
const handleSubmitTooth = (option, title, classId, owningModule) => {
  let obj
  if (option) {
    option.selected = false
    if (!option.toothClicked && option.toothCode.length > 0) {
      return
    }
  }
  if (title) {
    title.selected = false
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

  updateOption(
    title.optionId,
    title,
    props.appId,
    classId,
    owningModule,
    option,
    props.mouthData,
    store
  ).then(() => {
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

// 展示牙位处理
const sortTooth = (val) => {
  if (val) {
    const obj = val
      .sort((a, b) => a.sort - b.sort)
      .map((a) => a.value)
      .join('')
    return obj
  }
}

const popoverRef = ref()
const virtualRef = ref()
const buttonRef = ref() // popover虚拟触发绑定的ref参数
const optionData = ref({
  visible: false,
  selected: false
})

const handleClickOption = (e, option, index) => {
  // 使用索引直接引用原始数组中的对象
  optionData.value = props.title.orthOptionsList[index]

  if (!option.fdiToothCode) {
    buttonRef.value = e.target
    optionData.value.selected = true // 注意这里修改的是原始数组中的对象
  }
}
const handleMouseEnter = (e, option, index) => {
  optionData.value = props.title.orthOptionsList[index]

  if (option.fdiToothCode) {
    buttonRef.value = e.target
    optionData.value.visible = true
  }
  if (!props.disabled) {
    option.hover = true
  }
}
const handleMouseLeave = (option) => {
  option.hover = false
  setTimeout(() => {
    optionData.value.visible = false
  }, 1000)
}
const handleClickTooth = () => {
  optionData.value.visible = false
  optionData.value.selected = true
}
const onClickOutside = () => {
  optionData.value.visible = false
  optionData.value.selected = false
}
</script>

<style scoped lang="scss">
:deep .el-radio-button {
  .aiFlagImg {
    position: absolute;
    right: -6px;
    top: -4px;
  }
}

.diagramWrapper {
  width: 150px;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    cursor: pointer;
    background: #f7f8fa;
    border-radius: 6px;
  }

  .diagram {
    position: relative;
    .diagramBox {
      width: 122px;
      height: 36px;
      display: flex;
      div {
        height: 36px;
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
</style>
