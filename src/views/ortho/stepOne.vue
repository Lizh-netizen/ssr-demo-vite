<template>
  <div class="stepOne">
    <Header text="患者信息" backgroundColor="#f4f7fd" />

    <div class="patientInfo">
      <div class="patientInfo__item">
        <span class="patientInfo__item__desc">患者姓名</span
        ><span class="patientInfo__item__detail">{{ patientInfo.Name }}</span>
      </div>
      <div class="patientInfo__item">
        <span class="patientInfo__item__desc">病例号</span
        ><span class="patientInfo__item__detail">{{ patientInfo.PrivateId }}</span>
      </div>
      <div class="patientInfo__item">
        <span class="patientInfo__item__desc">性别</span
        ><span class="patientInfo__item__detail">{{
          patientInfo.Sex === 1 ? '男' : patientInfo.Sex === 2 ? '女' : '未知'
        }}</span>
      </div>
      <div class="patientInfo__item">
        <span class="patientInfo__item__desc">生日</span
        ><span class="patientInfo__item__detail">{{ patientInfo.age }} </span>
      </div>
    </div>
    <Header text="问诊" backgroundColor="#f4f7fd" />
    <div class="content inquiry" :style="{ 'min-height': '600px' }">
      <form-item label="主诉" width="58px"
        ><el-input
          v-model="complainTitle.cephalometricsContent"
          @blur="handleSubmitAddtionalContent(complainTitle, inquiryId, '问诊')"
        ></el-input
      ></form-item>
      <form-item label="现病史" width="58px"
        ><el-input
          v-model="currentTitle.cephalometricsContent"
          @blur="handleSubmitAddtionalContent(currentTitle, inquiryId, '问诊')"
        ></el-input
      ></form-item>
      <template v-for="item in inquiryData" :key="item.id">
        <template v-if="item.className">
          <form-item :label="item.className" class="specialFormItem">
            <div class="innerContent content">
              <form-item
                :label="title.titleName"
                width="100px"
                v-for="title in item.orthTitleList"
                :key="title.id"
              >
                <Option
                  :title="title"
                  :appId="appId"
                  @refreshList="refreshList"
                  owningModule="问诊"
                  :classId="item.id"
                ></Option>
              </form-item>
            </div>
          </form-item>
        </template>
        <template v-if="!item.className">
          <div :style="{ display: 'flex', gap: '16px' }">
            <template v-for="title in item.orthTitleList" :key="title.id">
              <template v-if="title.titleName !== '主诉' && title.titleName !== '现病史'">
                <form-item :label="title.titleName" width="100px">
                  <Option
                    :title="title"
                    :appId="appId"
                    @refreshList="refreshList"
                    owningModule="问诊"
                    :classId="item.id"
                  ></Option>
                </form-item>
              </template>
            </template>
          </div>
        </template>
      </template>
    </div>
    <Header text="临床检查" backgroundColor="#f4f7fd" />
    <div class="content">
      <template v-for="title in checkData.orthTitleList" :key="title.id">
        <template v-if="title.titleName !== '关节弹响' && title.titleName !== '侧关节'">
          <form-item :label="title.titleName" width="100px">
            <el-radio-group
              v-if="title.type == 1"
              v-model="title.optionId"
              @change="
                handleChangeOption(title.optionId, title, checkData.id, checkData.owningModule)
              "
              @dblclick="
                handleEmptyRadio(title.optionId, title, checkData.id, checkData.owningModule)
              "
            >
              <template v-for="(option, index) in title.orthOptionsList" :key="option.id">
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
                  @show="showPopover(index - 2)"
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
                    :ref="inputRefs[index - 2]"
                    v-model="option.otherContent"
                    @blur="
                      handleSubmitContent(
                        title.optionId,
                        title,
                        option,
                        checkData.id,
                        checkData.owningModule
                      )
                    "
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
              @change="
                handleChangeOption(title.optionId, title, checkData.id, checkData.owningModule)
              "
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
            <el-input
              v-if="
                (title.optionId.constructor === Array && title.optionId.includes(9)) ||
                title.optionId == 9
              "
              placeholder="请输入"
              v-model="title.otherContent"
              @blur="handleSubmit(title.optionId, title, checkData.id, checkData.owningModule)"
            />
          </form-item>
        </template>
        <!-- 关节错乱 -->

        <template v-if="title.titleName == '关节弹响'">
          <div :style="{ display: 'inline-flex' }">
            <div class="specialTitle">{{ title.titleName }}</div>

            <el-radio-group
              class="specialRadio"
              v-model="title.optionId"
              @change="
                handleChangeOption(title.optionId, title, checkData.id, checkData.owningModule)
              "
              @dblclick="
                handleEmptyRadio(title.optionId, title, checkData.id, checkData.owningModule)
              "
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
            <template v-if="isShow">
              <el-select
                v-model="title.selectId"
                class="specialSelect"
                @change="handleChange(title, title, checkData.id)"
              >
                <el-option
                  v-for="opt in title.listMap"
                  :key="opt.id"
                  :label="opt.optionName"
                  :value="opt.id"
                  >{{ opt.optionName }}</el-option
                >
              </el-select>
            </template>
          </div>
        </template>
        <template v-if="isShow && title.titleName == '侧关节'">
          <div :style="{ display: 'inline-flex' }">
            <div class="specialTitle side">{{ title.titleName }}</div>

            <el-select
              v-model="title.selectId1"
              class="specialSelect"
              @change="handleChange(title, title, checkData.id)"
            >
              <el-option
                v-for="opt in title.orthOptionsList"
                :key="opt.id"
                :label="opt.optionName"
                :value="opt.id"
              ></el-option>
            </el-select>
            <el-select
              v-model="title.selectId2"
              class="specialSelect"
              @change="handleChange(title, title, checkData.id)"
            >
              <el-option
                v-for="opt in title.listMap"
                :key="opt.id"
                :label="opt.optionName"
                :value="opt.id"
              ></el-option>
            </el-select>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<script setup>
import Header from '@/components/list/header.vue'
import FormItem from '@/components/list/formItem.vue'
import { nextTick, ref, defineProps, defineExpose } from 'vue'
import { Get, Post } from '@/utils/request'
import { useRoute } from 'vue-router'
import useChangeOption from '@/effects/changeOption.ts'
import useUpdateOption from '@/effects/updateOption.ts'
import emptyRadio from '@/effects/emptyRadio.ts'
import Option from '@/components/list/option.vue'
const clicked = ref(false)
defineExpose({
  clicked
})
const props = defineProps({
  pdfId: String
})
const refreshList = (val) => {
  if (val == '问诊') {
    getOrthInquiryList()
  }
}
const input1 = ref('')
const input2 = ref('')
const route = useRoute()
const appId = route.params.appId
const patientId = route.params.patientId
const handleMouseEnter = (option) => {
  if (option.otherContent) {
    option.visible = true
  }
  option.hover = true
}
let timeout
const handleMouseLeave = (option) => {
  option.hover = false
  if (!option.otherContent) return
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
async function handleSubmitContent(optionId, title, option, classId, owningModule) {
  option.visible = false
  if (option.otherContent) {
    const res = await useUpdateOption(
      optionId,
      title,
      appId,
      classId,
      owningModule,
      option.otherContent
    )
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
// 获取患者信息
const patientInfo = ref({})
async function getPatientInfo() {
  const result = await Get(`prod-api/business/patient/ljPatient/${patientId}`)
  patientInfo.value = result.data
  sessionStorage.setItem('name', patientInfo.value.Name)
}
getPatientInfo()
// 获取/处理问诊数据

const inquiryData = ref([])
const inquiryId = ref()

const complainTitle = ref()
const currentTitle = ref()

async function getOrthInquiryList() {
  const result = await Get(`/prod-api/emr/orthCommon/list/2/问诊/${appId}`)
  inquiryData.value = result.data
  result.data.forEach((item) => item.orthTitleList.forEach((title) => (title.showInput = false)))
  complainTitle.value = result.data.map((item) =>
    item.orthTitleList.find((title) => title.titleName == '主诉')
  )
  result.data.forEach((item) => {
    item.orthTitleList.forEach((title) => {
      if (title.titleName == '主诉') {
        console.log('🚀 ~ item.orthTitleList.forEach ~ complainTitle.value:', complainTitle.value)

        inquiryId.value = item.id
      }
      if (title.titleName == '现病史') {
        currentTitle.value = title
      }
      if (title.orthOptionsList[title.orthOptionsList.length - 1]?.otherContent) {
        title.otherContent = title.orthOptionsList[title.orthOptionsList.length - 1]?.otherContent
      }
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
getOrthInquiryList()

// 获取/处理临床检查数据
const checkData = ref({})
const inputRefs = ref([])
async function getOrthCheckList() {
  const result = await Get(`/prod-api/emr/orthCommon/list/2/临床检查/${appId}`)

  checkData.value = result.data[0]
  result.data.forEach((item) => {
    item.orthTitleList.forEach((title) => (title.showInput = false))
  })
  result.data.forEach((item) => {
    item.orthTitleList.forEach((title) => {
      if (title.orthOptionsList[title.orthOptionsList.length - 1].otherContent) {
        title.otherContent = title.orthOptionsList[title.orthOptionsList.length - 1].otherContent
      }
      if (title.titleName == '关节弹响') {
        title.optionId = ''
        title.text = ''
        title.showInput = false
        title.selectId = ''
        const choosenOptions = title.orthOptionsList.filter((option) => option.choosen === true)

        if (choosenOptions.length > 0) {
          title.optionId = choosenOptions[0].id
          isShow.value = title.optionId === 10 ? false : true
          const selectOptions = title.listMap.filter((option) => option.choosen === true)
          if (selectOptions.length > 0) {
            title.selectId = selectOptions[0].id
          }
        }
      } else if (title.titleName == '侧关节') {
        title.optionId = []
        title.text = ''
        title.showInput = false
        title.selectId1 = ''
        title.selectId2 = ''
        const selectOptions = title.orthOptionsList.filter((option) => option.choosen === true)
        if (selectOptions.length > 0) {
          title.selectId1 = selectOptions[0].id
        }
        const selectOptions2 = title.listMap.filter((option) => option.choosen === true)
        if (selectOptions2.length > 0) {
          title.selectId2 = selectOptions2[0].id
        }
      } else if (title.titleName == '骨龄') {
        title.optionId = ''
        title.text = ''
        title.showInput = false
        title.selectId1 = ''
        title.selectId2 = ''
        inputRefs.value = title.orthOptionsList
          .filter((option) => option.optionName === '骨龄超' || option.optionName === '骨龄晚')
          .map(() => ref(null))

        title.orthOptionsList.forEach((option) => {
          if (option.optionName === '骨龄超' || option.optionName === '骨龄晚') {
            option.fillColor = '#C9CDD4'
            option.seriousColor = '#f44c4c'
            option.hoverColor = '#2e6ce4'
            option.clicked = option.choosen ? true : false
            option.visible = false
          }
        })
        const choosenOptions = title.orthOptionsList.filter((option) => option.choosen === true)
        if (choosenOptions.length > 0) {
          title.optionId = choosenOptions[0].id
        }
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
getOrthCheckList()

// 上传调用接口
const isShow = ref(false)

async function handleChangeOption(optionId, title, classId, owningModule) {
  clicked.value = true
  if (props.pdfId) {
    sessionStorage.removeItem(props.pdfId)
  }

  useChangeOption(optionId, title, appId, classId, owningModule, isShow, checkData)
  await useUpdateOption(title.optionId, title, appId, classId, owningModule)
  // if ((res.code == 200) & (title.titleName == '骨龄')) {
  //   // getOrthCheckList()
  // }
}
const showPopover = (index) => {
  // 值为空的情况下聚焦，否则是展示状态
  if (!inputRefs.value[index].value[0].input.value) {
    inputRefs.value[index].value[0].focus()
  }
}
async function handleChange(obj, title, classId) {
  if (title.titleName == '关节弹响') {
    let obj1 = {
      aptmId: appId,
      titleId: title.id,
      optionsIdStr: [obj.optionId, obj.selectId],
      otherContent: '',
      cephalometricsContent: '',
      fdiToothCode: '',
      showPosition: '',
      classId: classId,
      owningModule: '临床检查'
    }
    await Post('/prod-api/emr/orthPlan/addOrthInspectResult', obj1)
  }
  if (title.titleName == '侧关节') {
    let obj1 = {
      aptmId: appId,
      titleId: title.id,
      optionsIdStr: obj.selectId2 == '' ? [obj.selectId1] : [obj.selectId1, obj.selectId2],
      otherContent: '',
      cephalometricsContent: '',
      fdiToothCode: '',
      showPosition: '',
      classId: classId,
      owningModule: '临床检查'
    }
    await Post('/prod-api/emr/orthPlan/addOrthInspectResult', obj1)
  }
}

const handleSubmit = (optionId, title, classId, owningModule) => {
  useUpdateOption(optionId, title, appId, classId, owningModule)
}
async function handleEmptyRadio(optionId, title, classId, owningModule) {
  if (
    title.orthOptionsList.some((option) => option.choosen == true) &&
    title.type == 1 &&
    title.optionId == optionId
  ) {
    emptyRadio(optionId, title)
    useUpdateOption(null, title, appId, classId, owningModule)
    if (owningModule == '问诊') {
      getOrthInquiryList()
    } else {
      getOrthCheckList()
    }
    // 重新请求数据
  }
}
</script>
<style lang="scss">
.el-input.borderless .el-input__wrapper {
  box-shadow: none;
}
.el-input.borderless .el-input__wrapper:hover {
  box-shadow: 0 0 0 1px #dcdfe6;
}
.el-input.borderless .el-input__wrapper.is-focus {
  box-shadow: 0 0 0 1px #409eff;
}
</style>
<style lang="scss" scoped>
.formItem.specialFormItem {
  align-items: flex-start;
}
.specialTitle {
  display: inline-block;
  width: 100px;
  text-align: right;
  padding-right: 16px;
  position: relative;
  top: 5px;
  color: #4e5969;
  &.side {
    padding-right: 8px;
    width: auto;
    margin-left: 12px;
  }
}
:deep .specialRadio.el-radio-group {
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  font-size: 0;
  margin-bottom: 16px;
}
:deep .specialSelect.el-select {
  width: 100px;
  margin-left: 8px;
  .el-input {
    --el-border-radius-base: 4px;
  }
}
.myPopper {
  width: unset;
  min-width: 100px !important;
  background: red;
  .el-input {
    width: 40px;
  }
}
.stepOne {
  * {
    box-sizing: border-box;
  }

  .patientInfo {
    display: flex;
    padding-left: 20px;
    flex-wrap: wrap;
    padding: 20px;
    padding-bottom: 0;
    &__item {
      margin-bottom: 20px;
      margin-right: 76px;
      &__desc {
        margin-right: 12px;
        color: #4e5969;
      }
      &__detail {
        color: #1d2129;
      }
    }
  }
  .inquiry {
    .innerContent {
      border-radius: 12px;
      opacity: 1;
      width: 100%;
      /* 填充/浅色 */
      background: #f7f8fa;
      position: relative;
      .formItem {
        &:last-child {
          margin-left: 0px;
        }
      }
    }
  }
}

:deep .el-checkbox-button.is-focus .el-checkbox-button__inner {
  --el-checkbox-button-checked-border-color: #dcdfe6;
}
:deep .el-input {
  width: 72px;
  height: 30px;
  margin-right: 4px;
}
.content {
  padding: 20px;
  padding-bottom: 0;

  :deep .el-checkbox-button__inner {
    height: 32px;
    img {
      position: absolute;
      right: 0;
      bottom: 0;
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
      // border: 1px solid #2e6ce4;
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
:deep .el-input {
  width: auto;
  --el-border-radius-base: 8px;
  margin-left: 4px;
}
:deep .el-checkbox-button.is-checked .el-checkbox-button__inner {
  border-color: #dcdfe6;
  background-color: #fff;
  box-shadow: none;
  color: #606266;
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
