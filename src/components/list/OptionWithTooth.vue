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
            src="@/assets/svg/AIFlagForFront.png"
            v-show="title.aiFlag == '1' && option.choosen"
          />
        </el-radio-button>
      </template>
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
                {{ option.optionName }}
                <span
                  v-if="option.optionSuffix"
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
                {{ option.optionName }}
                <span
                  v-if="option.optionSuffix"
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
            <Tooth
              :step="5"
              :title="option"
              :appId="appId"
              @submitTooth="(val) => handleSubmitTooth(val, title, classId, owningModule)"
              @toothClicked="handleToothClicked(option)"
            />
          </el-popover>
        </template> </template
    ></template>
  </el-radio-group>

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
            @after-leave="handleSubmitTooth(option, title, classId, owningModule)"
          >
            <template #reference>
              <el-checkbox-button
                @click="option.visible = true"
                :class="{
                  serious: option.serious == '1',
                  checked: option.choosen === true
                }"
                :value="option.id"
                @mouseenter="option.hover = true"
                @mouseleave="option.hover = false"
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
            @mouseleave="option.visible = false"
          >
            <template #reference>
              <el-checkbox-button
                @mouseenter="handleMouseEnterBtn(option)"
                :class="{
                  serious: option.serious == '1',
                  checked: option.choosen === true
                }"
                :value="option.id"
                @mouseleave="(e) => handleMouseLeaveBtn(e, option)"
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
            <Tooth
              :step="5"
              :title="option"
              :appId="appId"
              @submitTooth="(val) => handleSubmitTooth(val, title, classId, owningModule)"
              @toothClicked="handleToothClicked(option)"
            />
          </el-popover>
        </template> </template
    ></template>
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
import updateOption from '@/effects/optionWithTooth.ts'
import ChooseTooth from '@/components/list/chooseTooth.vue'
import { handleExclusiveOptions } from '@/effects/changeOption.ts'
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
  },
  classId: {
    type: Number,
    default: ''
  },
  className: {
    type: String,
    default: ''
  },
  api: {
    type: String,
    default: ''
  }
})
// console.log(props.title)

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
    updateOption(null, title, props.appId, classId, owningModule, props.api)
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
          updateOption(null, title1, props.appId, classId, owningModule, props.api)
        }
        if (title4Choose) {
          updateOption(null, title4, props.appId, classId, owningModule, props.api)
        }

        // 判断凹面型表现是否需要清空
        const title2 = props.savedTitleList.find((title) => title.titleName == '前牙覆盖')

        // 如果前牙覆盖中的反覆盖选项被选中，需要清空
        const option = title2.orthOptionsList.find((item) => item.optionName == '前牙反覆盖')
        const option1 = title2.orthOptionsList.find((item) => item.optionName == '前牙对刃')
        if (option.choosen) {
          updateOption(null, title2, props.appId, classId, owningModule, props.api)
        }
        if (option1.choosen) {
          updateOption(null, title2, props.appId, classId, owningModule, props.api)
        }
        const title3 = props.savedTitleList.find((title) => title.titleName == '凹面型表现')
        const title3Choose = title3.orthOptionsList.some((item) => item.choosen)

        if (title3Choose) {
          updateOption(null, title3, props.appId, classId, owningModule, props.api)
        }
      } else {
        const title1 = props.savedTitleList.find((title) => title.titleName == '反覆合程度')
        const title4 = props.savedTitleList.find((title) => title.titleName == '反覆盖程度')
        const title1Choose = title1.orthOptionsList.some((item) => item.choosen)
        const title4Choose = title4.orthOptionsList.some((item) => item.choosen)
        // 反覆合如果有选中的，需要取消
        if (title1Choose) {
          updateOption(null, title1, props.appId, classId, owningModule, props.api)
        }
        if (title4Choose) {
          updateOption(null, title4, props.appId, classId, owningModule, props.api)
        }
        const title3 = props.savedTitleList.find((title) => title.titleName == '凹面型表现')
        const title3Choose = title3.orthOptionsList.some((item) => item.choosen)

        if (title3Choose) {
          updateOption(null, title3, props.appId, classId, owningModule, props.api)
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
          updateOption(null, title1, props.appId, classId, owningModule, props.api)
        }
        // 反覆合如果有选中的，需要取消
        if (title4Choose) {
          updateOption(null, title4, props.appId, classId, owningModule, props.api)
        }
        // 判断凹面型表现是否需要清空
        const title2 = props.savedTitleList.find((title) => title.titleName == '前牙覆合')

        const option = title2.orthOptionsList.find((item) => item.optionName == '前牙反覆合')
        const option1 = title2.orthOptionsList.find((item) => item.optionName == '前牙对刃')
        if (option.choosen) {
          updateOption(null, title2, props.appId, classId, owningModule, props.api)
        }
        if (option1.choosen) {
          updateOption(null, title2, props.appId, classId, owningModule, props.api)
        }
        const title3 = props.savedTitleList.find((title) => title.titleName == '凹面型表现')
        const title3Choose = title3.orthOptionsList.some((item) => item.choosen)
        if (title3Choose) {
          updateOption(null, title3, props.appId, classId, owningModule, props.api)
        }
      } else {
        const title1 = props.savedTitleList.find((title) => title.titleName == '反覆合程度')
        const title4 = props.savedTitleList.find((title) => title.titleName == '反覆盖程度')
        const title1Choose = title1.orthOptionsList.some((item) => item.choosen)
        const title4Choose = title4.orthOptionsList.some((item) => item.choosen)
        // 反覆合如果有选中的，需要取消
        if (title1Choose) {
          updateOption(null, title1, props.appId, classId, owningModule, props.api)
        }
        if (title4Choose) {
          updateOption(null, title4, props.appId, classId, owningModule, props.api)
        }
        const title3 = props.savedTitleList.find((title) => title.titleName == '凹面型表现')
        const title3Choose = title3.orthOptionsList.some((item) => item.choosen)

        if (title3Choose) {
          updateOption(null, title3, props.appId, classId, owningModule, props.api)
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
  console.log('enter', title.titleName)
  if (title.titleName == '右侧后牙' || title.titleName == '左侧后牙') {
    updateOption(
      title.optionId,
      title,
      props.appId,
      classId,
      owningModule,
      props.api,
      null,
      props.mouthData
    )
  } else {
    updateOption(title.optionId, title, props.appId, classId, owningModule, props.api)
  }

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
          Post(`/prod-api/emr/${props.api}`, obj1)
        }
        if (obj2.titleId) {
          Post(`/prod-api/emr/${props.api}`, obj2)
        }
        if (obj3.titleId) {
          Post(`/prod-api/emr/${props.api}`, obj3)
        }
        if (obj4.titleId) {
          Post(`/prod-api/emr/${props.api}`, obj4)
        }
        Post(`/prod-api/emr/${props.api}`, obj).then(() => {
          option.submitAble = false
          title.submitAble = false
          emit('refreshList', owningModule)
        })
        return
      } else {
        updateOption(
          title.optionId,
          title,
          props.appId,
          classId,
          owningModule,
          props.api,
          option,
          props.mouthData
        ).then(() => {
          if (option) {
            option.submitAble = false
          }
          if (title) {
            title.submitAble = false
          }
          emit('refreshList', props.owningModule)
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
    emit('syncOption', { option: option, titleName: title.titleName, classId: classId })
  }
  updateOption(
    title.optionId,
    title,
    props.appId,
    classId,
    owningModule,
    props.api,
    option,
    props.mouthData
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
  updateOption(optionId, title, props.appId, classId, owningModule, props.api)
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

<style scoped lang="scss"></style>
