<template>
  <div
    :style="{
      background: '#f2f3f5',
      height: '100%'
    }"
  >
    <div class="gap"></div>

    <div class="header">
      <div
        :style="{
          display: 'flex',
          'align-items': 'center',
          'margin-right': '40px',
          cursor: 'pointer',
          width: '100px',
          'margin-left': '20px'
        }"
        @click="handleBackToList"
      >
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
            ><img :style="{ 'margin-right': '12px' }" src="../../assets/svg/Steps.svg" /></template
          ><span
            class="step-text"
            :class="{ finished: active === step.num || step.num <= editStep }"
            >{{ step.desc }}</span
          >
          <el-divider :class="{ finished: active === step.num || step.num <= editStep }" />
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
        <stepFive v-if="active === 5" :id="id" :pdfId="pdfId" ref="step5" />
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
          ><form-item :label="labelObj.label" width="132px"
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
              v-model="orthContent['riskValue']"
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
            <el-radio-group v-model="orthContent['riskValueSystem']">
              <el-radio
                v-for="(riskVal, index) in ['低', '中', '高']"
                :key="index"
                :label="riskVal"
              ></el-radio> </el-radio-group
          ></form-item>
        </template>
        <template v-else-if="index == 10">
          <form-item :label="labelObj.label" width="128px">
            {{ orthContent['correctionPeriod'] ? orthContent['correctionPeriod'] + '个月' : '' }}
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
const doctorId = ref()
window.addEventListener('message', function (event) {
  if (event.origin === 'https://odostest.orangedental.cn:4403') {
    doctorId.value = event.data
  }
})
const router = useRouter()
const route = useRoute()
const appId = route.params.appId
const patientId = route.params.patientId
// 切换步骤条
const steps = [
  { num: 1, desc: '基础信息' },
  { num: 2, desc: '图像分析' },
  { num: 3, desc: '模型分析' },
  { num: 4, desc: '问题列表' },
  { num: 5, desc: '方案目标' },
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

onMounted(() => {
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
// const handleGeneratePdf = () => {
//   // router.push(`/pdf1/${appId}/${patientId}`)
//   // if (!pdf.value) {
//   //   loading.value = ElLoading.service({
//   //     lock: true,
//   //     text: '报告生成中',
//   //     // 把颜色改成不透明的，就看不到后面的pdf的内容了
//   //     background: 'rgba(37, 38, 38, 1)'
//   //   })
//   // }
//   // // 但是需要有延迟，否则还是会看到pdfTemp的内容闪一下
//   setTimeout(() => {
//     active.value = 6
//   }, 200)
// }

const handleGeneratePdf = () => {
  if (
    active.value == 5 &&
    !step[active.value - 1].value.goalClicked &&
    !step[active.value - 1].value.methodClicked
  ) {
    ElMessage({ message: '请检查目标和方法是否填写完毕哦', type: 'error' })
  } else if (active.value == 5 && !step[active.value - 1].value.goalClicked) {
    ElMessage({ message: '请检查目标是否填写完毕哦', type: 'error' })
    return
  } else if (active.value == 5 && !step[active.value - 1].value.methodClicked) {
    ElMessage({ message: '请检查方法是否填写完毕哦', type: 'error' })
    return
  } else {
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
// 获取目标数据
const goalList = ref([])
async function getOrthGoalList() {
  const result = await Post(`/prod-api/business/globalDict/getDictListByType`, {
    dictType: 'ORTHTARGET'
  })
  goalList.value = result.data.map((item) => ({
    name: item.dictCodeName,
    id: item.id
  }))
  store.commit('setOrthGoalList', goalList.value)
}
getOrthGoalList()
const handleNextStep = () => {
  if (active.value == 4) {
    const goalList = store.state.goalList
    const planList = store.state.planList
    const transformedData = planList.map((scheme) => {
      return {
        name: scheme.name,
        checked: false, // You can set this value based on your logic
        aptmId: appId, // Example value, replace with actual data
        difficultyLevel: '一般难度', // Example value, replace with actual data
        stageList: scheme.stageList
          .filter((item) => item.targetIds.length > 0)
          .map((stage) => {
            return {
              stageName: stage.stageName,
              targetIds: stage.targetIds.map((target) => target.id).join(',')
            }
          })
      }
    })
    Post('/prod-api/emr/public/api/v1/scheme', transformedData)
  }
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
async function getPlanList() {
  const result = await Get(`/prod-api/emr/public/api/v1/scheme/list?aptmId=${appId}`)
  if (result.code == 200 && result.data.length > 0) {
    const planList = result.data.map((scheme) => ({
      name: scheme.name,
      checked: scheme.checked || false,
      difficultyLevel: scheme.difficultyLevel || '',
      stageList:
        scheme.stageList?.length == 0
          ? [
              {
                stageName: '3个月',
                targetIds: []
              },
              {
                stageName: '6个月',
                targetIds: []
              },
              {
                stageName: '9个月',
                targetIds: []
              },
              {
                stageName: '12个月',
                targetIds: []
              }
            ]
          : scheme.stageList?.map((item) => ({
              stageName: item.stageName,
              targetIds: item.targetIds.split(',').map((target, index) => ({
                id: target,
                name: item.targetNames.split(',')[index]
              }))
            }))
    }))
    const defaultStage = ['3个月', '6个月', '9个月', '12个月']

    // 不够的打上补丁
    planList.forEach((plan) => {
      const length = plan.stageList.length
      if (plan.stageList.length < 4) {
        for (let i = 0; i < 4 - length; i++) {
          plan.stageList.push({
            stageName: defaultStage[length + i],
            targetIds: []
          })
        }
      }
    })
    console.log('🚀 ~ planList.forEach ~ planList:', planList)
    store.state.planList = planList
  }
}
getPlanList()
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
async function initiateApproval() {
  dialogVisible.value = true
  const res = await Post('/prod-api/business/orthBase/selectOrthRisk', {
    patientId: patientId,
    apmtId: appId
  })
  orthContent.value = res.data
  orthContent.value['dentitionType'] = res.data.dentitionType || '无'
  orthContent.value['riskValueSystem'] = ''
  orthContent.value['riskValue'] = res.data['riskValue'].split('')[0]
}
const corpId = 'ding2b955d63d8846db035c2f4657eb6378f'

const hasConfirmApproval = ref(false)

async function confirmApproval() {
  try {
    const loading = ElLoading.service({
      lock: true,
      text: '发起审批中',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    orthContent.value['pdfUrl'] = pdf.value
    orthContent.value['riskValueSystem'] = orthContent.value['riskValueSystem']
      ? orthContent.value['riskValueSystem']
      : '无'
    const res = await Post('/prod-api/business/orthBase/sendApproval', {
      patientId: patientId,
      apmtId: appId,
      ...orthContent.value
    })
    dialogVisible.value = false
    loading.close()
    if (res.code === 200) {
      ElMessage({
        type: 'success',
        message: res.msg
      })
    }
  } catch (err) {
    loading.close()
    ElMessage({
      type: 'error',
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
  { label: '矫正方案', value: 'schemeStr' },
  { label: '病例风险（系统）', value: 'riskValueSystem' },
  { label: '病历风险（自评）', value: 'riskValue' },
  { label: '预计矫正周期', value: 'correctionPeriod' },
  { label: '说明', value: 'explain' }
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
  height: 26px;
  &__label {
    text-align: left;
  }
}
.gap {
  height: 16px;
  background: #f2f3f5;
}
.header {
  position: sticky;
  top: 0;
  margin-left: 20px;
  margin-right: 20px;
  display: flex;
  height: 72px;
  background: #ffffff;
  border-radius: 12px;
  justify-content: center;
  align-items: center;
  z-index: 20;
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
