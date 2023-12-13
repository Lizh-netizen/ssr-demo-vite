<template>
  <div class="container">
    <div class="taskCard">
      <task-card :default="currentTab" @changeTab="changeTab">
        <task-card-item
          v-for="item in tabData"
          :svg_name="item.svg_name"
          :name="item.name"
          :left_num="item.left_num"
          :right_num="item.right_num"
          :left_text="item.left_text"
          :right_text="item.right_text"
        ></task-card-item>
      </task-card>
    </div>
    <div class="content-wrapper">
      <div class="content">
        <filter-search
          @filter="filter"
          :storageName="storageName"
          :list="[
            {
              name: '医生',
              type: 'select',
              prop: 'doctorId',
              options: options,
              allowSearch: true
            },
            {
              name: '诊所',
              type: 'select',
              prop: 'officeId',
              options: options1,
              allowSearch: true
            },
            {
              name: '风险等级',
              type: currentTab == '面评矫正预约率' ? 'select' : undefined,
              prop: 'difficultyLevel',
              options: difficultyLevelList
            },
            {
              name: '就诊日期',
              dateType: currentTab == '面评矫正预约率' ? 'range' : undefined,
              type: 'date',
              prop: 'date'
            }
          ]"
        ></filter-search>

        <CustomTable
          :data="patientList"
          :columns="columns"
          :pagination="true"
          :total="total"
          :pagesStorage="pagesStorage"
          @change-page="changePage"
          @change-note="changeNote"
        >
          <template #voice_text="{ row }">
            <div :style="{ display: 'flex', alignItems: 'center' }">
              <div :style="{ marginRight: '2px' }">
                {{ row.voice_text }}
              </div>
              <div
                :style="{ display: 'flex' }"
                id="playPauseButton"
                @click="togglePlayPause(row)"
                v-if="row.voice_file_url"
              >
                <img src="@/assets/svg/play.svg" v-if="!isPlaying" /><img
                  v-else
                  src="@/assets/svg/pause.svg"
                />
              </div>
            </div>
          </template>
          <template #difficultyLevel="{ row }">
            {{
              row.difficultyLevel == 1 ? '低风险' : row.difficultyLevel == 2 ? '中风险' : '高风险'
            }}
          </template>
          <template #orthDoctorName="{ row }">
            <div>
              <span
                :style="{ padding: '4px 8px', display: 'inline-block' }"
                :class="{ notHasAptm: row.orthDoctorName === '未预约' }"
              >
                {{ row.orthDoctorName }}</span
              >
            </div>
          </template>
          <template #responsibleDoctor="{ row }">
            <a-select placeholder="请选择" allow-search @change="handleSaveOrthDoctor(row)">
              <a-option
                v-for="item in orthDoctorList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
                {{ item.label }}</a-option
              >
            </a-select>
            <!-- <el-select @change="handleSaveOrthDoctor(row)" v-model="row.transformDoctorName">
              <el-option
                v-for="item in orthDoctorList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :style="{ display: 'flex', alignItems: 'center' }"
              > -->
            <!-- <img
                  src="@/assets/svg/changeDoctor.svg"
                  :style="{
                    marginRight: '10px'
                  }"
                  v-if="item.value !== row.doctorId"
                /> -->

            <!-- </el-option>
            </el-select> -->
          </template>
          <template #note="{ row }">
            <div>
              {{ row.note }}
            </div>
          </template>
          <template #operation="{ row }">
            <el-button @click="handleEvaluateOrth(row)" v-if="currentTab == '面评'"
              >录入面型发育评估</el-button
            >
            <el-button @click="handleViewOrth(row)" v-if="currentTab == '矫正方案'"
              >查看正畸表</el-button
            >
            <el-button @click="handleCompareOrth(row)" v-if="currentTab == '矫正方案'"
              >对比面评报告</el-button
            >
            <el-button @click="handleCompareOrth(row)" v-if="currentTab == '面评'"
              >对比矫正方案报告</el-button
            >
            <el-button @click="handleEvaluateOrth(row)" v-if="currentTab == '面评矫正预约率'"
              >去预约</el-button
            >
          </template>
        </CustomTable>
        <audio
          id="audioPlayer"
          controls
          :style="{
            opacity: 0
          }"
          @canplay="handleCanPlay"
        >
          <source id="audioSource" type="audio/mp3" :src="voiceUrl" />
        </audio>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, watchEffect, watch, nextTick, onMounted } from 'vue'
import { Post, Get } from '../utils/request'
import { useRouter, useRoute } from 'vue-router'
import formatTime from '../utils/formatTime'
import { columns_config_evaluate, columns_config_ortho, columns_config_aptm } from './config'
import CustomTable from '../packages-js/custom-table/custom-table.vue'
import filterSearch from '../packages-js/filter-search/filter-search.vue'
import taskCardItem from '../packages-js/task-card-item/task-card-item.vue'
import taskCard from '../packages-js/task-card/task-card.vue'
import datePicker from '../packages-js/date-picker/date-picker.vue'
import { ElTableColumn, ElMessage } from 'element-plus'
import customList from '@/components/pdf/customList.vue'
const route = useRoute()
const params = route.query
console.log(route.query, route)
if (params.token) {
  sessionStorage.odos_token = params.token
}
const currentTab = ref(sessionStorage.currentTab || '面评')
sessionStorage.setItem('currentTab', currentTab.value)

// 切换卡片
// 首次渲染的时候也执行了
const changeTab = (val) => {
  currentTab.value = val
  sessionStorage.setItem('currentTab', val)
  // 添加缓存
  storageName.value = strategy[val].storage
  pagesStorage.value = strategy[val].page

  const args = getCache(currentTab)
  strategy[val].request(args)
}
const strategy = {
  面评: {
    config: columns_config_evaluate,
    storage: 'evaluate',
    page: 'evaluatePage',
    request: getEvaluateList
  },
  矫正方案: {
    config: columns_config_ortho,
    storage: 'ortho',
    page: 'orthoPage',
    request: getOrthoList
  },
  面评矫正预约率: {
    config: columns_config_aptm,
    storage: 'aptm',
    page: 'aptmPage',
    request: getAptmList
  }
}

const total = ref(0)
const date = ref('')
// 默认是今天的日期
date.value = formatTime()
const doctor = ref()
const officeId = ref()
const columns = ref([...columns_config_evaluate])
const filterVal = ref({})
const evaluateList = ref([])
const page = ref(sessionStorage.getItem('page') || 1)
const pageSize = ref(sessionStorage.getItem('pageSize') || 10)
// console.log(typeof sessionStorage.getItem('officeId'))
// const officeId = ref(sessionStorage.getItem('officeId') || '')
const doctorId = ref()
async function getEvaluateList(val) {
  if (date.value) {
    const res = await Post('/prod-api/business/orthClass/appointmentList', {
      startTime: val?.date || date.value, //预约日期
      pageSize: val?.pageSize || pageSize.value,
      pageNum: val?.page || page.value,
      officeId: val?.officeId || officeId.value,
      doctorId: val?.doctorId || doctorId.value,
      location: '2'
    })
    if (res.code == 200) {
      total.value = res.total
      evaluateList.value = res.rows
        .filter((item) => item.age.slice(-3, -2) >= 7)
        .map((item) => ({
          ...item,
          StartTime: item.StartTime.replace('T', ' ').slice(0, 16),
          patientName: item.patientName,
          age: item.age,
          facialAdvise: item.facialAdvise ? item.facialAdvise : '未评估'
        }))
      patientList.value = evaluateList.value
      total.value = evaluateList.value.length
    }
  }
}
function getCache(currentTab) {
  const pages = sessionStorage.getItem(strategy[currentTab.value].page)
  const storage = sessionStorage.getItem(strategy[currentTab.value].storage)
  const val = { ...JSON.parse(pages), ...JSON.parse(storage) }
  return val
}
const orthoList = ref([])
const patientList = ref([])
async function getOrthoList(val) {
  if (date.value) {
    const res = await Post('/prod-api/business/orthClass/appointmentList', {
      startTime: val?.date || date.value, //预约日期
      pageSize: val?.pageSize || pageSize.value,
      pageNum: val?.page || page.value,
      officeId: val?.officeId || officeId.value,
      doctorId: val?.doctorId || doctorId.value,
      location: '1'
    })
    if (res.code == 200) {
      total.value = res.total
      orthoList.value = res.rows.map((item) => ({
        ...item,
        StartTime: item.StartTime.replace('T', ' ').slice(0, 16),
        patientName: item.patientName,
        age: item.age,
        facialAdvise: item.facialAdvise ? item.facialAdvise : '未评估'
      }))
      patientList.value = orthoList.value
      total.value = res.total
    }
  }
}
const aptmList = ref([])
async function getAptmList(val) {
  const res = await Post('/prod-api/emr/public/api/v1/assessment/list', {
    startDate: val?.date[0] || date.value, //预约日期
    endDate: val?.date[1] || date.value,
    pageSize: val?.pageSize || pageSize.value,
    pageNum: val?.page || page.value,
    officeId: val?.officeId || officeId.value,
    doctorId: val?.doctorId || doctorId.value,
    difficultyLevel: val?.difficultyLevel
  })
  if (res.code == 200) {
    total.value = res.total
    orthoList.value = res.rows.map((item) => ({
      ...item,
      StartTime: item.StartTime.replace('T', ' ').slice(5, 16),
      patientName: item.patientName,
      age: item.age,
      orthStartTime: item.orthStartTime.replace('T', ' ').slice(5, 16),
      orthDoctorName: item.orthDoctorName ? item.orthDoctorName : '未预约',
      noteList: [{ time: '', name: '', content: 'content' }],
      isPlaying: false
    }))
    orthoList.value.forEach((item) => {
      getNote(item.aptmId)
    })
    patientList.value = orthoList.value
    total.value = res.total
  }
}
async function getNote(aptmId) {
  const res = await Get(`/prod-api/emr/public/api/v1/assessmentNote/list?aptmId=${aptmId}`)
}
const allOptions = ref([])
const loading = ref(false)
const getDoctorList = () => {
  loading.value = true
  Get('/prod-api/business/public/api/v1/provider/list?Job=医生').then((res) => {
    allOptions.value = res.map((item) => ({
      label: item.doctorName,
      value: item.doctorId
    }))
    options.value = allOptions.value
  })
}
getDoctorList()

const options = ref([])
const remoteMethod = (query) => {
  if (query) {
    loading.value = true
    options.value = allOptions.value.filter((option) => option.label.includes(query))
  }
}
const difficultyLevelList = [
  { label: '低风险', value: 1 },
  { label: '中风险', value: 2 },
  { label: '高风险', value: 3 }
]
const allOptions1 = ref([])
const tanent = ref()
const options1 = ref([])
const getTanentList = () => {
  Get('/prod-api/business/office/list').then((res) => {
    allOptions1.value = res.rows.map((item) => ({
      label: item.abbreviation,
      value: item.ljOfficeId
    }))
    options1.value = allOptions1.value.filter((option) => option.value)
  })
}
getTanentList()
const remoteMethod1 = (query) => {
  if (query) {
    loading.value = true
    options1.value = allOptions1.value.filter(
      (option) => option.label.includes(query) && option.value
    )
  }
}

const router = useRouter()
const handleViewOrth = (item) => {
  router.push(`/ortho/${item.apmtId}/${item.patientId}`)
}
const handleCompareOrth = (item) => {
  router.push(`/compareOrtho/${item.apmtId}/${item.patientId}`)
}
const handleEvaluateOrth = (item) => {
  router.push(`/evaluateOrtho/${item.apmtId}/${item.patientId}`)
}

const storageName = ref('evaluate')

const filter = (val) => {
  const v = getCache(currentTab)
  strategy[currentTab.value].request(v)
}
const pagesStorage = ref('evaluatePage')
const changePage = (page) => {
  const pages = sessionStorage.getItem(strategy[currentTab.value].page)
  const storage = sessionStorage.getItem(strategy[currentTab.value].storage)
  const val = { ...JSON.parse(pages), ...JSON.parse(storage) }
  strategy[currentTab.value].request(val)
}
watch(
  currentTab,
  (val) => {
    if (val == '面评') {
      patientList.value = evaluateList.value
    } else if (val == '矫正方案') {
      patientList.value = orthoList.value
    } else {
      patientList.value = aptmList.value.map((i) => ({
        ...i
      }))
    }
    columns.value = strategy[val].config
  },
  { immediate: true }
)
onMounted(() => {
  pagesStorage.value = strategy[currentTab.value].page
})

// 看板数据
const facialCount = ref({})
async function getFacialCount() {
  const res = await Post('/prod-api/business/orthBase/orthBoardCount', {
    startTime: date.value || filterVal.value.date,
    doctorId: filterVal.value.doctorId || '',
    officeId: filterVal.value.officeId || '',
    location: '1'
  })
  facialCount.value = res.data
}
const orthCount = ref({})
async function getOrthCount() {
  const res = await Post('/prod-api/business/orthBase/orthBoardCount', {
    startTime: date.value || filterVal.value.date,
    doctorId: filterVal.value.doctorId || '',
    officeId: filterVal.value.officeId || '',
    location: '2'
  })
  orthCount.value = res.data
}
getFacialCount()
getOrthCount()
const tabData = [
  {
    svg_name: 'cardSvg1',
    name: '面评矫正预约率',
    left_num: orthCount.value.numerator ? orthCount.value.numerator : 0,
    right_num: orthCount.value.totalCount ? orthCount.value.totalCount : 0,
    left_text: '已录入矫正方案人数',
    right_text: '需要矫正人数'
  },
  {
    svg_name: 'cardSvg1',
    name: '面评',
    left_num: facialCount.value.numerator ? facialCount.value.numerator : 0,
    right_num: facialCount.value.totalCount ? facialCount.value.totalCount : 0,
    left_text: '已面评人数',
    right_text: '7岁以上未做正畸或面评'
  },
  {
    svg_name: 'cardSvg1',
    name: '矫正方案',
    left_num: orthCount.value.numerator ? orthCount.value.numerator : 0,
    right_num: orthCount.value.totalCount ? orthCount.value.totalCount : 0,
    left_text: '已录入矫正方案人数',
    right_text: '需要矫正人数'
  }
]
async function changeNote(val) {
  val.row.note = val.note
  val.row.noteList.push({
    time: new Date().toLocaleString(),
    name: 'admin',
    content: val.note
  })
  const res = await Post('/prod-api/emr/public/api/v1/assessmentNote', {
    aptmId: val.row.aptmId,
    note: val.note
  })
  if (res.code == 200) {
    ElMessage.success('新增成功')
  }
}
const isPlaying = ref(false)
const audioPlayer = ref(null)
var audioSource = ref(null)
const voiceUrl = ref()
onMounted(() => {
  audioSource.value = document.getElementById('audioSource')
  audioPlayer.value = document.getElementById('audioPlayer')
  // 当音频播放结束时，将播放状态重置为false
  audioPlayer.value?.addEventListener('ended', function () {
    isPlaying.value = false
    voiceUrl.value = ''
  })
})

async function togglePlayPause(row) {
  if (!voiceUrl.value) {
    voiceUrl.value = row.voice_file_url
    audioPlayer.value.load()
  }
  if (!audioPlayer.value.paused && isPlaying.value) {
    audioPlayer.value.pause()
  } else if (audioPlayer.value.paused && !isPlaying.value) {
    audioPlayer.value.play()
  }

  isPlaying.value = !isPlaying.value
}
const handleCanPlay = () => {
  audioPlayer.value.play().then(() => {
    console.log('done')
  })
}
const selectDoctor = ref()
const orthDoctorList = ref([])
async function getOrthDoctorList() {
  const res = await Get('/prod-api/emr/public/api/v1/assessment/orthDoctorList')
  if (res.code == 200) {
    orthDoctorList.value = res.data.map((item) => {
      return {
        label: item.doctorName,
        value: item.doctorId
      }
    })
  }
}
getOrthDoctorList()
async function handleSaveOrthDoctor(item) {
  const found = orthDoctorList.value.find((item) => item.value == selectDoctor.value)

  const data = {
    orthDoctorName: found.label,
    orthDoctorId: selectDoctor.value,
    patientId: item.PatientId,
    aptmId: item.aptmId,
    id: item.id
  }
  const res = await Post('/prod-api/emr/public/api/v1/assessment', data)
  if (res.code == 200) {
  }
}
</script>
<style lang="scss" scoped>
.container {
  margin: 15px;
  border-radius: 10px;
  background-color: #fff;
}

.content {
  padding: 2px 20px;
  background: #fff;
  border-radius: 12px;
  // :deep .arco-select-view-single.arco-select-view-search {
  //   width: 100px;
  // }
  :deep .arco-select-view-single .arco-select-view-suffix {
    padding-left: 0;
  }
}
.notHasAptm {
  background: rgb(247, 101, 96);
  border-radius: 10px;
}
</style>
