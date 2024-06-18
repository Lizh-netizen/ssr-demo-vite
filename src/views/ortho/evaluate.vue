<template>
  <div class="drawer pt-[0]">
    <div class="flex items-center justify-between stickyHeader">
      <div
        class="section-header flex items-center cursor-pointer border-rd-[12px]"
        @click="handleBackToList"
      >
        <img src="@/assets/evaluate/Back.svg" class="mr-[12px]" />返回列表
      </div>

      <div class="flex gap-[48px] font-size-[16px]">
        <div>
          <span class="color-[#4E5969]">姓名：</span
          ><span class="font-500">{{ ljPatientInfo?.Name }}</span>
        </div>
        <div>
          <span class="color-[#4E5969]">病历号：</span
          ><span class="font-500">{{ ljPatientInfo?.PrivateId || '' }}</span>
        </div>
        <div>
          <span class="color-[#4E5969]">性别：</span
          ><span class="font-500">{{
            ljPatientInfo?.Sex == 1 ? '男' : ljPatientInfo?.Sex == 2 ? '女' : '未知'
          }}</span>
        </div>
        <div>
          <span class="color-[#4E5969]">出生日期：</span
          ><span class="font-500">{{ ljPatientInfo?.age }}</span>
        </div>
      </div>
      <div class="flex items-center button" @click="handleOpenImageDialogue">
        <img src="../../assets/svg/arrange.svg" class="mr-[8px]" />图像管理
      </div>
    </div>
    <div class="check section px-[12px]">
      <Header text="临床检查" backgroundColor="#f4f7fd" />
      <div class="content">
        <template v-for="title in checkData.orthTitleList" :key="title.id">
          <template v-if="title.titleName !== '关节弹响' && title.titleName !== '侧关节'">
            <form-item :label="title.titleName" width="100px">
              <Option
                :title="title"
                :appId="appId"
                @refreshList="refreshList"
                :owningModule="checkData.owningModule"
                :classId="checkData.id"
              ></Option>
            </form-item>
          </template>
        </template>
      </div>
    </div>
    <div class="image section px-[12px]">
      <Header text="图像分析" backgroundColor="#EAF0FC"
        ><div
          :style="{
            display: 'flex',
            'align-items': 'center',
            color: '#2E6CE4',
            gap: '4px',
            cursor: 'pointer'
          }"
          @click="openImgDialog"
        ></div
      ></Header>
      <div class="content" :style="{ 'padding-top': '0' }">
        <div class="questionItem__header">
          <img src="../../assets/svg/flag.svg" /><span class="questionItem__header__title"
            >面型评估</span
          >
        </div>
        <div class="container">
          <template v-for="item in faceAccessData" :key="item.id">
            <ImageItem :imageCaption="item.className"
              ><template #img
                ><template v-if="item.imageUrl"
                  ><img
                    :src="item.imageUrl"
                    :style="{
                      height: '240px',
                      'object-fit': 'cover'
                    }" /></template
                ><template v-else>
                  <div
                    class="imageItem__placeholder"
                    @click="handleOpenImageDialogue(item.className)"
                  >
                    <img :src="imgUrl" class="addPic" />
                  </div> </template></template
              ><template #content>
                <template v-for="title in item.orthTitleList" :key="title.id">
                  <form-item :label="title.titleName" width="120px">
                    <Option
                      :title="title"
                      :appId="appId"
                      @refreshList="refreshList"
                      owningModule="face"
                      :classId="item.id"
                    ></Option>
                  </form-item>
                </template>
              </template>
            </ImageItem>
          </template>
        </div>
        <div class="questionItem__header">
          <img src="../../assets/svg/flag.svg" /><span class="questionItem__header__title"
            >口内照</span
          >
        </div>
        <div class="container">
          <template v-for="item in mouthData" :key="item.id">
            <ImageItem
              v-if="item.className !== '前牙覆盖'"
              :imageCaption="item.className"
              :class="{
                removeBorder: item.className === '90度侧面像' || item.className === '45度侧面像',
                frontBite: item.className === '正面咬合'
              }"
              ><template #img
                ><template v-if="item.imageUrl"
                  ><img
                    :src="item.imageUrl"
                    :style="{
                      height: '240px',
                      'object-fit': 'cover'
                    }" /></template
                ><template v-else>
                  <div
                    class="imageItem__placeholder"
                    @click="handleOpenImageDialogue(item.className)"
                  >
                    <img :src="imgUrl" class="addPic" />
                  </div>
                </template>
                <template v-if="item.className == '正面咬合'">
                  <div :style="{ 'margin-top': '40px' }">
                    <template v-if="frontCover"
                      ><img
                        :src="frontCover"
                        :style="{
                          height: '240px',
                          'object-fit': 'cover'
                        }" /></template
                    ><template v-else>
                      <div
                        class="imageItem__placeholder"
                        @click="handleOpenImageDialogue('前牙覆盖')"
                      >
                        <img :src="imgUrl" class="addPic" />
                      </div>
                    </template>
                    <div :style="{ 'margin-bottom': '10px' }" class="color-[#4E5969]">前牙覆盖</div>
                  </div>
                </template> </template
              ><template #content>
                <template v-if="item.className == '正面咬合'"> </template>
                <div>
                  <template v-for="title in item.orthTitleList" :key="title.id">
                    <form-item :label="title.titleName" width="120px">
                      <OptionWithTooth
                        api="facialAssessment/addFacialResult"
                        :title="title"
                        :appId="appId"
                        @refreshList="refreshList"
                        @syncOption="syncOption"
                        owningModule="口内照"
                        :mouthData="mouthData"
                        :savedTitleList="savedTitleList"
                        :classId="item.id"
                        :className="item.className"
                      ></OptionWithTooth>
                    </form-item>
                  </template>
                </div>
              </template>
            </ImageItem>
          </template>
        </div>
        <div class="questionItem__header">
          <img src="../../assets/svg/flag.svg" /><span class="questionItem__header__title"
            >全景片<span v-if="panoTime" class="color-#4E5969 ml-[4px]">{{
              '(' + panoTime + ')'
            }}</span></span
          >
        </div>
        <template v-for="item in panoramicData" :key="item.id">
          <div class="placeholderContainer">
            <div
              class="image"
              :style="{
                flex: item.imageUrl ? '1' : '0',
                'min-width': item.imageUrl ? '250px' : 'auto'
              }"
            >
              <template v-if="item.imageUrl"
                ><img
                  :src="item.imageUrl"
                  :style="{ width: '100%', cursor: 'pointer' }"
                  @click="handleZoomPanoImage"
                /> </template
              ><template v-else>
                <div
                  class="imageItem__placeholder"
                  @click="handleOpenImageDialogue(item.className)"
                >
                  <img :src="imgUrl" class="addPic" />
                </div>
              </template>
            </div>
            <div class="imageItem__content specialComponent" :style="{ 'min-width': '780px' }">
              <div class="container">
                <div class="left-column">
                  <template
                    v-for="(title, index) in panoramicData[0].orthTitleList"
                    :key="title.id"
                  >
                    <template v-if="index <= 2">
                      <form-item :label="title.titleName" width="120px">
                        <el-radio-group
                          v-if="title.type == 1"
                          v-model="title.optionId"
                          @change="handleChangeOption(title.optionId, title, panoramicData[0].id)"
                        >
                          <template
                            v-for="(option, index) in title.orthOptionsList"
                            :key="option.id"
                          >
                            <el-radio-button
                              v-if="!option.optionSuffix"
                              :class="{
                                serious: option.serious == '1'
                              }"
                              :value="option.id"
                            >
                              {{ option.optionName }}
                            </el-radio-button></template
                          ></el-radio-group
                        >
                      </form-item>
                    </template>
                  </template>
                </div>
                <div class="leftLower-column">
                  <template
                    v-for="(title, index) in panoramicData[0].orthTitleList.slice(3, 9)"
                    :key="title.id"
                  >
                    <!-- <template v-if="index >= 2"> -->
                    <form-item :label="title.titleName" width="120px">
                      <Tooth
                        :step="2"
                        :title="title"
                        :appId="appId"
                        :data="panoramicData[0]"
                        module="evaluate"
                        :classId="panoramicData[0].id"
                        :owningModule="panoramicData[0].owningModule"
                      />
                    </form-item>
                    <!-- </template> -->
                  </template>
                </div>
              </div>
            </div>
          </div>
        </template>
        <div class="questionItem__header">
          <img src="../../assets/svg/flag.svg" /><span class="questionItem__header__title"
            >自由照片</span
          >
        </div>
        <div class="container">
          <template v-for="item in freePicData" :key="item.id">
            <ImageItem :imageCaption="item.className"
              ><template #img
                ><template v-if="item.imageUrl"
                  ><img
                    :src="item.imageUrl"
                    :style="{
                      height: '240px',
                      'object-fit': 'cover'
                    }" /></template
                ><template v-else>
                  <div
                    class="imageItem__placeholder"
                    @click="handleOpenImageDialogue(item.className)"
                  >
                    <img :src="imgUrl" class="addPic" />
                  </div> </template></template
              ><template #content>
                <template v-for="title in item.orthTitleList" :key="title.id">
                  <form-item
                    :label="title.titleName"
                    width="120px"
                    class="flex! items-start! textarea"
                  >
                    <el-input
                      type="textarea"
                      placeholder="输入描述"
                      v-model="title.cephalometricsContent"
                      :rows="4"
                      :style="{ width: '100%' }"
                      @blur="handleSubmitRemark(title, item.id, item.owningModule)"
                    ></el-input>
                  </form-item>
                </template>
              </template>
            </ImageItem>
          </template>
        </div>
      </div>
    </div>
    <div class="footer px-[12px]">
      <span class="dialog-footer">
        <el-button @click="handleBackToList">取消</el-button>
        <el-button type="primary" @click="handleConfirm"> 确认 </el-button>
      </span>
    </div>
  </div>
  <ImageDialog
    module="evaluate"
    :appId="appId"
    :patientId="patientId"
    v-if="imgDialogVisible"
    @savePics="handleSavePics"
    @cancel="handleClose"
  ></ImageDialog>

  <img
    id="img"
    :style="{
      opacity: 0
    }"
  />
  <el-dialog v-model="adviceVisible" title="面评建议" width="30%" class="advice">
    <div style="margin-top: 20px" class="advice__state">
      <div class="w-[70px] text-right mr-[16px]">结论</div>
      <el-radio-group v-model="advice" @change="handleAdviceChange">
        <el-radio-button :label="i" v-for="i in advices" :key="i" />
      </el-radio-group>
    </div>
    <div v-if="advice === '后续面评'" class="flex items-center">
      <div class="w-[70px] text-right mr-[16px]">时间选择</div>
      <el-date-picker
        unlink-panels
        v-model="time"
        class="datePicker"
        type="date"
        placeholder="请选择"
        value-format="YYYY-MM-DD"
        :shortcuts="rangeShortcuts"
        @selectShortcut="selectShortcutFn"
      ></el-date-picker>
    </div>
    <div v-if="advice === '立即矫正'">
      <div class="flex items-center">
        <div class="w-[70px] text-right mr-[16px]">患者依从性</div>
        <el-radio-group v-model="patientCompliance">
          <el-radio-button
            v-for="i in frankList"
            :key="i"
            :label="i.label"
            :value="i.value"
            class="patientCompliance"
            @click.native.prevent="handleClickFrank(i.value)"
            >{{ i.label }}</el-radio-button
          >
        </el-radio-group>
      </div>
      <div class="flex items-center mt-[16px]">
        <div class="w-[70px] text-right mr-[16px]">矫正医生</div>
        <template v-if="orthStatus == 3"
          ><el-select
            placeholder="请选择"
            allow-search
            filterable
            v-model="orthDoctorId"
            class="w-[120px]!"
          >
            <el-option
              v-for="item in orthDoctorList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
              {{ item.label }}</el-option
            >
          </el-select>
        </template>
        <template v-else
          ><a-select :defaultValue="doctorName" class="w-[120px]!" disabled></a-select
        ></template>
      </div>
    </div>
    <div v-if="advice === '转三级面评'" class="flex items-center">
      <div :style="{ display: 'inline-block' }" class="w-[70px] text-right mr-[16px]">
        <div>转诊至</div>
      </div>
      <el-select
        placeholder="请选择"
        allow-search
        filterable
        class="w-[120px]!"
        v-model="threeLevelDoctorId"
      >
        <el-option
          v-for="item in threeLevelDoctorList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
          {{ item.label }}</el-option
        >
      </el-select>
    </div>
    <div class="flex mt-[16px]">
      <div class="min-w-[70px] mr-[16px] text-right pt-[8px]">备注</div>
      <a-textarea
        class="border-rd-[8px]! bg-[#fff]! b-1px b-solid b-#E5E6EB"
        v-model="facialAdviseRemark"
        :max-length="100"
        show-word-limit
        @input="handleInput"
      />
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="adviceVisible = false">取消</el-button>
        <el-button type="primary" @click="handleAdvice"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
  <template v-if="!src">
    <div class="pdfContent" :style="{ display: 'none' }">
      <div class="pdfPage">
        <div class="patientInfo color-#fff font-500">
          <div class="mb-[8px] flex items-center">
            <img src="../../assets/eveluatePdf/avatar.svg" class="mr-[8px]" />{{
              ljPatientInfo?.Name
            }}
          </div>
          <div class="mb-[8px] flex items-center">
            <img src="../../assets/eveluatePdf/privateId.svg" class="mr-[8px]" />{{
              ljPatientInfo?.PrivateId
            }}
          </div>
          <div class="mb-[8px] flex items-center">
            <img src="../../assets/eveluatePdf/date.svg" class="mr-[8px]" />{{ ljPatientInfo?.age }}
          </div>
        </div>
        <div class="pt-[140px]">
          <div class="check" v-if="checkDataPdf?.list.length > 0">
            <div
              class="checkTitle color-#fff ml-[12px] position-relative z-3 h-[32px] flex items-center pl-[30px]"
            >
              临床检查
            </div>
            <div class="bg-#F7FBFD mt-[-6px] z--1 py-[16px] px-[20px] pb-0">
              <div><List :list="checkDataPdf?.list" class="checkList grid! grid-cols-3!" /></div>
            </div>
          </div>

          <!-- 其他内容 -->
          <div class="px-[20px] py-[10px]">
            <div class="flex">
              <!-- 面型评估 -->
              <div
                class="mr-[8px] borderBox facial"
                v-if="facialData?.imageList.length > 0 || facialData?.list.length > 0"
              >
                <div
                  class="h-[30px] w-[320px] px-[20px] py-[14px] bg-#216FB0 color-#FFFFFF font-500 pt-[6px]!"
                >
                  面型评估
                </div>
                <div class="p-[8px] max-w-[320px] color-[#1D2129]">
                  <div class="grid grid-cols-2 w-full gap-[8px]">
                    <div
                      class="w-[120px] h-[150px] overflow-hidden"
                      v-for="image in facialData?.imageList"
                      :key="image.imageUrl"
                    >
                      <img
                        :src="image.imageUrl + `?random=${Math.random()}`"
                        crossOrigin="anonymous"
                        class="w-full"
                      />
                    </div>
                  </div>
                  <div><List :list="facialData?.list" /></div>
                </div>
              </div>

              <!-- 全景片 -->
              <div
                class="flex-1 borderBox"
                v-if="panoData?.imageList.length > 0 || panoData?.list.length > 0"
              >
                <div
                  class="h-[30px] w-auto px-[20px] py-[14px] bg-#216FB0 color-#FFFFFF font-500 pt-[6px]!"
                >
                  全景片
                </div>
                <div class="p-[8px] pb-[0]! color-[#1D2129]">
                  <div
                    class="w-[290px] h-[150px] overflow-hidden"
                    v-for="image in panoData?.imageList"
                    :key="image.imageUrl"
                  >
                    <img
                      :src="image.imageUrl + `?random=${Math.random()}`"
                      crossOrigin="anonymous"
                      class="w-full"
                    />
                  </div>
                  <div><List :list="panoData?.list" :pano="true" /></div>
                </div>
              </div>
            </div>
            <!-- 口内照 -->
            <div
              class="mt-[8px] borderBox"
              v-if="mouthDataPdf?.imageList.length > 0 || mouthDataPdf?.list.length > 0"
            >
              <div
                class="h-[30px] w-full px-[20px] py-[14px] bg-#216FB0 color-#FFFFFF font-500 pt-[6px]!"
              >
                口内照
              </div>
              <div class="flex items-start p-[8px] color-[#1D2129] h-[510px]">
                <!-- 这里是图片, grid布局-->
                <div class="grid grid-cols-2 gap-[4px] mr-[16px]">
                  <div
                    class="h-[100px] w-[150px] overflow-hidden"
                    v-for="image in mouthDataPdf?.imageList"
                    :key="image.imageUrl"
                  >
                    <img
                      :src="image.imageUrl + `?random=${Math.random()}`"
                      class="w-full"
                      crossOrigin="anonymous"
                    />
                  </div>
                </div>
                <div class="flex-1 mr-[12px]"><List :list="mouthDataPdf?.list" /></div>
              </div>
            </div>
          </div>
        </div>
        <div class="facialAdvise">评估结果：{{ advice }}</div>
      </div>
    </div>
  </template>
</template>

<script setup>
import { Upload, WarningFilled } from '@element-plus/icons-vue'
import { ref, computed, onMounted, nextTick, onBeforeMount } from 'vue'
import Header from '../../components/list/header.vue'
import { Get, Post, Delete, Put } from '../../utils/request'
import formItem from '../../components/list/formItem.vue'
import ImageItem from '../../components/list/imageItem.vue'
import { useRoute, useRouter } from 'vue-router'
import { ElLoading, ElMessage } from 'element-plus'
import List from '@/components/evaluatePdf/evaluateList.vue'

import html2pdf from 'html2pdf.js'
import { GetSymptom } from '../../utils/tooth'
import placeholderUrl from '@/assets/ortho/imagePlaceholder.png'
import img from '@/assets/svg/addPic.svg'
import blueBgUrl from '@/assets/svg/blueBg.svg'
import ImageDialog from '@/components/list/imageDialog.vue'
import emptyRadio from '@/effects/emptyRadio.ts'
import OptionWithTooth from '@/components/list/OptionWithTooth.vue'
import useFdiToothCodeEffect from '@/effects/fdiToothCode.ts'
import updateOption from '@/effects/optionWithTooth.ts'
import {
  checkOrthOptions,
  checkImageUpload,
  checkFugaiOptionsEvaluate,
  checkOptions,
  checkEvaluatePano
} from '../../effects/checkCompletion'
import { useStore } from 'vuex'

const store = useStore()
const router = useRouter()
const route = useRoute()
const appId = route.params.appId
const patientId = route.params.patientId
const facialId = route.params.facialId
const orthStatus = route.params.orthStatus
const patientInfo = ref(
  JSON.parse(sessionStorage.getItem('patientInfo')) || store.state.patientInfo
)
const updatePatientInfo = () => {
  const newData = JSON.parse(sessionStorage.getItem('patientInfo')) || store.state.patientInfo
  Object.assign(patientInfo.value, newData)
}
// Listen for changes in sessionStorage
onMounted(() => {
  window.addEventListener('storage', (event) => {
    if (event.key === 'patientInfo') {
      updatePatientInfo()
    }
  })
})
const ljPatientInfo = ref()
onMounted(() => {
  patientInfo.value = JSON.parse(sessionStorage.getItem('patientInfo')) || store.state.patientInfo
})

async function getPatientInfo() {
  const formData = new FormData()
  formData.append('aptmId', appId)
  const result = await Post(
    `prod-api/business/public/api/v1/patient/getLjPatientInfoByAptmId?aptmId=${appId}`,
    formData,
    true
  )
  ljPatientInfo.value = result[0]
}
getPatientInfo()

const userInfo = ref(JSON.parse(sessionStorage.getItem('jc_odos_user')) || {})
const doctorName = ref(patientInfo.value?.facialOrthDoctorName || userInfo.value.userName)

// 面评弹窗逻辑
const frankList = ref([
  { value: 1, label: '好' },
  { value: 2, label: '中' },
  { value: 3, label: '差' }
])

const facialAdviseRemark = ref(patientInfo.value?.facialAdviseRemark || '')

const patientCompliance = ref(patientInfo.value?.patientCompliance || '')
const facialAdvise = ref(patientInfo.value?.facialAdvise || '')

const handleClickFrank = (item) => {
  if (item == patientCompliance.value) {
    patientCompliance.value = ''
  } else {
    patientCompliance.value = item
  }
}
const adviceVisible = ref(false)
const advices = ref(['立即矫正', '后续面评', '转三级面评', '无需矫正'])
const advice = ref(
  patientInfo.value?.facialAdvise == 1
    ? '立即矫正'
    : patientInfo.value?.facialAdvise == 2
      ? '无需矫正'
      : patientInfo.value?.facialAdvise == 3
        ? '后续面评'
        : patientInfo.value?.facialAdvise == 4
          ? '转三级面评'
          : '未评估'
)
const time = ref(patientInfo.value?.facialTime?.slice(0, 10) || '')
async function handleConfirm() {
  adviceVisible.value = true
  checkCompletion()
}

function checkImage() {}
const clinicalExamination = ref(0)
const imageUpload = ref(0)
const imageAnalysis = ref(0)
const facialCompletionId = ref()
const facialConclusion = ref(0)
async function checkImageOptions() {
  await getFaceAccessList()
  checkOrthOptions(faceAccessData.value)
  // 包含前牙覆盖选项的
  checkFugaiOptionsEvaluate(mouthData.value)
  checkEvaluatePano(panoramicData.value)
  console.log(
    checkOrthOptions(faceAccessData.value),
    // 包含前牙覆盖选项的
    checkFugaiOptionsEvaluate(mouthData.value),
    checkEvaluatePano(panoramicData.value)
  )
  if (
    checkOrthOptions(faceAccessData.value) === '0' &&
    checkFugaiOptionsEvaluate(mouthData.value) == '0' &&
    checkEvaluatePano(panoramicData.value) == '0'
  ) {
    return '0'
  } else if (
    checkOrthOptions(faceAccessData.value) === '1' &&
    checkFugaiOptionsEvaluate(mouthData.value) == '1' &&
    checkEvaluatePano(panoramicData.value) == '1'
  ) {
    return '1'
  } else {
    return '9'
  }
}

async function checkCompletion() {
  await getClassifiedImgList()
  await getMouthList()
  await getPanoramicList()
  const checkData = await getCheckList()
  // 临床检查
  clinicalExamination.value = checkOrthOptions(checkData)
  // 图片上传

  imageUpload.value = await checkImageUpload(classifiedImageList)
  // 图像分析的选项

  imageAnalysis.value = await checkImageOptions()

  const res = await Post('/prod-api/emr/facialAssessment/addFacialCompletionInfo', {
    id: +sessionStorage.facialCompletionId || '',
    aptmId: appId,
    patientId: patientId,
    clinicalExamination: clinicalExamination.value,
    imageUpload: imageUpload.value,
    imageAnalysis: imageAnalysis.value,
    facialConclusion: ''
  })
  if (res.data.facialCompletionId) {
    sessionStorage.setItem('facialCompletionId', res.data.facialCompletionId)
  }

  facialCompletionId.value = res.data.facialCompletionId
}
const id = ref()
async function getId() {
  const res = await Get(`/prod-api/business/orthBase/${appId}`)
  id.value = res.data.id
}
getId()
// 限制字数
const handleInput = (e) => {
  if (e.length > 100) {
    ElMessage({
      message: '字数限制100字以内',
      type: 'warning'
    })
  }
}
let facialOrthDoctorName = ref()
async function handleAdvice() {
  try {
    let orthDoctorName
    const found = orthDoctorList.value.find((item) => item.value == orthDoctorId.value)
    if (found) {
      orthDoctorName = found.label || ''
    }
    let facialDoctorName
    const found1 = threeLevelDoctorList.value.find((item) => item.value == threeLevelDoctorId.value)
    if (found1) {
      facialDoctorName = found1.label || ''
    }
    const facialAdvise =
      advice.value === '立即矫正'
        ? 1
        : advice.value === '后续面评'
          ? 3
          : advice.value === '转三级面评'
            ? 4
            : 2
    if (advice.value === '立即矫正') {
      time.value = ''
      threeLevelDoctorId.value = ''
      facialDoctorName = ''
    } else if (advice.value === '后续面评') {
      orthDoctorId.value = ''
      threeLevelDoctorId.value = ''
    } else if (advice.value === '转三级面评') {
      orthDoctorId.value = ''
      orthDoctorName = ''
      time.value = ''
    }
    const obj = {
      id: facialId,
      patientId: patientId,
      aptmId: appId,
      orthDoctorName: orthDoctorName || '',
      orthDoctorId: orthDoctorId.value || '',
      remark: '',
      ljProviderId: userInfo.value.ljProviderId,
      facialAdvise: facialAdvise,
      facialOrthDoctorId:
        advice.value === '立即矫正' && (orthStatus == 1 || orthStatus == 2)
          ? userInfo.value.ljProviderId
          : advice.value === '立即矫正' && orthStatus == 3
            ? orthDoctorId.value
            : '',
      facialOrthDoctorName:
        advice.value === '立即矫正' && (orthStatus == 1 || orthStatus == 2)
          ? userInfo.value.userName
          : advice.value === '立即矫正' && orthStatus == 3
            ? orthDoctorName
            : '',
      facialTime: advice.value === '后续面评' ? time.value : null,
      facialReferralToDoctorId: advice.value === '转三级面评' ? threeLevelDoctorId.value : '',
      facialReferralToDoctorName: advice.value === '转三级面评' ? facialDoctorName : '',
      patientCompliance: advice.value === '立即矫正' ? patientCompliance.value : '',
      facialAdviseRemark: facialAdviseRemark.value || ''
    }
    // 如果是1，2级矫正医生
    const res = await Post('/prod-api/emr/public/api/v1/assessment/add', obj)
    adviceVisible.value = false
    if (res.code === 200) {
      ElMessage.success(res.msg)
    }
    await Post('/prod-api/emr/facialAssessment/addFacialCompletionInfo', {
      id: +facialCompletionId.value || '',
      aptmId: appId,
      patientId: patientId,
      clinicalExamination: '',
      imageUpload: '',
      imageAnalysis: '',
      facialConclusion: '1'
    })
    facialConclusion.value = ''
  } catch (err) {
    console.log(err)
  }
  loading.value = ElLoading.service({
    lock: true,
    text: '保存中',
    // 把颜色改成不透明的，就看不到后面的pdf的内容了
    background: 'rgba(37, 38, 38, 1)'
  })
  main()
}
// main()
const loading = ref()

const rangeShortcuts = [
  {
    text: '1个月后',
    value: () => {
      // 获取当前日期
      const today = new Date()

      // 加上一个月的时间
      const nextMonth = new Date(today)
      nextMonth.setMonth(today.getMonth() + 1)

      // 获取年、月、日
      const year = nextMonth.getFullYear()
      const month = (nextMonth.getMonth() + 1).toString().padStart(2, '0')
      const day = nextMonth.getDate().toString().padStart(2, '0')

      // 格式化为 "YYYY-MM-DD"
      const formattedDate = `${year}-${month}-${day}`

      return formattedDate
    }
  },
  {
    text: '3个月后',
    value: () => {
      // 获取当前日期
      const today = new Date()

      // 加上一个月的时间
      const nextMonth = new Date(today)
      nextMonth.setMonth(today.getMonth() + 3)

      // 获取年、月、日
      const year = nextMonth.getFullYear()
      const month = (nextMonth.getMonth() + 1).toString().padStart(2, '0')
      const day = nextMonth.getDate().toString().padStart(2, '0')

      // 格式化为 "YYYY-MM-DD"
      const formattedDate = `${year}-${month}-${day}`

      return formattedDate
    }
  },
  {
    text: '6个月后',
    value: () => {
      // 获取当前日期
      const today = new Date()

      // 加上一个月的时间
      const nextMonth = new Date(today)
      nextMonth.setMonth(today.getMonth() + 6)

      // 获取年、月、日
      const year = nextMonth.getFullYear()
      const month = (nextMonth.getMonth() + 1).toString().padStart(2, '0')
      const day = nextMonth.getDate().toString().padStart(2, '0')

      // 格式化为 "YYYY-MM-DD"
      const formattedDate = `${year}-${month}-${day}`

      return formattedDate
    }
  },
  {
    text: '1年后',
    value: () => {
      // 获取当前日期
      const today = new Date()

      // 加上一年的时间
      const nextYear = new Date(today)
      nextYear.setFullYear(today.getFullYear() + 1)

      // 获取年、月、日
      const year = nextYear.getFullYear()
      const month = (nextYear.getMonth() + 1).toString().padStart(2, '0')
      const day = nextYear.getDate().toString().padStart(2, '0')

      // 格式化为 "YYYY-MM-DD"
      const formattedDate = `${year}-${month}-${day}`

      return formattedDate
    }
  },
  {
    text: '2年后',
    value: () => {
      // 获取当前日期
      const today = new Date()

      // 加上一年的时间
      const nextYear = new Date(today)
      nextYear.setFullYear(today.getFullYear() + 2)

      // 获取年、月、日
      const year = nextYear.getFullYear()
      const month = (nextYear.getMonth() + 1).toString().padStart(2, '0')
      const day = nextYear.getDate().toString().padStart(2, '0')

      // 格式化为 "YYYY-MM-DD"
      const formattedDate = `${year}-${month}-${day}`

      return formattedDate
    }
  }
]

const selectShortcutFn = (shortcut) => {
  let cacheStart = form.value.expectedUseCarTime
  let cacheEnd = form.value.expectedReturnCarTime
  // 移除副作用 start
  // 由于没有配置 value 点击之后会进行清空，此时将当前值（点击快捷选择前的值）重新赋值，使页面不会出现清空情况
  nextTick(() => {
    // 如果当前picker为 form 一部分，需要清除必填提示
    formRef.value.clearValidate('timeRange')
    form.value.timeRange = [cacheStart, cacheEnd]
    form.value.expectedUseCarTime = cacheStart
    form.value.expectedReturnCarTime = cacheEnd
  })
  // 移除副作用 end
  quickDateItemClicked(shortcut.label).then((val) => {
    let startStr = val[0]
    let endStr = val[1]
    form.value.expectedUseCarTime = startStr
    form.value.expectedReturnCarTime = endStr
    form.value.timeRange = [startStr, endStr]
  })
}
watch(
  patientInfo,
  (newVal) => {
    patientInfo.value = newVal
    facialAdvise
  },
  {
    immediate: true
  }
)
onBeforeMount(() => {})
onMounted(() => {
  window.addEventListener('click', (e) => {
    // 点击空白处，弹窗消失
    const popover = document.querySelector('.el-popper.el-popover')
    if (popover) {
      if (e.target !== popover && !popover.contains(e.target)) {
        const index = panoramicData.value[0].orthTitleList.findIndex(
          (title) => title.popVisible === true
        )
        if (index !== -1) {
          panoramicData.value[0].orthTitleList[index].popVisible = false
        }
      }
    }
  })
})
//
const handleChangeOption = (optionId, title, classId) => {
  updateOption(title.optionId, title, appId, classId)
}
const imgUrl = ref()
const handleClose = () => {
  imgDialogVisible.value = false
}
imgUrl.value = img
// 全景片牙位图逻辑
const symptomList = ref([])
symptomList.value = GetSymptom()
const handleBeforeEnterPopover = (title) => {
  symptomList.value.forEach((row) => {
    row.forEach((a) => {
      a.active = false

      if (title.toothCode?.includes(a.value + '')) {
        a.active = true
      }
    })
  })
}
// 单选反选取消
const strategy = {
  面型评估: getFaceAccessList,
  口内照: getMouthList,
  全景片: getPanoramicList
}
const refreshList = (val) => {
  strategy[val]()
}
// 获取数据

const checkData = ref([])

async function getCheckList() {
  const result = await Get(`/prod-api/emr/orthCommon/list/1/临床检查/${appId}`)
  checkData.value = result.data[0]
  result.data.forEach((item) => {
    item.orthTitleList.forEach((title) => (title.showInput = false))
  })
  result.data.forEach((item) => {
    item.orthTitleList.forEach((title) => {
      if (title.orthOptionsList.some((option) => option.otherContent)) {
        title.otherContent = title.orthOptionsList.find(
          (option) => option.otherContent
        ).otherContent
      }
      if (title.titleName == '关节弹响') {
        title.optionId = ''
        title.text = ''
        title.showInput = false
        title.selectId = ''
        const choosenOptions = title.orthOptionsList.filter((option) => option.choosen === true)

        if (choosenOptions.length > 0) {
          title.optionId = choosenOptions[0].id

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
  return result.data
}

const faceAccessData = ref([])
async function getFaceAccessList() {
  const result = await Get(`/prod-api/emr/orthCommon/list/1/面型评估/${appId}`)
  faceAccessData.value = result.data
  result.data.forEach((item) => item.orthTitleList.forEach((title) => (title.showInput = false)))
  result.data.forEach((item) => {
    if (!item.imageUrl) {
      item.hasImage = false
    } else {
      item.hasImage = true
    }
    item.orthTitleList.forEach((title) => {
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

const mouthData = ref([])
const frontCover = ref()
// 作为标题的备份
const savedTitleList = ref([])
async function getMouthList() {
  const result = await Get(`/prod-api/emr/orthCommon/list/1/口内照/${appId}`)
  mouthData.value = result.data
  result.data.forEach((item) => item.orthTitleList.forEach((title) => (title.showInput = false)))

  result.data.forEach((item) => {
    if (!item.imageUrl) {
      item.hasImage = false
    } else {
      item.hasImage = true
    }
    // 添加hover和点击时的颜色
    item.orthTitleList.forEach((title) => {
      title.orthOptionsList.forEach((option) => {
        if (option.optionSuffix) {
          option.fillColor = '#C9CDD4'
          option.seriousColor = '#f44c4c'
          option.hoverColor = '#2e6ce4'
          option.clicked = option.choosen ? true : false
        }
      })
    })
    item.orthTitleList.forEach((title) => {
      title.orthOptionsList.forEach((a) => {
        if (a.optionSuffix) {
          useFdiToothCodeEffect(a)
        }
      })
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
    if (item.className == '前牙覆盖') {
      frontCover.value = item.imageUrl
    }
    // 在刚开始展示的时候根据标题中的选项是否被选中展示
    if (item.className == '正面咬合') {
      savedTitleList.value = [...item.orthTitleList]
      const title1 = item.orthTitleList.find((title) => title.titleName == '反覆合程度')
      const title2 = item.orthTitleList.find((title) => title.titleName == '反覆盖程度')
      const title4 = item.orthTitleList.find((title) => title.titleName == '前牙覆合')
      const title5 = item.orthTitleList.find((title) => title.titleName == '前牙覆盖')
      const choosen1 = title1.orthOptionsList.some((option) => option.choosen === true)
      const choosen2 = title2.orthOptionsList.some((option) => option.choosen === true)
      const option1 = title4.orthOptionsList.find((option) => option.optionName == '前牙反覆合')
      const option2 = title5.orthOptionsList.find((option) => option.optionName == '前牙反覆盖')
      // 如果前牙覆合中的前牙反覆合没有被选中
      if (!option1.choosen && !choosen1) {
        const index = item.orthTitleList.findIndex((title) => title.titleName == '反覆合程度')
        item.orthTitleList.splice(index, 1)
      }
      if (!option2.choosen && !choosen2) {
        const index = item.orthTitleList.findIndex((title) => title.titleName == '反覆盖程度')
        item.orthTitleList.splice(index, 1)
      }
      if (!option1.choosen && !option2.choosen) {
        const index = item.orthTitleList.findIndex((title) => title.titleName == '凹面型表现')
        item.orthTitleList.splice(index, 1)
      }
    }
  })
}
// 同步牙位信息
const syncOption = (val) => {
  let title = {}
  let asyncOption = val.option
  let optionId = ''
  let item1 = mouthData.value.find((item) => item.className == '正面咬合')
  // 选了一个同步另一个
  if (val.option.optionName == '前牙反覆合') {
    title = item1.orthTitleList.find((title) => title.titleName == '前牙覆盖')
    optionId = title.orthOptionsList.find((option) => option.optionName == '前牙反覆盖').id
  } else if (val.option.optionName == '前牙反覆盖') {
    title = item1.orthTitleList.find((title) => title.titleName == '前牙覆合')
    optionId = title.orthOptionsList.find((option) => option.optionName == '前牙反覆合').id
  } else if (val.option.optionName == '前牙对刃') {
    if (val.titleName == '前牙覆合') {
      title = item1.orthTitleList.find((title) => title.titleName == '前牙覆盖')
      optionId = title.orthOptionsList.find((option) => option.optionName == '前牙对刃').id
    } else if (val.titleName == '前牙覆盖') {
      title = item1.orthTitleList.find((title) => title.titleName == '前牙覆合')
      optionId = title.orthOptionsList.find((option) => option.optionName == '前牙对刃').id
    }
  }

  asyncOption.id = optionId
  updateOption(
    optionId,
    title,
    appId,
    mouthData.value[0].id,
    '口内照',
    'facialAssessment/addFacialResult',
    val.option
  )
}

const panoImageUrl = ref()
const panoramicData = ref([])
const requestMouth = ref(false)
// 需要输入牙位的全景片title
const codeTitleList = ref([])
const sourceApmtId = ref()
const classId = ref()
const panoTime = ref()
async function getPanoramicList() {
  const result = await Get(`/prod-api/emr/orthCommon/list/1/全景片/${appId}`)
  panoramicData.value = result.data
  result.data.forEach((item) => {
    sourceApmtId.value = item.sourceApmtId ? item.sourceApmtId : appId
    classId.value = item.id
    panoTime.value = item.orthImageStartTime?.slice(0, 10)
    item.orthTitleList.forEach((title) => {
      title.showInput = false
      title.popVisible = false
    })
    if (!item.imageUrl) {
      item.hasImage = false
    } else {
      item.hasImage = true
      panoImageUrl.value = item.imageUrl
    }
    // flag为false再请求一次接口
    if (!item.flag) {
      requestMouth.value = true
      const obj = {
        sourceAptmId: sourceApmtId.value,
        aptmId: appId,
        classId: classId.value,
        location: '1'
      }
      Post('/prod-api/emr/orthCommon/selectOralCheckToothCode', obj).then((res) => {
        if (res.code == 200) {
          const nonCodeTitleList = panoramicData.value[0].orthTitleList.slice(0, 3)
          codeTitleList.value = res.data.slice(3)
          panoramicData.value[0].orthTitleList = [...nonCodeTitleList, ...codeTitleList.value]
          // 获取牙位数据是异步操作，需要分情况处理全景片数据
          handlePanoData(panoramicData)
        }
      })
    }
  })
  if (!requestMouth.value) {
    handlePanoData(panoramicData)
  }
}
// 自由照
const freePicData = ref([])
const freeImageUrl = ref()
async function getFreePic() {
  const result = await Get(`/prod-api/emr/orthCommon/list/1/自由照片/${appId}`)
  freePicData.value = result.data
  freeImageUrl.value = result.data[0].imageUrl
}

function handlePanoData(panoramicData) {
  panoramicData.value.forEach((item) => {
    item.orthTitleList.forEach((a) => {
      a.popVisible = false
      a.topLeft = []
      a.topRight = []
      a.bottomLeft = []
      a.bottomRight = []
      if (a.titleName == '多生牙') {
        if (a.fdiToothCode && !a.showPosition) {
          a.fdiToothCode = ''
        }
      }
      const arr = JSON.parse(a.showPosition == null || a.showPosition == '' ? '[]' : a.showPosition)
      if (a.fdiToothCode) {
        a.toothCode = a.fdiToothCode?.split(',')
        a.fdiToothCode?.split(',').forEach((code, index) => {
          if (code.startsWith('1') || code.startsWith('5')) {
            a.topLeft.push(arr[index][0])
          } else if (code.startsWith('2') || code.startsWith('6')) {
            a.topRight.push(arr[index][0])
          } else if (code.startsWith('4') || code.startsWith('8')) {
            a.bottomLeft.push(arr[index][0])
          } else if (code.startsWith('3') || code.startsWith('7')) {
            a.bottomRight.push(arr[index][0])
          }
        })
      } else {
        a.toothCode = []
      }
      a.position = arr || []
      a.submitAble = false
    })
  })

  panoramicData.value.forEach((item) => {
    item.orthTitleList.forEach((title) => {
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

getCheckList()
getFaceAccessList()
getMouthList()
getPanoramicList()
getFreePic()
// getModelList()
async function handleEmptyRadio(optionId, title, owningModule, classId) {
  if (
    title.orthOptionsList.some((option) => option.choosen == true) &&
    title.type == 1 &&
    title.optionId == optionId
  ) {
    emptyRadio(optionId, title)
    const obj = {
      aptmId: appId,
      titleId: title.id,
      optionsIdStr: [],
      otherContent: title.otherContent,
      cephalometricsContent: '',
      fdiToothCode: '',
      showPosition: '',
      classId: classId,
      owningModule: owningModule
    }

    Post('/prod-api/emr/facialAssessment/addFacialResult', obj)
    if (owningModule == 'check') {
      getCheckList()
    } else if (owningModule == 'face') {
      getFaceAccessList()
    } else if (owningModule == 'mouth') {
      getMouthList()
    } else if (owningModule == 'pano') {
      getPanoramicList()
    }
    // 重新请求数据
  }
}
const requestAgain = ref(false)

async function handleSubmitRemark(title, classId, owningModule) {
  if (!freeImageUrl.value) {
    ElMessage({
      message: '请先上传图片',
      type: 'warning'
    })
    return
  }
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
  const res = await Post('/prod-api/emr/facialAssessment/addFacialResult', obj)
}

const imgDialogVisible = ref(false)

const openImgDialog = () => {
  imgDialogVisible.value = true
  imageList.value.forEach((a) => {
    a.fileUrl = placeholderUrl
  })
  getClassifiedImgList()
}
const classifiedImageList = ref([])
async function getClassifiedImgList() {
  const res = await Get(`/prod-api/business/orthImage/list?apmtId=${appId}`)
  if (res.code == 200 && res.data.length > 0) {
    classifiedImageList.value = res.data
  }
}

const orthDoctorId = ref(+patientInfo.value?.facialOrthDoctorId || '')
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
const threeLevelDoctorId = ref(+patientInfo.value?.facialReferralToDoctorId || '')
const threeLevelDoctorList = ref([])
async function getThreeLevelDoctorList() {
  const res = await Get(`/prod-api/emr/public/api/v1/assessment/orthDoctorListByLevel/三级正畸医生`)
  if (res.code == 200) {
    threeLevelDoctorList.value = res.data.map((item) => {
      return {
        label: item.doctorName,
        value: item.doctorId
      }
    })
  }
}

getOrthDoctorList()
getThreeLevelDoctorList()
const imageArr = ref([])

const title = ref()
const handleOpenImageDialogue = (caption) => {
  imgDialogVisible.value = true
  // reminder是提醒从这个跳进去的
  title.value = caption
}

const src = ref()

// 保存图片
async function handleSavePics() {
  getAllData()
}

function getAllData() {
  getFaceAccessList()
  getMouthList()
  getPanoramicList()
  getFreePic()
}

const handleBackToList = () => {
  checkCompletion().then(() => {
    router.push('/index')
  })
}
function processData(data) {
  const result = {
    临床检查: { owningModule: '临床检查', imageList: [], list: [] },
    面型评估: { owningModule: '面型评估', imageList: [], list: [] },
    全景片: { owningModule: '全景片', imageList: [], list: [] },
    口内照: { owningModule: '口内照', imageList: [], list: [] }
  }

  data.forEach((item) => {
    const { owningModule, imageUrl, titleName, optionsNames, serious, otherContent } = item

    if (titleName || optionsNames) {
      let options = optionsNames
      if (otherContent) {
        const arr = options.split('，')
        const index = arr.findIndex((item) => item == '其他')
        arr.splice(index + 1, 0, '(' + otherContent + ')')
        options = arr.join('')
      }

      result[owningModule]?.list.push({
        title_name: titleName,
        option_names: options,
        serious: serious
      })
    }
    if (imageUrl) {
      if (
        result[owningModule] &&
        result[owningModule]?.imageList.find((i) => i.imageUrl == imageUrl)
      ) {
        return false
      }
      result[owningModule]?.imageList.push({ imageUrl })
    }
  })

  return result
}
const data = ref()
const checkDataPdf = ref()
const facialData = ref()
const panoData = ref()
const mouthDataPdf = ref()
async function getDataList(appId) {
  const res = await Get(
    `prod-api/emr/facialAssessment/getFacialIssuesList?aptmId=${appId}&location=1`
  )
  data.value = Object.values(processData(res.data))
  checkDataPdf.value = data.value.find((item) => item.owningModule == '临床检查')
  facialData.value = data.value.find((item) => item.owningModule == '面型评估')
  panoData.value = data.value.find((item) => item.owningModule == '全景片')
  mouthDataPdf.value = data.value.find((item) => item.owningModule == '口内照')
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
const generatePDF = () => {
  try {
    const options = {
      filename: `${ljPatientInfo.value?.Name}__面评报告__${formattedDate}.pdf`,
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
          `${ljPatientInfo.value?.Name}__面评报告__${formattedDate}.pdf`
        )
        Post('/prod-api/emr/upload', formData, true)
          .then((res) => {
            if (res.code == 200) {
              src.value = res.msg
              Post('/prod-api/emr/public/api/v1/assessment/updatePdfUrl', {
                id: facialId,
                pdfUrl: src.value
              })
              ElMessage({
                type: 'success',
                message: '保存成功'
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
            handleBackToList()
          })
      })
  } catch (err) {
    console.log(err)
  }
}
async function main() {
  // 依次执行这三个请求
  await getDataList(appId)
  // 所有请求完成后执行生成PDF
  // 刚开始不可见，要生成之前可见就可以，
  const pdfContent = document.querySelector('.pdfContent')
  pdfContent.style.display = 'block'
  generatePDF()
}
</script>
<style>
.el-dialog__body {
  padding: 24px;
  padding-top: 10px;
  padding-bottom: 10px;
}
.advice.el-dialog {
  width: 520px;
  border-radius: 12px;
  .el-dialog__body {
    padding: 0 24px;
  }
  .el-input {
    width: 100px;
    margin-left: 0;
  }
  .el-date-editor.el-input {
    width: 130px;
  }
  .el-input__wrapper.is-focus {
    --el-input-focus-border-color: #2e6ce4;
    box-shadow: 0px 0px 0px 1px #2e6ce4 !important;
  }
}
.el-input {
  width: 150px;
  margin-left: 10px;
}
.file-upload {
  position: relative;
  cursor: pointer;
}

.file-upload__label {
  display: inline-block;
  color: #333;
  border-radius: 4px;
  cursor: pointer;
}

.el-input.measured .el-input__wrapper {
  box-shadow: none;
}
.el-input.measured .el-input__wrapper:hover {
  box-shadow: 0 0 0 1px #dcdfe6;
}
.el-picker-panel__shortcut:hover {
  color: #1d2129;
  background: #f2f3f5 !important;
  width: 102px;
  border-radius: 4px;
}
.el-date-table td.current:not(.disabled) .el-date-table-cell__text {
  background-color: #2e6ce4;
  width: 32px;
  height: 24px;
  border-radius: 6px;
}
</style>
<style lang="scss" scoped>
.facial {
  :deep(.list1) {
    display: block;
    margin-top: 10px;
  }
}
.stickyHeader {
  position: sticky;
  top: 0;
  background: #fff;
  z-index: 10;
  padding: 0 12px;
  border-bottom: 1px solid #e5e6eb;
  margin-bottom: 20px;
}
:deep(.questionItem__header) {
  border-top: 1px solid #e5e6eb;
  &:first-child {
    border-top: none;
  }
}
:deep(.arco-textarea-wrapper) {
  background: #ffffff;

  box-sizing: border-box;
  /* 线条/一般 */
  border: 1px solid #e5e6eb;
}

.button {
  width: 122px;
  height: 32px;
  border-radius: 8px;
  opacity: 1;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 6px 20px;
  color: #ffffff;
  background: #2e6ce4;
}
:deep .formItem.textarea {
  .formItem__label {
    margin-top: 10px;
  }
}
:deep .imageItem.frontCoverImage {
  border-bottom: none !important;
  padding: 0;
  .imageItem__placeholder {
    // border: none;
    margin-bottom: 0px !important;
  }
}

:deep .imageItem.frontBite {
  padding-bottom: 0 !important;
  .imageItem__placeholder {
    // border: none;
    margin-bottom: 10px !important;
  }
  .imageItem__caption {
    top: 240px;
  }
  .imageItem__content {
    display: flex;
  }
}
:deep .el-input.el-input--prefix.el-input--suffix.el-date-editor el-date-editor--date {
  width: 130px;
}
:deep .el-textarea__inner {
  width: 300px;
}
.patientCompliance {
  :deep(.el-radio-button__inner) {
    width: 88px;
  }
}
:deep .el-radio-button__original-radio:checked + .el-radio-button__inner {
  color: #2e6ce4;
  background-color: #fff;
  border-color: #2e6ce4;
  --el-radio-button-checked-border-color: #2e6ce4;
}
.advice {
  &__state {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
  }
}
.imageItem {
  .img {
    img {
      width: 100%;
      height: 100%;
      border-radius: 12px;
    }
    img.addPic {
      width: auto;
      height: auto;
    }
  }
}
.imageItem__content.specialComponent {
  padding-left: 48px;
}
.placeholderContainer {
  display: flex;
  padding: 20px 0;
}
.imageItem__placeholder {
  width: 320px;
  height: 240px;
  border-radius: 10px;
  box-sizing: border-box;
  /* 线条/悬浮 */
  border: 1px dashed #c9cdd4;
  background: #f2f3f5;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  .addPic {
    position: absolute;
  }
  :deep .upload-demo {
    opacity: 0;
    height: 200px;
    z-index: 10;
    height: 100%;
    .el-upload {
      height: 100%;
    }
  }
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

.drawer {
  box-sizing: border-box;
  // font-family: 思源黑体;
  // padding: 20px;
  margin: 12px;
  background: #fff;
  padding-bottom: 20px;
  border-radius: 10px;
  .section {
    .content {
      .imageItem {
        width: auto;
        box-sizing: border-box;
        border-bottom: 1.4px dashed #e5e6eb;
      }
    }
    &-header {
      cursor: pointer;
      position: sticky;
      top: 0px;
      height: 50px;
      background: #fff;
      line-height: 50px;
      z-index: 2;
    }

    &.image {
      .questionItem__header {
        display: flex;
        align-items: center;
        padding-top: 20px;
        &__title {
          margin-left: 9px;
          font-weight: 500;
          letter-spacing: 0em;

          /* 文字/1级 */
          color: #1d2129;
        }
      }
    }
  }
  .content {
    padding: 20px;
    padding-bottom: 4px;
    :deep .el-input {
      height: 32px;
    }
  }

  .result {
    display: flex;
    align-items: center;
    background: #fdebeb;
    border: 1px dashed #ff5d5d;
    justify-content: space-between;
    height: 56px;
    padding: 12px 24.6px;
    box-sizing: border-box;
    margin: 12px 0 20px 0;
    &__title {
      color: #3d3d3d;
      font-size: 16px;
      font-weight: 500;
    }
    &__result {
      // font-family: 思源黑体;
      font-size: 20px;
      font-weight: bold;
      color: #ff5d5d;
    }
  }
  .footer {
    text-align: right;
  }
}

.imageManagement {
  /* padding: 24px; */

  position: relative;
  display: flex;
  .title {
    width: 557px;
    height: 50px;
    position: absolute;
    display: flex;
    background: #fff;
    z-index: 2;
    align-items: center;
    padding: 0 16px;
    box-sizing: border-box;
    border-radius: 12px 12px 0px 0;
    &__left {
      width: 35px;
      font-size: 16px;
      font-weight: 500;
      letter-spacing: 0em;

      /* 文字/1级 */
      color: #1d2129;
    }
    &__middle {
      display: flex;
      align-items: center;
      font-size: 12px;
      font-weight: normal;
      letter-spacing: 0em;

      color: #3d3d3d;
      margin-left: 12px;
    }
    &__right {
      top: 3px;
      position: relative;
      line-height: px;
      height: 23px;
      flex: 1;
      text-align: right;
      margin-right: 8px;
    }
  }
  .subSection {
    width: 560px;
    height: 533px;
    border-radius: 12px;
    opacity: 1;

    background: #ffffff;

    box-sizing: border-box;
    /* 线条/一般 */
    border: 1px solid #e5e6eb;
    overflow: auto;
  }
  &__images {
    /* position: relative; */
    margin-right: 16px;

    .imgContainer {
      margin-top: 12px;
      display: flex;
      flex-wrap: wrap;
      img.choose {
        border: 2px solid #2e6ce4;
        box-sizing: border-box;
      }
      &__empty {
        position: absolute;
        top: 167px;
        left: 200px;
      }

      .item {
        position: relative;
        width: 25%;
        padding-right: 16px;
        box-sizing: border-box;
        margin-bottom: 16px;
        .img {
          object-fit: cover;
          background-size: 100% 100%;
          width: 120px;
          height: 80px;
          border-radius: 12px;
        }

        .deleteImage {
          position: absolute;
          top: 0;
          right: 15px;
        }
        &__caption {
          display: flex;
          justify-content: center;
          color: #4e5969;
          margin-top: 10px;
        }
      }
    }
    &__button {
      position: absolute;
      right: 16px;
      bottom: 16px;
    }
  }
  &__classify {
    .title {
      color: #1d2129;
      font-size: 16px;
      font-weight: 500;
      letter-spacing: 0em;
      margin-bottom: 14px;
    }
    .imageWrapper {
      display: flex;
      flex-wrap: wrap;
      padding-left: 14px;

      padding-top: 50px;
      .item {
        position: relative;
        width: 25%;
        padding-right: 16px;
        box-sizing: border-box;
        margin-bottom: 16px;
        .img {
          width: 100%;
          height: 80px;
          border-radius: 12px;
          box-sizing: border-box;
          &.hover {
            border: 2px dashed #2e6ce4;
          }
        }
        .deleteImage {
          position: absolute;
          right: 16px;
          top: 0;
        }
        &__caption {
          display: flex;
          justify-content: center;
          color: #4e5969;
          margin-top: 6px;
        }
      }
    }
  }
  .classifyWrapper {
    width: 554px;
    right: 580px;
    bottom: 0px;
    position: absolute;
    height: 50px;

    text-align: right;

    background: #fff;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 10px;
    box-sizing: border-box;
    border-radius: 0 0px 12px 12px;
  }
}
.container .imageItem:last-child {
  border-bottom: none !important;
  // border-bottom: 1.4px solid #e5e6eb !important;
}

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
      top: 36px;
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
      .mouthImage {
      }
    }
    .facialAdvise {
      position: absolute;
      font-style: italic;
      font-family: YouSheBiaoTiHei;
      font-size: 32px;
      font-weight: 900;
      line-height: normal;
      letter-spacing: 0.04em;
      bottom: 30px;
      right: 80px;
      color: #1d458d;
    }
  }
}
</style>
