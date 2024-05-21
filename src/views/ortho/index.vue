<template>
  <div
    :style="{
      background: '#f2f3f5',
      height: '100%'
    }"
  >
    <div class="gap"></div>
    <div class="headerBox">
      <div class="header" ref="headerRef" :class="{ isFixed: scrollDistance > 20 }">
        <div class="goBack" @click="handleBackToList">
          <el-icon><ArrowLeft /></el-icon>返回列表
        </div>
        <div
          :style="{
            display: 'flex',
            'justify-content': 'center',
            flex: 1
          }"
        >
          <div
            class="step"
            @click="handleChangeStep(step.num)"
            :class="{ active: active === step.num }"
            v-for="step in steps"
            :key="step.num"
          >
            <template v-if="editStep < step.num || active === step.num"
              ><span class="step-num">{{ step.num }}</span></template
            ><template v-else-if="editStep >= step.num"
              ><img
                :style="{ 'margin-right': '12px' }"
                src="../../assets/svg/Steps.svg" /></template
            ><span
              class="step-text"
              :class="{ finished: active === step.num || step.num <= editStep }"
              >{{ step.desc }}</span
            >
            <el-divider :class="{ finished: active === step.num || step.num <= editStep }" />
          </div>
        </div>
      </div>
    </div>

    <div class="ortho-page">
      <div class="information">
        <stepOne v-if="active === 1" :pdfId="pdfId" ref="step1" /><stepTwo
          v-if="active === 2"
          :pdfId="pdfId"
          ref="step2"
        /><stepThree
          v-if="active === 3"
          :pdfId="pdfId"
          ref="step3"
          :dentitionType="dentitionType"
        /><stepFour v-if="active === 4" :pdfId="pdfId" ref="step4" />
        <stepFive
          v-if="active === 5"
          :id="id"
          :pdfId="pdfId"
          ref="step5"
          @requestPlanList="requestPlanList"
        />
        <pdf1 v-if="active === 6" @getPdfResult="getPdfResult" :id="id" ref="pdfComp" />
      </div>
      <div class="footer">
        <el-button v-if="active >= 2 && active <= 5" @click="handlePreStep">上一步</el-button>
        <el-button v-if="active == 6" @click="downloadPdf"> 下载报告 </el-button>
        <el-button type="primary" v-if="active < 5" @click="handleNextStep">下一步</el-button>
        <el-button type="primary" v-if="active == 5" @click="handleGeneratePdf">生成报告</el-button>
        <el-button
          type="primary"
          v-if="active == 5 && hasConfirmApproval == true"
          @click="checkApproval"
          >查看审批流</el-button
        >
        <el-button type="primary" v-if="active == 6" @click="initiateApproval">发起审批</el-button>
        <el-button
          type="primary"
          v-if="active == 6 && hasConfirmApproval == true"
          @click="backToList"
          >返回列表</el-button
        >
      </div>
    </div>
    <el-dialog
      v-model="dialogVisible"
      :close-on-press-escape="false"
      title="确认审批"
      class="confirmApproval"
    >
      <template v-for="(labelObj, index) in labelList" :key="labelObj.label">
        <template v-if="index <= 6"
          ><form-item
            :label="labelObj.label"
            width="132px"
            :class="{
              target: labelObj.label == '治疗目标',
              scheme: labelObj.label == '治疗计划'
            }"
            ><span class="desc">{{ orthContent[labelObj.value] }}</span></form-item
          ></template
        >
        <template v-if="index == 7"
          ><form-item :label="labelObj.label" width="132px"
            ><span class="desc uploadDesc">
              <a :href="pdf" target="_blank">{{ pdf.split('/')[pdf.split('/').length - 1] }}</a>
            </span></form-item
          ></template
        >
        <template v-else-if="index == 8">
          <form-item :label="labelObj.label" width="132px">
            <el-radio-group
              v-model="orthContent['riskValueSystem']"
              disabled
              :style="{ 'min-width': '172px' }"
            >
              <el-radio
                v-for="(riskVal, index) in ['低', '中', '高']"
                :key="index"
                :label="riskVal"
              ></el-radio> </el-radio-group
            ><span :style="{ 'margin-left': '20px' }" v-if="orthContent['ruleText']"
              >风险规则说明：{{ orthContent['ruleText'] }}</span
            ></form-item
          >
        </template>
        <template v-else-if="index == 9">
          <form-item :label="labelObj.label" width="128px">
            <el-radio-group v-model="orthContent['riskValue']">
              <el-radio
                v-for="(riskVal, index) in ['低', '中', '高']"
                :key="index"
                :label="riskVal"
              ></el-radio> </el-radio-group
          ></form-item>
        </template>
        <template v-else-if="index == 10">
          <form-item :label="labelObj.label" width="128px">
            {{ orthContent['correctionPeriod'] }}
          </form-item>
        </template>
        <template v-else-if="index == 11">
          <form-item :label="labelObj.label" width="128px">
            {{ orthContent['explain'] }}
          </form-item>
        </template>
      </template>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmApproval"> 确认 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import useFdiToothCodeEffect from '@/effects/fdiToothCode.ts'
// 这里非动态导入，不是路由
import stepOne from './stepOne.vue'
import stepTwo from './stepTwo.vue'
import stepThree from './stepThree.vue'
import stepFour from './stepFour.vue'
import stepFive from './stepFive.vue'
import pdf1 from './pdf1.vue'
import { ref, onMounted, nextTick } from 'vue'
// import { ElLoading, ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import { Get, Put, Post } from '@/utils/request'
import formItem from '@/components/list/formItem.vue'
import formatTime from '../../utils/formatTime'
import { useStore } from 'vuex'
import {
  checkOrthOptions,
  checkInquiry,
  checkFugaiOptions,
  checkOrthoCheck,
  checkOptions,
  checkPanoOptions,
  checkOrthFace,
  checkOrthImageUpload,
  checkModelOptions
} from '../../effects/checkCompletion'
const doctorId = ref()
window.addEventListener('message', function (event) {
  if (event.origin === 'https://odostest.orangedental.cn:4403') {
    doctorId.value = event.data
  }
})
const ljOfficeId = JSON.parse(sessionStorage.getItem('jc_odos_user')).ljOfficeId
const router = useRouter()
const route = useRoute()
const appId = route.params.appId
const patientId = route.params.patientId
// 切换步骤条
const steps = [
  { num: 1, desc: '问诊和检查' },
  { num: 2, desc: '图像分析' },
  { num: 3, desc: '模型分析' },
  { num: 4, desc: '诊断' },
  { num: 5, desc: '目标和工具' },
  { num: 6, desc: '报告预览' }
]
const editStep = ref(0)
const step = []
const step1 = ref(null)
const step2 = ref(null)
const step3 = ref(null)
const step4 = ref(null)
const step5 = ref(null)
const pdfComp = ref(null)
const handleChangeStep = (num) => {
  if (num > editStep.value) {
    ElMessage({
      message: '请点击下一步哦',
      type: 'warning'
    })
    return
  } else {
    active.value = num
  }
}

const scrollDistance = ref(0)
const headerRef = ref()
onMounted(() => {
  // 监听滚动，固定导航栏
  window.addEventListener('scroll', () => {
    scrollDistance.value = window.pageYOffset || document.documentElement.scrollTop
  })

  step.push(step1, step2, step3, step4, step5)
  const page = document.querySelector('.ortho-page')
  // page.addEventListener('mousewheel', function (e) {
  //   if (e.deltaX !== 0) {
  //     e.preventDefault() // 阻止默认的水平滚动事件
  //   }
  // })
})

const loading = ref()
const id = ref(0)
const pdf = ref()
const pdfId = ref()
function validateGoalAndTarget(planList) {
  const found = planList.find((plan, index) => plan.checked)
  for (let item of found.stageList) {
    if (item.targetIds.length > 0 && item.toolIds.length > 0) {
      return true
    }
  }
  return false
}
// 校验是否选了矫治器和难度
function validate(planList) {
  const difficultySelect = document.querySelectorAll('.arco-select.difficulty')

  const applicance = document.querySelectorAll('.arco-select.primaryApplianceId')

  planList.forEach((plan, index) => {
    if (!plan.primaryApplianceId) {
      applicance[index].classList.add('validateFail')
    }
    if (!plan.difficultyLevel) {
      difficultySelect[index].classList.add('validateFail')
    }
  })
  return planList.some((plan) => !plan.difficultyLevel || !plan.primaryApplianceId)
}

// 校验是否选中了方案
function validateCheck(planList) {
  const found = planList.find((plan, index) => plan.checked)

  return found ? false : true
}
function validateRisk(riskData) {
  return riskData[0].orthTitleList[0].orthOptionsList.some((option) => option.choosen)
}
const handleGeneratePdf = async () => {
  if (sessionStorage.getItem('toothFlag') == 'true') {
    return
  }
  if (active.value == 5) {
    if (validateCheck(step5.value.planList)) {
      ElMessage({
        message: '请选择一个方案',
        type: 'warning'
      })
      return false
    }
    await getPlanList()
    if (!validateGoalAndTarget(step5.value.planList)) {
      ElMessage({
        message: '请选择方案和工具',
        type: 'warning'
      })
      return false
    }
    if (validate(step5.value.planList)) {
      ElMessage({
        message: '请选择矫治器和难度',
        type: 'warning'
      })
      return false
    }
    await getRiskData()
    if (!validateRisk(riskData.value)) {
      ElMessage({
        message: '请选择风险',
        type: 'warning'
      })
      return false
    }
  }
  plansTools.value = '1'
  checkCompletion()
  nextTick(() => {
    editStep.value = active.value
    active.value++
    Put('/prod-api/business/orthBase', {
      id: progressRes.value.id,
      pdfUrl: '',
      pdfTime: '',
      progress: active.value
    })
    window.scrollTo(0, 0)
  })
}

const requestPlanList = () => {
  getPlanList()
}
const getPdfResult = (val) => {
  if (val) {
    loading.value?.close()
    Put('/prod-api/business/orthBase', {
      id: progressRes.value.id,
      pdfUrl: val,
      pdfTime: formatTime().formattedToday,
      progress: active.value
    })
    pdf.value = val
    pdfId.value = `pdfUrl${id.value}`
  }
}
const active = ref(0)
const progressRes = ref()
const dentitionType = ref()
function getOrthBase() {
  Get(`/prod-api/business/orthBase/${appId}`).then((res) => {
    if (res.code === 200) {
      progressRes.value = res.data
      active.value = res.data?.progress ? res.data.progress : 1
      editStep.value = active.value
      id.value = progressRes.value?.id
      dentitionType.value = res.data.dentitionType
      // 返回的有pdf, 那就直接跳转到pdf页面了
      if (progressRes.value && progressRes.value.pdfUrl) {
        // router.push(`/pdf1/${appId}/${patientId}`)
        sessionStorage.setItem(`pdfUrl${id.value}`, progressRes.value.pdfUrl)
        pdfId.value = `pdfUrl${id.value}`
        pdf.value = sessionStorage.getItem(`pdfUrl${id.value}`)
        active.value = 6
      }
    } else {
      active.value = 2
    }
  })
}
getOrthBase()
const store = useStore()
const diagnoseData = ref([])
async function getOrthDiagnoseList() {
  const result = await Get(`/prod-api/emr/orthCommon/list/2/诊断/${appId}`)
  diagnoseData.value = result.data
}

function checkChoosenOptions(data) {
  const dentition = ref(false)
  const other = ref(false)
  // 遍历数据
  for (let i = 0; i < data.length; i++) {
    const item = data[i]
    for (let j = 0; j < item.orthTitleList.length; j++) {
      const title = item.orthTitleList[j]
      if (title.titleName == '牙列期') {
        for (let k = 0; k < title.orthOptionsList.length; k++) {
          const option = title.orthOptionsList[k]
          if (option.choosen === true) {
            dentition.value = true
          }
        }
      } else {
        for (let k = 0; k < title.orthOptionsList.length; k++) {
          const option = title.orthOptionsList[k]
          if (option.choosen === true) {
            other.value = true
          }
        }
      }
    }
  }
  // 如果没有选中的选项，则返回false
  return { dentition, other }
}
const planCompletionId = ref()
const clinicalExamination = ref()
const imageUpload = ref()
const imageAnalysis = ref()
const modelAnalysis = ref()
const diagnosis = ref()
const plansTools = ref()
const approvalSubmitted = ref()
// 获取问诊数据
const inquiryData = ref()
async function getOrthInquiryList() {
  const result = await Get(`/prod-api/emr/orthCommon/list/2/问诊/${appId}`)
  inquiryData.value = result.data
}
const checkData = ref()
async function getOrthCheckList() {
  const result = await Get(`/prod-api/emr/orthCommon/list/2/临床检查/${appId}`)
  checkData.value = result.data
}
const classifiedImageList = ref([])
async function getClassifiedImgList() {
  const res = await Get(`/prod-api/business/orthImage/list?apmtId=${appId}`)
  if (res.code == 200 && res.data.length > 0) {
    classifiedImageList.value = res.data
  }
}
const faceAccessData = ref()
async function getOrthFaceAccessList() {
  const result = await Get(`/prod-api/emr/orthCommon/list/2/面型评估/${appId}`)
  faceAccessData.value = result.data
}
const modelData = ref({})
async function getOrthModelList() {
  const result = await Get(`/prod-api/emr/orthCommon/list/2/模型分析/${appId}`)
  modelData.value = result.data
}
const mouthData = ref()
async function getOrthMouthList() {
  const result = await Get(`/prod-api/emr/orthCommon/list/2/口内照/${appId}`)
  mouthData.value = result.data
}
const panoramicData = ref()
const cepha = ref()
async function getOrthPanoList() {
  const result = await Get(`/prod-api/emr/orthCommon/list/2/全景片/${appId}`)
  panoramicData.value = result.data
}
async function getOrthCephaList() {
  const result = await Get(`/prod-api/emr/orthCommon/list/2/侧位片/${appId}`)
  cepha.value = result.data
}
async function checkOrthImageAnalysis() {
  await getOrthFaceAccessList()
  await getOrthMouthList()
  await getOrthPanoList()
  await getOrthCephaList()
  console.log(345)
  const result =
    checkOrthFace(faceAccessData.value) &&
    checkFugaiOptions(mouthData.value) &&
    checkPanoOptions(panoramicData.value) &&
    checkOptions(cepha.value)
  console.log(checkPanoOptions(panoramicData.value))
  return result
}

const checkCompletion = async () => {
  if (active.value == 1) {
    await getOrthInquiryList()
    await getOrthCheckList()

    clinicalExamination.value =
      checkInquiry(inquiryData.value) && checkOrthoCheck(checkData.value) ? '1' : '0'
  }

  if (active.value == 2) {
    await getClassifiedImgList()
    imageUpload.value = checkOrthImageUpload(classifiedImageList) ? '1' : '0'
    imageAnalysis.value = (await checkOrthImageAnalysis()) ? '1' : '0'
  }
  if (active.value == 3) {
    await getOrthModelList()
    modelAnalysis.value = checkModelOptions(modelData.value) ? '1' : '0'
  }
  const res = await Post('/prod-api/emr/orthPlan/addOrthPlanCompletionInfo', {
    id: +sessionStorage.getItem(`planCompletionId`) || '',
    aptmId: appId,
    patientId: patientId,
    clinicalExamination: active.value == 1 ? clinicalExamination.value : '',
    imageUpload: active.value == 2 ? imageUpload.value : '',
    imageAnalysis: active.value == 2 ? imageAnalysis.value : '',
    modelAnalysis: active.value == 3 ? modelAnalysis.value : '',
    diagnosis: active.value == 4 ? diagnosis.value : '',
    plansTools: active.value == 5 ? plansTools.value : '',
    approvalSubmitted: active.value == 6 ? approvalSubmitted.value : ''
  })
  if (res.data.planCompletionId) {
    sessionStorage.setItem('planCompletionId', res.data.planCompletionId)
  }
  planCompletionId.value = res.data?.planCompletionId.value || ''
}
const handleNextStep = async () => {
  if (active.value == 4) {
    await getOrthDiagnoseList()
    const { dentition, other } = checkChoosenOptions(diagnoseData.value)
    if (!dentition.value) {
      ElMessage({
        message: '请选择牙列期',
        type: 'warning'
      })
      return
    }
    if (!other.value) {
      ElMessage({
        message: '请选择诊断',
        type: 'warning'
      })
      return
    }
    diagnosis.value = '1'
  }
  await checkCompletion()
  nextTick(() => {
    editStep.value = active.value
    active.value++
    Put('/prod-api/business/orthBase', {
      id: progressRes.value.id,
      pdfUrl: '',
      pdfTime: '',
      progress: active.value
    })
    window.scrollTo(0, 0)
  })
}

const handlePreStep = () => {
  if (active.value == 1) {
    return
  }
  nextTick(() => {
    editStep.value = active.value
    active.value--
    Put('/prod-api/business/orthBase', {
      id: progressRes.value.id,
      pdfUrl: '',
      pdfTime: '',
      progress: active.value
    })
    window.scrollTo(0, 0)
  })
}
const handleBackToList = () => {
  router.push('/index')
  window.parent.postMessage(`index`, '*')
}
// 下载PDF
const downloadPdf = () => {
  fetch(pdf.value)
    .then((response) => response.blob())
    .then((blob) => {
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'filename.pdf'
      link.click()
    })
}
// 发起审批
const dialogVisible = ref(false)
const orthContent = ref({})
const planList = ref()
const riskData = ref()
async function getRiskData() {
  const result = await Get(`/prod-api/emr/orthCommon/list/2/风险/${appId}`)
  riskData.value = result.data
}
async function getPlanList() {
  const result = await Get(`/prod-api/emr/public/api/v1/scheme/list?aptmId=${appId}`)
  if (result.code == 200 && result.data?.length > 0) {
    let data = result.data.find((item) => item.checked)
    if (!data) {
      ElMessage({
        message: '请选择一个方案',
        type: 'warning'
      })
      return false
    }
    const newData = processData(data.stageList)
    return newData
  }
}
// 定义一个函数，用于将数据转换成目标格式
function processData(data) {
  let targetStr = ''
  let planStr = ''
  let correctionPeriod = ''
  data.forEach((entry) => {
    const stageName = entry.stageName
    const targetNames = entry.targetNames ? entry.targetNames.split(',') : []
    const toolNames = entry.toolNames ? entry.toolNames.split(',') : []
    let goal =
      stageName +
      '（' +
      targetNames.join(',') +
      (entry.fdiToothCode ? ' ' + entry.fdiToothCode : '') +
      '）'
    let tool = stageName + '（' + toolNames.join(',') + '）'
    if (entry.targetIds) {
      if (targetStr !== '') targetStr += '；'
      targetStr += goal
    }
    if (entry.toolIds) {
      if (planStr !== '') planStr += '；'
      planStr += tool
    }
  })
  correctionPeriod = data[data.length - 1].stageName
  return { targetStr, planStr, correctionPeriod }
}

async function initiateApproval() {
  const { targetStr, planStr, correctionPeriod } = await getPlanList()
  if (!targetStr) {
    ElMessage.error('还没填写方案中的治疗目标哦')
    return
  }
  if (!planStr) {
    ElMessage.error('还没填写方案中的治疗工具哦')
    return
  }
  dialogVisible.value = true
  const res = await Post('/prod-api/emr/orthPlan/selectOrthApprovalDetailInfo', {
    patientId: +patientId,
    aptmId: +appId,
    ljOfficeId: +ljOfficeId
  })
  orthContent.value = res.data
  orthContent.value['dentitionType'] = res.data.dentitionType || '无'
  orthContent.value['riskValue'] = ''
  orthContent.value['targetStr'] = res.data['targetStr'] || targetStr
  orthContent.value['planStr'] = res.data['planStr'] || planStr
  orthContent.value['correctionPeriod'] = res.data['correctionPeriod'] || correctionPeriod
  orthContent.value['explain'] = res.data['explain'] || '无'
  orthContent.value['riskValueSystem'] = res.data['riskValueSystem'].split('')[0]
}
const corpId = 'ding2b955d63d8846db035c2f4657eb6378f'

const hasConfirmApproval = ref(false)

async function confirmApproval() {
  if (!orthContent.value['riskValue']) {
    ElMessage({
      type: 'warning',
      message: '请选择自评风险值'
    })
    return
  }
  try {
    const loading = ElLoading.service({
      lock: true,
      text: '发起审批中',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    orthContent.value['pdfUrl'] = pdf.value
    orthContent.value['riskValue'] = orthContent.value['riskValue']
      ? orthContent.value['riskValue']
      : '无'
    const res = await Post('/prod-api/business/orthBase/sendApproval', {
      deductionOfficeId: String(ljOfficeId),
      patientId: patientId,
      apmtId: appId,
      ...orthContent.value
    })
    dialogVisible.value = false
    loading.close()
    if (res.code === 200 || res.code === 204) {
      approvalSubmitted.value = '1'
      checkCompletion()
      ElMessage({
        type: 'success',
        message: res.msg
      })
    }
  } catch (err) {
    loading.close()
    ElMessage({
      type: 'warning',
      message: err
    })
  }
}
const backToList = () => {
  router.push('/list')
}

const labelList = [
  { label: '患者姓名', value: 'patientName' },
  { label: '病例号', value: 'privateId' },
  { label: '诊所', value: 'abbreviation' },
  { label: '牙列期', value: 'dentitionType' },
  { label: '术前诊断', value: 'diagnoseStr' },
  { label: '治疗目标', value: 'targetStr' },
  { label: '治疗计划', value: 'planStr' },
  { label: '矫正方案', value: 'planStr' },
  { label: '病例风险（系统）', value: 'riskValue' },
  { label: '病历风险（自评）', value: 'riskValueSystem' },
  { label: '预计矫正周期', value: 'correctionPeriod' },
  { label: '备注', value: 'explain' }
]
</script>
<style>
.el-divider--horizontal {
  width: 142.67px;
  flex: 1;
}
.finished.el-divider--horizontal {
  --el-border-color: #2e6ce4;
}

.el-dialog.confirmApproval {
}
</style>
<style lang="scss" scoped>
.uploadDesc.desc {
  position: relative;
  cursor: pointer;
}

.formItem {
  height: 34px;
  &__label {
    height: 100%;
    text-align: left;
  }
  &__content {
    height: 100%;
  }
}

.formItem.target,
.formItem.scheme {
  max-height: 48px;
  &__label {
    text-align: left;
  }
  .desc {
    height: 100%;
    max-height: 52px;
    overflow-y: auto;
  }
}
.gap {
  height: 16px;
  background: #f2f3f5;
}
.isFixed {
  position: fixed;
  top: 0;
  z-index: 2000;
}
.headerBox {
  height: 72px;

  .header {
    height: 72px;
    background-color: #fff;
    border-radius: 12px;
    margin-right: 20px;
    margin-left: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .goBack {
    display: flex;
    align-items: center;
    margin: 0 40px 0 20px;
    min-width: 100px;
    cursor: pointer;
  }

  .step {
    display: flex;
    width: 15%;
    align-items: center;
    color: #86909c;
    .step-num {
      border-radius: 50px;
      border: 2px solid #c9cdd4;
      margin-right: 12px;
      width: 24px;
      height: 24px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .step-text {
      margin-right: 11.5px;
      &.finished {
        color: #2e6ce4;
      }
    }
    &.active {
      .step-num {
        color: #ffffff;
        background: #2e6ce4;
        border: 2px solid #2e6ce4;
      }
    }
    &.finished {
      .step-text {
        color: #2e6ce4;
      }
    }
    &:last-child {
      :deep .el-divider.el-divider--horizontal {
        display: none;
      }
    }
  }
}
.ortho-page {
  display: flex;
  flex-direction: column;
  height: calc(100% - 80px);
  flex: 1;
  * {
    box-sizing: border-box;
  }
  box-sizing: border-box;
  padding: 20px;
  background: #f2f3f5;

  @media screen and (min-width: 1000px) and (max-width: 1440px) {
  }
  .information {
    flex: 1;
    width: 100%;
    padding: 20px;
    border-radius: 12px;
    opacity: 1;
    background: #ffffff;
  }
  .footer {
    width: 100%;
    height: 56px;
    border-radius: 12px;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    padding: 12px;
    gap: 12px;
    margin-top: 16px;
    background: #ffffff;
    .step-button {
      width: 82px;
      height: 32px;
      border-radius: 8px;
      line-height: 32px;
      text-align: center;
      color: #1d2129;
      border: 1px solid #c9cdd4;
      cursor: pointer;
    }
  }
}
:deep .el-divider.el-divider--horizontal {
  margin-right: 12px;
}
@media screen and (min-width: 800px) and (max-width: 1300px) {
  :deep .el-divider--horizontal {
    width: 100.67px;
    flex: 1;
  }
}
@media screen and (min-width: 600px) and (max-width: 810px) {
  :deep .el-divider--horizontal {
    width: 70.67px;
    flex: 1;
  }
}
</style>
