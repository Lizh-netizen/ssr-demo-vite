<template>
  <div class="drawer">
    <div
      :style="{ marginBottom: '10px', cursor: 'pointer' }"
      @click="handleBackToList"
      class="section-header"
    >
      <el-icon><ArrowLeft /></el-icon>返回列表
    </div>
    <div class="check section">
      <Header text="临床检查" backgroundColor="#f4f7fd" />
      <div class="content">
        <template v-for="title in checkData.orthTitleList" :key="title.id">
          <template v-if="title.titleName !== '关节弹响' && title.titleName !== '侧关节'">
            <form-item :label="title.titleName" width="100px">
              <Option
                :title="title"
                :appId="appId"
                @refreshList="refreshList"
                owningModule="check"
              ></Option>
            </form-item>
          </template>
        </template>
      </div>
    </div>
    <div class="image section">
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
        >
          <img src="../../assets/svg/imageUpload.svg" />图像管理
        </div></Header
      >
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
                      :disabled="!item.hasImage"
                      :title="title"
                      :appId="appId"
                      @refreshList="refreshList"
                      owningModule="face"
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
                  <div :style="{ 'margin-top': '30px' }">
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
                    <div :style="{ 'margin-bottom': '10px' }">前牙覆盖</div>
                  </div>
                </template> </template
              ><template #content>
                <template v-if="item.className == '正面咬合'"> </template>
                <div>
                  <template v-for="title in item.orthTitleList" :key="title.id">
                    <form-item :label="title.titleName" width="120px">
                      <Option
                        :disabled="!item.hasImage"
                        :title="title"
                        :appId="appId"
                        @refreshList="refreshList"
                        owningModule="mouth"
                        :mouthData="mouthData"
                        :savedTitleList="savedTitleList"
                      ></Option>
                      <!-- <el-radio-group
                        v-if="title.type == 1"
                        v-model="title.optionId"
                        @change="handleChangeOption(title.optionId, title)"
                        @dblclick="handleEmptyRadio(title.optionId, title, owningModule)"
                      >
                        <template v-for="(option, index) in title.orthOptionsList" :key="option.id">
                          <template v-if="!option.optionSuffix">
                            <el-radio-button
                              :class="{
                                serious: option.serious == '1',
                                checked: option.choosen === true
                              }"
                              :label="option.id"
                            >
                              {{ option.optionName }}
                              <img
                                class="aiFlagImg"
                                src="@/assets/svg/AIFlagForFront.svg"
                                v-show="title.aiFlag == '1' && option.choosen"
                              /> </el-radio-button
                          ></template>
                          <template v-else>
                            <template v-if="option.fdiToothCode == null">
                              <el-popover
                                placement="right"
                                :width="490"
                                trigger="click"
                                @show="handleBeforeEnterPopover(option)"
                                @after-leave="handleSubmitTooth(option, title)"
                              >
                                <template #reference>
                                  <el-radio-button
                                    @click="option.visible = true"
                                    :class="{
                                      serious: option.serious == '1',
                                      checked: option.choosen === true
                                    }"
                                    :label="option.id"
                                    @mouseenter="option.hover = true"
                                    @mouseleave="option.hover = false"
                                  >
                                    {{ option.optionName
                                    }}<svg
                                      v-if="option.optionSuffix"
                                      xmlns="http://www.w3.org/2000/svg"
                                      xmlns:xlink="http://www.w3.org/1999/xlink"
                                      fill="none"
                                      version="1.1"
                                      width="9.999975204467773"
                                      height="9.999975204467773"
                                      viewBox="0 0 9.999975204467773 9.999975204467773"
                                    >
                                      <g>
                                        <path
                                          d="M0,4.99999C0,2.23857,2.23857,0,4.99999,0C7.76141,0,9.99998,2.23857,9.99998,4.99999C9.99998,7.76141,7.76141,9.99998,4.99999,9.99998C2.23857,9.99998,0,7.76141,0,4.99999C0,4.99999,0,4.99999,0,4.99999ZM5.49999,3.49999C5.49999,3.49999,5.49999,2.49999,5.49999,2.49999C5.49999,2.49999,4.49999,2.49999,4.49999,2.49999C4.49999,2.49999,4.49999,3.49999,4.49999,3.49999C4.49999,3.49999,5.49999,3.49999,5.49999,3.49999C5.49999,3.49999,5.49999,3.49999,5.49999,3.49999ZM4.49999,3.99999C4.49999,3.99999,4.49999,7.49998,4.49999,7.49998C4.49999,7.49998,5.49999,7.49998,5.49999,7.49998C5.49999,7.49998,5.49999,3.99999,5.49999,3.99999C5.49999,3.99999,4.49999,3.99999,4.49999,3.99999C4.49999,3.99999,4.49999,3.99999,4.49999,3.99999Z"
                                          fill-rule="evenodd"
                                          :fill="
                                            option.clicked
                                              ? option.seriousColor
                                              : option.hover
                                              ? option.hoverColor
                                              : option.fillColor
                                          "
                                          fill-opacity="1"
                                        />
                                      </g>
                                    </svg>
                                  </el-radio-button>
                                </template>
                                <ChooseTooth :option="option"></ChooseTooth>
                              </el-popover>
                            </template>
                            <template v-else>
                              <el-popover
                                popper-class="myPopper"
                                :popper-style="{ width: 'auto', 'min-width': '100px' }"
                                placement="top-start"
                                :width="200"
                                :visible="option.visible"
                              >
                                <template #reference>
                                  <el-radio-button
                                    @mouseenter="handleMouseEnterBtn(option)"
                                    :class="{
                                      serious: option.serious == '1',
                                      checked: option.choosen === true
                                    }"
                                    :label="option.id"
                                    @mouseleave="(e) => handleMouseLeaveBtn(e, option)"
                                  >
                                    {{ option.optionName
                                    }}<svg
                                      v-if="option.optionSuffix"
                                      xmlns="http://www.w3.org/2000/svg"
                                      xmlns:xlink="http://www.w3.org/1999/xlink"
                                      fill="none"
                                      version="1.1"
                                      width="9.999975204467773"
                                      height="9.999975204467773"
                                      viewBox="0 0 9.999975204467773 9.999975204467773"
                                    >
                                      <g>
                                        <path
                                          d="M0,4.99999C0,2.23857,2.23857,0,4.99999,0C7.76141,0,9.99998,2.23857,9.99998,4.99999C9.99998,7.76141,7.76141,9.99998,4.99999,9.99998C2.23857,9.99998,0,7.76141,0,4.99999C0,4.99999,0,4.99999,0,4.99999ZM5.49999,3.49999C5.49999,3.49999,5.49999,2.49999,5.49999,2.49999C5.49999,2.49999,4.49999,2.49999,4.49999,2.49999C4.49999,2.49999,4.49999,3.49999,4.49999,3.49999C4.49999,3.49999,5.49999,3.49999,5.49999,3.49999C5.49999,3.49999,5.49999,3.49999,5.49999,3.49999ZM4.49999,3.99999C4.49999,3.99999,4.49999,7.49998,4.49999,7.49998C4.49999,7.49998,5.49999,7.49998,5.49999,7.49998C5.49999,7.49998,5.49999,3.99999,5.49999,3.99999C5.49999,3.99999,4.49999,3.99999,4.49999,3.99999C4.49999,3.99999,4.49999,3.99999,4.49999,3.99999Z"
                                          fill-rule="evenodd"
                                          :fill="
                                            option.clicked
                                              ? option.seriousColor
                                              : option.hover
                                              ? option.hoverColor
                                              : option.fillColor
                                          "
                                          fill-opacity="1"
                                        />
                                      </g>
                                    </svg>
                                  </el-radio-button>
                                </template>
                                <Tooth
                                  :step="5"
                                  :title="option"
                                  :appId="appId"
                                  @submitTooth="(val) => handleSubmitTooth(val, title)"
                                />
                              </el-popover>
                            </template>
                          </template>
                        </template>
                      </el-radio-group> -->
                    </form-item>
                  </template>
                </div>
              </template>
            </ImageItem>
          </template>
        </div>
        <div class="questionItem__header">
          <img src="../../assets/svg/flag.svg" /><span class="questionItem__header__title"
            >全景片</span
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
                    <template v-if="index <= 1">
                      <form-item :label="title.titleName" width="120px">
                        <el-radio-group
                          v-if="title.type == 1"
                          v-model="title.optionId"
                          @change="handleChangeOption(title.optionId, title)"
                          @dblclick="handleEmptyRadio(title.optionId, title, 'pano')"
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
                          @blur="handleSubmit(title.optionId, title)"
                        />
                        <el-checkbox-group
                          v-model="title.optionId"
                          v-else-if="title.type == 2"
                          @change="handleChangeOption(title.optionId, title)"
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
                            <img
                              src="../../assets/svg/checked.svg"
                              v-if="option.serious == '0'"
                            /><img src="../../assets/svg/abnormalChecked.svg" v-else />
                          </el-checkbox-button>
                        </el-checkbox-group>
                      </form-item>
                    </template>
                  </template>
                </div>
                <div class="leftLower-column">
                  <template
                    v-for="(title, index) in panoramicData[0].orthTitleList"
                    :key="title.id"
                  >
                    <template v-if="index >= 2">
                      <form-item :label="title.titleName" width="120px">
                        <el-popover
                          :width="490"
                          :visible="title.popVisible"
                          @show="handleBeforeEnterPopover(title)"
                          @after-leave="handleSubmitTooth(null, title, true)"
                        >
                          <template #reference>
                            <div
                              class="diagramWrapper"
                              @click.stop="openPop(title, panoramicData[0])"
                            >
                              <div class="diagram">
                                <div class="diagramBox">
                                  <div class="toothItem1">
                                    {{
                                      title.topLeft
                                        ?.sort((a, b) => a.sort - b.sort)
                                        .map((a) => a.value)
                                        .join('')
                                    }}
                                  </div>
                                  <div class="toothItem2">
                                    {{
                                      title.topRight
                                        ?.sort((a, b) => a.sort - b.sort)
                                        .map((a) => a.value)
                                        .join('')
                                    }}
                                  </div>
                                </div>
                                <div class="diagramBox">
                                  <div class="toothItem3">
                                    {{
                                      title.bottomLeft
                                        ?.sort((a, b) => a.sort - b.sort)
                                        .map((a) => a.value)
                                        .join('')
                                    }}
                                  </div>
                                  <div class="toothItem4">
                                    {{
                                      title.bottomRight
                                        ?.sort((a, b) => a.sort - b.sort)
                                        .map((a) => a.value)
                                        .join('')
                                    }}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </template>
                          <div class="selectContainer" id="selectContainer">
                            <div class="container">
                              <template v-for="(row, rowindex) in symptomList" :key="rowindex">
                                <div
                                  class="symptomBox"
                                  :class="{
                                    itemAlignRight:
                                      rowindex === 2 ||
                                      rowindex === 4 ||
                                      rowindex === 0 ||
                                      rowindex === 6,
                                    marginTop: rowindex == 4 || rowindex == 5,
                                    marginBottom: rowindex == 2 || rowindex == 3,
                                    marginRight:
                                      rowindex === 2 ||
                                      rowindex === 4 ||
                                      rowindex === 0 ||
                                      rowindex === 6,
                                    marginLeft:
                                      rowindex === 1 ||
                                      rowindex === 3 ||
                                      rowindex === 5 ||
                                      rowindex === 7
                                  }"
                                >
                                  <div
                                    class="symptomItem"
                                    :class="{ selected: item.active === true }"
                                    :id="item.value"
                                    v-for="(item, index) in row"
                                    :key="index"
                                    @click.stop="handleSelectTooth(item, title)"
                                  >
                                    {{ item.label }}
                                  </div>
                                </div>
                              </template>
                            </div>
                            <div class="left">右</div>
                            <div class="right">左</div>
                          </div>
                        </el-popover>
                      </form-item>
                    </template>
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
                  <form-item :label="title.titleName" width="120px">
                    <el-input
                      type="textarea"
                      placeholder="输入备注"
                      v-model="title.cephalometricsContent"
                      :rows="4"
                      :style="{ width: '100%' }"
                      @blur="handleSubmitRemark(title)"
                    ></el-input>
                  </form-item>
                </template>
              </template>
            </ImageItem>
          </template>
        </div>
      </div>
    </div>
    <div class="footer">
      <span class="dialog-footer">
        <el-button @click="handleBackToList">取消</el-button>
        <el-button type="primary" @click="handleConfirm"> 确认 </el-button>
      </span>
    </div>
  </div>
  <ImageDialog
    page="evaluate"
    :appId="appId"
    :patientId="patientId"
    :dialogVisible="imgDialogVisible"
    :caption="title"
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
      状态选择：
      <el-radio-group v-model="advice">
        <el-radio-button label="立即矫正" />
        <el-radio-button label="后续面评" />
        <el-radio-button label="转三级医生" />
        <el-radio-button label="无需矫正" />
      </el-radio-group>
    </div>
    <div v-if="advice === '后续面评'">
      时间选择：<el-date-picker
        v-model="time"
        type="date"
        placeholder="请选择"
        value-format="YYYY-MM-DD"
      ></el-date-picker>
    </div>
    <div v-if="advice === '立即矫正'">
      医生选择：<el-select placeholder="请选择" allow-search filterable v-model="orthDoctorId">
        <el-option
          v-for="item in orthDoctorList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
          {{ item.label }}</el-option
        >
      </el-select>
    </div>
    <div v-if="advice === '转三级医生'">
      <div :style="{ width: '70px', display: 'inline-block' }">转诊至：</div>
      <el-select placeholder="请选择" allow-search filterable v-model="threeLevelDoctorId">
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
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="adviceVisible = false">取消</el-button>
        <el-button type="primary" @click="handleAdvice"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import ChooseTooth from '@/components/list/chooseTooth.vue'
import { Upload, WarningFilled } from '@element-plus/icons-vue'
import { ref, computed, onMounted, nextTick } from 'vue'
import Header from '../../components/list/header.vue'
import { Get, Post, Delete, Put } from '../../utils/request'
import formItem from '../../components/list/formItem.vue'
import ImageItem from '../../components/list/imageItem.vue'
import { useRoute, useRouter } from 'vue-router'
import { ElLoading, ElMessage } from 'element-plus'

import useSelectTooth from '../../effects/selectTooth'
import { GetSymptom } from '../../utils/tooth'
import placeholderUrl from '@/assets/ortho/imagePlaceholder.png'
import img from '@/assets/svg/addPic.svg'
import blueBgUrl from '@/assets/svg/blueBg.svg'
import ImageDialog from '@/components/list/imageDialog.vue'
import emptyRadio from '@/effects/emptyRadio.ts'
import Option from '@/components/list/evaluateOption.vue'
import useFdiToothCodeEffect from '@/effects/fdiToothCode.ts'
const router = useRouter()
const route = useRoute()
const appId = route.params.appId
const patientId = route.params.patientId
const patientInfo = JSON.parse(sessionStorage.getItem('patientInfo'))
const facialId = patientInfo.facialId

// 面评弹窗逻辑
const adviceVisible = ref(false)
const advice = ref()
const time = ref(patientInfo.StartTime.slice(0, 10))
async function handleConfirm() {
  adviceVisible.value = true
}

const id = ref()
async function getId() {
  const res = await Get(`/prod-api/business/orthBase/${appId}`)
  id.value = res.data.id
}
getId()
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
    const facialAdvise = advice.value === '立即矫正' ? 1 : advice.value === '后续面评' ? 3 : 2
    const obj = {
      id: facialId,
      patientId: patientId,
      aptmId: appId,
      orthDoctorName: orthDoctorName || '',
      orthDoctorId: orthDoctorId.value || '',
      remark: '',
      facialAdvise: facialAdvise,
      facialOrthDoctorId: orthDoctorId.value || '',
      facialOrthDoctorName: orthDoctorName || '',
      facialTime: time.value || '',
      facialReferralToDoctorId: threeLevelDoctorId.value || '',
      facialReferralToDoctorName: facialDoctorName || ''
    }

    const res = await Post('/prod-api/emr/public/api/v1/assessment/add', obj)
    adviceVisible.value = false
    if (res.code === 200) {
      ElMessage.success(res.msg)
    }
  } catch (err) {
    console.log(err)
  }
  handleBackToList()
}

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
  faceEvaluate: getFaceAccessList,
  mouth: getMouthList,
  panoramic: getPanoramicList
}
const refreshList = (val) => {
  strategy[val]()
}
// 获取数据

const checkData = ref([])
async function getCheckList() {
  const result = await Get(`/prod-api/business/orthClass/list/1/临床检查/${appId}`)
  checkData.value = result.data[0]
  result.data.forEach((item) => {
    item.orthTitleList.forEach((title) => (title.showInput = false))
  })
  result.data.forEach((item) => {
    item.orthTitleList.forEach((title) => {
      if (title.orthOptionsList[title.orthOptionsList.length - 1].otherContent) {
        title.otherContent = title.orthOptionsList[title.orthOptionsList.length - 1].otherContent
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
}

const faceAccessData = ref([])
async function getFaceAccessList() {
  const result = await Get(`/prod-api/business/orthClass/list/1/面型评估/${appId}`)
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
  const result = await Get(`/prod-api/business/orthClass/list/1/口内照/${appId}`)
  mouthData.value = result.data
  result.data.forEach((item) => item.orthTitleList.forEach((title) => (title.showInput = false)))

  result.data.forEach((item) => {
    if (!item.imageUrl) {
      item.hasImage = false
    } else {
      item.hasImage = true
    }
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
      item.orthTitleList.forEach((title) => {
        if (title.titleName == '前牙覆合') {
          title.orthOptionsList.forEach((option) => {
            if (option.optionName === '前牙反覆合') {
              option.fillColor = '#C9CDD4'
              option.seriousColor = '#f44c4c'
              option.hoverColor = '#2e6ce4'
              option.clicked = option.choosen ? true : false
            }
          })
        }
        if (title.titleName == '前牙覆盖') {
          title.orthOptionsList.forEach((option) => {
            if (option.optionName === '前牙反覆盖') {
              option.fillColor = '#C9CDD4'
              option.seriousColor = '#f44c4c'
              option.hoverColor = '#2e6ce4'
              option.clicked = option.choosen ? true : false
            }
          })
        }
      })
    }
    if (item.className == '磨牙关系（左侧）') {
      item.orthTitleList.forEach((title) => {
        if (title.titleName == '后牙') {
          title.orthOptionsList.forEach((option) => {
            if (option.optionName === '左侧后牙反合') {
              option.fillColor = '#C9CDD4'
              option.seriousColor = '#f44c4c'
              option.hoverColor = '#2e6ce4'
              option.clicked = option.choosen ? true : false
            }
          })
        }
        if (title.titleName == '锁HE') {
          title.orthOptionsList.forEach((option) => {
            if (option.optionName === '正锁合' || option.optionName === '反锁合') {
              option.fillColor = '#C9CDD4'
              option.seriousColor = '#f44c4c'
              option.hoverColor = '#2e6ce4'
              option.clicked = option.choosen ? true : false
            }
          })
        }
      })
    }
    if (item.className == '磨牙关系（右侧）') {
      item.orthTitleList.forEach((title) => {
        if (title.titleName == '后牙') {
          title.orthOptionsList.forEach((option) => {
            if (option.optionName === '右侧后牙反合') {
              option.fillColor = '#C9CDD4'
              option.seriousColor = '#f44c4c'
              option.hoverColor = '#2e6ce4'
              option.clicked = option.choosen ? true : false
            }
          })
        }
        if (title.titleName == '锁HE') {
          title.orthOptionsList.forEach((option) => {
            if (option.optionName === '正锁合' || option.optionName === '反锁合') {
              option.fillColor = '#C9CDD4'
              option.seriousColor = '#f44c4c'
              option.hoverColor = '#2e6ce4'
              option.clicked = option.choosen ? true : false
            }
          })
        }
      })
    }
  })
}

const panoImageUrl = ref()
const panoramicData = ref([])
const requestMouth = ref(false)
// 需要输入牙位的全景片title
const codeTitleList = ref([])
const sourceApmtId = ref()
const classId = ref()
async function getPanoramicList() {
  const result = await Get(`/prod-api/business/orthClass/list/1/全景片/${appId}`)
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
        location: '1'
      }
      Post('/prod-api/business/orthClass/mouthCheck', obj).then((res) => {
        if (res.code == 200) {
          const nonCodeTitleList = panoramicData.value[0].orthTitleList.slice(0, 6)
          codeTitleList.value = res.data.slice(6)
          panoramicData.value[0].orthTitleList = [...nonCodeTitleList, ...codeTitleList.value]
          // 获取牙位数据是异步操作，需要分情况处理全景片数据
          handlePanoData(panoramicData)
        }
      })
    }
    item.orthTitleList.forEach((title) => {
      title.showInput = false
      title.popVisible = false
    })
  })
  if (!requestMouth.value) {
    handlePanoData(panoramicData)
  }
}
// 自由照
const freePicData = ref([])
const freeImageUrl = ref()
async function getFreePic() {
  const result = await Get(`/prod-api/business/orthClass/list/1/自由照片/${appId}`)
  freePicData.value = result.data
  freeImageUrl.value = result.data[0].imageUrl
}

function handlePanoData(panoramicData) {
  panoramicData.value.forEach((item) => {
    item.orthTitleList.forEach((a) => {
      a.topLeft = []
      a.topRight = []
      a.bottomLeft = []
      a.bottomRight = []
      const arr = JSON.parse(a.showPosition)

      if (a.fdiToothCode) {
        a.toothCode = a.fdiToothCode.split(',')
        a.fdiToothCode.split(',').forEach((code, index) => {
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
// const modelData = ref([])
// async function getModelList() {
//   const result = await Get(
//     `/prod-api/business/orthClass/list/1/模型分析/${appId}`
//   )
//   modelData.value = result.data[0]

//   modelData.value.orthTitleList.forEach((title) => {
//     title.optionId = ''
//     const choosenOptions = title.orthOptionsList.filter(
//       (option) => option.choosen === true
//     )
//     if (choosenOptions.length > 0) {
//       title.optionId = choosenOptions[0].id
//     }
//   })
// }

getCheckList()
getFaceAccessList()
getMouthList()
getPanoramicList()
getFreePic()
// getModelList()
async function handleEmptyRadio(optionId, title, owningModule) {
  if (
    title.orthOptionsList.some((option) => option.choosen == true) &&
    title.type == 1 &&
    title.optionId == optionId
  ) {
    emptyRadio(optionId, title)
    const obj = {
      apmtId: appId,
      titleId: title.id,
      optionsIdStr: [],
      otherContent: title.otherContent,
      cephalometricsContent: '',
      fdiToothCode: '',
      showPosition: ''
    }

    Post('/prod-api/business/facialResult', obj)
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
const handleChangeOption = (optionId, title) => {
  let choosenOption
  if (
    title.titleName == '前牙覆合' ||
    title.titleName == '前牙覆盖' ||
    title.titleName == '后牙' ||
    title.titleName == '锁HE'
  ) {
    requestAgain.value = true
    title.orthOptionsList.forEach((option) => {
      if (optionId == option.id) {
        option.clicked = true
      } else {
        option.clicked = false
      }
    })
  }
  const found = mouthData.value.find((item) => item.className == '正面咬合')
  if (title.titleName == '前牙覆合') {
    if (title.orthOptionsList.find((a) => optionId == a.id).optionName == '前牙反覆合') {
      found.orthTitleList = savedTitleList.value.filter((t) => t.titleName !== '反覆盖程度')
    } else if (title.orthOptionsList.find((a) => optionId == a.id).optionName !== '前牙反覆合') {
      found.orthTitleList = savedTitleList.value.filter((t) => t.titleName !== '反覆合程度')
      const title1 = savedTitleList.value.find((title) => title.titleName == '反覆合程度')
      // 判断凹面型表现是否需要清空
      const title2 = savedTitleList.value.find((title) => title.titleName == '前牙覆盖')
      if (!title2.orthOptionsList.some((a) => a.choosen == true)) {
        found.orthTitleList = savedTitleList.value.filter((t) => t.titleName !== '凹面型表现')
        title2.optionId = []
        updateOption(null, title2)
      }
      title1.optionId = []
      updateOption(null, title1)
      //  点击完需要重新请求接口
    }
    // getOrthFaceAccessList()
  }
  // 还有一个凹面型需要判断
  if (title.titleName == '前牙覆盖') {
    if (title.orthOptionsList.find((a) => optionId == a.id).optionName == '前牙反覆盖') {
      found.orthTitleList = savedTitleList.value.filter((t) => t.titleName !== '反覆合程度')
    } else if (title.orthOptionsList.find((a) => optionId == a.id).optionName !== '前牙反覆盖') {
      found.orthTitleList = savedTitleList.value.filter((t) => t.titleName !== '反覆盖程度')
      const title1 = savedTitleList.value.find((title) => title.titleName == '反覆盖程度')
      // 判断凹面型表现是否需要清空
      const title2 = savedTitleList.value.find((title) => title.titleName == '前牙覆合')
      if (!title2.orthOptionsList.some((a) => a.choosen == true)) {
        found.orthTitleList = savedTitleList.value.filter((t) => t.titleName !== '凹面型表现')
        title2.optionId = []
        updateOption(null, title2)
      }
      title1.optionId = []
      updateOption(null, title1)
    }
    // getOrthFaceAccessList()
  }
  if (title.type == 2) {
    // 无和别的选项互斥逻辑
    if (title.optionId1.includes(10) && title.optionId1.length < title.optionId.length) {
      title.optionId1 = title.optionId.filter((o) => o !== 10)
      title.optionId = title.optionId1
    } else if (
      !title.optionId1.includes(10) &&
      title.optionId1.length < title.optionId.length &&
      title.optionId.includes(10)
    ) {
      title.optionId1 = [10]
      title.optionId = [10]
      title.otherContent = ''
    }
    title.orthOptionsList.forEach((option) => {
      if (!title.optionId.includes(option.id)) {
        option.choosen = false
      } else {
        option.choosen = true
      }
    })
  }
  if (title.type == 1) {
    choosenOption = title.orthOptionsList.find((a) => a.id == optionId)
    title.orthOptionsList.forEach((option) => {
      if (optionId !== option.id) {
        option.choosen = false
      }
    })
  }
  updateOption(title.optionId, title, choosenOption)
  if (requestAgain.value) {
    // getMouthList()
  }
}
async function handleSubmitRemark(title) {
  if (!freeImageUrl.value) {
    ElMessage({
      message: '请先上传图片',
      type: 'warning'
    })
    return
  }
  const obj = {
    apmtId: appId,
    titleId: title.id,
    optionsIdStr: [],
    otherContent: '',
    cephalometricsContent: title.cephalometricsContent,
    fdiToothCode: '',
    showPosition: ''
  }
  const res = await Post('/prod-api/business/facialResult', obj)
}
async function updateOption(optionId, title, option) {
  let obj = null
  if (title.type == 1) {
    obj = {
      apmtId: appId,
      titleId: title.id,
      optionsIdStr: [optionId],
      otherContent: title.otherContent,
      cephalometricsContent: title.cephalometricsContent,
      fdiToothCode: '',
      showPosition: '',
      optionSuffix: option.optionSuffix
    }
  } else if (title.type == 2) {
    obj = {
      apmtId: appId,
      titleId: title.id,
      optionsIdStr: optionId,
      otherContent: title.otherContent,
      cephalometricsContent: '',
      fdiToothCode: '',
      showPosition: '',
      optionSuffix: option.optionSuffix
    }
  }
  await Post('/prod-api/business/facialResult', obj)
}
const imgDialogVisible = ref(false)
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
const openImgDialog = () => {
  imgDialogVisible.value = true
  imageList.value.forEach((a) => {
    a.fileUrl = placeholderUrl
  })
  getClassifiedImgList()
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
// 上传图片
// 上传图片逻辑e
const fileList = ref([])
const fileListWithFlag = ref([])

const params = new FormData()

const upload = ref(false)

// 影像管理
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

const orthDoctorId = ref(+patientInfo.facialOrthDoctorId || '')
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
const threeLevelDoctorId = ref(+patientInfo.facialReferralToDoctorId || '')
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
// 影像管理逻辑
const index = ref(0)
const imageArr = ref([])
const totalArr = ref([])
const title = ref()
const handleOpenImageDialogue = (caption) => {
  imgDialogVisible.value = true
  // reminder是提醒从这个跳进去的
  title.value = caption
}

const src = ref()

// 上传图片
// file是拖拽的，image是被拖的

const openPop = (title, item) => {
  if (!item.hasImage) {
    return
  } else {
    // 点击下一个十字牙位时，先吧之前的清空
    panoramicData.value[0].orthTitleList.forEach((t) => {
      if (title !== t) {
        t.popVisible = false
      }
    })
    title.popVisible = !title.popVisible
  }
}
const handleSubmitTooth = (option, title, isTitle) => {
  // symptomList.value.forEach((row) =>
  //   row.forEach((item) => (item.active = false))
  // )
  console.log('evelaute')
  if (isTitle && !title.submitAble) {
    return
  }
  if (!isTitle && !option.submitAble) {
    return
  }

  let obj = {
    apmtId: appId,
    titleId: title.id,
    optionsIdStr: isTitle ? [] : [title.optionId],
    otherContent: '',
    optionSuffix: '牙位图',
    cephalometricsContent: '',
    fdiToothCode: isTitle ? title.toothCode.join() : option.toothCode.join(),
    showPosition: isTitle ? JSON.stringify(title.position) : JSON.stringify(option.position)
  }
  Post('/prod-api/business/facialResult', obj).then(() => {
    title.submitAble = false
  })
}
const handleSubmit = (optionId, title) => {
  updateOption(optionId, title)
}
const handleSelectTooth = (item, title) => {
  useSelectTooth(item, title)
}
// 保存图片
async function handleSavePics() {
  // imgDialogVisible.value = false
  // imageList.value.forEach((item) => (item.reminder = false))
  // const orthImageList = imageList.value.filter((item) => item.fileUrl !== placeholderUrl)
  // const arr = orthImageList.map((item) => ({
  //   imageType: item.caption,
  //   imageUrl: item.fileUrl
  // }))
  // Post('/prod-api/business/orthImage', {
  //   apmtId: appId,
  //   orthImageList: arr
  // }).then((res) => {
  //   if (res.code == 200) {
  //     getAllData()
  //   }
  // })
  getAllData()
}

function getAllData() {
  getFaceAccessList()
  getMouthList()
  getPanoramicList()
  getFreePic()
}
const handleCloseImgDialog = () => {
  imageList.value.forEach((image) => (image.reminder = false))
}
const handleBackToList = () => {
  router.push('/index')
}
</script>
<style>
.el-dialog__body {
  padding: 24px;
  padding-top: 10px;
  padding-bottom: 10px;
}
.advice.el-dialog {
  width: 500px;
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

.file-upload__input {
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.el-input.measured .el-input__wrapper {
  box-shadow: none;
}
.el-input.measured .el-input__wrapper:hover {
  box-shadow: 0 0 0 1px #dcdfe6;
}
</style>
<style lang="scss" scoped>
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
  margin: 15px;
  background: #fff;
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
      margin-bottom: 10px;
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
</style>
