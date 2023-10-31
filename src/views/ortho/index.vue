<template>
  <div class="ortho-page">
    <div class="header">
      <div
        :style="{
          display: 'flex',
          'align-items': 'center',
          'margin-right': '40px',
          cursor: 'pointer'
        }"
        @click="handleBackToList"
      >
        <el-icon><ArrowLeft /></el-icon>返回列表
      </div>
      <div
        :style="{
          display: 'flex',
          'justify-content': 'center'
        }"
      >
        <div class="step" :class="{ active: active === 1 }" @click="active = 1">
          <template v-if="active == 1"><span class="step-num">1</span></template
          ><template v-else-if="active > 1"
            ><img :style="{ 'margin-right': '12px' }" src="../../assets/svg/Steps.svg" /></template
          ><span class="step-text" :class="{ finished: active > 1 }">基础信息</span>
        </div>
        <el-divider :class="{ finished: active > 1 }" />
        <div class="step" :class="{ active: active === 2 }" @click="active = 2">
          <template v-if="active > 2"
            ><img :style="{ 'margin-right': '12px' }" src="../../assets/svg/Steps.svg" /></template
          ><span v-else class="step-num">2</span>
          <span class="step-text" :class="{ finished: active > 2 }">图像分析</span>
        </div>
        <el-divider :class="{ finished: active > 2 }" />
        <div class="step" :class="{ active: active === 3 }" @click="active = 3">
          <template v-if="active > 3"
            ><img :style="{ 'margin-right': '12px' }" src="../../assets/svg/Steps.svg" /></template
          ><span v-else class="step-num">3</span
          ><span class="step-text" :class="{ finished: active > 3 }">模型分析</span>
        </div>
        <el-divider :class="{ finished: active > 3 }" />
        <div class="step" :class="{ active: active === 4 }" @click="active = 4">
          <template v-if="active > 4"
            ><img :style="{ 'margin-right': '12px' }" src="../../assets/svg/Steps.svg"
          /></template>
          <template v-else><span class="step-num">4</span></template
          ><span class="step-text" :class="{ finished: active > 4 }">问题列表</span>
        </div>
        <el-divider :class="{ finished: active > 4 }" />
        <div class="step step5" :class="{ active: active === 5 }" @click="active = 5">
          <template v-if="active > 5"
            ><img :style="{ 'margin-right': '12px' }" src="../../assets/svg/Steps.svg" /></template
          ><template v-else><span class="step-num">5</span></template
          ><span class="step-text" :class="{ finished: active > 5 }">方案目标</span>
        </div>
        <el-divider :class="{ finished: active > 5 }" />
        <div class="step step6" :class="{ active: active === 6 }" @click="active = 6">
          <!-- <template v-if="active > 5"
            ><img
              :style="{ 'margin-right': '12px' }"
              src="../../assets/svg/Steps.svg" />
              </template
          > -->
          <!-- <template v-else>
            
            </template
          > -->
          <span class="step-num">6</span>
          <span class="step-text" :class="{ finished: active > 5 }">报告预览</span>
        </div>
      </div>
    </div>
    <div class="information">
      <stepOne v-if="active === 1" :pdfId="pdfId" /><stepTwo
        v-if="active === 2"
        :pdfId="pdfId"
      /><stepThree v-if="active === 3" :pdfId="pdfId" /><stepFour
        v-if="active === 4"
        :pdfId="pdfId"
      />
      <stepFive v-if="active === 5" :id="id" :pdfId="pdfId" />
      <pdf1 v-if="active === 6" @getPdfResult="getPdfResult" :id="id" />
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
      <el-button type="primary" v-if="active == 6 && hasConfirmApproval == true" @click="backToList"
        >返回列表</el-button
      >
    </div>
  </div>
  <el-dialog v-model="dialogVisible" title="确认审批">
    <template v-for="(labelObj, index) in labelList" :key="labelObj.label">
      <template v-if="index <= 6"
        ><form-item :label="labelObj.label" width="128px"
          ><span class="desc">{{ orthContent[labelObj.value] }}</span></form-item
        ></template
      >
      <template v-if="index == 7"
        ><form-item :label="labelObj.label" width="128px"
          ><span class="desc uploadDesc">
            <a :href="pdf" target="_blank">{{ pdf.split('/')[pdf.split('/').length - 1] }}</a>
          </span></form-item
        ></template
      >
      <template v-else-if="index == 8">
        <form-item :label="labelObj.label" width="128px">
          <el-radio-group v-model="orthContent['riskValue']">
            <el-radio
              v-for="(riskVal, index) in ['低', '中', '高']"
              :key="index"
              :label="riskVal"
            ></el-radio> </el-radio-group
        ></form-item>
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
          <el-input v-model="orthContent['correctionPeriod']"></el-input>
        </form-item>
      </template>
      <template v-else-if="index == 11">
        <form-item :label="labelObj.label" width="128px">
          <el-input v-model="orthContent['explain']"></el-input>
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
</template>

<script setup>
import * as dd from 'dingtalk-jsapi'
import stepOne from './stepOne.vue'
import stepTwo from './stepTwo.vue'
import stepThree from './stepThree.vue'
import stepFour from './stepFour.vue'
import stepFive from './stepFive.vue'
import pdf1 from './pdf1.vue'
import { ref, onMounted } from 'vue'
import { ElLoading, ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import { Get, Put, Post } from '@/utils/request'
import formItem from '@/components/list/formItem.vue'
const router = useRouter()
const route = useRoute()
const appId = route.params.appId
const patientId = route.params.patientId

// 生成pdf逻辑
onMounted(() => {
  const page = document.querySelector('.ortho-page')
  page.addEventListener('mousewheel', function (e) {
    if (e.deltaX !== 0) {
      e.preventDefault() // 阻止默认的水平滚动事件
    }
  })
})
const loading = ref()
const id = ref(0)
const pdf = ref()
const pdfId = ref()
const handleGeneratePdf = () => {
  // router.push(`/pdf1/${appId}/${patientId}`)
  if (!pdf.value) {
    loading.value = ElLoading.service({
      lock: true,
      text: '报告生成中',
      // 把颜色改成不透明的，就看不到后面的pdf的内容了
      background: 'rgba(37, 38, 38, 1)'
    })
  }
  // 但是需要有延迟，否则还是会看到pdfTemp的内容闪一下
  setTimeout(() => {
    active.value++
  }, 200)
}
const getPdfResult = (val) => {
  if (val) {
    loading.value?.close()
    Put('/prod-api/business/orthBase', {
      id: progressRes.value.id,
      pdfUrl: val,
      pdfTime:  formatTime(),
      progress: active.value
    })
  }
}
const active = ref(0)
const progressRes = ref()

function getOrthBase() {
  Get(`/prod-api/business/orthBase/${appId}`).then((res) => {
    if (res.code === 200) {
      progressRes.value = res.data
      active.value = res.data?.progress ? res.data.progress : 1
      id.value = progressRes.value?.id
      // 返回的有pdf, 那就直接跳转到pdf页面了
      if (progressRes.value.pdfUrl) {
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
const handleNextStep = () => {
  active.value++
  Put('/prod-api/business/orthBase', {
    id: progressRes.value.id,
    pdfUrl: '',
    pdfTime: '',
    progress: active.value
  })
}
const handlePreStep = () => {
  if (active.value == 1) {
    return
  }
  active.value--
  Put('/prod-api/business/orthBase', {
    id: progressRes.value.id,
    pdfUrl: '',
    pdfTime: '',
    progress: active.value
  })
}
const handleBackToList = () => {
  router.push('/list')
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
  orthContent.value['riskValueSystem'] = ''
  orthContent.value['explain'] = ''
  orthContent.value['correctionPeriod'] = ''
  orthContent.value['riskValue'] = orthContent.value['riskValue'].split('')[0]
}
const corpId = 'ding2b955d63d8846db035c2f4657eb6378f'
// const dingSpaceData = ref()
const hasConfirmApproval = ref(false)
function saveFileToDingSpace() {
  if (dd.env.platform !== 'notInDingTalk') {
    dd.ready(function () {
      dd.runtime.permission.requestAuthCode({
        corpId,
        onSuccess(res) {
          console.log(res)
        },
        onFail() {}
      })
    })
  }
}
async function confirmApproval() {
  saveFileToDingSpace()
  orthContent.value['pdfUrl'] = pdf.value
  const res = await Post('/prod-api/business/orthBase/sendApproval', orthContent.value)
  if (res.code == 200) {
    dialogVisible.value = false
    ElMessage({
      message: res.msg,
      type: 'success'
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
.el-dialog__body {
  padding: 24px;
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

.ortho-page {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  flex: 1;
  * {
    box-sizing: border-box;
  }
  box-sizing: border-box;
  padding: 20px;
  background: #f2f3f5;
  // background: #f2f3f5;
  .header {
    display: flex;
    width: 100%;
    height: 72px;
    background: #ffffff;
    border-radius: 12px;
    justify-content: center;
    align-items: center;
    .step {
      // flex-basis: 0;
      display: flex;
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
        .step-text {
          color: #2e6ce4;
        }
      }
    }
  }
  @media screen and (min-width: 1000px) and (max-width: 1440px) {
  }
  .information {
    flex: 1;
    width: 100%;
    padding: 20px;
    border-radius: 12px;
    opacity: 1;
    margin-top: 16px;
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
