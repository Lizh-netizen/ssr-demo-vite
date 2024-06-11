<template>
  <template v-if="!src">
    <div class="pdfContent" :style="{ display: 'none' }">
      <div class="pdfPage">
        <img class="background" src="@/assets/pdfTemplate/frontCover.png" />
        <div class="title">
          <div>
            <div class="Chinese"><img src="@/assets/pdfTemplate/title.svg" /></div>
            <div class="font-size-[24px] mb-[33px]!">（含治疗计划）</div>

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
              <div class="value">{{ patientInfo.aptmOfficeName }}</div>
            </div>
            <div class="item">
              <div class="label">检查日期</div>
              <div class="value">{{ formattedDate }}</div>
            </div>
          </div>
        </div>
      </div>
      <template v-for="item in data" :key="item.id">
        <template v-if="item.owningModule === '问诊'">
          <div class="pdfPage">
            <img class="background" src="@/assets/pdfTemplate/template1.png" />
            <Header text="基础信息" />
            <el-row class="flex mb-[10px]!">
              <img
                :src="imgCover + `?random=${Math.random()}`"
                class="h-[134px]! w-[89px]!"
                crossOrigin="anonymous"
                v-if="imgCover"
              />
              <img
                class="h-[134px]! w-[89px]!"
                src="@/assets/imgs/avatar-boy.png"
                v-else-if="!imgCover && patientInfo.Sex == 1"
              />
              <img
                class="h-[134px]! w-[89px]!"
                src="@/assets/imgs/avatar-girl.png"
                v-else-if="!imgCover && patientInfo.Sex == 2"
              />
              <img class="h-[134px]! w-[89px]!" src="@/assets/imgs/avatar.png" v-else />

              <div class="personalInfo">
                <div class="item">
                  <div class="label">姓名</div>
                  {{ patientInfo.Name + patientInfo.age?.match(/\(([^)]+)\)/)[0] }}
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
            </el-row>

            <div class="subTitle">主诉&既往史</div>
            <template v-if="item.owningModule === '问诊' && item.list">
              <div class="content">
                <div class="list">
                  <template v-for="i in item.list">
                    <div
                      class="list__item"
                      v-if="i.title_name == '主诉' || i.title_name == '现病史'"
                    >
                      {{ i.title_name }} : {{ i.option_names }}
                    </div>
                  </template>

                  <div class="list__item">
                    {{ item.className }}
                    <div class="list innerList">
                      <template v-for="i in item.list" :key="i.id">
                        <div
                          v-if="i.title_name != '主诉' && i.title_name !== '现病史'"
                          class="list__item"
                        >
                          <span>{{ i.title_name }}：{{ i.option_names }}</span>
                          <img
                            src="../../assets/svg/serious.svg"
                            v-show="i.serious == '1'"
                            :style="{
                              'margin-left': '8px',
                              height: '13px'
                            }"
                          />
                        </div>
                      </template>
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

        <template v-if="item.owningModule === '面型评估'">
          <div class="pdfPage face">
            <img class="background" src="../../assets/pdfTemplate/mouthTemp.png" />
            <Header text="面型评估" />
            <div class="flex">
              <div class="imageList1">
                <div
                  class="imageBox imageSize"
                  v-for="image in item.imageList1"
                  :key="image.className"
                >
                  <div class="imageCaption">{{ image.className }}</div>
                  <img
                    crossOrigin="anonymous"
                    :src="image.imageUrl + `?random=${Math.random()}`"
                    v-if="image.imageUrl"
                  />
                  <img src="@/assets/imgs/placeholder-vertical.png" v-else />
                </div>
              </div>
              <div class="content1 content">
                <customList :list="item.list1" />
              </div>
            </div>
          </div>
        </template>

        <template v-if="item.owningModule === '口内照'">
          <div class="pdfPage mouth">
            <img class="background" src="../../assets/pdfTemplate/mouthTemp.png" />
            <Header text="咬合分析" />
            <div class="middle section">
              <div class="imageList1">
                <div class="imageBox image1 overflow-hidden">
                  <div class="imageCaption">
                    {{ item.imageList1[0]?.className }}
                  </div>
                  <img
                    crossOrigin="anonymous"
                    class="h-full"
                    :src="item.imageList1[0]?.imageUrl + `?random=${Math.random()}`"
                    v-if="item.imageList1[0]?.imageUrl"
                  />
                  <img src="@/assets/imgs/placeholder-h-blue.png" v-else class="h-full" />
                </div>
                <div class="imageBox image2 overflow-hidden">
                  <div class="imageCaption">
                    {{ item.imageList1[1]?.className }}
                  </div>
                  <img
                    crossOrigin="anonymous"
                    :src="item.imageList1[1]?.imageUrl + `?random=${Math.random()}`"
                    class="h-full! w-auto!"
                    v-if="item.imageList1[1]?.imageUrl"
                  />
                  <img src="@/assets/imgs/placeholder-v-blue.png" class="h-full" v-else />
                </div>
              </div>
              <div class="content1 content">
                <customList :list="item.list1" />
              </div>
            </div>
            <div class="bottom section">
              <div class="imageList2">
                <div
                  v-for="image in item.imageList2"
                  class="w-[50%]! h-[250px]! imageBox overflow-hidden"
                >
                  <div class="imageCaption">
                    {{ image.className }}
                  </div>
                  <img
                    crossOrigin="anonymous"
                    :src="image.imageUrl + `?random=${Math.random()}`"
                    class="h-full"
                    v-if="image.imageUrl"
                  />
                  <img src="@/assets/imgs/placeholder-h-blue.png" v-else class="h-full" />
                </div>
              </div>
              <div class="content2 content">
                <customList :list="item.list2.list1" />
                <customList :list="item.list2.list2" />
              </div>
            </div>
          </div>
        </template>
        <template v-if="item.owningModule === '口内照'">
          <div class="pdfPage mouth">
            <img class="background" src="../../assets/pdfTemplate/mouthTemp.png" />
            <Header text="咬合分析" />
            <div class="bottom section">
              <div class="imageList2">
                <div
                  v-for="image in item.imageList3"
                  class="w-[50%]! h-[250px]! imageBox overflow-hidden"
                >
                  <div class="imageCaption">
                    {{ image.className }}
                  </div>
                  <img
                    crossOrigin="anonymous"
                    :src="image.imageUrl + `?random=${Math.random()}`"
                    v-if="image.imageUrl"
                    class="h-full"
                  />
                  <img src="@/assets/imgs/placeholder-h-blue.png" class="h-full" v-else />
                </div>
              </div>
              <div class="content2 content">
                <customList :list="item.list3.list1" />
                <customList :list="item.list3.list2" />
              </div>
            </div>
            <div class="bottom section" v-if="item.imageList4.length > 0">
              <div class="imageList2">
                <div
                  v-for="image in item.imageList4"
                  class="w-[50%]! h-[250px]! imageBox overflow-hidden"
                >
                  <div class="imageCaption">
                    {{ image.className }}
                  </div>
                  <img
                    crossOrigin="anonymous"
                    :src="image.imageUrl + `?random=${Math.random()}`"
                    v-if="image.imageUrl"
                    class="h-full"
                  />
                  <img src="@/assets/imgs/placeholder-h-blue.png" v-else class="h-full" />
                </div>
              </div>
              <div class="content2 content">
                <customList :list="item.list4.list1" />
                <customList :list="item.list4.list2" />
              </div>
            </div>
          </div>
        </template>
        <template v-if="item.owningModule === '全景片'">
          <div class="pdfPage flexPdfPage">
            <img class="background" src="../../assets/pdfTemplate/pano.png" />
            <Header text="影像分析" />
            <div
              class="imgBox imageBox"
              :class="{
                cepha: item.owningModule === '侧位片',
                pano: item.owningModule === '全景片',
                hasBackGround: item.imageUrl
              }"
            >
              <div class="imageCaption">
                {{ item.className }}
              </div>
              <img
                :src="item.imageUrl + `?random=${Math.random()}`"
                crossOrigin="anonymous"
                class="avator"
                :class="{ cephaImg: item.owningModule === '侧位片' }"
                v-if="item.imageUrl"
              />
              <img src="@/assets/imgs/placeholder-horizontal.png" v-else />
            </div>
            <div class="content blueBackground" v-show="item.list.length > 0">
              <list :list="item.list" />
            </div>
          </div>
        </template>
        <template v-if="item.owningModule === '侧位片'">
          <div class="pdfPage flexPdfPage">
            <img class="background" src="../../assets/pdfTemplate/pano.png" />
            <Header text="影像分析" />
            <div
              class="imgBox imageBox h-[350px]!"
              :class="{
                cepha: item.owningModule === '侧位片',
                pano: item.owningModule === '全景片',
                hasBackGround: item.imageUrl
              }"
            >
              <div class="imageCaption">
                {{ item.className }}
              </div>
              <img
                :src="item.imageUrl + `?random=${Math.random()}`"
                crossOrigin="anonymous"
                class="h-full object-cover"
                :class="{ cephaImg: item.owningModule === '侧位片' }"
                v-if="item.imageUrl"
              />
              <img src="@/assets/imgs/placeholder-horizontal.png" v-else class="h-full" />
            </div>

            <el-table :data="cephaData" style="width: 100%" :cell-style="{ border: 'none' }">
              <el-table-column prop="titleName" label="测量项" width="70" />
              <el-table-column prop="standardValue" label="标准值" width="70" />
              <el-table-column prop="cephalotricsContent" label="实际值" width="70">
                <template #default="scope">
                  <div class="flex items-center">
                    <div
                      :class="
                        scope.row.measurementBias === 'ABOVE'
                          ? 'text-[#F65B56]'
                          : scope.row.measurementBias === 'BELOW'
                            ? 'text-[#2E6CE4]'
                            : ''
                      "
                    >
                      {{ scope.row.cephalotricsContent }}
                    </div>
                    <img
                      class="position-absolute right-[20px]"
                      src="@/assets/svg/upwards.svg"
                      v-show="scope.row.measurementBias === 'ABOVE'"
                    />
                    <img
                      src="@/assets/svg/downwards.svg"
                      class="position-absolute right-[20px]"
                      v-show="scope.row.measurementBias === 'BELOW'"
                    />
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="optionName" label="含义">
                <template #default="scope">
                  <div class="flex items-center">
                    <div
                      :class="
                        scope.row.measurementBias === 'ABOVE'
                          ? 'text-[#F65B56]'
                          : scope.row.measurementBias === 'BELOW'
                            ? 'text-[#2E6CE4]'
                            : ''
                      "
                    >
                      {{ scope.row.optionName }}
                    </div>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <list :list="extractedData" class="cephaList bg-#F4F7FD; text-[12px]" :noMB="true" />
          </div>
        </template>
        <template v-if="item.owningModule === '问题列表'">
          <div class="pdfPage">
            <img class="background" src="../../assets/pdfTemplate/template1.png" />
            <Header text="评估结果" />
            <div class="subTitle issuesList" v-if="item.data.length > 0">问题列表</div>
            <div class="content">
              <list :list="item.data" moduleName="问题列表" />
            </div>
            <div class="subTitle" v-if="data.find((item) => item.owningModule === '诊断')">
              诊断
            </div>
            <div class="content">
              <list
                :list="data.find((item) => item.owningModule === '诊断')?.list"
                v-if="data.find((item) => item.owningModule == '诊断')"
              />
            </div>
          </div>
        </template>
        <template v-if="item.owningModule === '方案'">
          <div class="pdfPage">
            <img class="background" src="../../assets/pdfTemplate/template1.png" />
            <Header text="方案&风险" />
            <div class="subTitle">方案</div>
            <div class="content">
              <div
                class="scheme case"
                v-for="a in item.data"
                :key="a.planName"
                :class="{ checkedScheme: a.checked, unCheckedScheme: !a.checked }"
              >
                <div class="color-#404682 mb-[8px]! flex items-center">
                  <div class="font-size-[13px]">{{ a.planName }}</div>
                  <div
                    v-if="a.checked"
                    class="bg-#F99020 border-rd-[4px] font-size-[10px] px-[8px]! py-[3px]! color-#FFFFFF ml-[8px]!"
                  >
                    当前方案
                  </div>
                </div>
                <div class="planBox">
                  <div v-for="feature in a.featureList" :key="feature" class="planItem">
                    {{ feature.name }}
                  </div>
                </div>
                <div v-if="a.stageList.length && a.checked" class="planTable">
                  <div v-for="stage in a.stageList" :key="stage.stageName">
                    <div class="grid grid-cols-[0.4fr_1fr_1fr] gap-[50px] mt-[16px]!">
                      <div>{{ stage.stageName }}</div>
                      <div class="flex">
                        {{ stage.goalList.join() }}
                      </div>
                      <div class="flex">
                        <div>{{ stage.toolList }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="subTitle mt-[16px]!"
              v-if="data.find((item) => item.owningModule == '风险')"
            >
              风险
            </div>
            <div class="content">
              <list
                :list="data.find((item) => item.owningModule == '风险').list"
                v-if="data.find((item) => item.owningModule == '风险')"
              />
            </div>
            <div
              class="subTitle mt-[10px]!"
              v-if="data.find((item) => item.owningModule == '备注')"
            >
              备注
            </div>
            <div class="content">
              <list
                :list="data.find((item) => item.owningModule == '备注').list"
                v-if="data.find((item) => item.owningModule == '备注')"
              />
            </div>
          </div>
        </template>
      </template>
      <div class="last-page">
        <img class="background" src="@/assets/pdfTemplate/endCover.png" />
      </div>
    </div>
  </template>
  <iframe :src="src" v-if="src" width="100%" height="100%"></iframe>
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
  const formData = new FormData()
  formData.append('aptmId', appId)
  const result = await Post(
    `prod-api/business/public/api/v1/patient/getLjPatientInfoByAptmId?aptmId=${appId}`,
    formData,
    true
  )
  patientInfo.value = result[0]
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
  '里程碑',
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

const faceImageList1 = [
  '正面像',
  '正面微笑像',
  '90度侧面像',
  '90度侧面微笑像',
  '45度侧面像',
  '45度侧面微笑像'
]
const mouthImageList1 = ['正面咬合', '前牙覆盖']
const mouthImageList2 = ['口内照（左侧）', '口内照（右侧）']
const mouthImageList3 = ['磨牙关系（左侧）', '磨牙关系（右侧）']
const mouthImageList4 = ['上颌', '下颌']
async function getDataList() {
  const result = await Get(
    `/prod-api/emr/orthPlan/getOrthPlanIssuesList?aptmId=${appId}&location=2`
  )
  extractedData.value = result.data
    .filter((item) => titlesToExtract.includes(item.titleName) && item.owningModule == '侧位片')
    .map((item) => ({
      title_name: item.titleName,
      option_names: item.optionsNames,
      serious: item.serious
    }))
  if (result.data?.length > 0) {
    const acc = result.data.reduce((acc, cur) => {
      if (
        cur.owningModule !== '面型评估' &&
        cur.owningModule !== '口内照' &&
        acc[cur.owningModule]
      ) {
        if (cur.owningModule == '风险') {
          acc[cur.owningModule].list.push({
            title_name: cur.titleName,
            option_names: cur.optionsNames,
            serious: cur.serious
          })
        } else {
          if (cur.titleName == '主诉' || cur.titleName == '现病史') {
            acc[cur.owningModule].list.push({
              title_name: cur.titleName,
              option_names: cur.cephalometricsContent,
              serious: cur.serious
            })
          } else {
            if (cur.titleName || cur.optionsNames) {
              acc[cur.owningModule].list.push({
                title_name: cur.titleName,
                option_names: cur.optionsNames,
                serious: cur.serious
              })
            }
          }
        }
      } else if (
        (cur.owningModule === '面型评估' || cur.owningModule === '口内照') &&
        acc[cur.owningModule + cur.className]
      ) {
        if (cur.titleName || cur.optionsNames) {
          acc[cur.owningModule + cur.className].list.push({
            title_name: cur.titleName,
            option_names: cur.optionsNames,
            serious: cur.serious
          })
        }
      } else if (
        cur.owningModule !== '面型评估' &&
        cur.owningModule !== '口内照' &&
        !acc[cur.owningModule]
      ) {
        acc[cur.owningModule] = cur
        acc[cur.owningModule].list = []
        if (cur.owningModule == '风险') {
          acc[cur.owningModule].list.push({
            title_name: cur.titleName,
            option_names: cur.optionsNames,
            serious: cur.serious
          })
        } else if (cur.owningModule == '备注') {
          if (cur.cephalometricsContent) {
            acc[cur.owningModule].list.push({
              title_name: '备注',
              option_names: cur.cephalometricsContent
            })
          } else {
            acc[cur.owningModule].list.push({
              title_name: '备注',
              option_names: '无'
            })
          }
        } else {
          if (cur.titleName == '主诉' || cur.titleName == '现病史') {
            acc[cur.owningModule].list.push({
              title_name: cur.titleName,
              option_names: cur.cephalometricsContent,
              serious: cur.serious
            })
          } else {
            if (cur.titleName || cur.optionsNames) {
              acc[cur.owningModule].list.push({
                title_name: cur.titleName,
                option_names: cur.optionsNames,
                serious: cur.serious
              })
            }
          }
        }
      } else if (
        (cur.owningModule === '面型评估' || cur.owningModule === '口内照') &&
        !acc[cur.owningModule + cur.className]
      ) {
        acc[cur.owningModule + cur.className] = cur
        acc[cur.owningModule + cur.className].list = []
        if (cur.titleName || cur.optionsNames) {
          acc[cur.owningModule + cur.className].list.push({
            title_name: cur.titleName,
            option_names: cur.optionsNames,
            serious: cur.serious
          })
        }
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
            const index = faceImageList1.indexOf(cur.className)
            acc[cur.owningModule].imageList1[index] = {
              className: cur.className,
              imageUrl: cur.imageUrl
            }
            acc[cur.owningModule].list1 = acc[cur.owningModule].list1.concat(cur.list)
          }
        } else {
          acc[cur.owningModule] = cur
          acc[cur.owningModule].list1 = []
          acc[cur.owningModule].imageList1 = []
          acc[cur.owningModule].imageList2 = []
          acc[cur.owningModule].list2 = []
          if (faceImageList1.includes(cur.className)) {
            const index = faceImageList1.indexOf(cur.className)
            acc[cur.owningModule].imageList1[index] = {
              className: cur.className,
              imageUrl: cur.imageUrl
            }
            acc[cur.owningModule].list1 = cur.list
          } else {
            acc[cur.owningModule].imageList2.push({
              className: cur.className,
              imageUrl: cur.imageUrl
            })
            acc[cur.owningModule].list2 = cur.list
          }
        }
      } else if (cur.owningModule == '口内照') {
        if (acc[cur.owningModule]) {
          if (mouthImageList1.includes(cur.className)) {
            acc[cur.owningModule].imageList1.push({
              className: cur.className,
              imageUrl: cur.imageUrl
            })
            acc[cur.owningModule].list1 = acc[cur.owningModule].list1.concat(cur.list)
          } else if (mouthImageList2.includes(cur.className)) {
            acc[cur.owningModule].imageList2.push({
              className: cur.className,
              imageUrl: cur.imageUrl
            })
            if (acc[cur.owningModule].imageList2.length == 1) {
              acc[cur.owningModule].list2.list1 = acc[cur.owningModule].list2.list1.concat(cur.list)
            } else {
              acc[cur.owningModule].list2.list2 = acc[cur.owningModule].list2.list2.concat(cur.list)
            }
          } else if (mouthImageList3.includes(cur.className)) {
            acc[cur.owningModule].imageList3.push({
              className: cur.className,
              imageUrl: cur.imageUrl
            })
            if (acc[cur.owningModule].imageList3.length == 1) {
              acc[cur.owningModule].list3.list1 = acc[cur.owningModule].list3.list1.concat(cur.list)
            } else {
              acc[cur.owningModule].list3.list2 = acc[cur.owningModule].list3.list2.concat(cur.list)
            }
          } else {
            acc[cur.owningModule].imageList4.push({
              className: cur.className,
              imageUrl: cur.imageUrl
            })
            if (acc[cur.owningModule].imageList4.length == 1) {
              acc[cur.owningModule].list4.list1 = acc[cur.owningModule].list4.list1.concat(cur.list)
            } else {
              acc[cur.owningModule].list4.list2 = acc[cur.owningModule].list4.list2.concat(cur.list)
            }
          }
        } else {
          acc[cur.owningModule] = cur
          acc[cur.owningModule].list1 = []
          acc[cur.owningModule].imageList1 = []
          acc[cur.owningModule].imageList2 = []
          acc[cur.owningModule].imageList3 = []
          acc[cur.owningModule].imageList4 = []
          acc[cur.owningModule].list2 = {}
          acc[cur.owningModule].list2.list1 = []
          acc[cur.owningModule].list2.list2 = []
          acc[cur.owningModule].list3 = {}
          acc[cur.owningModule].list3.list1 = []
          acc[cur.owningModule].list3.list2 = []
          acc[cur.owningModule].list4 = {}
          acc[cur.owningModule].list4.list1 = []
          acc[cur.owningModule].list4.list2 = []
          if (mouthImageList1.includes(cur.className)) {
            acc[cur.owningModule].imageList1.push({
              className: cur.className,
              imageUrl: cur.imageUrl
            })
            acc[cur.owningModule].list1 = cur.list
          }
          if (mouthImageList2.includes(cur.className)) {
            acc[cur.owningModule].imageList2.push({
              className: cur.className,
              imageUrl: cur.imageUrl
            })
            acc[cur.owningModule].list2.list1 = cur.list
          }
          if (mouthImageList3.includes(cur.className)) {
            acc[cur.owningModule].imageList3.push({
              className: cur.className,
              imageUrl: cur.imageUrl
            })
            acc[cur.owningModule].list3.list1 = cur.list
          }
          if (mouthImageList4.includes(cur.className)) {
            acc[cur.owningModule].imageList4.push({
              className: cur.className,
              imageUrl: cur.imageUrl
            })
            acc[cur.owningModule].list4.list1 = cur.list
          }
        }
      } else {
        acc[cur.owningModule] = cur
      }
      return acc
    }, {})
    data.value = Object.values(reduced)

    const objective = data.value.find((item) => item.owningModule == '里程碑')
    const method = data.value.find((item) => item.owningModule == '方法')
    if (objective && method) {
      objective.method = method
      data.value.splice(
        data.value.findIndex((item) => item.owningModule == '方法'),
        1
      )
    }
  }
  data.value.push({ owningModule: '问题列表', data: issuesList })
  data.value.push({ owningModule: '方案', data: schemeData })
  if (!data.value.find((item) => item.owningModule == '备注')) {
    data.value.push({ owningModule: '备注', list: [{ title_name: '备注', option_names: '无' }] })
  }

  const found = data.value.find((item) => item.owningModule == '问诊')
  if (found) {
    found.list = found?.list.filter((item) => item.title_name !== '家长矫正意愿')
  } else {
    data.value.unshift({ owningModule: '问诊' })
  }
}
const cephaData = ref([])
// 侧位片逻辑
const getCephaData = async () => {
  const res = await Get(`/prod-api/emr/orthPlan/selectOrthPlanLatResult?aptmId=${appId}`)
  cephaData.value = res.data
}
const titlesToExtract = ['腺样体', '扁桃体', '颈椎分期']
const extractedData = ref()
const getClassName = (row) => {
  // console.log(r)
  // return row.measurementBias === 'ABOVE' ? 'red' : ''
}
const tableData = ref([
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  }
])
const schemeData = ref([])
const getSchemeList = async () => {
  const res = await Get(`/prod-api/emr/public/api/v1/scheme/list?aptmId=${appId}`)
  schemeData.value = transformData(res.data)

  schemeData.value.forEach((scheme) => {
    scheme.featureList = featureList.value.filter((feature) => {
      return scheme.featureList.includes(feature.id)
    })
    scheme.featureList.unshift({
      name: alignerList.value.filter((item) => item.id == scheme.primaryApplianceId)[0]?.name
    })
    scheme.featureList.unshift({ name: scheme.difficultyLevel })
    scheme.featureList.unshift({ name: scheme.stageList[scheme.stageList.length - 1].stageName })
  })
}
function transformData(data) {
  return data.map((item) => {
    const stageList = item.stageList.reduce((acc, stage) => {
      // 如果 targetIds 或 toolIds 为空，则不添加该阶段
      if (stage.targetIds || stage.toolIds) {
        // 检查targetNames是否包含拔牙
        let goalList = []

        if (stage.targetNames) {
          goalList = stage.targetNames.split(',').map((targetName) => {
            if (targetName === '拔牙' || targetName === '个别牙反合纠正') {
              const toothCode =
                stage.toothCodeInfo[targetName === '拔牙' ? '138' : '139']?.fdiToothCode
              if (toothCode) {
                return `${targetName}(${toothCode})`
              }
            }
            return targetName
          })
        }

        acc.push({
          stageName: stage.stageName,
          goalList: goalList,
          toolList: stage.toolNames
        })
      }
      return acc
    }, [])

    // 在 stageList 的第一项前加入指定的数据
    stageList.unshift({
      stageName: '阶段',
      goalList: ['里程碑'],
      toolList: '工具'
    })

    return {
      planName: item.name,
      checked: item.checked,
      difficultyLevel: item.difficultyLevel,
      primaryApplianceId: item.primaryApplianceId,
      featureList: item.featureTagIds ? item.featureTagIds.split(',').map((tag) => tag) : [],
      stageList: stageList
    }
  })
}
const featureList = ref([])
const featureMeritList = ref([])
const getFeatureMerit = async () => {
  const result = await Post('/prod-api/business/globalDict/getDictListByType', {
    dictType: 'ORTHFEATURETAGMERIT'
  })
  featureList.value = [
    ...featureList.value,
    ...result.data.map((item) => ({
      name: item.dictCodeName,
      id: item.id,
      dictType: item.dictType
    }))
  ]
}
getFeatureMerit()
const featureEffectList = ref([])
const getFeatureEffect = async () => {
  const result = await Post('/prod-api/business/globalDict/getDictListByType', {
    dictType: 'ORTHFEATURETAGDEFECT'
  })
  featureList.value = [
    ...featureList.value,
    ...result.data.map((item) => ({
      name: item.dictCodeName,
      id: item.id,
      dictType: item.dictType
    }))
  ]
}
getFeatureEffect()

const imgCover = ref()
// 获取完数据在其中添加图片
async function getClassifiedImgList() {
  const res = await Get(`/prod-api/business/orthImage/list?apmtId=${appId}`)
  if (res.code == 200) {
    const front = res.data.find((item) => item.imageType == '正面像')
    imgCover.value = front?.imageUrl
  }
}

const issuesList = ref([])
// 获取问题列表
async function getIssuesList() {
  const result = await Get(
    `/prod-api/emr/orthPlan/getOrthPlanIssuesList?aptmId=${appId}&location=2&serious=1`
  )
  if (result.data?.length > 0) {
    issuesList.value = result.data
      .filter((item) => item.titleName || item.optionsNames)
      .map((item) => ({
        title_name: item.titleName,
        option_names: item.optionsNames,
        serious: item.serious,
        active: item.active
      }))
  }
}

// let generatedPdfData = null
const src = ref()
// const pdf = sessionStorage.getItem(`pdfUrl${props.id}`)
// src.value = pdf ? pdf : ''

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
const alignerList = ref([])
const getAlignerList = async () => {
  const result = await Post('/prod-api/business/globalDict/getDictListByType', {
    dictType: 'ORTHPRIMARYAPPLIANCE'
  })
  alignerList.value = result.data.map((item) => ({
    name: item.dictCodeName,
    id: +item.id,
    dictType: item.dictType
  }))
}
async function main() {
  // 依次执行这三个请求
  await getAlignerList()
  await getSchemeList()
  await getDataList()
  await getCephaData()
  await getClassifiedImgList()
  await getIssuesList()
  await getPatientInfo()

  // 所有请求完成后执行生成PDF
  // 刚开始不可见，要生成之前可见就可以，
  const pdfContent = document.querySelector('.pdfContent')
  if (pdfContent) {
    pdfContent.style.display = 'block'
  }
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
  // main()
})
</script>

<style lang="scss" scoped>
.cephaList {
  background: #f4f7fd;
  .list-item {
    background: #f4f7fd;
  }
  .list-item {
  }
}
.el-table--border .el-table__cell {
  border-right: none !important;
  border-bottom: none !important;
}
:deep(.el-table__body, .el-table__footer, .el-table__header) {
  border-spacing: 2px !important;
}
table {
  border-collapse: separate !important;
  border-spacing: 5px !important;
}
:deep(.el-table .el-table__cell) {
  padding: 4px 0;
}
:deep(.el-table) {
  margin-top: 20px;
  thead {
    color: #404682;
    font-size: 14px;
    font-weight: 500;
    .el-table__cell {
      background: #dee9ff;
    }
  }
  .el-table__body {
    color: #404682;
    font-size: 12px;
  }
}
:deep(.el-table__body .el-table__cell) {
  padding: 0 !important;
}
.cephaImg {
  width: 50% !important;
}
.planBox {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;

  .planItem {
    font-size: 10px;
    color: #404682;
    background: rgba(64, 70, 130, 0.1);
    border-radius: 4px;
    padding: 3px 8px;
    margin-bottom: 4px;
  }
}
.planTable {
  border: 1px solid #e5e6eb;
  color: #404682;
  font-size: 12px;
  background-color: #fff;
  border-radius: 8px;
  padding: 0 12px 10px 12px;
  margin-top: 4px;
}
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
.cepha {
  border-radius: 12px;
  display: flex;
  justify-content: center;
}
.pano {
  border-radius: 12px;
  display: flex;
  justify-content: center;
}
.hasBackGround {
  background-color: #060606;
}
.imageCaption {
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.16em;
  color: #ffffff;
  position: absolute;
  padding: 4px 12px;
  background: rgba(0, 0, 0, 0.5);
  left: 0px;
  top: 0px;
  border-radius: 12px 0px 12px 0px;
}
.imageBox {
  border-radius: 12px;
  position: relative;

  img {
    width: 100%;
  }
}

.scheme {
  padding: 12px;
}
.checkedScheme {
  border: 2px solid #2e6ce4;
  background: #f4f7fd;
}
.unCheckedScheme {
  border: 1px dashed #404682;
}
.case {
  border-radius: 10px;

  &:not(:first-child) {
    margin-top: 12px;
  }
}
.contentImg {
  position: absolute;
  z-index: 10;

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
    .imgBox {
      width: 100%;
      // height: 500px;
      display: flex;
      justify-content: center;
      align-items: center;
      &.cepha {
        height: 400px;
      }
    }
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
        display: grid;
        grid-template-columns: auto auto;
        gap: 10px;

        .imageSize {
          width: 150px;
          height: 225px;
        }
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

      .content1 {
        width: 340px;
        background: #eaf0fc;
        display: flex;
        align-items: center;
        margin-left: 10px;
        border-radius: 12px;

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
        img {
          border-radius: 12px;
        }
      }
      .middle {
        padding: 10px;
        // margin-top: 16px;
        background: #eaf0fc;
        border-radius: 16px;
        .imageList1 {
          display: flex;
          gap: 10px;

          .image1 {
            width: 50%;
            // grid-column: 1 / span 2;
            // grid-row: 1 / span 2;
            // height: 250px;
            // overflow: hidden;
            // width: 263px;
            height: 250px;
          }
          .image2 {
            width: 50%;
            height: 250px;
          }
          // .image2 {
          //   grid-column: 3;
          //   grid-row: 1;
          //   height: 250px;
          //   img {
          //     width: 100%;
          //   }
          // }
          // .image3 {
          //   grid-column: 3;
          //   grid-row: 2;
          //   max-height: 200px;
          // }
        }
        .content1 {
          flex: 1;
          // margin-left: 10px;
          border-radius: 12px;
          display: flex;
          align-items: center;
        }
      }
      .bottom {
        margin-top: 18px;
        padding: 10px;
        background: #eaf0fc;
        border-radius: 16px;
        justify-content: space-between;
        height: 460px;

        .content2.content {
          display: flex;
          gap: 22px;
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
          display: flex;
          gap: 10px;
          .image1 {
            width: 316px;
            grid-column: 1 / span 2;
            img {
              width: 100%;
            }
          }
          .image2,
          .image3,
          .image4,
          .image5 {
            width: 150px;
            height: 100px;
            img {
              width: 100%;
              height: 100%;
            }
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
      font-size: 66px;
      line-height: normal;
      letter-spacing: 0px;
      color: #3b4485;
      .English {
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 12px;
        letter-spacing: 0.16em;
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
          display: flex;
          justify-content: center;
          box-sizing: border-box;
          color: #ffffff;
          background: #3b4485;
          width: 62px;
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
      border-radius: 262px;
      color: #ffffff;
      &.issuesList {
        background: #f76560;
      }
    }
    .personalInfo {
      // width: 182px;
      height: 116px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin: 8px 0 0 20px;
      font-size: 13px;

      .item {
        display: flex;
        .label {
          width: 60px;
          margin-right: 16px;
          text-align: right;
        }
      }
    }
    .content {
      color: #4e5969;
      padding-top: 16px;
      // padding-bottom: 4px;
      padding-left: 12px;
      &.blueBackground {
        background: #f4f7fd;
        margin-top: 12px;
        border-radius: 12px;
      }
      .list {
        margin-bottom: 16px;
        &__item {
          &:not(:last-child) {
            margin-bottom: 16px;
          }
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
          padding: 16px 0 0 16px;

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

  // .content {
  //   z-index: 10;
  // }
  .imgList {
    .imgItem {
      display: flex;
      height: 380px;
      .avatorContainer {
        position: relative;

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
:deep(.list1.cephaList) {
  .list__item {
    width: 33% !important;
    /* margin-bottom: 16px; */
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    &::before {
      top: 0 !important;
    }
  }
}
</style>
