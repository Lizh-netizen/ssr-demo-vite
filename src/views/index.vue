<template>
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
        { name: '就诊日期', type: 'date', prop: 'date', defaultDate: formatTime() }
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
      <template #filterRemark="{ row }">
        <div :style="{ display: 'flex', alignItems: 'center' }">
          <div>
            123这是大段的文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字文
          </div>
          <div id="playPauseButton" @click="togglePlayPause">
            <img src="@/assets/svg/play.svg" v-if="!isPlaying" /><img
              v-else
              src="@/assets/svg/pause.svg"
            />
          </div>
        </div>
      </template>

      <template #responsibleDoctor="{ row }">
        <el-select>
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :style="{ display: 'flex', alignItems: 'center' }"
            ><img
              src="@/assets/svg/changeDoctor.svg"
              :style="{
                marginRight: '10px'
              }"
            />{{ item.label }}
          </el-option>
        </el-select>
      </template>

      <template #operation="{ row }">
        <el-button @click="handleEvaluate(row)" v-if="currentTab == '面评矫正预约率'"
          >录入矫正方案评估</el-button
        >
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
      </template>
    </CustomTable>
  </div>
  <audio
    id="audioPlayer"
    controls
    :style="{
      opacity: 0
    }"
  >
    <source
      id="audioSource"
      type="audio/mp3"
      src="https://orange-odos.oss-cn-hangzhou.aliyuncs.com/2023/11/28/record_20231128120133A111.mp3"
    />
  </audio>
</template>
<script setup>
import { ref, watchEffect, watch, nextTick, onMounted } from 'vue'
import { Post, Get } from '../utils/request'
import { useRouter } from 'vue-router'
import formatTime from '../utils/formatTime'
import { columns_config_evaluate, columns_config_ortho, columns_config_aptm } from './config'
import CustomTable from '../packages-js/custom-table/custom-table.vue'
import filterSearch from '../packages-js/filter-search/filter-search.vue'
import taskCardItem from '../packages-js/task-card-item/task-card-item.vue'
import taskCard from '../packages-js/task-card/task-card.vue'
import datePicker from '../packages-js/date-picker/date-picker.vue'

const currentTab = ref(sessionStorage.currentTab || '面评')
sessionStorage.setItem('currentTab', currentTab.value)

// 切换卡片
const changeTab = (val) => {
  currentTab.value = val
  sessionStorage.setItem('currentTab', val)
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
async function getAptmList() {}
const aptmList = ref([
  {
    patientName: 'Magvian Vivi',
    doctorName: '顾晓倩',
    apmtId: 3419404,
    patientId: 525855,
    Sex: 2,
    StartTime: '2023-11-24T10:00:00',
    filterStatus: 0,
    facialAdvise: '',
    Birth: '2016-02-19T00:00:00',
    Mobile: '15121049773',
    age: '2016-02-19 (7岁)',
    filterRemark: '这是备注',
    responsibleDoctor: '顾晓倩',
    note: '备注',
    noteList: [{ time: '', name: '', content: 'content' }]
  }
])
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
  filterVal.value = JSON.parse(sessionStorage.getItem(storageName.value))
  strategy[currentTab.value].request(filterVal.value)
}
const pagesStorage = ref('evaluatePage')
const changePage = () => {
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
        ...i,
        noteList: [{ time: '', name: '', content: 'content' }]
      }))
    }
    columns.value = strategy[val].config
  },
  { immediate: true }
)
onMounted(() => {
  console.log(currentTab.value, strategy[currentTab.value].page)
  // pagesStorage.value = strategy[currentTab.value].page
  strategy[currentTab.value].request()
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
  },
  {
    svg_name: 'cardSvg1',
    name: '面评矫正预约率',
    left_num: orthCount.value.numerator ? orthCount.value.numerator : 0,
    right_num: orthCount.value.totalCount ? orthCount.value.totalCount : 0,
    left_text: '已录入矫正方案人数',
    right_text: '需要矫正人数'
  }
]
const changeNote = () => {}
const isPlaying = ref(false)
const audioPlayer = ref(null)
onMounted(() => {
  audioPlayer.value = document.getElementById('audioPlayer')
  // 当音频播放结束时，将播放状态重置为false
  audioPlayer.value?.addEventListener('ended', function () {
    isPlaying.value = false
  })
})

const audioSource = document.getElementById('audioSource')
function togglePlayPause() {
  console.log(audioPlayer)
  if (isPlaying.value) {
    audioPlayer.value.pause()
  } else {
    audioPlayer.value.play()
  }
  isPlaying.value = !isPlaying.value
}
</script>
<style lang="scss" scoped>
.content {
  padding: 0 20px;
}
</style>
