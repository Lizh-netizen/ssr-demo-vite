<template>
  <template v-if="!src">
    <div class="pdfContent">
      <div class="pdfPage">
        <div class="patientInfo color-#fff font-500">
          <div class="mb-[8px] flex items-center">
            <img src="../../assets/eveluatePdf/avatar.svg" class="mr-[8px]" />{{
              patientInfo.patientName
            }}
          </div>
          <div class="mb-[8px] flex items-center">
            <img src="../../assets/eveluatePdf/privateId.svg" class="mr-[8px]" />{{
              patientInfo.privateId
            }}
          </div>
          <div class="mb-[8px] flex items-center">
            <img src="../../assets/eveluatePdf/date.svg" class="mr-[8px]" />{{
              patientInfo.StartTime.split(' ')[0]
            }}
          </div>
        </div>
        <div class="pt-[150px]">
          <div class="check">
            <div
              class="checkTitle color-#fff ml-[12px] position-relative z-3 h-[32px] flex items-center pl-[12px]"
            >
              临床检查
            </div>
            <div class="bg-#F7FBFD mt-[-6px] z--1 py-[16px] px-[20px] pb-0">
              <div><List :list="checkData?.list" class="checkList grid! grid-cols-3!" /></div>
            </div>
          </div>

          <!-- 其他内容 -->
          <div class="px-[20px] py-[10px]">
            <div class="flex">
              <!-- 面型评估 -->
              <div class="mr-[10px] borderBox">
                <div
                  class="h-[50px] w-[420px] px-[20px] py-[14px] bg-#216FB0 color-#FFFFFF font-500"
                >
                  面型评估
                </div>
                <div class="p-[10px] max-w-[400px]">
                  <div class="grid grid-cols-3 w-full gap-[10px]">
                    <img
                      :src="image.imageUrl"
                      crossOrigin="anonymous"
                      class="w-[120px]"
                      v-for="image in facialData?.imageList"
                      :key="image.imageUrl"
                    />
                  </div>
                  <div><List :list="facialData?.list" /></div>
                </div>
              </div>

              <!-- 全景片 -->
              <div class="flex-1 borderBox">
                <div class="h-[50px] w-auto px-[20px] py-[14px] bg-#216FB0 color-#FFFFFF font-500">
                  全景片
                </div>
                <div class="p-[10px]">
                  <div>
                    <img
                      :src="image.imageUrl"
                      v-for="image in panoData?.imageList"
                      :key="image.imageUrl"
                      crossOrigin="anonymous"
                      class="w-[290px]"
                    />
                  </div>
                  <div><List :list="panoData?.list" /></div>
                </div>
              </div>
            </div>
            <!-- 口内照 -->
            <div class="mt-[12px] borderBox">
              <div class="h-[50px] w-full px-[20px] py-[14px] bg-#216FB0 color-#FFFFFF font-500">
                口内照
              </div>
              <div class="flex items-center p-[10px]">
                <!-- 这里是图片, grid布局-->
                <div class="grid grid-cols-2 gap-[10px] mr-[16px]">
                  <img
                    :src="image.imageUrl"
                    class="w-[150px]"
                    crossOrigin="anonymous"
                    v-for="image in mouthData?.imageList"
                    :key="image.imageUrl"
                  />
                </div>
                <div class="flex-1"><List :list="mouthData?.list" /></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  <iframe :src="src" v-if="src" width="100%" height="100%"></iframe>
</template>

<script setup>
import List from '@/components/evaluatePdf/evaluateList.vue'
import { Get, Post } from '@/utils/request'
import html2pdf from 'html2pdf.js'

function processData(data) {
  const result = {
    临床检查: { owningModule: '临床检查', imageList: [], list: [] },
    面型评估: { owningModule: '面型评估', imageList: [], list: [] },
    全景片: { owningModule: '全景片', imageList: [], list: [] },
    口内照: { owningModule: '口内照', imageList: [], list: [] }
  }

  data.forEach((item) => {
    const { owningModule, imageUrl, titleName, optionsNames } = item

    if (imageUrl) {
      result[owningModule].imageList.push({ imageUrl })
    }

    if (titleName && optionsNames) {
      result[owningModule]?.list.push({ title_name: titleName, option_names: optionsNames })
    }
  })

  return result
}
const data = ref()
const checkData = ref()
const facialData = ref()
const panoData = ref()
const mouthData = ref()
async function getDataList() {
  const res = await Get(
    'prod-api/emr/facialAssessment/getFacialIssuesList?aptmId=3446944&location=1&serious=1'
  )
  data.value = Object.values(processData(res.data))
  checkData.value = data.value.find((item) => item.owningModule == '临床检查')
  facialData.value = data.value.find((item) => item.owningModule == '面型评估')
  panoData.value = data.value.find((item) => item.owningModule == '全景片')
  mouthData.value = data.value.find((item) => item.owningModule == '口内照')
}
const patientInfo = JSON.parse(sessionStorage.getItem('patientInfo')) || {}
// 得到当天日期
const today = new Date()
const year = today.getFullYear()
let month = today.getMonth() + 1 // 注意月份从0开始
const day = today.getDate()
if (month < 10) {
  month = '0' + month
}
const formattedDate = `${year}-${month}-${day}`
const generatePDF = () => {
  try {
    const options = {
      filename: `${patientInfo.patientName}__正畸报告__${formattedDate}.pdf`,
      margin: 0,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 2, useCORS: true, dpi: 96 },
      pagebreak: { mode: 'css' },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }
    const element = document.querySelector('.pdfContent')

    html2pdf()
      .set(options)
      .from(element)
      .toPdf()
      .get('pdf')
      .then((pdfObj) => {
        const formData = new FormData()
        const perBlob = pdfObj.output('blob')
        formData.append(
          'file',
          perBlob,
          `${patientInfo.patientName}__正畸报告__${formattedDate}.pdf`
        )

        Post('/prod-api/emr/upload', formData, true)
          .then((res) => {
            if (res.code == 200) {
              src.value = res.msg
              sessionStorage.setItem(`pdfUrl${props.id}`, src.value)
              emit('getPdfResult', src.value)
              ElMessage({
                type: 'success',
                message: '报告生成成功',
                duration: 0
              })
            } else {
              ElMessage({
                type: 'error',
                message: '生成失败'
              })
            }
          })
          .catch((err) => {
            console.log(err)
          })
          .finally(() => {
            loading.value?.close()
            setTimeout(() => {
              ElMessage.closeAll()
            }, 3000)
          })
      })
  } catch (err) {
    console.log(err)
  }
}
async function main() {
  // 依次执行这三个请求
  await getDataList()
  // 所有请求完成后执行生成PDF
  // 刚开始不可见，要生成之前可见就可以，
  const pdfContent = document.querySelector('.pdfContent')
  pdfContent.style.display = 'block'
  generatePDF()
}
const loading = ref()
const src = ref()
onMounted(() => {
  if (!src.value) {
    loading.value = ElLoading.service({
      lock: true,
      text: '报告生成中',
      // 把颜色改成不透明的，就看不到后面的pdf的内容了
      background: 'rgba(37, 38, 38, 1)'
    })

    main()
  }
})
</script>

<style scoped lang="scss">
:deep(.checkList.list1) {
  .list__item {
    width: auto !important;
  }
}
.pdfContent {
  position: relative;
  width: 210mm;

  .pdfPage {
    color: #404682;
    position: relative;
    width: 210mm; /* 页面宽度 */
    height: 296.8mm; /* 页面高度 */
    background-image: url('../../assets/eveluatePdf/cover.png');
    background-size: contain;
    background-size: 100%;
    page-break-inside: avoid;
    .patientInfo {
      position: absolute;
      left: 550px;
      top: 20px;
    }
    .check {
      .checkTitle {
        background-image: url('../../assets/eveluatePdf/临床检查背景.svg');
        background-repeat: no-repeat;
        background-size: auto 32px;
      }
    }
    .borderBox {
      box-sizing: border-box;
      border: 2px solid #216fb0;
    }
  }
}
</style>
