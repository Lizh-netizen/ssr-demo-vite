<template>
  <template v-if="!src">
    <div class="pdfContent" :style="{ display: 'none' }">
      <div class="pdfPage">
        <img class="background" src="../../assets/pdfTemplate/frontCover.png" />
        <div class="title">
          <div>
            <div class="title-date">{{ formattedDate }}</div>
            <div class="Chinese">正畸检查报告</div>
            <div class="item">
              <div class="label">姓名</div>
              <div class="value">{{ patientInfo.Name }}</div>
            </div>
            <div class="item">
              <div class="label">生日</div>
              <div class="value">{{ patientInfo.age }}</div>
            </div>
            <div class="item">
              <div class="label">诊所</div>
              <div class="value">{{ patientInfo.Abbreviation }}</div>
            </div>
          </div>
        </div>
      </div>
      <template v-for="item in data" :key="item.id">
        <template v-if="item.owningModule === '问诊'">
          <div class="pdfPage">
            <img class="background" src="../../assets/pdfTemplate/template1.png" />
            <Header text="基础信息" />
            <div class="personalInfo">
              <div class="item">
                <div class="label">姓名</div>
                {{ patientInfo.Name }}
              </div>
              <div class="item">
                <div class="label">病例号</div>
                {{ patientInfo.PrivateId }}
              </div>
              <div class="item">
                <div class="label">出生日期</div>
                {{ patientInfo.Birth?.split('T')?.[0] }}
              </div>
              <div class="item">
                <div class="label">评估日期</div>
                {{ formattedDate }}
              </div>
            </div>
            <div class="subTitle">主诉&既往史</div>
            <template v-if="item.owningModule === '问诊'">
              <div class="content">
                <div class="list">
                  <div class="list__item">主诉</div>
                  <div class="list__item">
                    {{ item.className }}
                    <div class="list innerList">
                      <div
                        class="list__item"
                        v-for="i in item.list"
                        :key="i.id"
                        :data-serious="i.serious"
                      >
                        <div>
                          {{ i.title_name }}：{{ i.option_names }}
                          <img
                            src="../../assets/svg/serious.svg"
                            v-show="i.serious == '1'"
                            :style="{
                              'margin-left': '8px'
                            }"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <div class="subTitle" v-if="data.find((item) => item.owningModule == '临床检查')">
              临床检查
            </div>
            <div class="content">
              <list
                :list="data.find((item) => item.owningModule == '临床检查').list"
                v-if="data.find((item) => item.owningModule == '临床检查')"
              />
            </div>
          </div>
        </template>

        <template v-if="item.owningModule === '诊断'">
          <div class="pdfPage">
            <img class="background" src="../../assets/pdfTemplate/template1.png" />
            <Header text="评估结果" />
            <div class="subTitle issuesList" v-if="issuesList.length > 0">问题列表</div>
            <div class="content">
              <list :list="issuesList" moduleName="问题列表" />
            </div>
            <div class="subTitle">诊断</div>
            <div class="content">
              <list :list="item.list" />
            </div>
            <div class="subTitle" v-if="data.find((item) => item.owningModule == '方案')">方案</div>
            <div class="content">
              <list
                :list="data.find((item) => item.owningModule == '方案').list"
                v-if="data.find((item) => item.owningModule == '方案')"
              />
            </div>
          </div>
        </template>
        <template v-if="item.owningModule === '面型评估'">
          <div class="pdfPage face">
            <img class="background" src="../../assets/pdfTemplate/faceTemp.png" />
            <Header text="影像分析" />
            <div class="className">面型评估</div>
            <div class="imageList1">
              <div :style="{ display: 'flex', gap: '16px' }">
                <div
                  :style="{
                    width: '170px',
                    'border-radius': '12px',
                    height: '230px',
                    position: 'relative',
                    overflow: 'hidden'
                  }"
                  v-for="image in item.imageList1"
                  :key="image.className"
                >
                  <div class="imageCaption" v-if="image.imageUrl">{{ image.className }}</div>
                  <img
                    crossOrigin="anonymous"
                    :src="image.imageUrl + `?random=${Math.random()}`"
                    :style="{ width: '100%' }"
                  />
                </div>
              </div>
            </div>
            <div class="content1 content">
              <customList :list="item.list1" />
            </div>
            <div class="imageList2">
              <div
                :style="{
                  width: '170px',
                  'border-radius': '12px',
                  height: '230px',
                  position: 'relative',
                  overflow: 'hidden'
                }"
                v-for="image in item.imageList2"
                :key="image.className"
              >
                <div class="imageCaption" v-if="image.imageUrl">{{ image.className }}</div>
                <img
                  crossOrigin="anonymous"
                  :style="{ width: '100%' }"
                  :src="image.imageUrl + `?random=${Math.random()}`"
                />
              </div>
            </div>
            <div class="content2 content">
              <customList :list="item.list2" />
            </div>
          </div>
        </template>

        <template v-if="item.owningModule === '口内照'">
          <div class="pdfPage mouth">
            <img class="background" src="../../assets/pdfTemplate/mouthTemp.png" />
            <Header text="影像分析" />
            <div class="className">口内照</div>
            <div class="middle section">
              <div class="imageList1">
                <div class="image1" :style="{ position: 'relative' }">
                  <div class="imageCaption" v-if="item.imageList1[0]?.imageUrl">
                    {{ item.imageList1[0]?.className }}
                  </div>
                  <img
                    crossOrigin="anonymous"
                    class="image1"
                    :src="item.imageList1[0]?.imageUrl + `?random=${Math.random()}`"
                  />
                </div>
                <div :style="{ position: 'relative' }" class="image2">
                  <div class="imageCaption" v-if="item.imageList1[1]?.imageUrl">
                    {{ item.imageList1[1]?.className }}
                  </div>
                  <img
                    crossOrigin="anonymous"
                    class="image2"
                    :src="item.imageList1[1]?.imageUrl + `?random=${Math.random()}`"
                  />
                </div>
                <div :style="{ position: 'relative' }">
                  <div class="imageCaption" v-if="item.imageList1[2]?.imageUrl">
                    {{ item.imageList1[2]?.className }}
                  </div>
                  <img
                    crossOrigin="anonymous"
                    class="image3"
                    :src="item.imageList1[2]?.imageUrl + `?random=${Math.random()}`"
                  />
                </div>
              </div>
              <div class="content1 content">
                <customList :list="item.list1" />
              </div>
            </div>
            <div class="bottom section">
              <div class="content2 content">
                <customList :list="item.list1" />
              </div>
              <div class="imageList2">
                <div :style="{ position: 'relative' }" class="image1">
                  <div class="imageCaption" v-if="item.imageList2[0]?.imageUrl">
                    {{ item.imageList2[0]?.className }}
                  </div>
                  <img
                    crossOrigin="anonymous"
                    class="image1"
                    :src="item.imageList2[0]?.imageUrl + `?random=${Math.random()}`"
                  />
                </div>
                <div :style="{ position: 'relative' }" class="image2">
                  <div class="imageCaption" v-if="item.imageList2[1]?.imageUrl">
                    {{ item.imageList2[1]?.className }}
                  </div>
                  <img
                    crossOrigin="anonymous"
                    class="image2"
                    :src="item.imageList2[1]?.imageUrl + `?random=${Math.random()}`"
                  />
                </div>
                <div :style="{ position: 'relative' }">
                  <div class="imageCaption" v-if="item.imageList2[2]?.imageUrl">
                    {{ item.imageList2[2]?.className }}
                  </div>
                  <img
                    crossOrigin="anonymous"
                    class="image3"
                    :src="item.imageList2[2]?.imageUrl + `?random=${Math.random()}`"
                  />
                </div>
                <div :style="{ position: 'relative' }">
                  <div class="imageCaption" v-if="item.imageList2[3]?.imageUrl">
                    {{ item.imageList2[3]?.className }}
                  </div>
                  <img
                    crossOrigin="anonymous"
                    class="image4"
                    :src="item.imageList2[3]?.imageUrl + `?random=${Math.random()}`"
                  />
                </div>
                <div :style="{ position: 'relative' }">
                  <div class="imageCaption" v-if="item.imageList2[4]?.imageUrl">
                    {{ item.imageList2[4]?.className }}
                  </div>
                  <img
                    crossOrigin="anonymous"
                    class="image5"
                    :src="item.imageList2[4]?.imageUrl + `?random=${Math.random()}`"
                  />
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-if="item.owningModule === '全景片' || item.owningModule === '侧位片'">
          <div class="pdfPage flexPdfPage">
            <img class="background" src="../../assets/pdfTemplate/pano.png" />
            <Header text="影像分析" />
            <div class="imgBox">
              <div class="imageCaption" v-if="item.fileUrl">{{ item.className }}</div>
              <img
                :src="item.fileUrl + `?random=${Math.random()}`"
                crossOrigin="anonymous"
                class="avator pic"
              />
            </div>
            <div class="content blueBackground">
              <list :list="item.list" />
            </div>
          </div>
        </template>
        <template v-if="item.owningModule === '目标'">
          <div class="pdfPage">
            <img class="background" src="../../assets/pdfTemplate/template1.png" />
            <Header text="目标&方法&风险" />
            <div class="subTitle">目标</div>
            <div class="content">
              <list :list="item.list" />
            </div>
            <template v-if="item.method">
              <div class="subTitle">方法</div>
              <div class="content">
                <list :list="item.method.list" />
              </div>
            </template>
            <div class="subTitle" v-if="data.find((item) => item.owningModule == '风险')">风险</div>
            <div class="content">
              <list
                :list="data.find((item) => item.owningModule == '风险').list"
                v-if="data.find((item) => item.owningModule == '风险')"
              />
            </div>
          </div>
        </template>
      </template>
      <div class="last-page">
        <img class="background" src="../../assets/pdfTemplate/endCover.png" />
      </div>
    </div>
  </template>
  <iframe :src="src" v-if="src" width="100%" height="600px"></iframe>
</template>

<script setup>
import html2pdf from 'html2pdf.js'
import { onMounted, ref, defineEmits, defineProps } from 'vue'
import { useRoute } from 'vue-router'
import { Get, Post } from '@/utils/request'
import Header from '@/components/customHeader.vue'
import list from '@/components/pdf/list.vue'
import customList from '@/components/pdf/customList.vue'

import { ElLoading } from 'element-plus'
const props = defineProps(['id'])
const patientName = ref()
patientName.value = sessionStorage.getItem('name')
const route = useRoute()
const appId = route.params.appId
const patientId = route.params.patientId

const patientInfo = ref({})
async function getPatientInfo() {
  const result = await Get(`prod-api/business/patient/ljPatient/${patientId}`)
  patientInfo.value = result.data
}
// 得到当天日期
const today = new Date()
const year = today.getFullYear()
let month = today.getMonth() + 1 // 注意月份从0开始
const day = today.getDate()
if (month < 10) {
  month = '0' + month
}
const formattedDate = `${year}-${month}-${day}`
const data = ref([])
const order = [
  '问诊',
  '临床检查',
  '诊断',
  '方案',
  '面型评估',
  '口内照',
  '全景片',
  '侧位片',
  '目标',
  '方法'
]
function sort(a, b) {
  const indexA = order.indexOf(a.owningModule)
  const indexB = order.indexOf(b.owningModule)

  if (indexA === -1) {
    return 1 // 如果a的值不在order中，将其排在后面
  }
  if (indexB === -1) {
    return -1 // 如果b的值不在order中，将其排在后面
  }

  return indexA - indexB // 根据order中的位置进行比较
}
// 获取非问题列表页面的数据
const faceImageList1 = ['正面像', '正面微笑像']
const faceImageList2 = ['90度侧面像', '45度侧面像', '45度侧面微笑像', '90度侧面微笑像']
const mouthImageList1 = ['正面咬合', '口内照（左侧）', '口内照（右侧）']
const mouthImageList2 = ['前牙覆盖', '磨牙关系（左侧）', '磨牙关系（右侧）', '上颌', '下颌']
async function getDataList() {
  const result = await Get(`/prod-api/business/orthClass/issuesList?apmtId=${appId}&location=2`)
  if (result.data?.length > 0) {
    const acc = result.data.reduce((acc, cur) => {
      if (
        cur.owningModule !== '面型评估' &&
        cur.owningModule !== '口内照' &&
        acc[cur.owningModule]
      ) {
        acc[cur.owningModule].list.push({
          title_name: cur.title_name,
          option_names: cur.option_names,
          serious: cur.serious
        })
      } else if (
        (cur.owningModule === '面型评估' || cur.owningModule === '口内照') &&
        acc[cur.owningModule + cur.className]
      ) {
        acc[cur.owningModule + cur.className].list.push({
          title_name: cur.title_name,
          option_names: cur.option_names,
          serious: cur.serious
        })
      } else if (
        cur.owningModule !== '面型评估' &&
        cur.owningModule !== '口内照' &&
        !acc[cur.owningModule]
      ) {
        acc[cur.owningModule] = cur
        acc[cur.owningModule].list = []
        acc[cur.owningModule].list.push({
          title_name: cur.title_name,
          option_names: cur.option_names,
          serious: cur.serious
        })
      } else if (
        (cur.owningModule === '面型评估' || cur.owningModule === '口内照') &&
        !acc[cur.owningModule + cur.className]
      ) {
        acc[cur.owningModule + cur.className] = cur
        acc[cur.owningModule + cur.className].list = []
        acc[cur.owningModule + cur.className].list.push({
          title_name: cur.title_name,
          option_names: cur.option_names,
          serious: cur.serious
        })
      }
      return acc
    }, {})
    // 得到的数组按照order的顺序，除了面型评估和口内照其他的每个一个item, 然后对面型评估和口内照进行合并
    data.value = Object.values(acc)
    data.value.sort(sort)
    const reduced = data.value.reduce((acc, cur) => {
      if (cur.owningModule == '面型评估') {
        if (acc[cur.owningModule]) {
          if (faceImageList1.includes(cur.className)) {
            acc[cur.owningModule].imageList1.push({
              className: cur.className,
              imageUrl: cur.image_url
            })
            acc[cur.owningModule].list1 = acc[cur.owningModule].list1.concat(cur.list)
          } else {
            acc[cur.owningModule].list2.push(...cur.list)
            acc[cur.owningModule].imageList2.push({
              className: cur.className,
              imageUrl: cur.image_url
            })
          }
        } else {
          acc[cur.owningModule] = cur
          acc[cur.owningModule].list1 = []
          acc[cur.owningModule].imageList1 = []
          acc[cur.owningModule].imageList2 = []
          acc[cur.owningModule].list2 = []
          if (faceImageList1.includes(cur.className)) {
            acc[cur.owningModule].imageList1.push({
              className: cur.className,
              imageUrl: cur.image_url
            })
            acc[cur.owningModule].list1 = cur.list
          }
        }
      } else if (cur.owningModule == '口内照') {
        if (acc[cur.owningModule]) {
          if (mouthImageList1.includes(cur.className)) {
            acc[cur.owningModule].imageList1.push({
              className: cur.className,
              imageUrl: cur.image_url
            })
            acc[cur.owningModule].list1 = acc[cur.owningModule].list1.concat(cur.list)
          } else {
            acc[cur.owningModule].list2.push(...cur.list)
            acc[cur.owningModule].imageList2.push({
              className: cur.className,
              imageUrl: cur.image_url
            })
          }
        } else {
          acc[cur.owningModule] = cur
          acc[cur.owningModule].list1 = []
          acc[cur.owningModule].imageList1 = []
          acc[cur.owningModule].imageList2 = []
          acc[cur.owningModule].list2 = []
          if (mouthImageList1.includes(cur.className)) {
            acc[cur.owningModule].imageList1.push({
              className: cur.className,
              imageUrl: cur.image_url
            })
            acc[cur.owningModule].list1 = cur.list
          }
        }
      } else {
        acc[cur.owningModule] = cur
      }
      return acc
    }, {})
    data.value = Object.values(reduced)
    const objective = data.value.find((item) => item.owningModule == '目标')
    const method = data.value.find((item) => item.owningModule == '方法')
    if (objective && method) {
      objective.method = method
      data.value.splice(
        data.value.findIndex((item) => item.owningModule == '方法'),
        1
      )
    }
  }
}
const imgCount = ref(0)
// 获取完数据在其中添加图片
async function getClassifiedImgList() {
  const res = await Get(`/prod-api/business/orthImage/list?apmtId=${appId}`)
  if (res.code == 200) {
    // const molar = res.data.find((item) => item.imageType === '磨牙关系（左侧）')
    const face = data.value.find((d) => d.owningModule === '面型评估')
    const mouth = data.value.find((d) => d.owningModule === '口内照')

    faceImageList1.forEach((item) => {
      if (face && !face.imageList1.some((image) => image.className === item)) {
        face.imageList1.push({ className: item })
      }
    })
    faceImageList2.forEach((item) => {
      if (face && !face.imageList2.some((image) => image.className === item)) {
        face.imageList2.push({ className: item })
      }
    })
    mouthImageList1.forEach((item) => {
      if (mouth && !mouth.imageList1.some((image) => image.className === item)) {
        mouth.imageList1.push({ className: item })
      }
    })
    mouthImageList2.forEach((item) => {
      if (mouth && !mouth.imageList2.some((image) => image.className === item)) {
        mouth.imageList2.push({ className: item })
      }
    })
    res.data.forEach((item) => {
      face?.imageList1?.forEach((a) => {
        if (item.imageType == a.className) {
          a.imageUrl = item.imageUrl
          imgCount.value++
        }
      })
      face?.imageList2?.forEach((a) => {
        if (item.imageType == a.className) {
          a.imageUrl = item.imageUrl
          imgCount.value++
        }
      })
      mouth?.imageList1?.forEach((a) => {
        if (item.imageType == a.className) {
          a.imageUrl = item.imageUrl
          imgCount.value++
        }
      })
      mouth?.imageList2?.forEach((a) => {
        if (item.imageType == a.className) {
          a.imageUrl = item.imageUrl
          imgCount.value++
        }
      })
      // if (molar && item.imageType === '磨牙关系（右侧）') {
      //   mouth?.imageList2?.push({
      //     className: '磨牙关系（右侧）',
      //     imageUrl: item.imageUrl
      //   })
      // }
      data.value.forEach((b) => {
        if (b.className === item.imageType && item.imageUrl) {
          b.fileUrl = item.imageUrl
          imgCount.value++
        }
      })
    })
  }
}

const issuesList = ref([])
// 获取问题列表
async function getIssuesList() {
  const result = await Get(`/prod-api/business/orthClass/issuesList?apmtId=${appId}&serious=1`)
  if (result.data?.length > 0) {
    issuesList.value = result.data.map((item) => ({
      title_name: item.title_name,
      option_names: item.option_names,
      serious: item.serious
    }))
  }
}

// let generatedPdfData = null
const src = ref()
const pdf = sessionStorage.getItem(`pdfUrl${props.id}`)
src.value = pdf ? pdf : ''

const emit = defineEmits(['getPdfResult'])
const generatePDF = () => {
  try {
    const options = {
      filename: `${patientInfo.value.Name}__正畸报告__${formattedDate}.pdf`,
      margin: 0,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 2, useCORS: true, dpi: 96 },
      pagebreak: { mode: 'css' },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }
    const element = document.querySelector('.pdfContent')
    // html2pdf().set(options).from(element).save()

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
          `${patientInfo.value.Name}__正畸报告__${formattedDate}.pdf`
        )
        Post('/prod-api/emr/upload', formData, true)
          .then((res) => {
            if (res.code == 200) {
              src.value = res.msg
              sessionStorage.setItem(`pdfUrl${props.id}`, src.value)
              emit('getPdfResult', src.value)
              ElMessage({
                type: 'success',
                message: '报告生成成功'
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
          })
      })
  } catch (err) {
    console.log(err)
  }
}

async function main() {
  // 依次执行这三个请求
  await getDataList()
  await getClassifiedImgList()
  await getIssuesList()
  await getPatientInfo()
  // 所有请求完成后执行生成PDF
  // 刚开始不可见，要生成之前可见就可以，
  const pdfContent = document.querySelector('.pdfContent')
  pdfContent.style.display = 'block'
  generatePDF()
}
const loading = ref()

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

<style lang="scss" scoped>
.FrontalSmile1Wrapper {
  position: absolute;
  width: 500px;
  height: 500px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  top: 400px;
  left: 50px;
}
.FrontalSmile1 {
  width: 500px;
}
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
body {
  margin: 0;
}
.pic {
  margin-bottom: 0;
  width: 100%;
  border-radius: 12px;
}
.imageCaption {
  font-size: 10px;
  font-weight: 500;
  line-height: normal;
  letter-spacing: 0.16em;
  color: #ffffff;
  position: absolute;
  padding: 4px 12px;
  background: #2e6ce4;
  border-radius: 12px 0px 12px 0px;
}
.contentImg {
  position: absolute;
  z-index: 10;
  &.content1 {
    top: 232px;
    left: 204px;
  }
  &.content2 {
    top: 438px;
    left: 483px;
  }
  &.content3 {
    bottom: 93px;
    left: 204px;
  }
}
.pdfContent {
  position: relative;
  width: 210mm;
  /* 页面宽度 */
  .last-page {
    width: 210mm; /* 页面宽度 */
    height: 296.8mm;
    position: relative;
    .background {
      width: 100%; /* 图片宽度与页面宽度相同 */
      height: 100%; /* 图片高度与页面高度相同 */
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: -1;
    }
  }
  .pdfPage {
    color: #404682;
    position: relative;
    width: 210mm; /* 页面宽度 */
    height: 297mm; /* 页面高度 */

    page-break-inside: avoid;
    padding: 50px 30px;
    .listType {
      width: 8px;
      height: 8px;
      background: #404682;
      margin-right: 8px;
    }
    &.flexPdfPage {
      display: flex;
      flex-direction: column;
      .content {
        flex: 1;
      }
    }
    &.face {
      .className {
        position: absolute;
        top: 260px;
        left: 152px;
        font-size: 24px;
        font-weight: 500;
        line-height: normal;
        text-align: center;
        letter-spacing: 0em;
        color: #2e6ce4;
      }
      .imageList1 {
        width: 360px;
        height: 226px;
        top: 410px;
        left: 26px;
        position: absolute;
      }
      .imageList2 {
        width: 360px;
        top: 570px;
        right: 26px;
        position: absolute;
        height: 468px;
        display: grid;
        grid-column-gap: 6px;
        grid-row-gap: 18px;
        grid-template-columns: auto auto;
      }
      .content2 {
        position: absolute;
        right: 28px;
        width: 360px;
        top: 160px;
        height: 400px;
        display: flex;
        align-items: center;

        &.content {
          .list1 {
            width: 100%;
            display: block;
          }
        }
      }
      .content1 {
        position: absolute;
        left: 30px;
        width: 340px;
        top: 660px;
        height: 390px;
        display: flex;
        align-items: center;
        &.content {
          .list1 {
            width: 100%;
            display: block;
            .list__item {
              background: red;
              width: 100%;
              text-wrap: nowrap;
            }
          }
        }
      }
    }
    &.mouth {
      .content {
        .list1 {
          width: 100%;
          display: block;
          .list__item {
            width: 100%;
            text-wrap: nowrap;
          }
        }
      }
      .className {
        height: 58px;
        border-radius: 12px;
        opacity: 1;
        width: 100%;
        background: #eaf0fc;
        margin-top: 22px;
        text-align: center;
        line-height: 58px;
        font-size: 20px;
        font-weight: bold;
        text-align: center;
        letter-spacing: 0em;
        color: #2e6ce4;
      }
      .section {
        display: flex;
        img {
          border-radius: 12px;
        }
      }
      .middle {
        margin-top: 16px;

        .imageList1 {
          display: grid;
          grid-gap: 10px;
          .image1 {
            max-width: 267px;
            grid-column: 1 / span 2;
            grid-row: 1 / span 2;
            height: 100%;
          }
          .image2,
          .image3 {
            width: 126px;
          }
          .image2 {
            grid-column: 3;
            grid-row: 1;
          }
          .image3 {
            grid-column: 3;
            grid-row: 2;
          }
        }
        .content1 {
          flex: 1;
          margin-left: 10px;
          background: #f4f7fd;
          border-radius: 12px;
          display: flex;
          align-items: center;
        }
      }
      .bottom {
        margin-top: 18px;
        background: #f4f7fd;
        padding: 16px;
        padding-left: 0;
        justify-content: space-between;
        border-radius: 12px;
        .content2.content {
          display: flex;
          align-items: center;
          flex: 1;
          .list1 {
            width: 100%;
            display: block;
            .list__item {
              width: 100%;
              text-wrap: nowrap;
            }
          }
        }
        .imageList2 {
          width: 316px;
          height: 100%;
          display: grid;
          grid-gap: 10px;
          grid-template-columns: auto auto;
          .image1 {
            width: 316px;
            grid-column: 1 / span 2;
          }
          .image2,
          .image3,
          .image4,
          .image5 {
            width: 150px;
            height: 100px;
          }
        }
      }
    }
    .background {
      width: 210mm; /* 图片宽度与页面宽度相同 */
      height: 100%; /* 图片高度与页面高度相同 */
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: -1;
    }
    .title {
      bottom: 100px;
      left: 45px;
      display: flex;
      box-sizing: border-box;
      align-items: center;
      justify-content: center;
      position: absolute;
      font-weight: 900;
      font-size: 76px;
      line-height: normal;
      letter-spacing: 0px;
      color: #3b4485;
      .English {
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 12px;
        letter-spacing: 0.16em;
      }
      .Chinese {
        margin-bottom: 33px;
      }
      .item {
        display: flex;
        margin-bottom: 20px;
        align-items: center;
        gap: 12px;
        .label {
          font-size: 12px;
          font-weight: 500;
          line-height: normal;
          letter-spacing: 0px;
          padding: 2px 14px;
          box-sizing: border-box;
          color: #ffffff;
          background: #3b4485;
          width: 52px;
        }
        .value {
          font-size: 14px;
          font-weight: 500;
          line-height: normal;
          letter-spacing: 0px;
        }
      }

      &.imgTitle {
        height: 290px;
        text-align: center;
      }
      &-date {
        font-size: 48px;
      }
    }
    .subTitle {
      background: #2e6ce4;
      width: 100%;
      padding: 6px 24px;
      box-sizing: border-box;
      font-size: 13px;
      font-weight: 500;
      line-height: normal;
      letter-spacing: 0em;
      border-radius: 262px;
      color: #ffffff;
      &.issuesList {
        background: #f76560;
      }
    }
    .personalInfo {
      margin-left: 14px;
      margin-top: -11px;
      width: 100%;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      font-size: 13px;
      font-weight: normal;
      line-height: normal;
      letter-spacing: 0em;
      margin-bottom: 10px;
      .item {
        width: 50%;
        margin-bottom: 12px;
        display: flex;
        align-items: center;
        .label {
          width: 60px;
          margin-right: 16px;
        }
      }
    }
    .content {
      color: #4e5969;
      padding-top: 16px;
      padding-bottom: 4px;
      padding-left: 12px;
      &.blueBackground {
        background: #f4f7fd;
        margin-top: 12px;
        border-radius: 12px;
      }
      .list {
        &__item {
          margin-bottom: 16px;
          &:before {
            display: inline-block;
            content: '';
            width: 8px;
            height: 8px;
            background: #4e5969;
            margin-right: 8px;
            border-radius: 50%;
          }
        }
        &.innerList {
          display: flex;
          flex-wrap: wrap;
          padding: 16px;

          .list__item {
            width: 50%;
            padding-right: 10px;
            display: flex;
            &:before {
              display: inline-block;
              content: '';
              min-width: 8px;
              height: 8px;
              box-sizing: border-box;
              border: 2px solid #404682;
              background: #fff;
              position: relative;
              top: 6px;
            }
          }
        }
      }
    }
    img.rect.img {
      width: 505px;
      height: 56px;
      position: absolute;
      bottom: 66px !important;
      left: 50%;
      transform: translate(-50%);
      top: 1000px;
    }
    &.front {
      .imgItem:last-child {
        flex-direction: row-reverse;
      }
    }
    .plan {
      position: absolute;
      bottom: 80px;
      left: 300px;
      font-size: 20px;
      font-weight: bold;
      line-height: normal;
      letter-spacing: 0.16em;
      color: #ffffff;
    }
  }

  .content {
    z-index: 10;
  }
  .imgList {
    .imgItem {
      display: flex;
      height: 380px;
      .avatorContainer {
        position: relative;
        .imgBox {
          position: relative;
          width: 400px;
          height: 316px;
          overflow: hidden;
          display: flex;
          justify-content: center;
          align-items: center;
          background: black;
        }
        .avator {
          width: 100%;
        }
        .caption {
          position: absolute;
          top: 0;
          left: 0;

          height: 28px;
          padding: 4px 16px;
          background: #fdb32c;
        }
      }
    }
    .desc {
      padding: 17px;
      flex: 1;
    }
  }
}
.pdfPage.side {
  .imgList {
    .imgItem {
      height: 360px;
    }
  }
}
</style>
