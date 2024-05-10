<template>
  <div class="stepTwo">
    <div class="button" @click="openImgDialog"><img src="@/assets/svg/arrange.svg" />影像管理</div>
    <Header text="面型评估" backgroundColor="#f4f7fd" />
    <div class="content" :style="{ 'min-height': '700px' }">
      <template v-for="(item, index) in faceAccessData" :key="item.id">
        <ImageItem
          :imageCaption="item.className"
          :class="{
            removeBorder: item.className === '90度侧面像' || item.className === '45度侧面像',
            side90: item.className === '90度侧面像',
            needMarginTop: item.className === '45度侧面微笑像'
          }"
          ><template #img
            ><template v-if="item.imageUrl">
              <!-- 正面像放在canvas中展示 -->
              <template v-if="item.className == '正面像'">
                <canvas
                  id="FrontalRose"
                  width="320"
                  height="240"
                  @click="handlePreviewImage(item)"
                ></canvas>
              </template>
              <template v-else>
                <img
                  :src="item.imageUrl"
                  @click="handlePreviewImage(item)"
                  :style="{
                    height: '240px',
                    'object-fit': 'cover',
                    'max-width': '320px'
                  }"
                />
              </template> </template
            ><template v-else>
              <div
                class="imageItem__placeholder"
                @click.prevent.stop="handleOpenImageDialogue(item.className)"
              >
                <img :src="imgUrl" class="addPic" />
              </div> </template></template
          ><template #content>
            <template v-for="title in item.orthTitleList" :key="title.id">
              <template
                v-if="
                  title.titleName == '侧貌' ||
                  title.titleName == '凸面型表现' ||
                  title.titleName == '凹面型表现'
                "
              >
                <form-item :label="title.titleName" width="120px">
                  <el-radio-group
                    v-if="title.type == 1"
                    v-model="title.optionId"
                    @change="handleChangeOption(title.optionId, title, item.id, item.owningModule)"
                    @dblclick="handleEmptyRadio(title.optionId, title, owningModule)"
                  >
                    <template v-for="(option, index) in title.orthOptionsList" :key="option.id">
                      <el-radio-button
                        :disabled="!item.hasImage"
                        :class="{
                          serious: option.serious == '1'
                        }"
                        :label="option.id"
                      >
                        {{ option.optionName }}
                        <img
                          class="aiFlagImg highZIndex"
                          :class="{ highZIndex: !showViewer }"
                          src="@/assets/svg/AIFlagForFront.svg"
                          v-show="title.aiFlag == '1' && option.choosen"
                        />
                      </el-radio-button>
                    </template> </el-radio-group
                ></form-item>
              </template>
              <template v-else>
                <form-item :label="title.titleName" width="120px">
                  <Option
                    :disabled="!item.hasImage"
                    :title="title"
                    :appId="appId"
                    :showViewer="showViewer"
                    @refreshList="refreshList"
                    :classId="item.id"
                    :owningModule="item.owningModule"
                    :notShowSvg="false"
                  ></Option> </form-item
              ></template>
            </template>
          </template>
        </ImageItem>
      </template>
    </div>

    <Header text="口内照" />
    <div class="content mouth">
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
                @click="handlePreviewImage(item)"
                :src="item.imageUrl"
                :style="{
                  height: '240px',
                  width: '320px',
                  'object-fit': 'cover'
                }" /></template
            ><template v-else>
              <div class="imageItem__placeholder" @click="handleOpenImageDialogue(item.className)">
                <img :src="imgUrl" class="addPic" />
              </div>
            </template>
            <template v-if="item.className == '正面咬合'">
              <div :style="{ 'margin-top': '40px' }">
                <template v-if="frontCover"
                  ><img
                    @click="handlePreviewImage(frontCoverItem)"
                    :src="frontCover"
                    :style="{
                      height: '240px',
                      width: '320px',
                      'object-fit': 'cover'
                    }" /></template
                ><template v-else>
                  <div class="imageItem__placeholder" @click="handleOpenImageDialogue('前牙覆盖')">
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
                  <MouthOption
                    :title="title"
                    :appId="appId"
                    @refreshList="refreshList"
                    @syncOption="syncOption"
                    owningModule="口内照"
                    :mouthData="mouthData"
                    :disabled="!item.hasImage"
                    :savedTitleList="savedTitleList1"
                    :classId="item.id"
                  ></MouthOption>
                </form-item>
              </template>
            </div>
          </template>
        </ImageItem>
      </template>
    </div>
    <Header
      text="全景片"
      @dblclick.prevent.stop="handleDblClick"
      @click.prevent.stop="console.log(11)"
    />
    <div class="content panoramic">
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
                @click.stop="handleOpenImageDialogue(item.className)"
              >
                <img :src="imgUrl" class="addPic" />
              </div>
            </template>
          </div>
          <div class="imageItem__content specialComponent" :style="{ 'min-width': '780px' }">
            <div class="container">
              <div class="left-column">
                <template v-for="(title, index) in panoramicData[0].orthTitleList" :key="title.id">
                  <template v-if="index <= 2">
                    <form-item :label="title.titleName" width="120px">
                      <el-radio-group
                        v-if="title.type == 1"
                        v-model="title.optionId"
                        @change="
                          handleChangeOption(
                            title.optionId,
                            title,
                            panoramicData[0].id,
                            panoramicData[0].owningModule
                          )
                        "
                        @dblclick="
                          handleEmptyRadio(title.optionId, title, item.id, item.owningModule)
                        "
                      >
                        <el-radio-button
                          :disabled="!panoramicData[0].hasImage"
                          :class="{
                            serious: option.serious == '1',
                            checked: option.choosen === true
                          }"
                          v-for="option in title.orthOptionsList"
                          :key="option.id"
                          :label="option.id"
                        >
                          {{ option.optionName }}
                        </el-radio-button>
                      </el-radio-group>
                      <el-input
                        v-if="title.optionId == 136"
                        placeholder="请输入"
                        v-model="title.otherContent"
                        @blur="
                          handleSubmit(
                            title.optionId,
                            title,
                            panoramicData[0].id,
                            panoramicData[0].owningModule
                          )
                        "
                      />
                      <el-checkbox-group
                        v-model="title.optionId"
                        v-else-if="title.type == 2"
                        @change="
                          handleChangeOption(
                            title.optionId,
                            title,
                            panoramicData[0].id,
                            panoramicData[0].owningModule
                          )
                        "
                      >
                        <el-checkbox-button
                          :disabled="!panoramicData[0].hasImage"
                          :class="{
                            serious: option.serious == '1',
                            checked: option.choosen === true
                          }"
                          v-for="option in title.orthOptionsList"
                          :key="option.id"
                          :label="option.id"
                        >
                          {{ option.optionName }}
                          <img src="@/assets/svg/checked.svg" v-if="option.serious == '0'" /><img
                            src="@/assets/svg/abnormalChecked.svg"
                            v-else
                          />
                        </el-checkbox-button>
                      </el-checkbox-group>
                    </form-item>
                  </template>
                </template>
              </div>
              <div class="right-column">
                <template v-for="(title, index) in panoramicData[0].orthTitleList" :key="title.id">
                  <template v-if="index <= 5 && index >= 3">
                    <form-item :label="title.titleName" width="120px">
                      <el-radio-group
                        v-if="title.type == 1"
                        v-model="title.optionId"
                        @change="
                          handleChangeOption(
                            title.optionId,
                            title,
                            panoramicData[0].id,
                            panoramicData[0].owningModule
                          )
                        "
                        @dblclick="
                          handleEmptyRadio(title.optionId, title, item.id, item.owningModule)
                        "
                      >
                        <el-radio-button
                          :disabled="!panoramicData[0].hasImage"
                          :class="{
                            serious: option.serious == '1',
                            checked: option.choosen === true
                          }"
                          v-for="option in title.orthOptionsList"
                          :key="option.id"
                          :label="option.id"
                        >
                          {{ option.optionName }}
                        </el-radio-button>
                      </el-radio-group>
                      <el-input
                        v-if="title.optionId == 136"
                        placeholder="请输入"
                        v-model="title.otherContent"
                        @blur="
                          handleSubmit(
                            title.optionId,
                            title,
                            panoramicData[0].id,
                            panoramicData[0].owningModule
                          )
                        "
                      />
                      <el-checkbox-group
                        v-model="title.optionId"
                        v-else-if="title.type == 2"
                        @change="
                          handleChangeOption(
                            title.optionId,
                            title,
                            panoramicData[0].id,
                            panoramicData[0].owningModule
                          )
                        "
                      >
                        <el-checkbox-button
                          :disabled="!panoramicData[0].hasImage"
                          :class="{
                            serious: option.serious == '1',
                            checked: option.choosen === true
                          }"
                          v-for="option in title.orthOptionsList"
                          :key="option.id"
                          :label="option.id"
                        >
                          {{ option.optionName }}
                          <img src="@/assets/svg/checked.svg" v-if="option.serious == '0'" /><img
                            src="@/assets/svg/abnormalChecked.svg"
                            v-else
                          />
                        </el-checkbox-button>
                      </el-checkbox-group>
                    </form-item>
                  </template>
                </template>
              </div>
              <div class="leftLower-column">
                <template v-for="(title, index) in panoramicData[0].orthTitleList" :key="title.id">
                  <template v-if="index >= 6 && index <= 12">
                    <form-item :label="title.titleName" width="120px">
                      <Tooth
                        :step="2"
                        :title="title"
                        :appId="appId"
                        :data="panoramicData[0]"
                        :classId="panoramicData[0].id"
                        :owningModule="panoramicData[0].owningModule"
                      />
                    </form-item>
                  </template>
                </template>
              </div>
              <div class="leftLower-column">
                <template v-for="(title, index) in panoramicData[0].orthTitleList" :key="title.id">
                  <template v-if="index >= 13 && index <= 19">
                    <form-item :label="title.titleName" width="120px">
                      <Tooth
                        :step="2"
                        :title="title"
                        :appId="appId"
                        :data="panoramicData[0]"
                        :classId="panoramicData[0].id"
                        :owningModule="panoramicData[0].owningModule"
                      />
                    </form-item>
                  </template>
                </template>
              </div>
            </div>
            <template v-for="(title, index) in panoramicData[0].orthTitleList" :key="title.id">
              <template v-if="index == panoramicData[0].orthTitleList.length - 1">
                <form-item :label="title.titleName" width="120px">
                  <a-textarea
                    v-model="title.otherContent"
                    @blur="
                      handleSubmit(
                        title.optionId,
                        title,
                        panoramicData[0].id,
                        panoramicData[0].owningModule
                      )
                    "
                  ></a-textarea></form-item
              ></template>
            </template>
          </div>
        </div>
      </template>
    </div>
    <Header text="侧位片" />
    <div
      class="content cephalometric"
      ref="loadingTarget"
      :style="{
        display: 'none'
      }"
    >
      <div class="placeholderContainer">
        <div class="image" :style="{ flex: cephaImage ? '1' : '0' }">
          <canvas
            v-show="cephaImage"
            ref="myCanvas"
            id="myCanvas"
            @click="handleZoomPic"
            :style="{
              cursor: 'pointer'
            }"
          >
          </canvas>
          <template v-if="cephaImage">
            <el-button class="cephalometric__button" type="primary" @click="getAIResult"
              >AI测量</el-button
            >
          </template>
          <template v-else>
            <div class="imageItem__placeholder" @click="handleOpenImageDialogue('侧位片')">
              <img :src="imgUrl" class="addPic" />
            </div>
          </template>
        </div>
        <div
          class="imageItem__content specialComponent cephalometric"
          :style="{
            'min-width': '800px'
          }"
        >
          <template v-for="title in cephaData" :key="title.id">
            <template v-if="title.showInput">
              <div class="formItem">
                <div
                  class="formItem__label"
                  @mouseleave="hideLine"
                  @mouseenter="showLine(title.titleName)"
                >
                  {{
                    title.titleName == 'Wits'
                      ? title.titleName + `(mm)`
                      : title.titleName == 'S-Go/N-Me' || title.titleName == 'S-N/Go`-Me'
                        ? title.titleName + `(%)`
                        : title.titleName + `(˚)`
                  }}
                </div>
                <el-tooltip
                  class="box-item"
                  effect="light"
                  placement="top"
                  :content="title.titlePrompt"
                  ><img src="@/assets/svg/questionMark.svg"
                /></el-tooltip>

                <div class="formItem__content">
                  <img
                    src="@/assets/svg/AI.svg"
                    :style="{ opacity: `${title.aiFlag == '1' ? 1 : 0}` }"
                  />
                  <div
                    :style="{
                      width: '100px',
                      display: 'flex',
                      'align-items': 'center'
                    }"
                  >
                    <el-input
                      :disabled="!cephaImage"
                      v-model="title.cephalometricsContent"
                      @focus="title.measured = false"
                      @blur="handleBlurInput(title)"
                      :class="{
                        measured: title.measured === true,
                        blue:
                          title.orthOptionsList.findIndex(
                            (option) => option.id == title.optionId
                          ) == 1,
                        red:
                          title.orthOptionsList.findIndex(
                            (option) => option.id == title.optionId
                          ) == 2
                      }"
                    ></el-input>
                    <img
                      src="@/assets/svg/downwards.svg"
                      v-show="
                        title.orthOptionsList.findIndex((option) => option.id == title.optionId) ==
                        1
                      "
                    />
                    <img
                      src="@/assets/svg/upwards.svg"
                      v-show="
                        title.orthOptionsList.findIndex((option) => option.id == title.optionId) ==
                        2
                      "
                    />
                  </div>
                  <el-radio-group
                    class="cephaRadio"
                    @change="
                      handleChangeOption(title.optionId, title, cephaClassId, '侧位片', '侧位片')
                    "
                    v-model="title.optionId"
                  >
                    <el-radio-button
                      :disabled="!cephaImage"
                      :label="option.id"
                      :class="{
                        serious: option.serious == '1',
                        checked: option.choosen === true,
                        red:
                          title.orthOptionsList.findIndex(
                            (option) => option.id == title.optionId
                          ) == 2,

                        green:
                          title.orthOptionsList.findIndex(
                            (option) => option.id == title.optionId
                          ) == 0,
                        blue:
                          title.orthOptionsList.findIndex(
                            (option) => option.id == title.optionId
                          ) == 1
                      }"
                      v-for="option in title?.orthOptionsList"
                      :key="option.id"
                      >{{ option.optionName }}</el-radio-button
                    ></el-radio-group
                  >
                </div>
              </div>
            </template>
            <template v-else>
              <div class="formItem">
                <div class="formItem__label">
                  {{ title.titleName }}
                </div>
                <el-tooltip class="box-item" effect="light" placement="top"
                  ><img src="@/assets/svg/questionMark.svg" :style="{ opacity: '0' }"
                /></el-tooltip>
                <div class="formItem__content">
                  <el-radio-group
                    v-model="title.optionId"
                    @change="
                      handleChangeOption(title.optionId, title, cephaClassId, '侧位片', '侧位片')
                    "
                    @dblclick="handleEmptyRadio(title.optionId, title, cephaClassId, '侧位片')"
                    ><el-radio-button
                      :disabled="!cephaImage"
                      :label="option.id"
                      :class="{
                        serious: option.serious == '1',
                        checked: option.choosen === true
                      }"
                      v-for="option in title?.orthOptionsList"
                      :key="option.id"
                      >{{ option.optionName }}</el-radio-button
                    ></el-radio-group
                  >
                </div>
              </div>
            </template>
          </template>
        </div>
      </div>
    </div>
  </div>
  <!-- <ImgDialog v-if="imgDialogVisible" :dialogVisible="imgDialogVisible" :imgUrl="imgUrl"></ImgDialog> -->
  <!-- 影像管理弹窗 -->
  <ImageDialog
    module="ortho"
    :appId="appId"
    :patientId="patientId"
    v-if="imgDialogVisible"
    @savePics="handleSavePics"
    @cancel="handleClose"
  ></ImageDialog>

  <div class="overlay" ref="overlayRef" @click="handleZoomOutCepha">
    <div class="overlay__header">{{ overlayName }}</div>
    <div class="overlay__mask"></div>
    <img
      class="zoomPanoImage"
      :src="panoImageUrl"
      :style="{ cursor: 'pointer' }"
      @click="handleZoomOutPanoImage"
      v-if="zoomPano"
    />
    <canvas id="myZoomCanvas" @click="handleZoomOutPic" v-if="!zoomPano"></canvas>
    <img
      src="@/assets/svg/close.svg"
      :style="{
        position: 'fixed',
        right: '20px',
        top: '20px',
        cursor: 'pointer'
      }"
      @click="handleZoomOutPic(true)"
    />
  </div>
  <img
    id="img"
    :style="{
      opacity: 0
    }"
  />
  <PreviewImage
    :owningModule="previewImageOwningModule"
    :className="previewImageClassName"
    :degree="imageRotationDegree"
    :id="previewImageId"
    :showViewer="showViewer"
    :imageUrl="previewImageUrl"
    @closeViewer="handleCloseViewer"
  />
</template>

<script setup>
import {
  computed,
  nextTick,
  onMounted,
  ref,
  watch,
  defineProps,
  defineExpose,
  onBeforeMount,
  onBeforeUnmount
} from 'vue'
import Header from '@/components/list/header.vue'
import ImageItem from '@/components/list/imageItem.vue'
import FormItem from '@/components/list/formItem.vue'
import { Post, Get, Put, Delete, Post1 } from '@/utils/request'
import axios from 'axios'
// import { Upload } from '@element-plus/icons-vue'
// import { ElLoading, ElMessage } from 'element-plus'
import {
  calculateFourPointsAngle,
  calculateThreePointsAngle,
  calculateDistanceRatio,
  calculateWits,
  perpendicularDistance,
  calculateDistanceEffect,
  averageThreeCourts
} from '@/utils/calculate'
import { GetSymptom } from '@/utils/tooth'
import { WarningFilled } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'
import 'animate.css'
import useChangeOption from '@/effects/changeOption.ts'
import useUpdateOption from '@/effects/updateOption.ts'
import useSelectTooth from '@/effects/selectTooth.ts'
import emptyRadio from '@/effects/emptyRadio.ts'
import useFdiToothCodeEffect from '@/effects/fdiToothCode.ts'
import img from '@/assets/svg/addPic.svg'
import blueBgUrl from '@/assets/svg/blueBg.svg'
import placeholderUrl from '@/assets/ortho/imagePlaceholder.png'
import ImageDialog from '@/components/list/imageDialog.vue'
import Option from '@/components/list/option.vue'
import MouthOption from '@/components/list/mouthOption.vue'
import updateOption from '@/effects/mouthOption.ts'
import previewImage from '../../components/list/previewImage.vue'
const route = useRoute()
const appId = route.params.appId
const patientId = route.params.patientId
const showViewer = ref(false)

const previewImageUrl = ref('')
const previewImageId = ref()
const imageRotationDegree = ref()
const previewImageClassName = ref()
const header = document.querySelector('.header')
const previewImageOwningModule = ref()
const handlePreviewImage = (item) => {
  previewImageClassName.value = item.className
  previewImageOwningModule.value = item.owningModule

  previewImageId.value = item.imageId
  previewImageUrl.value = item.imageUrl
  showViewer.value = true
  imageRotationDegree.value = item.imageRotationDegree % 360
  header.style.position = 'static'
}
const handleCloseViewer = () => {
  header.style.position = 'sticky'
  showViewer.value = false
}
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
onBeforeMount(() => {
  const link = document.createElement('link')
  link.id = 'preloadLink'
  link.href = img
  link.rel = 'preload'
  link.as = 'image'
  document.head.appendChild(link)
})
const clicked = ref(false)
defineExpose({
  clicked
})
const props = defineProps({
  pdfId: String,
  active: Number
})
// 单选反选取消
const strategy = {
  面型评估: getOrthFaceAccessList,
  口内照: getOrthMouthList,
  侧位片: getOrthCephaList
}

const refreshList = (val) => {
  strategy[val]()
}
// 点击全景片图片逻辑
const zoomPano = ref(false)
const overlayName = ref('')
const handleZoomPanoImage = () => {
  overlayRef.value.style.display = 'flex'
  zoomPano.value = true
  overlayName.value = '全景片'
}
const handleZoomOutPanoImage = () => {
  overlayRef.value.style.display = 'none'
  zoomPano.value = false
}

const canvasMaxX = ref(window.innerWidth - 900)
const ratio = 665 / 390
const canvasMaxY = ref((canvasMaxX.value / ratio).toFixed(2))

window.addEventListener('resize', () => {
  if (window.innerWidth < 1080) {
    return
  }
  const canvas = document.getElementById('myCanvas')
  if (canvas) {
    canvasMaxX.value = window.innerWidth - 900
    canvasMaxY.value = (canvasMaxX.value / ratio).toFixed(2)
    coordinatesSmall.value = coordinatesBase.value.map((point) => ({
      label: point.label,
      x: point.x * canvasMaxX.value,
      y: point.y * canvasMaxY.value
    }))
    initCanvas(canvasMaxX.value, canvasMaxY.value, true)
  }
})

// 上传图片逻辑
const fileList = ref([])
const fileListWithFlag = ref([])

const params = new FormData()

const upload = ref(false)

const handleBlurInput = (title) => {
  title.measured = true
  if (title.cephalometricsContent !== title.AIValue) {
    title.aiFlag = '0'
  }
  let obj = {
    aptmId: appId,
    titleId: title.id,
    optionsIdStr: [],
    otherContent: '',
    cephalometricsContent: title.cephalometricsContent ? title.cephalometricsContent : '',
    fdiToothCode: '',
    showPosition: '',
    classId: cephaClassId.value,
    owningModule: '侧位片'
  }
  Post('/prod-api/emr/orthPlan/addOrthInspectResult', obj).then((res) => {
    if (res.code == 200 && res.data.optionsId) {
      title.optionId = res.data.optionsId
      let obj1 = {
        aptmId: appId,
        titleId: title.id,
        optionsIdStr: [res.data.optionsId],
        otherContent: '',
        cephalometricsContent: '',
        fdiToothCode: '',
        showPosition: '',
        classId: cephaClassId.value,
        owningModule: '侧位片'
      }
      title.inputVal = title.cephalometricsContent
      Post('/prod-api/emr/orthPlan/addOrthInspectResult', obj1)
      Post('/prod-api/business/optionsResult/updateAIType', {
        apmtId: appId,
        cephalometricsList: [
          {
            titleId: title.id,
            aiType: 2
          }
        ]
      })
    } else if (res.code == 500 && res.msg) {
      title.cephalometricsContent = title.inputVal
      ElMessage({
        type: 'error',
        message: res.msg
      })
    } else if (res.code == 200) {
      if (title.orthOptionsList && title.orthOptionsList.length) {
        title.optionId = ''
      }
    }
  })
}

const chooseImgNum = computed(() => {
  let num = 0
  imageArr.value.forEach((item) => {
    item.imageList.forEach((img) => {
      if (img.choose) {
        num++
      }
    })
  })
  return num
})

// 影像管理逻辑
const index = ref(0)
const imageArr = ref([])
const totalArr = ref([])
const handleImageDialog = () => {
  imgDialogVisible.value = !imgDialogVisible.value
}
const openImgDialog = () => {
  imgDialogVisible.value = true
}

// 右侧分类图片占位
const imageList = ref([
  {
    caption: '正面像',
    typeName: 'FrontalRepose',
    fileUrl: placeholderUrl
  },
  {
    caption: '正面微笑像',
    typeName: 'FrontalSmile',
    fileUrl: placeholderUrl
  },
  {
    caption: '90度侧面像',
    typeName: 'LeftProfile',
    fileUrl: placeholderUrl
  },
  {
    caption: '90度侧面微笑像',
    typeName: 'RightProfile',
    fileUrl: placeholderUrl
  },
  {
    caption: '45度侧面像',
    typeName: 'LeftSideProfile',
    fileUrl: placeholderUrl
  },
  {
    caption: '45度侧面微笑像',
    typeName: 'RightSideProfile',
    fileUrl: placeholderUrl
  },
  {
    caption: '口内照（左侧）',
    typeName: '',
    fileUrl: placeholderUrl
  },
  {
    caption: '口内照（右侧）',
    typeName: '',
    fileUrl: placeholderUrl
  },
  {
    caption: '磨牙关系（左侧）',
    typeName: 'Left',
    fileUrl: placeholderUrl
  },
  {
    caption: '磨牙关系（右侧）',
    typeName: 'Right',
    fileUrl: placeholderUrl
  },
  {
    caption: '正面咬合',
    typeName: 'Anterior',
    fileUrl: placeholderUrl
  },
  {
    caption: '前牙覆盖',
    typeName: 'Cover',
    fileUrl: placeholderUrl
  },
  {
    caption: '上颌',
    typeName: 'Upper',
    fileUrl: placeholderUrl
  },
  {
    caption: '下颌',
    typeName: 'Lower',
    fileUrl: placeholderUrl
  },
  {
    caption: '全景片',
    typeName: 'Panoramic',
    fileUrl: placeholderUrl
  },
  {
    caption: '侧位片',
    typeName: 'Cephalometric',
    fileUrl: placeholderUrl
  }
])

// 图片分类
async function getToken() {
  let token
  const res = await Post1('/bonceph/platform/user/login', {
    username: 'bonceph',
    userpwd: '4371f7b311bf4f88cbd27855f3143430'
  })
  if (res.code == 200) {
    token = res.data.token
  }
  return token
}
// async function getToken() {
//   let token
//   const res = await axios({
//     url: 'http://47.101.150.34:8177/bonceph/platform/user/login',
//     method: 'post',
//     data: { username: 'bonceph', userpwd: '4371f7b311bf4f88cbd27855f3143430' }
//   })
//   if (res.status == 200) {
//     token = res.data.data.token
//   }
//   return token
// }
const loading = ref(false)
const loadingTarget2 = ref()
// 自动分类
// 图片拖拽
const dragFile = ref(null)
const src = ref()
// 在右边区域拖拽
const handleDragStart1 = (img) => {
  dragFile.value = img
  dragFile.value.rightDrop = true
  src.value = dragFile.value.fileUrl
  const image2 = document.getElementById('img')
  image2.src = img.fileUrl
  image2.style.opacity = 1
  image2.width = 120
  image2.height = 80
  image2.style.position = 'absolute'
  image2.style.top = '-9999px'
  image2.style.objectFit = 'cover'
  image2.style.border = '2px solid #2E6CE4'
  image2.style.boxShadow = '0px 9px 18px 0px rgba(0, 0, 0, 0.57)'
  event.dataTransfer.setDragImage(image2, 60, 40)
}
// 从左侧拖到右侧
const handleDragStart = (file, event) => {
  if (file.file) {
    event.dataTransfer.setData('text/plain', file)
    dragFile.value = event.dataTransfer.files[0]
  } else {
    dragFile.value = file
  }
  const image2 = document.getElementById('img')
  image2.src = file.imgUrl
  image2.style.opacity = 1
  image2.width = 120
  image2.height = 80
  image2.style.position = 'absolute'
  image2.style.top = '-9999px'
  image2.style.objectFit = 'cover'
  image2.style.border = '2px solid #2E6CE4'
  image2.style.boxShadow = '0px 9px 18px 0px rgba(0, 0, 0, 0.57)'
  event.dataTransfer.setDragImage(image2, 60, 40)
}
const handleDragEnd = () => {
  const image2 = document.getElementById('img')
  image2.style.opacity = 0
}
const imageUrlChanged = ref(false)
// 保存图片
async function handleSavePics(val) {
  imageUrlChanged.value = val
  // imageList.value.forEach((item) => (item.reminder = false))
  // const orthImageList = imageList.value.filter((item) => item.fileUrl.startsWith('https'))
  // const arr = orthImageList.map((item) => ({
  //   imageType: item.caption,
  //   imageUrl: item.fileUrl,
  //   imageId: item.fileId || null
  // }))
  // Post('/prod-api/business/orthImage', {
  //   apmtId: appId,
  //   orthImageList: arr
  // }).then(() => {
  //   getAllData()
  // })
  if (props.pdfId) {
    sessionStorage.removeItem(props.pdfId)
  }
  getAllData()
}
const handleClose = () => {
  imgDialogVisible.value = false
}
const handleDragOver = (e) => {
  if (!e.target.src.endsWith('jpeg') && !e.target.src.endsWith('jpg')) {
    e.target.src = blueBgUrl
    e.target.classList.add('hover')
  }
}
const handleDragLeave = (e) => {
  if (!e.target.src.endsWith('jpeg') && !e.target.src.endsWith('jpg')) {
    e.target.src = placeholderUrl
  }
  e.target.classList.remove('hover')
}

function getAllData() {
  getOrthFaceAccessList()
  getOrthCephaList()
  getOrthMouthList()
  getOrthPanoramicList()
}
const handleCloseImgDialog = () => {
  imageList.value.forEach((image) => (image.reminder = false))
}
// 获取照片和相关信息

const faceAccessData = ref([])
// 侧貌的
const savedTitleList = ref([])
// 前牙覆盖的
const savedTitleList1 = ref([])
const FrontalRose = [
  'forehead_center',
  'eyebrow_right_corner_left',
  'eyebrow_left_corner_right',
  'nose_middle_contour',
  'chin_2',
  'cheek_right_1',
  'cheek_left_1'
]
const frontalCanvasWidth = ref(0)
const frontalCanvasHeight = ref(0)
const frontalRatio = ref(0)
function loadImageToCanvas(maxWidth, maxHeight, imageUrl, canvasId) {
  const image = new Image() // 创建 img 元素
  const canvas = document.getElementById(canvasId)
  const ctx = canvas.getContext('2d')
  image.onload = function () {
    // 执行 drawImage 语句
    const imgWidth = image.width
    const imgHeight = image.height

    let width = imgWidth
    let height = imgHeight
    frontalRatio.value = imgWidth / imgHeight
    // 等比例缩放计算
    if (width > maxWidth) {
      width = maxWidth
      height = width / frontalRatio.value
    }

    if (height > maxHeight) {
      height = maxHeight
      width = height * frontalRatio.value
    }
    canvas.width = width
    frontalCanvasWidth.value = width

    canvas.height = height
    frontalCanvasHeight.value = height
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    // 在画布上绘制缩小后的图片
    ctx.drawImage(image, 0, 0, width, height)
    if (faceSet.value.length) {
      drawPointsOnCanvas(ctx, image, canvas, faceSet.value)
    }
  }

  image.src = imageUrl // 设置图片源地址
}
function drawPointsOnCanvas(ctx, image, canvas, pointList) {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
  pointList.forEach(function (coordinate) {
    const x = coordinate.x
    const y = coordinate.y

    // 绘制圆形点
    ctx.beginPath()
    ctx.arc(x, y, 2, 0, 2 * Math.PI)
    // ctx.fillStyle = 'red'
    ctx.fill()
  })
  drawLineOnCanvas(ctx, canvas)
}
// 计算正貌
async function calculateFrontal1(pointList, classId, owningModule) {
  const leftDistance = perpendicularDistance(pointList[6], pointList[0], pointList[3])
  const rightDistance = perpendicularDistance(pointList[5], pointList[0], pointList[3])
  const frontTitle = faceAccessData.value[0].orthTitleList[0]
  frontTitle.aiFlag = '1'
  frontTitle.aiTest = true
  if (leftDistance < rightDistance) {
    const optionId = frontTitle.orthOptionsList[2].id
    await useUpdateOption(optionId, frontTitle, appId, classId, owningModule)
  } else if (leftDistance > rightDistance) {
    const optionId = frontTitle.orthOptionsList[1].id
    await useUpdateOption(optionId, frontTitle, appId, classId, owningModule)
  } else {
    const optionId = frontTitle.orthOptionsList[0].id
    await useUpdateOption(optionId, frontTitle, appId, classId, owningModule)
  }
}
// 计算面中
async function calculateFrontal2(pointList, classId, owningModule) {
  const middleTitle = faceAccessData.value[0].orthTitleList[3]
  middleTitle.aiFlag = '1'
  middleTitle.aiTest = true
  const middleDistance = perpendicularDistance(pointList[3], pointList[2], pointList[1])
  const averageDistance = averageThreeCourts(pointList)
  compareThreeCourts(middleDistance, averageDistance, middleTitle, classId, owningModule)
}
// 计算面下
async function calculateFrontal3(pointList, classId, owningModule) {
  console.log(11)
  const bottomTitle = faceAccessData.value[0].orthTitleList[4]
  bottomTitle.aiFlag = '1'
  bottomTitle.aiTest = true
  const bottomDistance = calculateDistanceEffect(pointList[3], pointList[4])
  const averageDistance = averageThreeCourts(pointList)
  compareThreeCourts(bottomDistance, averageDistance, bottomTitle, classId, owningModule)
}
async function calculateFront(pointList, classId, owningModule) {
  await calculateFrontal1(pointList, classId, owningModule)
  await calculateFrontal2(pointList, classId, owningModule)
  await calculateFrontal3(pointList, classId, owningModule)
  getOrthFaceAccessList()
}
const AiTest = ref(false)
async function compareThreeCourts(distance, averageDistance, title, classId, owningModule) {
  if (distance > averageDistance) {
    const optionId = title.orthOptionsList[2].id
    await useUpdateOption(optionId, title, appId, classId, owningModule)
  } else if (distance < averageDistance) {
    const optionId = title.orthOptionsList[1].id
    await useUpdateOption(optionId, title, appId, classId, owningModule)
  } else {
    const optionId = title.orthOptionsList[0].id
    await useUpdateOption(optionId, title, appId, classId, owningModule)
  }
  getOrthFaceAccessList()
}
function drawLineOnCanvas(ctx, canvas) {
  ctx.strokeStyle = 'green'
  ctx.lineWidth = 1
  ctx.beginPath()
  faceSet.value.forEach((point) => {
    ctx.moveTo(0, point.y)
    ctx.lineTo(canvas.width, point.y)
    ctx.strokeStyle = 'blue'
  })
  ctx.stroke()

  ctx.strokeStyle = 'purple'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(faceSet.value[0].x, 0)
  ctx.lineTo(faceSet.value[3].x, canvas.height)
  ctx.stroke()
}
async function addFaceset(list) {
  const obj = {
    apmtId: appId,
    pointType: 2,
    pointList: list
  }
  Post('/prod-api/business/orthPoint', obj)
}

const faceSet = ref([])
const FrontalReposeImageUrl = ref()
const FrontalSmileImageUrl = ref()
async function getOrthFaceAccessList() {
  const result = await Get(`/prod-api/emr/orthCommon/list/2/面型评估/${appId}`)
  faceAccessData.value = result.data
  result.data.forEach((item) => item.orthTitleList.forEach((title) => (title.showInput = false)))
  result.data.forEach((item) => {
    if (!item.imageUrl) {
      item.hasImage = false
    } else {
      item.hasImage = true
      // 预加载如果没很快用到会有警告

      if (item.className === '正面像') {
        const preloadLink = document.createElement('link')
        preloadLink.href = item.imageUrl
        preloadLink.rel = 'preload'
        preloadLink.as = 'image'
        document.head.appendChild(preloadLink)
        const title1 = item.orthTitleList.find((title) => title.titleName == '正貌')
        const title2 = item.orthTitleList.find((title) => title.titleName == '面中三分之一')
        const title3 = item.orthTitleList.find((title) => title.titleName == '面下三分之一')
        // 刚开始的时候都没有选，全部计算，之后改动的话也不会计算了
        const isTitle1Test = title1.orthOptionsList.some((option) => option.choosen == true)
        const isTitle2Test = title2.orthOptionsList.some((option) => option.choosen == true)
        const isTitle3Test = title3.orthOptionsList.some((option) => option.choosen == true)
        AiTest.value = !isTitle1Test || !isTitle2Test || !isTitle3Test
        FrontalReposeImageUrl.value = item.imageUrl
        const formData = new FormData()
        formData.append('imageUrl', item.imageUrl)
        Get(`/prod-api/business/orthPoint/list?apmtId=${appId}&pointType=2`).then((res) => {
          if (res.data.length > 0) {
            faceSet.value = res.data.map((item) => ({
              label: item.pointName,
              x: item.xcoordinate,
              y: item.ycoordinate
            }))
            if (AiTest.value) {
              calculateFront(faceSet.value, item.id, item.owningModule)
            }
            // nextTick(() => {
            // 如果快速切换了页面，那么就不画图了
            if (interruptSignal) {
              return
            }
            loadImageToCanvas(320, 240, FrontalReposeImageUrl.value, 'FrontalRose')
            // })
          } else {
            Post('/prod-api/business/orthImage/calculateFaceShapeSet', formData, true).then(
              (res) => {
                if (res.data.face_list) {
                  const data = res.data.face_list[0].landmark201
                  const image = new Image()
                  image.onload = () => {
                    const { width, height, ratio } = getRatio(image.width, image.height, 320, 240)
                    // 比例缩放的因子
                    const scaleFactorWidth = width / image.width
                    const scaleFactorHeight = height / image.height
                    faceSet.value = FrontalRose.map((a) => ({
                      label: a,
                      x: data[a].x * scaleFactorWidth,
                      y: data[a].y * scaleFactorHeight
                    }))
                    calculateFront(faceSet.value, item.id, item.owningModule)
                    const set = faceSet.value.map((item) => [item.label, item.x, item.y])
                    addFaceset(set)
                  }
                  image.src = FrontalReposeImageUrl.value

                  // nextTick(() => {
                  if (interruptSignal) {
                    return
                  }
                  loadImageToCanvas(320, 240, FrontalReposeImageUrl.value, 'FrontalRose')
                } else {
                  loadImageToCanvas(320, 240, FrontalReposeImageUrl.value, 'FrontalRose')
                }
              }
            )
          }
        })
      }
      if (item.className == '正面微笑像') {
        FrontalSmileImageUrl.value = item.imageUrl
      }
    }
    if (item.className == '90度侧面像') {
      savedTitleList.value = [...item.orthTitleList]
      const title1 = item.orthTitleList.find((title) => title.titleName == '凸面型表现')
      const title2 = item.orthTitleList.find((title) => title.titleName == '凹面型表现')
      const choosen1 = !title1.orthOptionsList.some((option) => option.choosen === true)
      const choosen2 = !title2.orthOptionsList.some((option) => option.choosen === true)
      if (choosen1 && choosen2) {
        item.orthTitleList.splice(1, 2)
      } else if (choosen2) {
        item.orthTitleList.splice(2, 1)
      } else if (choosen1) {
        item.orthTitleList.splice(1, 1)
      }
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
  loadingTarget.value.style.display = 'block'
}

function getRatio(imgWidth, imgHeight, maxWidth, maxHeight) {
  let ratio = 0
  let width = imgWidth
  let height = imgHeight
  ratio = imgWidth / imgHeight
  // 等比例缩放计算
  if (width > maxWidth) {
    width = maxWidth
    height = width / ratio
  }

  if (height > maxHeight) {
    height = maxHeight
    width = height * ratio
  }
  return { width, height, ratio }
}
const frontCoverItem = ref()
const mouthData = ref([])
const frontCover = ref()
async function getOrthMouthList() {
  const result = await Get(`/prod-api/emr/orthCommon/list/2/口内照/${appId}`)
  mouthData.value = result.data
  result.data.forEach((item) => item.orthTitleList.forEach((title) => (title.showInput = false)))

  result.data.forEach((item) => {
    if (!item.imageUrl) {
      item.hasImage = false
    } else {
      item.hasImage = true
    }
    item.orthTitleList.forEach((title) => {
      title.orthOptionsList.forEach((option) => {
        if (option.optionSuffix) {
          option.fillColor = '#C9CDD4'
          option.seriousColor = '#f44c4c'
          option.hoverColor = '#2e6ce4'
          option.clicked = option.choosen ? true : false
          useFdiToothCodeEffect(option)
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
      frontCoverItem.value = item
      frontCover.value = item.imageUrl
    }
    if (item.className == '正面咬合') {
      savedTitleList1.value = [...item.orthTitleList]
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
    title = item1.orthTitleList.find((title) => {
      return title.titleName == '前牙覆盖'
    })
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
  updateOption(optionId, title, appId, val.classId, mouthData.value[0].owningModule, val.option)
}
function yieldNewTask() {
  return new Promise((resolve) => {
    setTimeout(resolve, 0)
  })
}

const tasks = [getOrthFaceAccessList, getOrthMouthList, getOrthPanoramicList, getOrthCephaList]
// mayCancelList(tasks)
// 页面切换时不用画图
let interruptSignal = false
onBeforeUnmount(() => {
  interruptSignal = true
})

async function main() {
  // 创建要运行的函数数组

  while (tasks.length > 0) {
    // 从任务数组中取出第一个任务

    const task = tasks.shift()

    // Run the task:
    if (interruptSignal) {
      break
    }
    await task()
  }
  // 运行任务
  // await task()
}

// getAllData()
main()
onBeforeUnmount(() => {})
// 获取全景片
const panoImageUrl = ref()
const panoramicData = ref([])
const sourceApmtId = ref()
const classId = ref()
const requestMouth = ref(false)
// 需要输入牙位的全景片title
const codeTitleList = ref([])

function handlePanoData(panoramicData) {
  panoramicData.value.forEach((item) => {
    item.orthTitleList.forEach((a) => {
      useFdiToothCodeEffect(a)

      a.showInput = false
      a.popVisible = false
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
      if (title.orthOptionsList && title.orthOptionsList.some((option) => option.otherContent)) {
        title.otherContent = title.orthOptionsList.find(
          (option) => option.otherContent
        ).otherContent
      }
    })
  })
}
// const lastApmtId  =ref()
async function getOrthPanoramicList() {
  const result = await Get(`/prod-api/emr/orthCommon/list/2/全景片/${appId}`)
  panoramicData.value = result.data
  result.data.forEach((item) => {
    sourceApmtId.value = item.sourceApmtId ? item.sourceApmtId : appId
    classId.value = item.id
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
        sourceApmtId: sourceApmtId.value,
        apmtId: appId,
        classId: classId.value,
        location: '2'
      }
      Post('/prod-api/business/orthClass/mouthCheck', obj).then((res) => {
        if (res.code == 200) {
          const nonCodeTitleList = panoramicData.value[0].orthTitleList.slice(0, 6)
          codeTitleList.value = res.data.slice(6, 20)
          const other = res.data.slice(20)
          panoramicData.value[0].orthTitleList = [
            ...nonCodeTitleList,
            ...codeTitleList.value,
            ...other
          ]
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

// 上传侧面微笑像并自动分类
const imgUrl = ref()
imgUrl.value = img

// 获取侧位片
const cephaImage = ref(null)
const cephaData = ref([])
function isChineseOrEnglish(char) {
  const pattern = /^[a-zA-Z]$/ // 匹配中文字符范围（\u4E00-\u9FFF）和英文字母（大小写）
  return pattern.test(char)
}
const cephaClassId = ref()
async function getOrthCephaList() {
  const result = await Get(`/prod-api/emr/orthCommon/list/2/侧位片/${appId}`)
  cephaClassId.value = result.data[0].id
  cephaData.value = result.data[0].orthTitleList
  cephaImage.value = result.data[0].imageUrl
  if (cephaData.value.some((i) => i.aiFlag == '0')) {
    pointMoved.value = true
  }
  // 如果有值就画图画点，只有图，那就不画点
  if (cephaImage.value) {
    if (cephaData.value.some((i) => i.cephalometricsContent)) {
      Get(`/prod-api/business/orthPoint/list/?apmtId=${appId}`).then((res) => {
        hasPoints.value = true
        allPoints.value = res.data
        filteredPoints.value = allPoints.value.filter((a) => pointsToFind.includes(a.pointName))
        coordinatesBase.value = filteredPoints.value.map((point) => ({
          label: point.pointName,
          x: point.xcoordinate,
          y: point.ycoordinate
        }))
        if (interruptSignal) {
          return
        }
        initCanvas(canvasMaxX.value, canvasMaxY.value, true)
      })
    } else {
      if (interruptSignal) {
        return
      }
      initCanvas(canvasMaxX.value, canvasMaxY.value, false)
    }
  }

  cephaData.value.forEach((title) => {
    if (isChineseOrEnglish(title.titleName[0])) {
      title.showInput = true
    }
    if (title.cephalometricsContent) {
      title.measured = true
    }
    const choosenOptions = title.orthOptionsList.filter((option) => option.choosen === true)
    if (choosenOptions.length > 0) {
      title.optionId = choosenOptions[0].id
    }
    title.AIValue = title.cephalometricsContent
    // inputVal用来回滚到上一次的有效值
    title.inputVal = title.cephalometricsContent
  })
}

async function imageUrlToBlob(imageUrl) {
  return fetch(imageUrl).then((response) => response.blob()) // 将响应内容转换为Blob
}

// 点击侧位片方法逻辑
const overlayRef = ref(null)
// 记录放大后的图片宽高比例
const w = ref(0)
const h = ref(0)
const initZoomCanvas = () => {
  const image = new Image() // 创建 img 元素
  const canvas = document.getElementById('myZoomCanvas')
  const ctx = canvas.getContext('2d')

  image.onload = function () {
    const imgWidth = image.width
    const imgHeight = image.height

    let width = imgWidth
    let height = imgHeight
    const maxWidth = window.innerWidth
    const maxHeight = window.innerHeight
    // 等比例缩放计算
    if (width > maxWidth) {
      width = maxWidth
      height = width / aspectRatio.value
    } else {
      image.width = window.innerWidth
      image.height = image.width / aspectRatio.value
      width = image.width
      height = image.height
    }

    if (height > maxHeight) {
      height = maxHeight
      width = height * aspectRatio.value
    } else {
      image.width = window.innerWidth
      image.height = image.width / aspectRatio.value
      width = image.width
      height = image.height
    }
    canvas.width = width
    w.value = canvas.width
    canvas.height = height
    h.value = canvas.height
    coordinatesLarge.value = coordinatesBase.value.map((point) => ({
      label: point.label,
      x: point.x * width,
      y: point.y * height
    }))
    drawPoints(ctx, image, canvas, true)
  }
  canvas.addEventListener('mousemove', (e) =>
    handleMouseMove(e, image, canvas, ctx, w.value, h.value)
  )
  canvas.addEventListener('mousedown', (e) => handleMouseDown(e, canvas))
  canvas.addEventListener('mouseup', handleMouseUp)
  const timestamp = new Date().getTime()
  image.src = `${cephaImage.value}` // 设置图片源地址
  overlayName.value = '侧位片'
}
const handleZoomPic = () => {
  overlayRef.value.style.display = 'flex'
  initZoomCanvas()
}
// 移动canvas点逻辑
const startLeft = ref(0)
const startTop = ref(0)
const afterLeft = ref(0)
const afterTop = ref(0)
const isMoving = ref(false)
const draggingPoint = ref(null)

function handleMouseDown(event, canvas) {
  draggingPoint.value = findPoint(event, canvas)
  startLeft.value = event.clientX
  startTop.value = event.clientY
}

function handleMouseUp(event) {
  isMoving.value = false
  draggingPoint.value = null
  afterLeft.value = event.clientX
  afterTop.value = event.clientY
}
let draggingPointX = ref(0)
let draggingPointY = ref(0)
const draggingPointLabel = ref()
const stopDraw = ref(true)
// 刚开始的时候null 应该就是不画的
function handleMouseMove(event, image, canvas, ctx, w, h) {
  const point = findPoint(event, canvas)
  if (point) {
    // ctx.fillStyle = 'white'
    // ctx.font = `20px Arial`
    // ctx.fillText(point.label, point.x + 5, point.y - 5)
    stopDraw.value = false
  } else {
    if (stopDraw.value) {
      return
    } else {
      initZoomCanvas()
      stopDraw.value = true
    }
  }
  pointMoved.value = true
  isMoving.value = true
  if (isMoving.value) {
    if (draggingPoint.value) {
      let mouseX = event.clientX - canvas.getBoundingClientRect().x
      let mouseY = event.clientY - canvas.getBoundingClientRect().y
      draggingPoint.value.x = mouseX
      draggingPoint.value.y = mouseY
      let point = coordinatesBase.value.find((point) => point.label == draggingPoint.value.label)
      point.x = mouseX / w
      point.y = mouseY / h
      draggingPointLabel.value = point.label
      draggingPointX.value = point.x
      draggingPointY.value = point.y
      const point1 = coordinatesLarge.value.find((p) => p.label == point.label)
      point1.x = point.x * w
      point1.y = point.y * h
      drawPoints(ctx, image, canvas, true)
      // 边移动边画点
      if (draggingPointLabel.value) {
        // ctx.fillStyle = 'white'
        // ctx.font = '20px Arial'
        // ctx.fillText(point.label, point1.x + 5, point1.y - 5)
      }
      pointRatio.forEach((label) => {
        if (point.label !== 'A' && point.label !== 'Me' && label.includes(point.label)) {
          let ratio = calculateDistanceRatio(label, coordinatesLarge.value)
          calculateSinglePoint(ratio, label, true)
        } else if (point.label == 'Me' && (label.includes('M') || label.includes('Me'))) {
          let ratio = calculateDistanceRatio(label, coordinatesLarge.value)
          calculateSinglePoint(ratio, label, true)
        }

        cephaData.value.forEach((title) => {
          if (title.titleName.includes(point.label)) {
            title.changeCoor = true
          }
          if (
            point.label == 'Me' &&
            (title.titleName.includes('M') || title.titleName.includes('Me'))
          ) {
            title.changeCoor = true
          }
        })
      })
      angleListWithThreePoints.forEach((label) => {
        if (point.label !== 'A' && point.label !== 'Me' && label.includes(point.label)) {
          let ratio = calculateThreePointsAngle(label, coordinatesLarge.value)
          calculateSinglePoint(ratio, label, true)
        } else if (point.label == 'Me' && (label.includes('M') || label.includes('Me'))) {
          let ratio = calculateThreePointsAngle(label, coordinatesLarge.value)
          calculateSinglePoint(ratio, label, true)
        } else if (point.label == 'A' && label.includes(point.label) && !label.includes('Ar')) {
          let ratio = calculateThreePointsAngle(label, coordinatesLarge.value)
          calculateSinglePoint(ratio, label, true)
        }
        cephaData.value.forEach((title) => {
          if (
            point.label == 'Me' &&
            (title.titleName.includes('M') || title.titleName.includes('Me'))
          ) {
            title.changeCoor = true
          } else if (
            point.label == 'A' &&
            title.titleName.includes('A') &&
            !title.titleName.includes('Ar')
          ) {
            title.changeCoor = true
          } else if (title.titleName.includes(point.label)) {
            title.changeCoor = true
          }
        })
      })
      angleListWithFourPoints.forEach((label) => {
        if (point.label !== 'A' && point.label !== 'Me' && label.includes(point.label)) {
          let ratio = calculateFourPointsAngle(label, coordinatesLarge.value)
          calculateSinglePoint(ratio, label, true)
        } else if (point.label == 'Me' && (label.includes('M') || label.includes('Me'))) {
          let ratio = calculateFourPointsAngle(label, coordinatesLarge.value)
          calculateSinglePoint(ratio, label, true)
        }
        cephaData.value.forEach((title) => {
          if (title.titleName.includes(point.label)) {
            title.changeCoor = true
          }
          if (
            point.label == 'Me' &&
            (title.titleName.includes('M') || title.titleName.includes('Me'))
          ) {
            title.changeCoor = true
          }
        })
      })
      if (['A', 'B', 'UI', 'LI', 'L6', 'U6'].includes(point.label)) {
        cephaData.value.forEach((title) => {
          if (title.titleName == 'Wits') {
            title.changeCoor = true
          }
        })
        const A = coordinatesLarge.value.find((item) => item.label == 'A')
        const B = coordinatesLarge.value.find((item) => item.label == 'B')
        const U1 = coordinatesLarge.value.find((item) => item.label == 'UI')
        const L1 = coordinatesLarge.value.find((item) => item.label == 'LI')
        const U6 = coordinatesLarge.value.find((item) => item.label == 'U6')
        const L6 = coordinatesLarge.value.find((item) => item.label == 'L6')
        const distance = calculateWits(A, B, U1, L1, U6, L6, w0.value, h0.value)
        calculateSinglePoint(distance, 'Wits', true)
      }
    }
  }
}

function findPoint(event, canvas) {
  const canvasX = canvas.getBoundingClientRect().x
  const canvasY = canvas.getBoundingClientRect().y
  const eventX = event.clientX
  const eventY = event.clientY

  // 遍历点坐标，检查是否在某个点上
  for (let i = 0; i < coordinatesLarge.value.length; i++) {
    let point = coordinatesLarge.value[i]
    let dx = eventX - canvasX - point.x
    let dy = eventY - canvasY - point.y
    let distance = Math.sqrt(dx * dx + dy * dy)
    if (distance <= 5) {
      // 判断是否在半径为5的圆内
      return point
    }
  }
  return null // 未找到点
}
// 记录放大前的图片宽高比例
const h0 = ref(0)
const w0 = ref(0)
const myCanvas = ref(null)
// 点击空白处可以取消canvas
const handleZoomOutCepha = (e) => {
  const zoomCanvas = document.querySelector('#myZoomCanvas')
  if (e.target !== zoomCanvas && !zoomCanvas.contains(e.target)) {
    handleZoomOutPic(true)
  }
}
const handleZoomOutPic = (fromBtn) => {
  // 判断是从全景片还是侧位片关闭的
  if (zoomPano.value) {
    overlayRef.value.style.display = 'none'
    zoomPano.value = false
    return
  } else {
    if (
      fromBtn === true ||
      !(startTop.value !== afterTop.value || startLeft.value !== afterLeft.value)
    ) {
      overlayRef.value.style.display = 'none'
      initCanvas(canvasMaxX.value, canvasMaxY.value, true)
      cephaData.value.forEach((item) => {
        // 更新值和选项
        if (draggingPointLabel.value !== 'Me' && draggingPointLabel.value !== 'A') {
          if (item.titleName.includes(draggingPointLabel.value)) {
            item.aiFlag = '0'
            let obj = {
              aptmId: appId,
              titleId: item.id,
              optionsIdStr: [],
              otherContent: '',
              cephalometricsContent: item.cephalometricsContent,
              fdiToothCode: '',
              showPosition: '',
              classId: cephaClassId.value,
              owningModule: '侧位片'
            }
            Post('/prod-api/emr/orthPlan/addOrthInspectResult', obj).then((res) => {
              if (res.code == 200 && res.data.optionsId) {
                item.optionId = res.data.optionsId
                let obj1 = {
                  aptmId: appId,
                  titleId: item.id,
                  optionsIdStr: [res.data.optionsId],
                  otherContent: '',
                  cephalometricsContent: '',
                  fdiToothCode: '',
                  showPosition: '',
                  classId: cephaClassId.value,
                  owningModule: '侧位片'
                }
                Post('/prod-api/emr/orthPlan/addOrthInspectResult', obj1)
              }
            })
          }
        } else if (
          draggingPointLabel.value == 'Me' &&
          (item.titleName.includes('M') || item.titleName.includes('Me'))
        ) {
          item.aiFlag = '0'
          let obj = {
            aptmId: appId,
            titleId: item.id,
            optionsIdStr: [],
            otherContent: '',
            cephalometricsContent: item.cephalometricsContent,
            fdiToothCode: '',
            showPosition: '',
            classId: cephaClassId.value,
            owningModule: '侧位片'
          }
          Post('/prod-api/emr/orthPlan/addOrthInspectResult', obj).then((res) => {
            if (res.code == 200) {
              item.optionId = res.data.optionsId
              let obj1 = {
                aptmId: appId,
                titleId: item.id,
                optionsIdStr: [res.data.optionsId],
                otherContent: '',
                cephalometricsContent: '',
                fdiToothCode: '',
                showPosition: '',
                classId: cephaClassId.value,
                owningModule: '侧位片'
              }
              Post('/prod-api/emr/orthPlan/addOrthInspectResult', obj1)
            }
          })
        } else if (
          draggingPointLabel.value == 'A' &&
          ((item.titleName.includes('A') && item.titleName.length == 3) || item.titleName == 'Wits')
        ) {
          item.aiFlag = '0'
          let obj = {
            aptmId: appId,
            titleId: item.id,
            optionsIdStr: [],
            otherContent: '',
            cephalometricsContent: item.cephalometricsContent,
            fdiToothCode: '',
            showPosition: '',
            classId: cephaClassId.value,
            owningModule: '侧位片'
          }
          Post('/prod-api/emr/orthPlan/addOrthInspectResult', obj).then((res) => {
            if (res.code == 200 && res.data.optionsId) {
              item.optionId = res.data.optionsId
              let obj1 = {
                aptmId: appId,
                titleId: item.id,
                optionsIdStr: [res.data.optionsId],
                otherContent: '',
                cephalometricsContent: '',
                fdiToothCode: '',
                showPosition: '',
                classId: cephaClassId.value,
                owningModule: '侧位片'
              }
              Post('/prod-api/emr/orthPlan/addOrthInspectResult', obj1)
            }
          })
        }
      })
      // 更新单个点的坐标
      Put('/prod-api/business/orthPoint', {
        apmtId: appId,
        pointName: draggingPointLabel.value,
        xCoordinate: draggingPointX.value,
        yCoordinate: draggingPointY.value
      })
      const list = cephaData.value
        .filter((title) => title.changeCoor === true)
        .map((title) => ({
          titleId: title.id,
          aiType: 1
        }))
      // 是坐标引起的变化
      Post('/prod-api/business/optionsResult/updateAIType', {
        apmtId: appId,
        cephalometricsList: list
      })
    }
  }
}
// 根据url获取点坐标
const allPoints = ref([])
const coordinatesSmall = ref([])
const coordinatesLarge = ref([])
const coordinatesBase = ref([])
const filteredPoints = ref([])
const pointsToFind = [
  'A',
  'N',
  'B',
  'Or',
  'Po',
  'Go',
  'Go_1',
  'UI',
  'UI_1',
  'S',
  'P',
  'Go`',
  'Me',
  'Ar',
  'LI',
  'LI_1',
  'Ratio1',
  'Ratio2',
  'U6',
  'L6',
  'Gn',
  'ANS',
  'PNS'
]
// const pointsToFind = [
//   'C',
//   'Stoms',
//   'UL',
//   'UL`',
//   'Ls',
//   'LL',
//   'LL`',
//   'Stomi',
//   'Li',
//   'Ba',
//   'BL1',
//   'D`',
//   'BL2',
//   'LPW',
//   'MPW',
//   'Go',
//   'Go`',
//   'TPPW',
//   'PNS',
//   'UPW',
//   'TB',
//   'B',
//   'AD',
//   'AD2',
//   'A',
//   'ANS',
//   'S',
//   'A`',
//   'Ar',
//   'B`',
//   'Cm',
//   'Co',
//   'G',
//   'GST',
//   'Gn',
//   'Go_1',
//   'MP_2',
//   'Gs',
//   'Id',
//   'Id_1',
//   'L6',
//   'LI',
//   'LI_1',
//   'MBN',
//   'N',
//   'Me',
//   'MP_1',
//   'R1',
//   'Mes',
//   'Ns',
//   'Or',
//   'P',
//   'PBM',
//   'Pcd',
//   'Po',
//   'Pos',
//   'Pr',
//   'Pr_1',
//   'Prn',
//   'Pt',
//   'Ptm',
//   'R',
//   'R3',
//   'Ratio1',
//   'Ratio2',
//   'Sn',
//   'U',
//   'U6',
//   'UI',
//   'UI_1',
//   'V',
//   'PBT'
// ]
let ratio1
let ratio2
let standardDistance
async function getPoints(file) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('mobile', '13014532111')
  const token = await getToken()
  if (token) {
    const res = await Post1('/bonceph/platform/marker/predict', formData, true, token)
    if (res.code == 200) {
      allPoints.value = res.data
      filteredPoints.value = allPoints.value.filter((a) => pointsToFind.includes(a[0]))
      coordinatesBase.value = filteredPoints.value.map((point) => ({
        label: point[0],
        x: point[1],
        y: point[2]
      }))
      ratio1 = coordinatesBase.value.find((item) => item.label == 'Ratio1')
      ratio2 = coordinatesBase.value.find((item) => item.label == 'Ratio2')
      standardDistance = calculateDistanceEffect(ratio1, ratio2)
    }
  }
}
// async function getPoints(file) {
//   const formData = new FormData()
//   formData.append('file', file)
//   formData.append('mobile', '13014532111')
//   const token = await getToken()

//   if (token) {
//     const res = await axios({
//       url: 'http://47.101.150.34:8177/bonceph/platform/marker/predict',
//       method: 'post',
//       data: formData,
//       headers: {
//         Authorization: `${token}`,
//         'content-type': 'multipart/form-data'
//       }
//     })
//     if (res.status == 200) {
//       allPoints.value = res.data.data
//       filteredPoints.value = allPoints.value.filter((a) => pointsToFind.includes(a[0]))
//       coordinatesBase.value = filteredPoints.value.map((point) => ({
//         label: point[0],
//         x: point[1],
//         y: point[2]
//       }))
//       ratio1 = coordinatesBase.value.find((item) => item.label == 'Ratio1')
//       ratio2 = coordinatesBase.value.find((item) => item.label == 'Ratio2')
//       standardDistance = calculateDistanceEffect(ratio1, ratio2)
//       console.log('🚀 ~ getPoints ~ standardDistance:', standardDistance)
//     }
//   }
// }
// AI测量逻辑

const pointMoved = ref(false)
// 悬浮划线
function findIntersectionPoint(x1, y1, x2, y2, x3, y3, x4, y4) {
  const denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1)

  // 判断两线是否平行，如果denominator为0，则平行
  if (denominator === 0) {
    return null
  }

  const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator
  // const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;

  // 计算交点坐标，无需验证是否在两条线段之间
  const intersectionX = x1 + ua * (x2 - x1)
  const intersectionY = y1 + ua * (y2 - y1)
  return { x: intersectionX, y: intersectionY }
}
const drawSeparateFourPointsLine = (ctx, p1, p2, p3, p4) => {
  ctx.beginPath()
  ctx.moveTo(p1.x, p1.y)
  ctx.lineTo(p2.x, p2.y)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(p3.x, p3.y)
  ctx.lineTo(p4.x, p4.y)
  ctx.stroke()
}
const drawFourPointsLine = (ctx, p1, p2, p3, p4) => {
  const intersection = findIntersectionPoint(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, p4.x, p4.y)
  ctx.beginPath()
  ctx.moveTo(p1.x, p1.y)
  ctx.lineTo(p2.x, p2.y)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(p3.x, p3.y)
  ctx.lineTo(p4.x, p4.y)
  ctx.stroke()
  drawDashedLine(p1, intersection, p3)
}
const drawThreePointsLine = (ctx, p1, p2, p3) => {
  ctx.beginPath()
  ctx.moveTo(p1.x, p1.y)
  ctx.lineTo(p2.x, p2.y)
  ctx.lineTo(p3.x, p3.y)
  ctx.stroke()
}
function findNearestPointOnLine(start, end, point) {
  const lineVector = { x: end.x - start.x, y: end.y - start.y }
  const pointVector = { x: point.x - start.x, y: point.y - start.y }
  const lineLength = Math.sqrt(lineVector.x ** 2 + lineVector.y ** 2)
  const dotProduct = (pointVector.x * lineVector.x + pointVector.y * lineVector.y) / lineLength ** 2

  const nearestPoint = {
    x: start.x + dotProduct * lineVector.x,
    y: start.y + dotProduct * lineVector.y
  }

  return nearestPoint
}
const showLine = (label) => {
  if (hasPoints.value) {
    const canvas = document.getElementById('myCanvas')
    const ctx = canvas.getContext('2d')
    ctx.lineWidth = 1.5
    ctx.save()
    ctx.strokeStyle = 'blue'
    let arr = []
    let p1, p2, p3, p4
    if (['颈椎分期', '腺样体', '扁桃体'].includes(label)) {
      return
    }
    if (['S-Go/N-Me', 'S-N/Go`-Me'].includes(label)) {
      arr = label.split('/').map((a) => a.split('-'))
      p1 = coordinatesSmall.value.find((item) => item.label == arr[0][0])
      p2 = coordinatesSmall.value.find((item) => item.label == arr[0][1])
      p3 = coordinatesSmall.value.find((item) => item.label == arr[1][0])
      p4 = coordinatesSmall.value.find((item) => item.label == arr[1][1])
      drawSeparateFourPointsLine(ctx, p1, p2, p3, p4)
    } else if (label.includes('-')) {
      arr = label.split('-').filter((a) => a !== '-')
      if (arr.length == 2) {
        if (label === 'L1-MP') {
          p1 = coordinatesSmall.value.find((item) => item.label == 'LI_1')
          p2 = coordinatesSmall.value.find((item) => item.label == 'LI')
          p3 = coordinatesSmall.value.find((item) => item.label == 'Go_1')
          p4 = coordinatesSmall.value.find((item) => item.label == 'Me')
          drawFourPointsLine(ctx, p1, p2, p3, p4)
        }
        if (label === 'SN-MP') {
          p1 = coordinatesSmall.value.find((item) => item.label == 'S')
          p2 = coordinatesSmall.value.find((item) => item.label == 'N')
          p3 = coordinatesSmall.value.find((item) => item.label == 'Go_1')
          p4 = coordinatesSmall.value.find((item) => item.label == 'Me')
          drawFourPointsLine(ctx, p1, p2, p3, p4)
        }
        if (label === 'U1-SN') {
          p1 = coordinatesSmall.value.find((item) => item.label == 'UI_1')
          p2 = coordinatesSmall.value.find((item) => item.label == 'UI')
          p3 = coordinatesSmall.value.find((item) => item.label == 'S')
          p4 = coordinatesSmall.value.find((item) => item.label == 'N')
          drawFourPointsLine(ctx, p1, p2, p3, p4)
        }
        if (label === 'FH-MP') {
          p1 = coordinatesSmall.value.find((item) => item.label == 'P')
          p2 = coordinatesSmall.value.find((item) => item.label == 'Or')
          p3 = coordinatesSmall.value.find((item) => item.label == 'Go_1')
          p4 = coordinatesSmall.value.find((item) => item.label == 'Me')
          drawFourPointsLine(ctx, p1, p2, p3, p4)
        }
      } else if (arr.length == 3) {
        if (arr[0] == 'Na') {
          p1 = coordinatesSmall.value.find((item) => item.label == 'N')
          p2 = coordinatesSmall.value.find((item) => item.label == arr[1])
          p3 = coordinatesSmall.value.find((item) => item.label == arr[2])
          drawThreePointsLine(ctx, p1, p2, p3)
        } else {
          p1 = coordinatesSmall.value.find((item) => item.label == arr[0])
          p2 = coordinatesSmall.value.find((item) => item.label == arr[1])
          p3 = coordinatesSmall.value.find((item) => item.label == arr[2])
          drawThreePointsLine(ctx, p1, p2, p3)
        }
      }
    } else if (label == 'Wits') {
      const A = coordinatesSmall.value.find((item) => item.label == 'A')
      const B = coordinatesSmall.value.find((item) => item.label == 'B')
      const U1 = coordinatesSmall.value.find((item) => item.label == 'UI')
      const L1 = coordinatesSmall.value.find((item) => item.label == 'LI')
      const U6 = coordinatesSmall.value.find((item) => item.label == 'U6')
      const L6 = coordinatesSmall.value.find((item) => item.label == 'L6')
      const M_U6L6 = {
        x: (U6.x + L6.x) / 2,
        y: (U6.y + L6.y) / 2
      }

      // 计算U1L1的中点坐标
      const M_U1L1 = {
        x: (U1.x + L1.x) / 2,
        y: (U1.y + L1.y) / 2
      }
      const nearestPointOnLine1 = findNearestPointOnLine(M_U1L1, M_U6L6, A)
      const nearestPointOnLine2 = findNearestPointOnLine(M_U1L1, M_U6L6, B)
      // // 绘制U6L6和U1L1中点之间的实线连接
      ctx.beginPath()
      ctx.moveTo(M_U6L6.x, M_U6L6.y)
      ctx.lineTo(M_U1L1.x, M_U1L1.y)
      ctx.strokeStyle = 'blue'
      ctx.stroke()

      // 绘制垂线
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      ctx.moveTo(A.x, A.y)
      ctx.lineTo(nearestPointOnLine1.x, nearestPointOnLine1.y)
      ctx.strokeStyle = 'blue'
      ctx.stroke()

      ctx.setLineDash([5, 5])
      ctx.beginPath()
      ctx.moveTo(B.x, B.y)
      ctx.lineTo(nearestPointOnLine2.x, nearestPointOnLine2.y)
      ctx.strokeStyle = 'blue'
      ctx.stroke()
    } else if (label == 'ODI') {
      p1 = coordinatesSmall.value.find((item) => item.label == 'A')
      p2 = coordinatesSmall.value.find((item) => item.label == 'B')
      p3 = coordinatesSmall.value.find((item) => item.label == 'Go')
      p4 = coordinatesSmall.value.find((item) => item.label == 'Gn')
      drawFourPointsLine(ctx, p1, p2, p3, p4)
      // drawODI()
    } else if (label == 'APDI') {
      // drawAPDI()
      p1 = coordinatesSmall.value.find((item) => item.label == 'A')
      p2 = coordinatesSmall.value.find((item) => item.label == 'B')
      p3 = coordinatesSmall.value.find((item) => item.label == 'Go')
      p4 = coordinatesSmall.value.find((item) => item.label == 'Gn')
      drawFourPointsLine(ctx, p1, p2, p3, p4)
    } else {
      arr = label.split('')
      p1 = coordinatesSmall.value.find((item) => item.label == arr[0])
      p2 = coordinatesSmall.value.find((item) => item.label == arr[1])
      p3 = coordinatesSmall.value.find((item) => item.label == arr[2])
      ctx.beginPath()
      ctx.moveTo(p1.x, p1.y)
      ctx.lineTo(p2.x, p2.y)
      ctx.lineTo(p3.x, p3.y)
      ctx.stroke()
    }
  }
}
function drawDashedLine(p1, intersection, p3) {
  const canvas = document.getElementById('myCanvas')
  const ctx = canvas.getContext('2d')
  ctx.setLineDash([5, 5]) // 设置虚线样式（5个像素实线，5个像素空白）
  ctx.beginPath()

  ctx.moveTo(p1.x, p1.y)
  ctx.lineTo(intersection.x, intersection.y)
  ctx.lineTo(p3.x, p3.y)
  ctx.stroke()
  // ctx.setLineDash([]) // 重置虚线样式，绘制实线
}
const hideLine = () => {
  if (hasPoints.value) {
    initCanvas(canvasMaxX.value, canvasMaxY.value, true)
  }
}

const imgDialogVisible = ref(false)
const title = ref()
const handleOpenImageDialogue = (caption) => {
  imgDialogVisible.value = true
  // reminder是提醒从这个跳进去的
  title.value = caption
}
const handleDblClick = () => {
  console.log(33)
}
async function getImageList() {
  if (imageArr.value.length !== 0) {
    return
  } else {
    Get(`/prod-api/business/orthImage/imageList?patientId=${patientId}`).then((res) => {
      totalArr.value = res.data
      if (res.data.find((a) => a.imageList.length !== 0)) {
        imageArr.value[0] = res.data.find((a) => a.imageList.length !== 0)

        index.value = res.data.findIndex((a) => a.imageList.length !== 0)
        imageArr.value[0].imageList.forEach((img) => {
          img.imgUrl = img.fileUrl
          img.choose = false
        })
      }
    })
  }
}
async function getClassifiedImgList() {
  const res = await Get(`/prod-api/business/orthImage/list?apmtId=${appId}`)
  if (res.code == 200 && res.data.length > 0) {
    res.data.forEach((item) => {
      imageList.value.forEach((a) => {
        // a.fileUrl = placeholderUrl
        if (item.imageType == a.caption) {
          a.fileUrl = item.imageUrl
          a.id = item.id
        }
      })
    })
  } else {
    imageList.value.forEach((a) => {
      a.fileUrl = placeholderUrl
    })
  }
}

const angleListWithThreePoints = [
  'ANB',
  'Ar-Go`-Me',
  'Ar-Go`-N',
  'Na-Go`-Me',
  'S-Ar-Go`',
  'Na-S-Ar',
  'SNA',
  'SNB'
]
const pointRatio = ['S-Go/N-Me', 'S-N/Go`-Me']

const angleListWithFourPoints = ['U1-SN', 'SN-MP', 'L1-MP', 'FH-MP']
// const distanceList = ['S-N', 'Go`-Me']
function calculateSinglePoint(ratio, item, changed) {
  const foundPoint = cephaData.value.find((a) => a.titleName == item)
  foundPoint.cephalometricsContent = ratio.toFixed(2)
  foundPoint.inputVal = foundPoint.cephalometricsContent
  foundPoint.AIValue = foundPoint.cephalometricsContent
  if (changed) {
    foundPoint.aiFlag = '0'
  } else {
    foundPoint.aiFlag = '1'
  }
}

function calculateAllPoints() {
  pointRatio.forEach((item) => {
    let ratio = calculateDistanceRatio(item, coordinatesSmall.value)
    calculateSinglePoint(ratio, item, false)
  })
  angleListWithThreePoints.forEach((item) => {
    let angle = calculateThreePointsAngle(item, coordinatesSmall.value)
    calculateSinglePoint(angle, item, false)
  })
  angleListWithFourPoints.forEach((item) => {
    let angle = calculateFourPointsAngle(item, coordinatesSmall.value)
    calculateSinglePoint(angle, item, false)
  })
  // const ODI = calculateODI(coordinatesSmall.value);
  // console.log(ODI);
  // calculateAPDI()
  coordinatesBase.value = coordinatesBase.value.map((point) => ({
    label: point.label,
    x: point.x * 1,
    y: point.y * 1
  }))
  const A = coordinatesBase.value.find((item) => item.label == 'A')
  const B = coordinatesBase.value.find((item) => item.label == 'B')
  const U1 = coordinatesBase.value.find((item) => item.label == 'UI')
  const L1 = coordinatesBase.value.find((item) => item.label == 'LI')
  const U6 = coordinatesBase.value.find((item) => item.label == 'U6')
  const L6 = coordinatesBase.value.find((item) => item.label == 'L6')

  const distance = calculateWits(A, B, U1, L1, U6, L6, standardDistance)
  calculateSinglePoint(distance, 'Wits', false)
}
async function updateResult() {
  console.log(cephaData.value)
  // post值和选项
  cephaData.value.forEach((item) => {
    if (!['颈椎分期', '腺样体', '扁桃体'].includes(item.titleName)) {
      item.measured = true
      let obj = {
        aptmId: appId,
        titleId: item.id,
        optionsIdStr: [],
        otherContent: '',
        cephalometricsContent: item.cephalometricsContent,
        fdiToothCode: '',
        showPosition: '',
        aiFlag: '1',
        classId: cephaClassId.value,
        owningModule: '侧位片'
      }
      Post('/prod-api/emr/orthPlan/addOrthInspectResult', obj).then((res) => {
        // 返回的有optionsId的时候再调用选项的接口
        if (res.code == 200 && res.data.optionsId) {
          item.optionId = res.data.optionsId
          let obj1 = {
            aptmId: appId,
            titleId: item.id,
            optionsIdStr: [res.data.optionsId],
            otherContent: '',
            cephalometricsContent: '',
            fdiToothCode: '',
            showPosition: '',
            classId: cephaClassId.value,
            owningModule: '侧位片'
          }
          Post('/prod-api/emr/orthPlan/addOrthInspectResult', obj1)
        }
      })
    }
  })
  Post('/prod-api/business/orthPoint', {
    apmtId: appId,
    pointList: coordinatesBase.value.map((c) => [c['label'], c['x'], c['y']])
  })
}
const hasPoints = ref(false)
function afterGetPoint() {
  initCanvas(canvasMaxX.value, canvasMaxY.value, true)
  calculateAllPoints()
  updateResult()
  // if (pointMoved.value) {
  //   Get(`/prod-api/emr/orthCommon/list/2/侧位片/${appId}`).then((res) => {
  //     res.data[0].orthTitleList.forEach((a) => {
  //       cephaData.value.forEach((title) => {
  //         if (a.titleName == title.titleName) {
  //           title.aiFlag = a.aiFlag
  //         }
  //       })
  //     })
  //   })
  // } else {

  cephaData.value.forEach((title) => (title.aiFlag = '1'))
  //}
  loading.value = false
}
const loadingTarget = ref(null)
async function getAIResult() {
  try {
    const loading = ElLoading.service({
      lock: true,
      text: '正在计算中',
      background: 'rgba(255, 255, 255, 0.66);',
      target: loadingTarget.value
    })
    if (cephaImage.value) {
      loading.value = true
      const timestamp = new Date().getTime()
      imageUrlToBlob(`${cephaImage.value}?t=${timestamp}`)
        .then((blob) => {
          getPoints(blob)
            .then(() => {
              hasPoints.value = true
              coordinatesSmall.value = coordinatesBase.value.map((point) => ({
                label: point.label,
                x: point.x * w0.value,
                y: point.y * h0.value
              }))
              loading.close()
              afterGetPoint()
            })
            .catch((err) => {
              loading.close()
              ElMessage({
                message: err,
                type: 'warning'
              })
            })
        })
        .catch((error) => {
          loading.close()
          ElMessage({
            message: error,
            type: 'warning'
          })
        })
    }
  } catch (error) {
    ElMessage({
      message: error,
      type: 'warning'
    })
  }
}
// 画出曲线轮廓
function drawFaceContour(ctx, points) {
  ctx.beginPath()
  ctx.moveTo(points[0].x, points[0].y)
  ctx.fillStyle = 'orange'
  for (let i = 1; i < points.length - 2; i += 2) {
    const xc = (points[i].x + points[i + 1].x) / 2
    const yc = (points[i].y + points[i + 1].y) / 2
    ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc)
  }

  // 最后两个点做为曲线的终点
  ctx.quadraticCurveTo(
    points[points.length - 2].x,
    points[points.length - 2].y,
    points[points.length - 1].x,
    points[points.length - 1].y
  )

  // 设置样式
  ctx.lineWidth = 1
  // 可选，添加填充颜色

  // 绘制轮廓线
  ctx.strokeStyle = 'orange'
  ctx.stroke()
  // ctx.fill()

  // 标记每个点
  // for (let i = 0; i < points.length; i++) {
  //   ctx.beginPath()
  //   ctx.arc(points[i].x, points[i].y, 1, 0, 2 * Math.PI, false)
  //   ctx.fill()
  //   ctx.stroke()
  // }
}
const faceList1 = ['GST', 'Ns', 'MBN', 'Prn', 'Cm', 'Sn', 'UL']
function drawPoints(ctx, image, canvas, zoom) {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
  if (zoom) {
    coordinatesLarge.value.forEach(function (coordinate) {
      const x = coordinate.x
      const y = coordinate.y
      const label = coordinate.label

      // 绘制圆形点
      ctx.beginPath()
      ctx.arc(x, y, 3, 0, 2 * Math.PI)
      ctx.fillStyle = 'red'
      // ctx.fillStyle = 'white'
      ctx.fill()
      ctx.fillText(coordinate.label, x - 5, y - 5)
      ctx.font = '12px Arial'
      // 绘制字体
      // if (draggingPointLabel.value) {
      //   ctx.fillStyle = 'white'
      //   ctx.font = '20px Arial'
      //   ctx.fillText(draggingPointLabel.value, x + 5, y - 5)
      // }
    })
  } else {
    coordinatesSmall.value.forEach(function (coordinate) {
      const x = coordinate.x
      const y = coordinate.y
      // const label = coordinate.label

      // 绘制圆形点
      ctx.beginPath()
      ctx.arc(x, y, 2, 0, 2 * Math.PI)
      ctx.fillStyle = 'red'
      ctx.fill()
      // 绘制字体
      ctx.fillStyle = 'white'
      ctx.font = '20px Arial'

      // ctx.fillText(coordinate.label, x + 5, y - 5)
    })
  }
}
// 暂时没用到
// let Ratio1 = ref()
// let Ratio2 = ref()
// let standardVal = ref()
// 画点放在里面也可以，因为刚进来没有点坐标也不会画
let aspectRatio = ref(0)
function initCanvas(maxWidth, maxHeight, draw) {
  const image = new Image() // 创建 img 元素
  const canvas = document.getElementById('myCanvas')
  const ctx = canvas.getContext('2d')

  image.onload = function () {
    // 执行 drawImage 语句
    const imgWidth = image.width
    const imgHeight = image.height

    let width = imgWidth
    let height = imgHeight
    aspectRatio.value = imgWidth / imgHeight
    // 等比例缩放计算
    if (width > maxWidth) {
      width = maxWidth
      height = width / aspectRatio.value
    }

    if (height > maxHeight) {
      height = maxHeight
      width = height * aspectRatio.value
    }
    canvas.width = width
    w0.value = width
    canvasMaxX.value = width
    canvas.height = height
    h0.value = height
    canvasMaxY.value = height
    coordinatesSmall.value = coordinatesBase.value.map((point) => ({
      label: point.label,
      x: point.x * w0.value,
      y: point.y * h0.value
    }))

    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    // 在画布上绘制缩小后的图片
    ctx.drawImage(image, 0, 0, width, height)
    if (draw) {
      drawPoints(ctx, image, canvas, false)
      let list = faceList1.map((item) => {
        coordinatesSmall.value.filter((point) => {
          if (point.label === item) {
            return point
          }
        })
      })
      const labelToDataMap = coordinatesSmall.value.reduce((acc, item) => {
        acc[item.label] = item
        return acc
      }, {})
      const faceTourList1 = faceList1.map((label) => labelToDataMap[label])

      // drawFaceContour(ctx, faceTourList1)
    }
  }
  const timestamp = new Date().getTime()
  image.crossOrigin = 'anonymous'
  image.src = `${cephaImage.value}?t=${timestamp}` // 设置图片源地址
}

onMounted(() => {
  watch(coordinatesBase.value, (newVal) => {
    if (newVal && pointMoved.value) {
      getAIResult()
    }
  })
})

// 上传数据调用接口
const handleChangeOption = async (optionId, title, classId, owningModule, className) => {
  if (props.pdfId) {
    sessionStorage.removeItem(props.pdfId)
  }
  if (title.titleName == '侧貌') {
    const found = faceAccessData.value.find((item) => item.className == '90度侧面像')
    if (title.orthOptionsList.find((a) => optionId == a.id).optionName == '凸面型') {
      const title2 = savedTitleList.value.find((title) => title.titleName == '凹面型表现')
      const choosen2 = title2.orthOptionsList.some((option) => option.choosen === true)
      if (choosen2) {
        await useUpdateOption(null, title2, appId, classId, owningModule)
      }
      found.orthTitleList = savedTitleList.value.filter((t) => !t.titleName.includes('凹'))
      title2.orthOptionsList.forEach((option) => (option.choosen = false))
      title2.optionId = []
    } else if (title.orthOptionsList.find((a) => optionId == a.id).optionName == '凹面型') {
      const title1 = savedTitleList.value.find((title) => title.titleName == '凸面型表现')
      const choosen1 = title1.orthOptionsList.some((option) => option.choosen === true)
      if (choosen1) {
        await useUpdateOption(null, title1, appId, classId, owningModule)
      }
      found.orthTitleList = savedTitleList.value.filter((t) => !t.titleName.includes('凸'))
      title1.optionId = []
      title1.orthOptionsList.forEach((option) => (option.choosen = false))
    } else if (title.orthOptionsList.find((a) => optionId == a.id).optionName == '直面型') {
      found.orthTitleList = savedTitleList.value.filter(
        (t) => !t.titleName.includes('凸') && !t.titleName.includes('凹')
      )
      const title1 = savedTitleList.value.find((title) => title.titleName == '凸面型表现')
      const choosen1 = title1.orthOptionsList.some((option) => option.choosen === true)
      const title2 = savedTitleList.value.find((title) => title.titleName == '凹面型表现')
      const choosen2 = title2.orthOptionsList.some((option) => option.choosen === true)
      const title3 = savedTitleList.value.find((title) => title.titleName == '侧貌')
      if (choosen1) {
        await useUpdateOption(null, title1, appId, classId, owningModule)
      }
      if (choosen2) {
        await useUpdateOption(null, title2, appId, classId, owningModule)
      }
      await useUpdateOption(optionId, title3, appId, classId, owningModule)
      title1.optionId = []
      title2.optionId = []
      //  点击完直面型需要重新请求接口
      getOrthFaceAccessList()
      return
    }
    // getOrthFaceAccessList()
  }

  if (className == '侧位片') {
    title.aiFlag = '0'
    Post('/prod-api/business/optionsResult/updateAIType', {
      apmtId: appId,
      cephalometricsList: [
        {
          titleId: title.id,
          aiType: 3
        }
      ]
    })
  }
  useChangeOption(optionId, title, appId, classId, owningModule)
  useUpdateOption(title.optionId, title, appId, classId, owningModule)
}

// const handleSubmitTooth = (title) => {
//   if (!title.submitAble) {
//     return
//   }

//   let obj = {
//     apmtId: appId,
//     titleId: title.id,
//     optionsIdStr: [],
//     otherContent: '',
//     cephalometricsContent: '',
//     fdiToothCode: title.toothCode.join(),
//     showPosition: JSON.stringify(title.position)
//   }
//   Post('/prod-api/emr/orthPlan/addOrthInspectResult', obj).then(() => {
//     title.submitAble = false
//   })
// }
const handleSubmit = (optionId, title, classId, owningModule) => {
  console.log(
    '🚀 ~ handleSubmit ~ optionId, title, classId, owningModule:',
    optionId,
    title,
    classId,
    owningModule
  )

  useUpdateOption(optionId, title, appId, classId, owningModule)
}
async function handleEmptyRadio(optionId, title, classId, owningModule) {
  if (
    title.orthOptionsList.some((option) => option.choosen == true) &&
    title.type == 1 &&
    title.optionId == optionId
  ) {
    emptyRadio(optionId, title)
    useUpdateOption(null, title, appId, classId, owningModule)
    if (owningModule == '面型评估') {
      getOrthFaceAccessList()
    } else if (owningModule == '口内照') {
      getOrthMouthList()
    } else if (owningModule == '全景片') {
      getOrthPanoramicList()
    } else if (owningModule == '侧位片') {
      getOrthCephaList()
    }
    // 重新请求数据
  }
}
</script>
<style>
.el-dialog {
  border-radius: 12px;
}
/* .el-dialog__body {
  padding: 0;
} */
.el-dialog__body {
  padding-top: 10px;
  padding-bottom: 10px;
}
.el-input.measured .el-input__wrapper {
  box-shadow: none;
}
.el-input.measured .el-input__wrapper:hover {
  box-shadow: 0 0 0 1px #dcdfe6;
}
div.el-input__wrapper {
  width: 100%;
}
</style>
<style lang="scss" scoped>
:deep(.el-input.blue) {
  .el-input__inner {
    color: #2e6ce4;
  }
}
:deep(.el-input.red) {
  .el-input__inner {
    color: #f65b56;
  }
}
img {
  &:hover {
    cursor: zoom-in;
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
.imageItem {
  width: auto;
  box-sizing: border-box;
  border-bottom: 1.4px dashed #e5e6eb;
  height: auto !important;
  padding-bottom: 36px !important;
}
.formItem__content {
  flex: 1;
  display: inline-flex;
  margin-left: 12px;
  align-items: center;
}
.formItem {
  * {
    box-sizing: border-box;
  }
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  &__label {
    flex: 0 0 auto;
    padding-right: 4px;
    min-width: 50px;
    color: #4e5969;
    text-align: right;
    width: 120px;
    img {
      margin-left: 3px;
    }
  }
  &__content {
    flex: 1;
    display: flex;
    margin-left: 12px;
    input {
      width: 100px;
      height: 32px;
      opacity: 1;

      /* 自动布局 */
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 8px 12px;
      gap: 5px;
      flex-grow: 1;
      align-self: stretch;
    }
  }
}
.measurement {
  width: 86px;
  display: inline-flex;
  align-items: center;
  .bubble {
    position: relative;
    top: -8px;
    right: -4px;
  }
}
.imageItem.removeBorder {
  border: none;
  padding-bottom: 0 !important;
}

.placeholderContainer {
  display: flex;
  padding-top: 20px;
  border-bottom: 1px dashed #e5e6eb;

  .imageItem__placeholder {
    position: relative;
    .addPicCaption {
      position: absolute;
      color: #4e5969;
      top: 248px;
      left: 50%;
      transform: translate(-50%, 0);
    }
  }

  .imageItem__content.cephalometric {
    padding-left: 0;
    .hide {
      opacity: 0;
    }
  }
}

.overlay {
  position: fixed;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100%;
  opacity: 1;
  z-index: 10;
  /* 自动布局 */
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.86);
  display: none;

  &__header {
    position: absolute;
    top: 10px;
    color: #ffffff;
    left: 10px;
    font-weight: bold;
    font-size: 16px;
  }
}
.dragging {
  opacity: 0.5;
}
.diagramWrapper {
  width: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  .diagram {
    position: relative;
    .diagramBox {
      width: 122px;
      height: 30px;
      display: flex;
      div {
        height: 30px;
        width: 61px;
        display: flex;
        align-items: center;
        padding: 4px;
        box-sizing: border-box;
      }
      &:nth-child(1) {
        border-bottom: 1px solid #d8d8d8;
        > div:nth-child(1) {
          border-right: 1px solid #d8d8d8;
          justify-content: end;
        }
      }
      &:nth-child(2) {
        > div:nth-child(1) {
          border-right: 1px solid #d8d8d8;
          justify-content: end;
        }
      }
    }
  }
}
.selectContainer {
  .container {
    display: grid;
    grid-template-columns: auto auto;
    .symptomBox {
      display: flex;
      .symptomItem {
        width: 24px;
        height: 24px;
        /* border: solid 1px #ccc; */
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 2px 2px;
        cursor: pointer;
        border: 0.5px solid #e9e9eb;
        box-sizing: border-box;
        &.selected {
          background-color: #0081cc;
          border-color: #0081cc;
          color: #fff;
        }
      }

      &.marginTop {
        margin-top: 16px;
      }
      &.marginBottom {
        margin-bottom: 16px;
      }
      &.marginRight {
        margin-right: 12px;
      }
      &.marginLeft {
        margin-left: 12px;
      }
      &.itemAlignRight {
        justify-content: end;
      }
    }
  }
  &:after {
    content: '';
    position: absolute;
    width: 1px;
    height: 138px;
    left: 247px;
    top: 16px;
    background: #d8d8d8;
  }
  &:before {
    content: '';
    position: absolute;
    width: 465px;
    height: 1px;
    left: 20px;
    top: 82px;
    background: #d8d8d8;
  }
  .left {
    position: absolute;
    width: 26px;
    height: 20px;
    z-index: 6;
    left: 120px;
    background: #ffffff;
    top: 72px;
    text-align: center;
  }
  .right {
    position: absolute;
    width: 26px;
    height: 20px;
    z-index: 6;
    right: 120px;
    background: #ffffff;
    top: 72px;
    text-align: center;
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
.imageItem {
  position: relative;
  display: flex;
  height: 316px;
  padding: 20px 0;
  border-bottom: 1.4px dashed #e5e6eb;
  &:last-child {
    border-bottom: none;
  }
  &.needMarginTop {
    margin-top: 10px;
  }
  .image {
    width: 320px;
    height: 240px;
    border-radius: 10px;
    position: relative;
  }
  &__content {
    padding-left: 48px;
  }
  &__caption {
    position: absolute;
    left: 130px;
    top: 268px;
    color: #4e5969;
  }
  &.sideImage {
    height: 604px;
    .image {
      display: block;
      position: relative;
      margin-bottom: 52px;
    }
    .imageItem__caption.pic2 {
      position: absolute;
      left: 130px;
      top: 560px;
    }
  }
  &.sideImage2 {
    .image {
      margin-right: 48px;
    }
    .imageItem__caption.pic2 {
      left: 493px;
    }
    .sideImages {
      display: flex;
    }
  }
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
  &:hover {
    background: #e5e6eb;
  }
}

.stepTwo {
  * {
    box-sizing: border-box;
  }
  .button {
    width: 122px;
    height: 32px;
    border-radius: 8px;
    opacity: 1;
    cursor: pointer;
    /* 自动布局 */
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 6px 20px;
    color: #ffffff;
    background: #2e6ce4;
    margin-bottom: 20px;
    img {
      margin-right: 8px;
    }
  }
  .header {
    display: flex;
    height: 47px;
    display: flex;
    align-items: center;
    padding: 12px 20px;
    /* 主色-5% */
    background: #f4f7fd;
    border-radius: 8px;
    .line {
      width: 4px;
      height: 14px;
      border-radius: 133px;
      opacity: 1;
      background: #2e6ce4;
    }
    .text {
      font-size: 16px;
      font-weight: 500;
      letter-spacing: 0em;
      margin-left: 4px;
      /* 文字/1级 */
      color: #1d2129;
    }
  }
  .content {
    .container {
      display: grid;
      grid-template-columns: 420px 300px;
      :deep .el-input {
        width: 140px;
        margin-left: 10px;
      }
    }
    &.panoramic {
      overflow: auto;
      .imageItem {
        height: 100%;
      }
      .placeholderContainer {
        display: flex;
      }
      .zoomPanoImage {
        position: absolute;
        top: 20px;
        left: 20px;
      }
    }
    &.cephalometric {
      overflow: auto;
      .imageItem {
        .img {
          height: auto;
          width: auto;
        }
      }
      .placeholderContainer {
        display: flex;
        height: 100%;
        .image {
          position: relative;
          .cephalometric {
            &__button {
              position: absolute;
              left: 50%;
              transform: translate(-50%, 0);
              color: #ffffff;
              border-radius: 8px;
              opacity: 1;

              width: 81px;
              height: 36px;
              /* 自动布局 */
              display: flex;
              flex-direction: row;
              justify-content: center;
              align-items: center;

              background: #2e6ce4;
            }
          }
        }
      }
    }
    padding: 0 20px;
    :deep .el-checkbox-button__inner {
      height: 32px;
      img {
        position: absolute;
        right: 0;
        bottom: 0;
      }
    }
    :deep .el-radio-button {
      svg {
        position: relative;
        left: 3px;
      }

      .aiFlagImg {
        position: absolute;
        right: -6px;
        top: -4px;
      }
    }

    &.cephalometric {
      .imageItem {
        height: 100%;
      }
      :deep .el-input {
        width: 70px;
        margin-right: 10px;
      }
    }
  }
}
.item:hover .imageItem {
  display: block;
}
:deep .el-checkbox-button.is-focus .el-checkbox-button__inner {
  --el-checkbox-button-checked-border-color: #dcdfe6;
}
:deep .el-input {
  width: 72px;
  height: 30px;
  margin-right: 4px;
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
:deep .el-input {
  width: auto;
  --el-border-radius-base: 8px;
  margin-left: 4px;
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
:deep .el-radio-group.cephaRadio {
  .el-radio-button__original-radio:checked + .el-radio-button__inner {
    box-shadow: none;
    border: none;
    background: #eaf0fc;
  }

  .el-radio-button:first-child .el-radio-button__inner {
    border-left: none;
  }
  .el-radio-button__inner {
    border: none;
    background: #f2f3f5;
    margin-right: 2px;
  }
}
:deep .el-radio-group.cephaRadio .el-radio-button.serious {
  .el-radio-button__original-radio:checked + .el-radio-button__inner {
    box-shadow: none;
    border: none;
    background: #fdebeb;
  }
}
:deep .el-radio-group.cephaRadio .el-radio-button.green {
  .el-radio-button__original-radio:checked + .el-radio-button__inner {
    box-shadow: none;
    border: none;
    background: #ddf9e3;
    color: #23c343;
  }
}
:deep .el-radio-group.cephaRadio .el-radio-button.blue {
  .el-radio-button__original-radio:checked + .el-radio-button__inner {
    box-shadow: none;
    border: none;
    background: #eaf0fc;
    color: #2e6ce4;
  }
}
.content.mouth {
  .imageItem:first-child {
    &:last-child {
      display: flex;
    }
    :deep(.imageItem__content) {
      display: flex;
      img {
        height: 240px;
        max-width: 320px;
        object-fit: cover;
        border-radius: 12px;
      }
    }
  }
}
</style>
