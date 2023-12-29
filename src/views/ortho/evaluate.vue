<template>
  <div class="drawer">
    <div class="check section">
      <div :style="{ marginBottom: '10px', cursor: 'pointer' }" @click="handleBackToList">
        <el-icon><ArrowLeft /></el-icon>返回列表
      </div>

      <Header text="临床检查" backgroundColor="#f4f7fd" />
      <div class="content">
        <template v-for="title in checkData.orthTitleList" :key="title.id">
          <template v-if="title.titleName !== '关节弹响' && title.titleName !== '侧关节'">
            <form-item :label="title.titleName" width="100px">
              <el-radio-group
                v-if="title.type == 1"
                v-model="title.optionId"
                @change="handleChangeOption(title.optionId, title)"
              >
                <template v-for="(option, index) in title.orthOptionsList" :key="option.id">
                  <el-radio-button
                    v-if="!option.optionSuffix"
                    :class="{
                      serious: option.serious == '1'
                    }"
                    :label="option.id"
                  >
                    {{ option.optionName }}
                  </el-radio-button>

                  <el-popover
                    v-else
                    popper-class="myPopper"
                    :popper-style="{ width: 'auto', 'min-width': '100px' }"
                    placement="top-start"
                    :width="200"
                    :visible="option.visible"
                    @show="showPopover(index - 2)"
                  >
                    <template #reference>
                      <el-radio-button
                        :class="{
                          serious: option.serious == '1',
                          checked: option.choosen === true
                        }"
                        :label="option.id"
                        @mouseenter="handleMouseEnter(option)"
                        @mouseleave="handleMouseLeave(option)"
                      >
                        {{ option.optionName
                        }}<svg
                          xmlns="http://www.w3.org/2000/svg"
                          xmlns:xlink="http://www.w3.org/1999/xlink"
                          fill="
                              none
                            "
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
                    <el-input
                      maxlength="2"
                      :ref="inputRefs[index - 2]"
                      v-model="option.otherContent"
                      @blur="handleSubmitContent(title.optionId, title, option)"
                      :class="{
                        borderless: option.otherContent
                      }"
                    ></el-input
                    >{{ option.optionSuffix?.substr(-1) }}
                  </el-popover>
                </template>
              </el-radio-group>
              <el-checkbox-group
                v-model="title.optionId"
                v-if="title.type == 2"
                @change="handleChangeOption(title.optionId, title)"
              >
                <el-checkbox-button
                  :class="{
                    serious: option.serious == '1',
                    checked: option.choosen === true
                  }"
                  v-for="option in title.orthOptionsList"
                  :key="option.id"
                  :label="option.id"
                >
                  {{ option.optionName }}
                  <img src="../../assets/svg/checked.svg" v-if="option.serious == '0'" /><img
                    src="../../assets/svg/abnormalChecked.svg"
                    v-else
                  />
                </el-checkbox-button>
              </el-checkbox-group>
              <el-input
                v-if="
                  (title.optionId.constructor === Array && title.optionId.includes(9)) ||
                  title.optionId == 9
                "
                placeholder="请输入"
                v-model="title.otherContent"
                @blur="handleSubmit(title.optionId, title)"
              />
            </form-item>
          </template>
          <!-- 关节错乱 -->

          <template v-if="title.titleName == '关节弹响'">
            <div :style="{ display: 'inline-flex' }">
              <div class="specialTitle">{{ title.titleName }}</div>

              <el-radio-group
                class="specialRadio"
                v-model="title.optionId"
                @change="handleChangeOption(title.optionId, title)"
              >
                <el-radio-button
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
            </div>
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
                    <el-radio-group
                      v-if="title.type == 1"
                      v-model="title.optionId"
                      @change="handleChangeOption(title.optionId, title, item.className, item)"
                    >
                      <el-radio-button
                        :disabled="!item.hasImage"
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
                    <el-checkbox-group
                      v-model="title.optionId"
                      v-if="title.type == 2"
                      @change="handleChangeOption(title.optionId, title, item.className, item)"
                    >
                      <el-checkbox-button
                        :disabled="!item.hasImage"
                        :class="{
                          serious: option.serious == '1',
                          checked: option.choosen === true
                        }"
                        v-for="option in title.orthOptionsList"
                        :key="option.id"
                        :label="option.id"
                      >
                        {{ option.optionName }}
                        <img src="../../assets/svg/checked.svg" v-if="option.serious == '0'" /><img
                          src="../../assets/svg/abnormalChecked.svg"
                          v-else
                        />
                      </el-checkbox-button>
                    </el-checkbox-group>
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
              :imageCaption="item.className"
              :class="{
                removeBorder: item.className === '90度侧面像' || item.className === '45度侧面像'
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
                  </div> </template></template
              ><template #content>
                <template v-for="title in item.orthTitleList" :key="title.id">
                  <form-item :label="title.titleName" width="120px">
                    <el-radio-group
                      v-if="title.type == 1"
                      v-model="title.optionId"
                      @change="handleChangeOption(title.optionId, title, item.className, item)"
                    >
                      <el-radio-button
                        :disabled="!item.hasImage"
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
                    <el-checkbox-group
                      v-model="title.optionId"
                      v-if="title.type == 2"
                      @change="handleChangeOption(title.optionId, title, item.className, item)"
                    >
                      <el-checkbox-button
                        :disabled="!item.hasImage"
                        :class="{
                          serious: option.serious == '1',
                          checked: option.choosen === true
                        }"
                        v-for="option in title.orthOptionsList"
                        :key="option.id"
                        :label="option.id"
                      >
                        {{ option.optionName }}
                        <img src="../../assets/svg/checked.svg" v-if="option.serious == '0'" /><img
                          src="../../assets/svg/abnormalChecked.svg"
                          v-else
                        />
                      </el-checkbox-button>
                    </el-checkbox-group>
                  </form-item>
                </template>
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
                          @after-leave="handleSubmitTooth(title)"
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
      </div>
    </div>
    <!-- <div class="model section">
      <Header text="模型分析" backgroundColor="#EAF0FC" />
      <div class="content">
        <form-item
          v-for="title in modelData.orthTitleList"
          :key="title.id"
          :label="title.titleName"
          width="110px"
          :showMark="title.titleName === 'Bolton指数（前牙比）'"
          :content="title.prompt"
        >
          <el-radio-group
            v-model="title.optionId"
            @change="handleChangeOption(title.optionId, title)"
          >
            <template v-for="option in title.orthOptionsList" :key="option.id">
              <el-radio-button
                :class="{
                  serious: option.serious == '1',
                  checked: option.choosen === true
                }"
                :label="option.id"
              >
                {{ option.optionName }}
              </el-radio-button>
            </template>
          </el-radio-group>
        </form-item>
      </div>
    </div> -->
    <div class="footer">
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirm"> 确认 </el-button>
      </span>
    </div>
  </div>
  <ImageDialog
    :appId="appId"
    :patientId="patientId"
    :dialogVisible="imgDialogVisible"
    :caption="title"
    @savePics="handleSavePics"
    @cancel="handleClose"
  ></ImageDialog>
  <!-- 影像管理弹窗 -->
  <!-- <el-dialog
    v-model="imgDialogVisible"
    title="影像管理"
    width="1183px"
    @close="handleCloseImgDialog"
    :close-on-click-modal="false"
  >
    <div class="imageManagement" ref="loadingTarget2">
      <div class="imageManagement__images subSection">
        <div class="title">
          <div class="title__left">图库</div>
          <div class="title__middle">
            <img src="../../assets/svg/reminder.svg" :style="{ 'margin-right': '4px' }" />
            可直接拖拽照片到右侧指定位置或点击下方一键“自动分类”哦～
          </div>
          <div class="title__right file-upload">
            <div class="file-upload__label">
              <el-button type="primary" link :icon="Upload">上传图片</el-button>
            </div>
            <input class="file-upload__input" type="file" @change="handleFileChange" multiple />
          </div>
        </div>
        <div
          :style="{
            'padding-left': '14px',
            'padding-bottom': '50px',
            'padding-top': '50px'
          }"
        >
          <img
            class="imgContainer__empty"
            src="../../assets/svg/empty__image.svg"
            v-if="imageArr.length == 0"
          />
          <template v-else>
            <div v-for="(item, index) in imageArr" :key="index">
              <div>
                {{ item.StartTime.split('T')[0] }}
              </div>
              <div class="imgContainer">
                <div
                  class="item"
                  v-for="img in item.imageList"
                  :key="img.id"
                  @mouseenter="img.showFlag = true"
                  @mouseleave="img.showFlag = false"
                >
                  <div
                    :style="{
                      position: 'relative',
                      border: '1px solid #e5e6eb',
                      'border-radius': '12px'
                    }"
                  >
                    <img
                      :style="{ display: 'block' }"
                      class="img"
                      :src="img.imgUrl"
                      :class="{
                        choose: img.choose === true
                      }"
                      draggable="true"
                      @dragstart="handleDragStart(img, $event)"
                      @dragend="handleDragEnd"
                      @click="handleToggleChoose(img)"
                    />
                    <img
                      src="../../assets/svg/imageChecked.svg"
                      :style="{
                        position: 'absolute',
                        right: '6px',
                        bottom: '6px'
                      }"
                      @click="handleToggleChoose(img)"
                      v-show="img.choose === true"
                    />
                  </div>
                </div>
              </div>
              <div
                :style="{
                  display: 'inline-flex',
                  color: '#4E5969',
                  cursor: 'pointer'
                }"
                @click="handleLoadPic"
                v-if="!item.file && index === imageArr.length - 1"
              >
                <span>加载上次影像</span><img src="../../assets/svg/morePic.svg" />
              </div>
            </div>
          </template>
        </div>

        <div class="classifyWrapper">
          <span :style="{ 'margin-right': '6px' }">已选中{{ chooseImgNum }}张</span
          ><el-button @click="handleClassifyPics">自动分类</el-button>
        </div>
      </div>
      <div class="imageManagement__classify subSection">
        <div class="title">分类</div>
        <div class="imageWrapper">
          <div
            class="item"
            v-for="img in imageList"
            :key="img.typeName"
            @mouseenter="img.showFlag = true"
            @mouseleave="img.showFlag = false"
          >
            <div
              :style="{
                position: 'relative',
                border: '1px solid #e5e6eb',
                'border-radius': '12px'
              }"
            >
              <img
                class="img"
                :class="{
                  hover: img.reminder === true,
                  animate__animated: img.reminder === true,
                  animate__bounce: img.reminder === true
                }"
                :style="{ display: 'block' }"
                :src="img.fileUrl"
                @drop="(e) => handleDrop(e, img)"
                @dragover.prevent="handleDragOver"
                @dragleave="handleDragLeave"
                @dragstart="handleDragStart1(img)"
                @dragend="handleDragEnd"
              />
            </div>
            <el-popconfirm
              width="300"
              confirm-button-text="确认"
              :icon="WarningFilled"
              icon-color="#FF7D00"
              cancel-button-text="取消"
              title="确认删除该张图片吗？"
              @confirm="handleDeleteImage1(img)"
            >
              <template #reference>
                <img
                  :style="{ cursor: 'pointer' }"
                  class="deleteImage"
                  src="../../assets/svg/deleteImage.svg"
                  v-if="img.showFlag && !img.fileUrl.startsWith('data:image')"
                />
              </template>
            </el-popconfirm>
            <div class="item__caption">{{ img.caption }}</div>
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="imgDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSavePics"> 确定 </el-button>
      </span>
    </template>
  </el-dialog> -->
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
        <el-radio-button label="后续矫正" />
        <el-radio-button label="无需矫正" />
      </el-radio-group>
    </div>
    <div v-if="advice === '后续面评' || advice === '后续矫正'">
      时间选择：<el-input v-model="time"></el-input>个月后{{ advice.slice(2) }}
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
import { Upload, WarningFilled } from '@element-plus/icons-vue'
import { ref, computed, onMounted, nextTick } from 'vue'
import Header from '../../components/list/header.vue'
import { Get, Post, Delete, Put } from '../../utils/request'
import formItem from '../../components/list/formItem.vue'
import ImageItem from '../../components/list/imageItem.vue'
import { useRoute, useRouter } from 'vue-router'
import { ElLoading, ElMessage } from 'element-plus'
import useUpdateOption from '../../effects/updateOption'
import useSelectTooth from '../../effects/selectTooth'
import { GetSymptom } from '../../utils/tooth'
import placeholderUrl from '@/assets/ortho/imagePlaceholder.png'
import img from '@/assets/svg/addPic.svg'
import blueBgUrl from '@/assets/svg/blueBg.svg'
import ImageDialog from '@/components/list/imageDialog.vue'
const router = useRouter()
const route = useRoute()
const appId = route.params.appId
const patientId = route.params.patientId
// 面评弹窗逻辑
const adviceVisible = ref(false)
const advice = ref()
const time = ref()
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
    let remark = ''
    if (advice.value === '立即矫正' || advice.value === '无需矫正') {
      remark = advice.value
    } else {
      remark = time.value + '个月后' + advice.value.slice(2)
    }
    const res = await Put('/prod-api/business/orthBase', {
      id: id.value,
      remark: remark
    })
    adviceVisible.value = false
    if (res.code === 200) {
      ElMessage.success(res.msg)
    }
  } catch (err) {
    console.log(err)
  }
}

onMounted(() => {
  nextTick(() => {
    setTimeout(() => {
      console.log(document.querySelector('.imageDialog'))
    }, 2000)
  })

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
// getModelList()

const handleChangeOption = (optionId, title) => {
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
    title.orthOptionsList.forEach((option) => {
      if (optionId !== option.id) {
        option.choosen = false
      }
    })
  }
  updateOption(title.optionId, title)
}
async function updateOption(optionId, title) {
  let obj = null
  if (title.type == 1) {
    obj = {
      apmtId: appId,
      titleId: title.id,
      optionsIdStr: [optionId],
      otherContent: title.otherContent,
      cephalometricsContent: title.cephalometricsContent,
      fdiToothCode: '',
      showPosition: ''
    }
  } else if (title.type == 2) {
    obj = {
      apmtId: appId,
      titleId: title.id,
      optionsIdStr: optionId,
      otherContent: title.otherContent,
      cephalometricsContent: '',
      fdiToothCode: '',
      showPosition: ''
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
symptomList.value = GetSymptom()
const upload = ref(false)
const handleFileChange = (event) => {
  const selectedFiles = event.target.files
  if (selectedFiles.length > 16) {
    event.preventDefault()
    ElMessage('最多上传16张图片')
  } else {
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i]
      params.append('files', file)

      if (file) {
        const reader = new FileReader()
        reader.onload = () => {
          fileList.value.push(reader.result)
          fileListWithFlag.value.push({
            imgUrl: reader.result,
            showFlag: false,
            choose: true,
            file: file
          })
        }
        reader.readAsDataURL(file)
      }
    }

    if (!upload.value) {
      imageArr.value.unshift({
        file: true,
        StartTime: '2023-8-14',
        imageList: fileListWithFlag.value
      })
      upload.value = true
    } else {
      imageArr.value[0].imageList = fileListWithFlag.value
    }
  }
}
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
const handleToggleChoose = (img) => {
  img.choose = !img.choose
}

const handleDeleteImage1 = (img) => {
  // 删除图库中的图片
  if (img.id) {
    Delete(`/prod-api/business/orthImage/${img.id}`).then((res) => {
      if (res.code == 200) {
        const found = imageList.value.find((image) => img == image)
        found.fileUrl = placeholderUrl
        found.id = undefined
        // getAllData()
      }
    })
  } else {
    img.fileUrl = placeholderUrl
  }
}
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
// 加载更多图像
const handleLoadPic = () => {
  if (imageArr.value.length < totalArr.value.length) {
    totalArr.value[imageArr.value.length].imageList.forEach((img) => {
      img.imgUrl = img.fileUrl
    })
    const itemWithImage = totalArr.value
      .slice(index.value + 1)
      .find((a) => a.imageList.length !== 0)
    if (itemWithImage) {
      imageArr.value.push(itemWithImage)
      index.value = totalArr.value.findIndex(
        (item) => item == imageArr.value[imageArr.value.length - 1]
      )
      imageArr.value[imageArr.value.length - 1].imageList.forEach((img) => {
        img.imgUrl = img.fileUrl
      })
    } else {
      ElMessage('没有更多图像了哦')
    }
  }
}

// 图片分类

const loadingTarget2 = ref()
// 自动分类
// const loading = ref(false)
async function handleClassifyPics() {
  if (chooseImgNum.value == 0) {
    ElMessage({
      message: '未选中图片',
      type: 'error'
    })
  } else {
    // loading.value = true
    const loading = ElLoading.service({
      lock: true,
      text: '正在分类中',
      background: 'rgba(0, 0, 0, 0.7)',
      target: loadingTarget2.value
    })
    const formData = new FormData()
    let orthImageString, orthImageList
    imageArr.value
      .filter((i) => i.file === undefined)
      .forEach((c) => {
        orthImageList = c.imageList
          .filter((b) => b.choose === true)
          .map((a) => {
            if (a.choose) {
              return {
                ljUrl: a.imgUrl,
                ljId: a.id,
                LJCreateDatetime: a.timestamp
              }
            }
          })
      })
    orthImageString = JSON.stringify({
      patientId: patientId,
      apmtId: appId,
      orthImageList
    })
    if (imageArr.value.filter((i) => i.file === true).length > 0) {
      imageArr.value
        .filter((i) => i.file === true)[0]
        .imageList.filter((image) => image.choose === true)
        .forEach((file) => {
          formData.append('files', file.file)
        })
    } else {
      formData.append('files', null)
    }
    formData.append('orthImageString', orthImageString)
    const res = await Post('/prod-api/business/orthImage/handleMultiImage', formData, true)
    loading.close()
    if (res.code === 200) {
      imageArr.value.forEach((a) => a.imageList.forEach((b) => (b.choose = false)))
      res.data.forEach((d) => {
        imageList.value.forEach((i) => {
          if (d.typeName == i.typeName) {
            i.fileUrl = d.fileUrl
          }
        })
      })
    }
  }
}
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
const handleDrop = (e, image) => {
  const image2 = document.getElementById('img')
  image2.style.opacity = 0
  e.target.classList.remove('hover')
  if (!dragFile.value.rightDrop) {
    // 从左拖到右
    handleSingleImage(dragFile.value, image)
  } else {
    // 有id的话是分类过的，要通过接口删除
    if (dragFile.value.id) {
      handleDeleteImage1(dragFile.value)
    } else {
      // 否则只要替换掉fileUrl就可以了
      const found = imageList.value.find((image) => dragFile.value.fileUrl == image.fileUrl)
      found.fileUrl = placeholderUrl
    }
    // 已经上传过的有id
    if (image.id) {
      Put('/prod-api/business/orthImage', {
        id: image.id,
        imageUrl: src.value
      }).then(() => {
        getClassifiedImgList()
      })
      // 否则也是替换掉fileUrl
    } else {
      image.fileUrl = src.value
    }
  }
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
// 上传图片
// file是拖拽的，image是被拖的
const failCount = ref(0)
async function handleSingleImage(file, image) {
  const formData = new FormData()
  if (file.type) {
    formData.append('file', file, 'Cover')
    formData.append(
      'orthImageString',
      JSON.stringify({
        patientId: patientId,
        apmtId: appId,
        orthImageList: []
      })
    )
  } else {
    formData.append(
      'orthImageString',
      JSON.stringify({
        patientId: patientId,
        apmtId: appId,
        orthImageList: [
          {
            ljUrl: file.imgUrl,
            ljId: file.id,
            LJCreateDatetime: file.timestamp
          }
        ]
      })
    )
  }

  const res = await Post('/prod-api/business/orthImage/handleSingleImage', formData, true)
  if (res.code == 200 && res.data[0].fileUrl) {
    image.fileUrl = res.data[0].fileUrl
  } else {
    image.fileUrl = placeholderUrl
    if (failCount.value == 0) {
      failCount.value++
      ElMessage({
        message: '拖拽失败，请再试一次',
        type: 'warning'
      })
    } else {
      ElMessage({
        message: '拖拽失败，请联系管理员',
        type: 'warning'
      })
    }
  }
}
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
const handleSubmitTooth = (title) => {
  // symptomList.value.forEach((row) =>
  //   row.forEach((item) => (item.active = false))
  // )
  if (!title.submitAble) {
    return
  }

  let obj = {
    apmtId: appId,
    titleId: title.id,
    optionsIdStr: [],
    otherContent: '',
    cephalometricsContent: '',
    fdiToothCode: title.toothCode.join(),
    showPosition: JSON.stringify(title.position)
  }
  Post('/prod-api/business/optionsResult', obj).then(() => {
    title.submitAble = false
  })
}
const handleSubmit = (optionId, title) => {
  useUpdateOption(optionId, title, '', appId)
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
}
const handleCloseImgDialog = () => {
  imageList.value.forEach((image) => (image.reminder = false))
}
const handleBackToList = () => {
  router.push('/index')
}
</script>
<style>
.el-dialog {
  border-radius: 12px;
}
.el-dialog__body {
  padding: 24px;
  padding-top: 10px;
  padding-bottom: 10px;
}
.advice.el-dialog {
  .el-dialog__body {
    padding: 0 24px;
  }
  .el-input {
    width: 40px;
    margin-left: 0;
  }
  .el-input__wrapper.is-focus {
    --el-input-focus-border-color: #2e6ce4;
    box-shadow: #2e6ce4;
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
  font-family: 思源黑体;
  padding: 20px;
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
      font-family: 思源黑体;
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
  border-bottom: 1.4px solid #e5e6eb !important;
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
      height: 25px;
      display: flex;
      div {
        height: 25px;
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
