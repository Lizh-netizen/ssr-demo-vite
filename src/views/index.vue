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
              prop: 'date',
              defaultDate: currentTab == '面评矫正预约率' ? [firstDate, date] : date
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
              <div :style="{ marginRight: '2px', width: '70px' }">
                {{ row.voice_text }}
              </div>
              <div
                :style="{ display: 'flex' }"
                id="playPauseButton"
                @click="togglePlayPause(row)"
                v-if="row.voice_file_url"
              >
                <img
                  src="@/assets/svg/play.svg"
                  v-if="!row.isPlaying"
                  :style="{ height: '16px' }"
                /><img v-else src="@/assets/svg/pause.svg" :style="{ height: '16px' }" />
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
            <a-select
              placeholder="请选择"
              allow-search
              v-model="selectDoctor"
              @change="handleSaveOrthDoctor(row)"
            >
              <a-option
                v-for="item in orthDoctorList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
                {{ item.label }}</a-option
              >
            </a-select>
          </template>

          <template #notes="{ row }">
            <div
              :style="{
                color: '#2E6CE4',
                cursor: 'pointer'
              }"
              @click="handleNoteDrawer(row)"
            >
              点击查看
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
            <el-button @click="handleGoSche(row)" v-if="currentTab == '面评矫正预约率'"
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
  <div class="drawer">
    <a-drawer v-model:visible="drawerVisible" class="drawer">
      <template #header>
        <div class="title" :style="{ color: '#1d2129' }">备注</div>
      </template>

      <div v-if="!edit" @click="handleAddNote" :style="{ display: 'flex', alignItems: 'center' }">
        <img src="@/assets/svg/addNote.svg" :style="{ marginRight: '4px', cursor: 'pointer' }" />
        新增备注
      </div>

      <div class="form" v-else>
        <div class="form_title">
          <div :style="{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }">
            <div
              class="selectWrapper"
              :style="{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                width: '114px',
                background: '#f2f3f5'
              }"
            >
              <a-select
                v-model="remarkType"
                :style="{ width: '114px' }"
                placeholder="选择类型"
                default-popup-visible="true"
                @focus="dropdown"
              >
                <a-option
                  v-for="item in remarkTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  >{{ item.label }}</a-option
                >
              </a-select>
              <img src="@/assets/svg/arrowup.svg" v-if="dropdown" />
              <img src="@/assets/svg/arrowdown.svg" v-else />
            </div>

            <div class="btns">
              <a-button @click="edit = false">取消</a-button>
              <a-button type="primary" @click="handleSaveNotes">保存 </a-button>
            </div>
          </div>
        </div>
        <div
          class="form_input"
          :style="{
            position: 'relative'
          }"
        >
          <a-select v-model="patientAptm">
            <a-option
              v-for="item in patientAptmList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              >{{ item.label }}</a-option
            >
          </a-select>
          <div class="cover"></div>

          <div class="chooseAptm">选择预约</div>
        </div>
        <div class="form_textarea">
          <a-textarea placeholder="请输入内容或选择下方快捷回复" allow-clear v-model="textarea" />

          <div class="form_textarea_quickReply">
            快捷回复：
            <div
              class="form_textarea_quickReply_item"
              v-for="item in quickReplies"
              :key="item"
              @click="handleAutoFill(item)"
            >
              {{ item }}
            </div>
          </div>
        </div>
      </div>
      <div class="notesWrapper">
        <img src="@/assets/ortho/emptyImage.png" v-if="empty" class="emptyImage" />
        <div v-else="!empty">
          <div class="item" v-for="item in noteList" :key="item">
            <span class="circle"></span>
            <div class="rightBox">
              <div class="title">
                <div class="time">{{ item.time }}</div>
                <div class="name">{{ item.name }}</div>
              </div>
              <div class="content">
                <span class="remarkType">{{ item.remarkTypeName }}</span
                >{{ item.content }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </a-drawer>
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
import Drawer from '../components/list/drawer.vue'
import { ElTableColumn, ElMessage } from 'element-plus'
import customList from '@/components/pdf/customList.vue'
const route = useRoute()
const params = route.query

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
const firstDate = ref()
// 默认是今天的日期
firstDate.value = formatTime().firstDate
date.value = formatTime().formattedToday
const doctor = ref()
const officeId = ref()
const columns = ref([...columns_config_evaluate])
const filterVal = ref({})
const evaluateList = ref([])
const page = ref(sessionStorage.getItem('page') || 1)
const pageSize = ref(sessionStorage.getItem('pageSize') || 10)

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
      evaluateList.value = res.rows.map((item) => ({
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
  let pageSizes = val?.pageSize || pageSize.value
  let pageNum = val?.page || page.value
  const res = await Post(
    `/prod-api/emr/public/api/v1/assessment/list?pageNum=${pageNum}&pageSize=${pageSizes}`,
    {
      startDate: val?.date?.[0] || date.value, //预约日期
      endDate: val?.date?.[1] || date.value,
      officeId: val?.officeId || officeId.value,
      doctorId: val?.doctorId || doctorId.value,
      difficultyLevel: val?.difficultyLevel
    }
  )
  if (res.code == 200) {
    total.value = res.total
    orthoList.value = res.rows.map((item) => ({
      ...item,
      StartTime: item.StartTime.replace('T', ' ').slice(5, 16),
      patientName: item.patientName,
      age: item.age,
      orthStartTime: item.orthStartTime.replace('T', ' ').slice(5, 16),
      orthDoctorName: item.orthDoctorName ? item.orthDoctorName : '未预约',
      // notes: '',
      noteList: [{ time: '', name: '', content: 'content' }],
      isPlaying: false,
      itemType: '--',
      orthItemType: '--'
    }))
    patientList.value = orthoList.value
    total.value = res.total
  }
}
const noteList = ref([])
const empty = ref(false)
const selected = ref()
async function getNote(row) {
  let url = `/prod-api/business/totalRemark/list?`
  if (row.aptmId) {
    url += `aptmId=${row.aptmId}`
  } else if (row.PatientId) {
    url += `PatientId=${row.PatientId}`
  } else if (row.id) {
    url += `customerId=${row.id}`
  }
  const res = await Get(url)
  if (res.code == 200) {
    if (res.rows.length == 0) {
      empty.value = true
    }
    selected.value = row
    noteList.value = res.rows.map((item) => ({
      ...item,
      time: item.createTime.slice(0, 16),
      name: item.createBy,
      content: item.remark
    }))
  }
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
// 备注
const drawer = ref(false)
const drawerVisible = ref(false)
const edit = ref(false)
const type = ref()
const handleNoteDrawer = (row) => {
  drawerVisible.value = true
  getNote(row)
  getPatientAptm(row)
  getRemarkType(row)
}
const patientAptmList = ref([])
const remarkTypeList = ref([])
async function getRemarkType(row) {
  let url = `/prod-api/business/totalRemark/typeList`
  if (row.apmtId) {
    url += `?needApmtId=1`
  } else {
    url += `?needApmtId=0`
  }
  const res = await Get(url)
  if (res.code == 200) {
    remarkTypeList.value = res.data.map((item) => ({
      label: item.type,
      value: item.typeId
    }))
  }
}

async function getPatientAptm(row) {
  const res = await Get(
    `/prod-api/business/public/api/v1/appointment/allAppList?patientId=${row.PatientId}`
  )
  if (res.code == 200) {
    patientAptmList.value = res.data.map((item) => ({
      label: item.StartTime + ' ' + '|' + ' ' + item.doctorName,
      value: item.app_id
    }))
  }
}
const handleAddNote = () => {
  edit.value = true
  empty.value = false
}
async function handleSaveNotes() {
  console.log(selected.value, textarea.value)
  const res = await Post('/prod-api/business/totalRemark', {
    customerId: selected.value.id, //客户id
    remark: textarea.value, //备注
    patientId: selected.value.PatientId, //患者id
    apmtId: selected.value.aptmId,
    remarkType: remarkType.value
  })
  if (res.code == 200) {
    ElMessage.success('保存成功')
  }
  drawerVisible.value = false
  edit.value = false
  textarea.value = ''
  remarkType.value = ''
}
const dropdown = ref(false)
const handleChangeType = (e) => {
  console.log(e)
}
const remarkType = ref()
const handleClose = () => {}
// 快捷录入
const quickReplies = ['未接通', '关机', '需再次联系']
const handleAutoFill = (item) => {
  textarea.value = item
}
const textarea = ref()
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
const handleEvaluateOrth = (item) => {
  router.push(`/evaluateOrtho/${item.apmtId}/${item.patientId}`)
}
const handleCompareOrth = (item) => {
  router.push(`/compareOrtho/${item.apmtId}/${item.patientId}`)
}
const handleGoSche = (item) => {
  window.open(`https://orange.linkedcare.cn/#/patient/info/${item.PatientId}/apptRecord`, '_blank')
}

const storageName = ref(strategy[sessionStorage.getItem('currentTab')].storage)

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
    apmtId: val.row.apmtId,
    note: val.note
  })
  if (res.code == 200) {
    ElMessage.success('新增成功')
  }
}

const audioPlayer = ref(null)
var audioSource = ref(null)
const voiceUrl = ref()
onMounted(() => {
  audioSource.value = document.getElementById('audioSource')
  audioPlayer.value = document.getElementById('audioPlayer')
  // 当音频播放结束时，将播放状态重置为false
  audioPlayer.value?.addEventListener('ended', function () {
    selectedVoiceItem.value.isPlaying = false
    voiceUrl.value = ''
  })
})

const selectedVoiceItem = ref()
async function togglePlayPause(row) {
  // 切换数据源
  if (!voiceUrl.value && !selectedVoiceItem.value) {
    selectedVoiceItem.value = row
    voiceUrl.value = selectedVoiceItem.value.voice_file_url
    audioPlayer.value.load()
  } else {
    if (selectedVoiceItem.value.patientName == row.patientName) {
      if (!audioPlayer.value.paused && row.isPlaying) {
        audioPlayer.value.pause()
      } else if (audioPlayer.value.paused && !row.isPlaying) {
        audioPlayer.value.play()
      }
    } else {
      selectedVoiceItem.value = row
      voiceUrl.value = selectedVoiceItem.value.voice_file_url
      audioPlayer.value.load()
      if (!audioPlayer.value.paused && row.isPlaying) {
        audioPlayer.value.pause()
      } else if (audioPlayer.value.paused && !row.isPlaying) {
        audioPlayer.value.play()
      }
    }
  }

  row.isPlaying = !row.isPlaying
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
  const found = orthDoctorList.value.find((i) => i.value == selectDoctor.value)
  const data = {
    orthDoctorName: found.label,
    orthDoctorId: selectDoctor.value,
    patientId: item.PatientId,
    apmtId: item.apmtId,
    id: item.id
  }
  const res = await Post('/prod-api/emr/public/api/v1/assessment', data)
  if (res.code == 200) {
  }
}
</script>
<style lang="scss" scoped>
:deep .arco-drawer-footer > .arco-btn {
  border-radius: 6px !important;
}
:deep .arco-drawer-footer {
  :deep .arco-btn {
    border-radius: 6px;
  }
}
:deep .arco-textarea {
  height: 110px;
  background: #fff;
}
.arco-btn {
  border-radius: 6px;
}
.arco-input-wrapper {
  background: #fff;
}
.el-drawer.rtl.open {
  background: #fff;
}
:deep .arco-drawer-footer {
  display: none;
}
.drawer {
  color: #1d2129;
  position: relative;

  :deep .arco-drawer {
    width: 480px;
    :deep .arco-drawer-footer {
      display: none;
    }
  }
  :deep .arco-select-view-single {
    position: relative;
    img {
      position: absolute;
      right: 0;
      top: 0;
    }
  }

  :deep .el-drawer__header {
    margin-bottom: 0;
  }
  :deep .el-textarea {
    --el-input-border-color: #fff;
    --el-input-focus-border-color: none;
    &:hover {
      --el-input-hover-border: none;
      --el-border-color-hover: none;
    }
  }
  .notesWrapper {
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
    .emptyImage {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 240px;
    }
  }
  .title {
    font-size: 18px;
  }
  .form {
    background: #f4f7fd;
    // width: 448px;
    height: 253px;
    padding: 12px;
    border-radius: 12px;
    :deep .arco-select-view-suffix {
      display: none;
    }
    &_title {
      // padding: 4px 12px;
      // background: #e5e6eb;
      margin-bottom: 12px;
      // border-radius: 6px;
      // width: 114px;
      .selectWrapper:hover {
        background-color: #e5e6eb;
      }
    }
    &_input {
      height: 36px;
      margin-bottom: 12px;
      :deep .el-input {
        height: 36px;
      }
      :deep .arco-select-view-single {
        background: #fff !important;
      }
      :deep .arco-select-view-single:hover {
        background: #fff !important;
      }
      .cover {
        background: #fff;
        top: -0.5px;
        height: 4px;
        width: 50px;
        position: absolute;
        left: 8px;
      }
      .chooseAptm {
        position: absolute;
        /* padding: 2px; */
        top: -7px;
        left: 12px;
        font-size: 10px;
        font-weight: normal;
        line-height: normal;
        letter-spacing: 0em;
        color: #4e5969;
        z-index: 10;
      }
    }
    &_textarea {
      height: 149px;
      border: 1px solid #e5e6eb;
      background: #ffffff;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      :deep .el-textarea {
        height: 117px;
      }
      :deep .el-textarea__inner {
        resize: none;
      }

      &_quickReply {
        color: #4e5969;
        padding-left: 12px;
        display: flex;
        align-items: center;
        margin-bottom: 6px;
        textarea {
          resize: none;
          &::placeholder {
            color: #4e5969;
          }
        }
        &_item {
          cursor: pointer;
          color: #1d2129;
          background: #f2f3f5;
          padding: 2px 8px;
          margin-left: 8px;
          border-radius: 4px;
        }
      }
    }
  }
  .item {
    width: 376px;
    position: relative;
    display: flex;
    .circle {
      width: 8px;
      height: 8px;
      background: #c9cdd4;
      margin: 7px 17px 0 4px;
      border-radius: 50%;
      &::before {
        display: block;
        content: '';
        width: 1px;
        height: calc(100% - 25px);
        background-color: #c9cdd4;
        position: absolute;
        left: 7.5px;
        bottom: 0;
      }
    }
    &:last-child .cricle::before {
      opacity: 0;
    }
    .rightBox {
      display: flex;
      flex-direction: column;
      .title {
        display: flex;
        justify-content: space-between;
        font-size: 14px;
        height: 24px;
        color: #1d2129;
        align-items: center;
      }
      .content {
        width: 331px;
        padding: 8px 0 12px 0;
        line-height: 24px;
        color: #1d2129;
      }
      .remarkType {
        font-size: 12px;
        font-weight: normal;
        line-height: 20px;
        letter-spacing: 0px;
        border-radius: 4px;
        color: #2e6ce4;
        padding: 4px 10px;
        border: 1px solid #2e6ce4;
        margin-right: 12px;
      }
    }
  }
}

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
  border: 1px solid #f76560;

  border-radius: 4px;
  color: #f76560;
}
</style>
